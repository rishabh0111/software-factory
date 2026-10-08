#!/usr/bin/env node
// floor-guard.mjs: report changes that make a test suite or quality gate
// easier to pass without improving the code: skipped/focused/deleted tests,
// removed assertions, checker suppressions, stubs and TODOs, tests excluded by
// config, loosened coverage/mutation thresholds and weakened project rules.
// It reports findings only; a later gate decides what is acceptable.
// Line-pattern based and deliberately shallow. Paths under .software-factory/
// are skipped (except the chosen constraints file).
//
// Usage: node floor-guard.mjs [--base <ref>] [--constraints <path>]
//   --base         ref to compare from (default origin's default branch, else main)
//   --constraints  rules file to guard, relative to the repo top (default CONSTRAINTS.md)
// Stdout: one JSON object. Stderr: one summary line.
// Exit:   0 clean, 1 findings, 2 could not check (never read this as clean)

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const MAX_TEXT = 120;
const out = { base: null, mergeBase: null, constraints: null };

function finish(status, findings, error) {
  const result = {
    tool: 'floor-guard',
    status,
    base: out.base,
    merge_base: out.mergeBase,
    constraints: out.constraints,
    findings,
  };
  if (status === 'error') result.error = error;
  process.stdout.write(JSON.stringify(result) + '\n');
  if (status === 'clean') {
    process.stderr.write('floor-guard: clean\n');
  } else if (status === 'findings') {
    const rules = [...new Set(findings.map((f) => f.rule))];
    process.stderr.write(`floor-guard: ${findings.length} finding(s): ${rules.join(', ')}\n`);
  } else {
    process.stderr.write(`floor-guard: could not check: ${error}\n`);
  }
  process.exit(status === 'clean' ? 0 : status === 'findings' ? 1 : 2);
}

const fail = (reason) => finish('error', [], reason);

function git(args, { cwd, okCodes = [0] } = {}) {
  const r = spawnSync('git', args, {
    cwd,
    encoding: 'buffer',
    maxBuffer: Infinity,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  if (r.error) return { ok: false, code: -1, stdout: Buffer.alloc(0), stderr: String(r.error.message) };
  return {
    ok: okCodes.includes(r.status),
    code: r.status,
    stdout: r.stdout,
    stderr: r.stderr.toString('utf8'),
  };
}
const firstLine = (s) => String(s || '').split('\n')[0].trim();

// ---- arguments ------------------------------------------------------------

let baseArg = null;
let constraintsArg = 'CONSTRAINTS.md';
{
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--base' || a === '--constraints') {
      const v = argv[i + 1];
      if (v === undefined || v === '' || v.startsWith('--')) fail(`usage: ${a} needs a value`);
      if (a === '--base') baseArg = v;
      else constraintsArg = v;
      i++;
    }
  }
}
let constraintsPath = constraintsArg.replace(/\\/g, '/');
while (constraintsPath.startsWith('./')) constraintsPath = constraintsPath.slice(2);

// ---- repository, base and merge base --------------------------------------

const topRes = git(['rev-parse', '--show-toplevel']);
const top = topRes.ok ? topRes.stdout.toString('utf8').trim() : '';
if (!top) fail('not in a git work tree');
try {
  process.chdir(top);
} catch (e) {
  fail(`cannot enter the repository top: ${e.message}`);
}

if (baseArg === null) {
  const sym = git(['symbolic-ref', '-q', 'refs/remotes/origin/HEAD']);
  const ref = sym.ok ? sym.stdout.toString('utf8').trim() : '';
  baseArg = ref.startsWith('refs/remotes/') ? ref.slice('refs/remotes/'.length) : 'main';
}
out.base = baseArg;

const baseRes = git(['rev-parse', '--verify', '-q', `${baseArg}^{commit}`]);
if (!baseRes.ok) fail(`base ref does not resolve to a commit: ${baseArg}`);
const baseSha = baseRes.stdout.toString('utf8').trim();

