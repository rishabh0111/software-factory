#!/usr/bin/env node
// Builds the commands cheat sheet in docs/commands.html and the sf-ask catalog in
// plugins/sf-core/skills/sf-ask/catalog.md from the skills and agents on disk.
//
//   node scripts/build-site.mjs            rewrite both outputs
//   node scripts/build-site.mjs --check    exit 1 if either is stale, write nothing
//   node scripts/build-site.mjs --root DIR read DIR/plugins/ and write under DIR
//
// Reads each SKILL.md frontmatter (name, description, disable-model-invocation).
// Skills with disable-model-invocation: true are listed as typed commands; the rest
// go in an "Also applies on its own" group. Short labels come from
// docs/commands.labels.json; a skill missing from it gets the first clause of its
// description. The catalog lists every skill and agent of each plugin with the first
// sentence of its description. No dependencies.

import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const START = "<!-- commands:start -->";
const END = "<!-- commands:end -->";

const args = process.argv.slice(2);
const check = args.includes("--check");
const rootIdx = args.indexOf("--root");
if (rootIdx !== -1 && !args[rootIdx + 1]) fail("--root needs a directory");
const root = resolve(rootIdx !== -1 ? args[rootIdx + 1] : join(dirname(fileURLToPath(import.meta.url)), ".."));
const pagePath = join(root, "docs", "commands.html");
const labelsPath = join(root, "docs", "commands.labels.json");

function fail(msg) { console.error(`build-site: ${msg}`); process.exit(2); }

function frontmatter(text, file) {
  const m = text.replace(/^﻿/, "").match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) fail(`no frontmatter in ${file}`);
  const out = {};
  const lines = m[1].split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const kv = lines[i].match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kv) continue;
    let [, key, val] = kv;
    if (/^[>|][-+]?$/.test(val)) {
      const block = [];
      while (i + 1 < lines.length && (/^\s+\S/.test(lines[i + 1]) || lines[i + 1].trim() === "")) block.push(lines[++i].trim());
      val = block.join(val.startsWith(">") ? " " : "\n").trim();
    } else if (val.startsWith('"') && val.endsWith('"') && val.length > 1) {
      try { val = JSON.parse(val); } catch { val = val.slice(1, -1); }
    } else if (val.startsWith("'") && val.endsWith("'") && val.length > 1) {
      val = val.slice(1, -1).replace(/''/g, "'");
    }
    out[key] = val;
  }
  return out;
}