const mbRes = git(['merge-base', baseSha, 'HEAD']);
if (!mbRes.ok) fail(`no merge base between ${baseArg} and HEAD (shallow or unrelated clone?)`);
const mergeBase = mbRes.stdout.toString('utf8').trim();
out.mergeBase = mergeBase;

const showAtBase = (file) => {
  const r = git(['show', `${mergeBase}:${file}`]);
  return r.ok ? r.stdout.toString('utf8') : null;
};
const readNow = (file) => {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch {
    return null;
  }
};

const constraintsActive =
  fs.existsSync(constraintsPath) || git(['cat-file', '-e', `${mergeBase}:${constraintsPath}`]).ok;
if (constraintsActive) out.constraints = constraintsPath;

// ---- collecting the change ------------------------------------------------

function isSkipped(p) {
  if (p === null) return false;
  if (constraintsActive && p === constraintsPath) return false;
  return p === '.software-factory' || p.startsWith('.software-factory/');
}

function unquotePath(raw) {
  let p = raw;
  const tab = p.indexOf('\t');
  if (tab >= 0) p = p.slice(0, tab);
  if (p.length >= 2 && p.startsWith('"') && p.endsWith('"')) {
    const octal = /\\[0-7]{3}/.test(p);
    p = p.slice(1, -1).replace(/\\(["\\tn]|[0-7]{3})/g, (m, c) => {
      if (c === 't') return '\t';
      if (c === 'n') return '\n';
      if (/^[0-7]{3}$/.test(c)) return String.fromCharCode(parseInt(c, 8));
      return c;
    });
    // octal escapes are the bytes of a UTF-8 name; re-decode them
    if (octal) p = Buffer.from(p, 'latin1').toString('utf8');
  }
  return p;
}

function sidePath(raw) {
  const p = unquotePath(raw);
  if (p === '/dev/null') return null;
  return p.replace(/^[a-z]\//, '');
}

const files = []; // { path, oldPath, deleted, added: [], removed: [] }

function forEachLine(buf, fn) {
  let start = 0;
  const len = buf.length;
  while (start < len) {
    let nl = buf.indexOf(10, start);
    if (nl < 0) nl = len;
    let end = nl;
    if (end > start && buf[end - 1] === 13) end--;
    fn(buf.toString('utf8', start, end));
    start = nl + 1;
  }
}

function parseDiff(buf) {
  let file = null;
  let inHeader = false;
  let oldNo = 0;
  let newNo = 0;
  const begin = (headerLine) => {
    file = { path: null, oldPath: null, deleted: false, added: [], removed: [], header: headerLine };
    files.push(file);
    inHeader = true;
  };
  forEachLine(buf, (line) => {
    if (line.startsWith('diff ')) {
      begin(line);
      return;
    }
    if (!file) return;
    if (inHeader) {
      if (line.startsWith('--- ')) {
        file.oldPath = sidePath(line.slice(4));
      } else if (line.startsWith('+++ ')) {
        const p = sidePath(line.slice(4));
        if (p === null) file.deleted = true;
        file.path = p;
      } else if (line.startsWith('deleted file mode')) {
        file.deleted = true;
      } else if (line.startsWith('rename from ')) {
        file.oldPath = unquotePath(line.slice(12));
      } else if (line.startsWith('rename to ')) {
        file.path = unquotePath(line.slice(10));
      } else if (line.startsWith('@@')) {
        const m = /^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/.exec(line);
        if (m) {
          oldNo = Number(m[1]);
          newNo = Number(m[2]);
          inHeader = false;
        }
      }
      return;
    }
    if (line.startsWith('@@')) {
      const m = /^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/.exec(line);
      if (m) {
        oldNo = Number(m[1]);
        newNo = Number(m[2]);
      }
      return;
    }
    const c = line[0];
    if (c === '+') file.added.push({ line: newNo++, text: line.slice(1) });
    else if (c === '-') file.removed.push({ line: oldNo++, text: line.slice(1) });
    else if (c === ' ') {
      oldNo++;
      newNo++;
    }
  });
}

function settleFile(f) {
  // Fall back to the "diff --git a/X b/X" header when there were no ---/+++ lines.
  if (f.path === null && f.oldPath === null) {
    const rest = f.header.replace(/^diff --git /, '');
    const half = (rest.length - 1) / 2;
    if (Number.isInteger(half) && rest.slice(0, half).replace(/^a\//, '') === rest.slice(half + 1).replace(/^b\//, '')) {
      f.oldPath = rest.slice(0, half).replace(/^a\//, '');
      f.path = f.oldPath;
    }
  }
  if (f.deleted) {
    if (f.oldPath === null) f.oldPath = f.path;
    f.path = f.oldPath;
  } else if (f.path === null) {
    f.path = f.oldPath;
  }
}

const diffRes = git([
  '-c', 'core.quotepath=false',
  'diff', '--no-color', '--no-ext-diff', '--no-textconv', '-U0',
  '--src-prefix=a/', '--dst-prefix=b/',
  mergeBase, '--',
]);
if (!diffRes.ok) fail(`git diff failed: ${firstLine(diffRes.stderr)}`);
parseDiff(diffRes.stdout);

const untrackedRes = git(['ls-files', '--others', '--exclude-standard', '-z']);
if (!untrackedRes.ok) fail(`git ls-files failed: ${firstLine(untrackedRes.stderr)}`);
for (const p of untrackedRes.stdout.toString('utf8').split('\0').filter(Boolean)) {
  if (isSkipped(p)) continue;
  let buf;
  try {
    const st = fs.lstatSync(p);
    if (st.isSymbolicLink()) buf = Buffer.from(fs.readlinkSync(p) + '\n');
    else if (st.isFile()) buf = fs.readFileSync(p);
    else continue;
  } catch (e) {
    fail(`cannot read untracked file ${p}: ${e.message}`);
  }
  const f = { path: p, oldPath: null, deleted: false, added: [], removed: [], header: '' };
  files.push(f);
  if (buf.subarray(0, 8000).includes(0)) continue; // binary
  let n = 1;
  forEachLine(buf, (text) => f.added.push({ line: n++, text }));
}

files.forEach(settleFile);
const changed = files.filter((f) => f.path !== null && !isSkipped(f.path) && !isSkipped(f.oldPath));

// ---- test-file detection --------------------------------------------------

function globToRegex(glob) {
  let g = glob;
  if (g.startsWith('<rootDir>/')) g = g.slice('<rootDir>/'.length);
  while (g.startsWith('./')) g = g.slice(2);
  return new RegExp('^' + globBody(g) + '$');
}

function findClose(s, from, open, close) {
  let depth = 0;
  for (let i = from; i < s.length; i++) {
    if (s[i] === '\\') {
      i++;
      continue;
    }
    if (s[i] === open) depth++;
    else if (s[i] === close) {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function splitTop(s, sep) {
  const parts = [];
  let depth = 0;
  let cur = '';
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === '(' || c === '{' || c === '[') depth++;
    else if (c === ')' || c === '}' || c === ']') depth--;
    if (c === sep && depth === 0) {
      parts.push(cur);
      cur = '';
    } else cur += c;
  }
  parts.push(cur);
  return parts;
}

const reEscape = (s) => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');

function globBody(g) {
  let re = '';
  for (let i = 0; i < g.length; i++) {
    const c = g[i];
    const next = g[i + 1];
    if ('?+*@!'.includes(c) && next === '(') {
      const close = findClose(g, i + 1, '(', ')');
      if (close < 0) throw new Error('unbalanced extglob');
      const alts = splitTop(g.slice(i + 2, close), '|').map(globBody).join('|');
      if (c === '!') re += '[^/]*';
      else re += `(?:${alts})${c === '@' ? '' : c}`;
      i = close;
    } else if (c === '*') {
      if (next === '*') {
        if (g[i + 2] === '/') {
          re += '(?:.*/)?';
          i += 2;
        } else {
          re += '.*';
          i += 1;
        }
      } else re += '[^/]*';
    } else if (c === '?') {
      re += '[^/]';
    } else if (c === '[') {
      const close = g.indexOf(']', i + 2);
      if (close < 0) {
        re += '\\[';
        continue;
      }
      let body = g.slice(i + 1, close);
      if (body.startsWith('!')) body = '^' + body.slice(1);
      re += `[${body.replace(/\\/g, '\\\\')}]`;
      i = close;
    } else if (c === '{') {
      const close = findClose(g, i, '{', '}');
      if (close < 0) {
        re += '\\{';
        continue;
      }
      re += `(?:${splitTop(g.slice(i + 1, close), ',').map(globBody).join('|')})`;
      i = close;
    } else if (c === '\\' && next !== undefined) {
      re += reEscape(next);
      i++;
    } else {
      re += reEscape(c);
    }
  }
  return re;
}

const asList = (v) => (typeof v === 'string' ? [v] : Array.isArray(v) ? v.filter((x) => typeof x === 'string') : []);

function readTestConfig(read) {
  const cfg = { includes: [], excludes: [], regexes: [], testpaths: [] };
  const addGlob = (g) => {
    const neg = g.startsWith('!');
    try {
      (neg ? cfg.excludes : cfg.includes).push(globToRegex(neg ? g.slice(1) : g));
    } catch {
      /* dropped */
    }
  };
  const pkg = read('package.json');
  if (pkg !== null) {
    try {
      const j = JSON.parse(pkg);
      asList(j && j.ava && j.ava.files).forEach(addGlob);
      asList(j && j.jest && j.jest.testMatch).forEach(addGlob);
      for (const r of asList(j && j.jest && j.jest.testRegex)) {
        try {
          cfg.regexes.push(new RegExp(r));
        } catch {
          /* dropped */
        }
      }
    } catch {
      /* unparseable JSON is ignored */
    }
  }
  const addPath = (p) => {
    let d = p.trim().replace(/\/+$/, '');
    while (d.startsWith('./')) d = d.slice(2);
    if (d) cfg.testpaths.push(d);
  };
  const py = read('pyproject.toml');
  if (py !== null) {
    const m = /^[ \t]*testpaths[ \t]*=[ \t]*(\[[^\]]*\]|"[^"\n]*"|'[^'\n]*')/m.exec(py);
    if (m) for (const q of m[1].match(/"[^"]*"|'[^']*'/g) || []) addPath(q.slice(1, -1));
  }
  for (const name of ['pytest.ini', 'setup.cfg', 'tox.ini']) {
    const text = read(name);
    if (text === null) continue;
    const lines = text.replace(/\r/g, '').split('\n');
    for (let i = 0; i < lines.length; i++) {
      const m = /^testpaths\s*[=:]\s*(.*)$/.exec(lines[i]);
      if (!m) continue;
      const values = [m[1]];
      while (i + 1 < lines.length && /^[ \t]+\S/.test(lines[i + 1])) values.push(lines[++i]);
      values.join(' ').split(/\s+/).filter(Boolean).forEach(addPath);
    }
  }
  return cfg;
}

const configs = [readTestConfig(readNow), readTestConfig(showAtBase)];

function matchesConfig(cfg, p) {
  if (cfg.regexes.some((r) => r.test('/' + p))) return true;
  if (cfg.testpaths.some((d) => p === d || p.startsWith(d + '/'))) return true;
  return cfg.includes.some((r) => r.test(p)) && !cfg.excludes.some((r) => r.test(p));
}

const TEST_DIRS = new Set(['test', 'tests', 'spec', 'specs', '__tests__', 'e2e']);
function isTestFile(p) {
  const parts = p.split('/');
  const name = parts[parts.length - 1];
  if (parts.slice(0, -1).some((d) => TEST_DIRS.has(d))) return true;
  if (name.includes('.test.') || name.includes('.spec.') || name.includes('_test.')) return true;
  if (name.startsWith('test_')) return true;
  if (parts.length === 1 && /^(test|tests|spec)\.[^.]+$/.test(name)) return true;
  if (/(Test|Tests)\.(java|kt|cs|scala)$/.test(name)) return true;
  return configs.some((cfg) => matchesConfig(cfg, p));
}

const CONFIG_NAMES = [
  /^stryker\.conf(ig)?\./, /^jest\.config\./, /^vitest\.config\./, /^karma\.conf\./,
  /^playwright\.config\./, /^\.nycrc/, /^\.c8rc/, /^package\.json$/, /^pyproject\.toml$/,
  /^setup\.cfg$/, /^tox\.ini$/, /^pytest\.ini$/, /^\.coveragerc$/, /^\.?codecov\.ya?ml$/,
  /^pom\.xml$/, /^build\.gradle(\.kts)?$/, /^\.mutmut/, /^phpunit\.xml(\.dist)?$/, /^\.golangci\.ya?ml$/,
];
const baseName = (p) => p.slice(p.lastIndexOf('/') + 1);
const isGuardedConfig = (p) => CONFIG_NAMES.some((r) => r.test(baseName(p)));
const isCiFile = (p) =>
  isGuardedConfig(p) || p.startsWith('.github/workflows/') || baseName(p) === '.gitlab-ci.yml' || baseName(p) === 'Makefile';

// ---- line patterns --------------------------------------------------------

const SILENCED = [
  /@ts-ignore/, /@ts-nocheck/, /@ts-expect-error/, /eslint-disable/, /biome-ignore/, /oxlint-disable/,
  /# ?noqa/, /#\s*type:\s*ignore/, /#\s*pragma:\s*no ?cover/, /pylint:\s*disable/,
  /istanbul ignore/, /c8 ignore/, /v8 ignore/, /nosemgrep/, /\bnosec\b/, /gitleaks:\s*allow/,
  /Stryker disable/, /pragma:\s*no mutate/, /@SuppressWarnings/, /#!?\[allow\(/,
  /\/\/ ?nolint/, /rubocop:\s*disable/, /NOSONAR/,
];
const UNFINISHED = [
  /throw\s+new\s+\w*(Error|Exception)\s*\(\s*[^)]*not\s*implemented/i,
  /throw\s+new\s+NotImplemented\w*/,
  /raise\s+NotImplementedError/,
  /catch\s*(\([^)]*\))?\s*\{\s*\}/,
  /^\s*except\b[^:]*:\s*pass\b/,
  /\b(TODO|FIXME)\b/,
  /^\s*pass\s*#.*\b(stub|todo|fixme|placeholder|not implemented|implement)/i,
  /\btodo!\(/, /\bunimplemented!\(/,
  /panic\(\s*"not implemented/i,
];
const MADE_EASIER = [
  /\.(skip|todo|fixme)\b/, /\.only\(/, /\b(xit|xdescribe|xtest|fit|fdescribe)\(/,
  /@pytest\.mark\.(skip|skipif|xfail)\b/, /unittest\.skip/, /\bt\.(Skip|SkipNow|Skipf)\(/,
  /@Disabled\b/, /@Ignore\b/, /#\[ignore\]/, /["']?\bskip["']?\s*[:=]\s*true\b/,
];
const DESELECTED = [
  /--deselect\b/i, /--ignore(-glob)?[= ]/i, /testPathIgnorePatterns/i, /modulePathIgnorePatterns/i,
  /(^|[\s'"])-k[\s=]*['"]?\s*not\b/i,
];
const EXCLUDE_SETTING = /\bexclude\w*["']?\s*[:=](.*)$/i;
const ASSERTION = [
  /\bexpect\b/, /\bassert/, /\bshould/, /\bverify\b/, /\brequire\.\w+/,
  /\bt\.(Error|Errorf|Fatal|Fatalf|Fail)\w*/,
  /\bt\.(is|not|true|false|truthy|falsy|deepEqual|notDeepEqual|like|throws|throwsAsync|notThrows|notThrowsAsync|regex|notRegex|snapshot|equal|equals|notEqual|notEquals|ok|notOk|same|notSame|strictSame|match|notMatch|assert)\s*\(/,
];

const any = (list, text) => list.some((r) => r.test(text));
const clip = (s) => s.slice(0, MAX_TEXT);

function tableCells(line) {
  const t = line.trim();
  if (!t.startsWith('|')) return null;
  return t.replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
}
const isExceptionRow = (line) => {
  const cells = tableCells(line);
  return cells !== null && /^[WE]\d+$/.test(cells[0] || '');
};

// ---- findings -------------------------------------------------------------

const findings = [];
const seen = new Set();
function report(rule, file, line, side, text) {
  const key = `${rule}\0${file}\0${line}\0${side}`;
  if (seen.has(key)) return;
  seen.add(key);
  findings.push({ rule, file, line, side, text: clip(text) });
}

// 1. added-line checks, in diff order
for (const f of changed) {
  const test = isTestFile(f.path);
  const config = isGuardedConfig(f.path);
  const ci = isCiFile(f.path);
  const isConstraints = constraintsActive && f.path === constraintsPath;
  for (const a of f.added) {
    const text = a.text.trim();
    if (any(SILENCED, a.text)) report('silenced-checker', f.path, a.line, 'added', text);
    if (any(UNFINISHED, a.text)) report('unfinished-work', f.path, a.line, 'added', text);
    if ((test || config) && any(MADE_EASIER, a.text)) report('test-made-easier', f.path, a.line, 'added', text);
    if (ci) {
      const ex = EXCLUDE_SETTING.exec(a.text);
      if (any(DESELECTED, a.text) || (ex && /test|spec/i.test(ex[1]))) {
        report('test-deselected', f.path, a.line, 'added', text);
      }
    }
    if (isConstraints && isExceptionRow(a.text)) report('new-exception', f.path, a.line, 'added', text);
  }
}

// 2. deleted test files
for (const f of changed) {
  if (f.deleted && isTestFile(f.path)) report('test-deleted', f.path, null, 'removed', 'test file deleted');
}

// 3. removed assertions
{
  const addedInTests = new Set();
  for (const f of changed) {
    if (f.deleted || !isTestFile(f.path)) continue;
    for (const a of f.added) addedInTests.add(a.text.trim());
  }
  for (const f of changed) {
    if (f.deleted || !isTestFile(f.path)) continue;
    for (const r of f.removed) {
      const text = r.text.trim();
      if (any(ASSERTION, r.text) && !addedInTests.has(text)) {
        report('assertion-removed', f.path, r.line, 'removed', text);
      }
    }
  }
}

// 4. constraints file deleted, 5. constraints rule changes
const NUM = /\d+(?:\.\d+)?/g;
const MIN_BEFORE = /(>=|>|≥)\s*$|\b(at least|minimum|min|no less than|not fall|not drop)\b/;
const MIN_AFTER = /^\s*(\S+\s+)?(or more|or higher|must not fall|must not drop)\b/;
const MAX_BEFORE = /(<=|<|≤)\s*$|\b(at most|maximum|max|no more than|under|below|not grow|not exceed)\b/;
const MAX_AFTER = /^\s*(\S+\s+)?(or less|or lower|must not grow|must not exceed)\b/;

function numbersByDirection(line) {
  const groups = { min: [], max: [], none: [] };
  let m;
  NUM.lastIndex = 0;
  while ((m = NUM.exec(line))) {
    let before = line.slice(Math.max(0, m.index - 24), m.index).toLowerCase();
    before = before.replace(/^.*\d/, '');
    const after = line.slice(m.index + m[0].length, m.index + m[0].length + 40).toLowerCase();
    const value = Number(m[0]);
    if (MIN_BEFORE.test(before) || MIN_AFTER.test(after)) groups.min.push(value);
    else if (MAX_BEFORE.test(before) || MAX_AFTER.test(after)) groups.max.push(value);
    else groups.none.push(value);
  }
  return groups;
}

function compareRule(oldLine, newLine) {
  const o = numbersByDirection(oldLine);
  const n = numbersByDirection(newLine);
  for (const dir of ['min', 'max', 'none']) {
    const len = Math.max(o[dir].length, n[dir].length);
    for (let i = 0; i < len; i++) {
      const a = o[dir][i];
      const b = n[dir][i];
      if (a === b) continue;
      if (a === undefined) continue;
      if (b === undefined) return 'threshold-removed';
      if (dir === 'min') {
        if (b < a) return 'threshold-loosened';
      } else if (dir === 'max') {
        if (b > a) return 'threshold-loosened';
      } else {
        return 'threshold-changed';
      }
    }
  }
  return null;
}

function ruleKey(line) {
  const t = line.trim();
  const bullet = /^[-*] (.*)$/.exec(t);
  if (bullet) {
    const colon = bullet[1].indexOf(':');
    return 'b:' + (colon >= 0 ? bullet[1].slice(0, colon) : bullet[1]).trim();
  }
  const cells = tableCells(t);
  if (cells) {
    if (cells.every((c) => /^:?-*:?$/.test(c))) return null; // separator row
    const first = cells.find((c) => c !== '');
    return first === undefined ? null : 't:' + first;
  }
  return null;
}

const constraintsFile = constraintsActive ? changed.find((f) => f.path === constraintsPath) : undefined;
if (constraintsFile && constraintsFile.deleted) {
  report('rule-removed', constraintsPath, null, 'removed', 'constraints file deleted');
}
if (constraintsFile) {
  const addedRules = constraintsFile.added.map((a) => ({ ...a, key: ruleKey(a.text) })).filter((a) => a.key);
  for (const r of constraintsFile.removed) {
    const key = ruleKey(r.text);
    if (!key) continue;
    const match = addedRules.find((a) => a.key === key);
    if (!match) {
      if (!isExceptionRow(r.text)) report('rule-removed', constraintsPath, r.line, 'removed', r.text.trim());
      continue;
    }
    const rule = compareRule(r.text, match.text);
    if (rule) report(rule, constraintsPath, match.line, 'added', `${r.text.trim()}  ->  ${match.text.trim()}`);
  }
}

// 6. thresholds in guarded config files
const XML_SETTING = /^\s*<([A-Za-z_][\w.:-]*)\b[^>]*>\s*["']?(-?\d+(?:\.\d+)?)["']?\s*<\/\1>\s*$/;
const KV_SETTING = /^\s*["']?([A-Za-z_][\w.-]*)["']?\s*[:=]\s*["']?(-?\d+(?:\.\d+)?)["']?\s*[,;]?\s*$/;
const THRESHOLD_KEY = /threshold|break|fail_under|fail-under|failunder|minimum|coverage|branches|lines|functions|statements|maxSurviving|mutationThreshold|testStrengthThreshold/i;
const isThresholdKey = (k) => THRESHOLD_KEY.test(k) || /(^|[^A-Za-z])min/i.test(k) || /[a-z]Min/.test(k);

function setting(line) {
  const m = XML_SETTING.exec(line) || KV_SETTING.exec(line);
  if (!m || !isThresholdKey(m[1])) return null;
  const value = Number(m[2]);
  return Number.isFinite(value) ? { key: m[1], value } : null;
}

for (const f of changed) {
  if (!isGuardedConfig(f.path)) continue;
  const added = f.added.map((a) => ({ ...a, s: setting(a.text) })).filter((a) => a.s);
  for (const r of f.removed) {
    const s = setting(r.text);
    if (!s) continue;
    const match = added.find((a) => a.s.key === s.key);
    if (!match) {
      report('threshold-removed', f.path, r.line, 'removed', r.text.trim());
      continue;
    }
    const isMax = /max/i.test(s.key);
    const loosened = isMax ? match.s.value > s.value : match.s.value < s.value;
    if (loosened) {
      report('threshold-loosened', f.path, match.line, 'added', `${r.text.trim()}  ->  ${match.text.trim()}`);
    }
  }
}

finish(findings.length ? 'findings' : 'clean', findings);