function firstClause(desc) {
  let s = String(desc || "").replace(/\s+/g, " ").trim();
  s = s.split(/(?<=[a-z0-9)\]"'])[.:;](?:\s|$)|\s[—–-]\s/i)[0];
  s = s.replace(/\s*\([^)]*\)/g, "").trim();
  if (s.length > 90) s = s.slice(0, 90).replace(/\s+\S*$/, "") + "…";
  if (s && !/[.…]$/.test(s)) s += ".";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const isDir = (p) => { try { return statSync(p).isDirectory(); } catch { return false; } };

const pluginsDir = join(root, "plugins");
if (!isDir(pluginsDir)) fail(`no plugins directory at ${pluginsDir}`);
if (!existsSync(pagePath)) fail(`missing ${pagePath}`);
const labels = existsSync(labelsPath) ? JSON.parse(readFileSync(labelsPath, "utf8")) : {};
const labelOrder = Object.keys(labels);

const plugins = readdirSync(pluginsDir)
  .filter((p) => isDir(join(pluginsDir, p, "skills")))
  .sort((a, b) => (a === "sf-core" ? -1 : b === "sf-core" ? 1 : a.localeCompare(b)))
  .map((plugin) => {
    const skillsDir = join(pluginsDir, plugin, "skills");
    const skills = readdirSync(skillsDir)
      .filter((d) => existsSync(join(skillsDir, d, "SKILL.md")))
      .map((d) => {
        const file = join(skillsDir, d, "SKILL.md");
        const fm = frontmatter(readFileSync(file, "utf8"), file);
        const name = fm.name || d;
        return {
          name,
          userRun: String(fm["disable-model-invocation"]).trim() === "true",
          label: labels[name] || firstClause(fm.description),
        };
      })
      .sort((a, b) => {
        const ia = labelOrder.indexOf(a.name), ib = labelOrder.indexOf(b.name);
        if (ia !== -1 || ib !== -1) return (ia === -1 ? 1e9 : ia) - (ib === -1 ? 1e9 : ib);
        return a.name.localeCompare(b.name);
      });
    return { plugin, skills };
  })
  .filter((p) => p.skills.length);

function list(skills, typed) {
  return skills
    .map((s) => `<li class="cheat${typed ? "" : " auto"}"><code>${typed ? "/" : ""}${esc(s.name)}</code><span>${esc(s.label)}</span></li>`)
    .join("\n");
}

const blocks = plugins.map(({ plugin, skills }) => {
  const typed = skills.filter((s) => s.userRun);
  const auto = skills.filter((s) => !s.userRun);
  const id = `p-${plugin}`;
  let html = `<section class="plugin" aria-labelledby="${id}">\n<h2 id="${id}"><code>${esc(plugin)}</code></h2>\n`;
  if (typed.length) html += `<h3 class="group-h">Run only when you type them</h3>\n<ul class="cheats">\n${list(typed, true)}\n</ul>\n`;
  if (auto.length) html += `<h3 class="group-h">Also applies on its own</h3>\n<ul class="cheats compact">\n${list(auto, false)}\n</ul>\n`;
  return html + `</section>`;
});

// ---------- the sf-ask catalog ----------

function firstSentence(desc) {
  const s = String(desc || "").replace(/\\n/g, " ").replace(/\s+/g, " ").trim();
  const re = /^.*?(?<!\b(?:e\.g|i\.e|vs|etc|cf))[.!?](?=\s|$)/;
  const m = s.match(re);
  if (!m) return s;
  if (m[0].length >= 30) return m[0];
  const rest = s.slice(m[0].length).trim();
  const m2 = rest.match(re);
  return (m[0] + " " + (m2 ? m2[0] : rest)).trim();
}

const cell = (s) => String(s).replace(/\|/g, "\\|").replace(/\s+/g, " ").trim();
const mdFiles = (dir) => (isDir(dir) ? readdirSync(dir).filter((f) => f.endsWith(".md")).sort() : []);

const catalogPlugins = readdirSync(pluginsDir)
  .filter((p) => isDir(join(pluginsDir, p, "skills")) || isDir(join(pluginsDir, p, "agents")))
  .sort((a, b) => (a === "sf-core" ? -1 : b === "sf-core" ? 1 : a.localeCompare(b)))
  .map((plugin) => {
    const skillsDir = join(pluginsDir, plugin, "skills");
    const skills = (isDir(skillsDir) ? readdirSync(skillsDir) : [])
      .filter((d) => existsSync(join(skillsDir, d, "SKILL.md")))
      .map((d) => {
        const file = join(skillsDir, d, "SKILL.md");
        const fm = frontmatter(readFileSync(file, "utf8"), file);
        return { name: fm.name || d, userRun: String(fm["disable-model-invocation"]).trim() === "true", what: firstSentence(fm.description) };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
    const agentsDir = join(pluginsDir, plugin, "agents");
    const agents = mdFiles(agentsDir).map((f) => {
      const file = join(agentsDir, f);
      const fm = frontmatter(readFileSync(file, "utf8"), file);
      return { name: fm.name || f.replace(/\.md$/, ""), what: firstSentence(fm.description) };
    });
    return { plugin, skills, agents };
  })
  .filter((p) => p.skills.length || p.agents.length);

function catalog() {
  const out = [
    "# Catalog",
    "",
    "Generated by `scripts/build-site.mjs` from `plugins/*/skills/*/SKILL.md` and `plugins/*/agents/*.md`. Do not edit by hand; regenerate with `node scripts/build-site.mjs`.",
  ];
  for (const { plugin, skills, agents } of catalogPlugins) {
    out.push("", `## \`${plugin}\``);
    if (skills.length) {
      out.push("", "| Skill | How it starts | What it is for |", "|---|---|---|");
      for (const s of skills) out.push(`| \`${s.userRun ? "/" : ""}${s.name}\` | ${s.userRun ? "you run it" : "on its own"} | ${cell(s.what)} |`);
    }
    if (agents.length) {
      out.push("", "| Agent | What it is for |", "|---|---|");
      for (const ag of agents) out.push(`| \`${ag.name}\` | ${cell(ag.what)} |`);
    }
  }
  return out.join("\n") + "\n";
}

// ---------- write or check ----------

const generated = `${START}\n${blocks.join("\n")}\n${END}`;
const page = readFileSync(pagePath, "utf8");
const a = page.indexOf(START), b = page.indexOf(END);
if (a === -1 || b === -1 || b < a) fail(`markers ${START} / ${END} not found in ${pagePath}`);

const catalogPath = join(pluginsDir, "sf-core", "skills", "sf-ask", "catalog.md");
if (!isDir(dirname(catalogPath))) fail(`missing ${dirname(catalogPath)}`);

const outputs = [
  { path: pagePath, next: page.slice(0, a) + generated + page.slice(b + END.length) },
  { path: catalogPath, next: catalog() },
];

const stale = [];
for (const { path, next } of outputs) {
  const before = existsSync(path) ? readFileSync(path, "utf8") : null;
  if (before === next) continue;
  stale.push(path.slice(root.length + 1).replace(/\\/g, "/"));
  if (!check) writeFileSync(path, next);
}

if (check) {
  if (stale.length) { console.error(`build-site: stale. Run: node scripts/build-site.mjs\n  ${stale.join("\n  ")}`); process.exit(1); }
  console.log(`build-site: up to date (${outputs.length} files checked).`);
} else {
  console.log(stale.length ? `build-site: wrote\n  ${stale.join("\n  ")}` : "build-site: no change.");
}
