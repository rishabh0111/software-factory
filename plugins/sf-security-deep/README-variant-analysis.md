# Variant Analysis

Find similar vulnerabilities and bugs across codebases using pattern-based analysis.

**Author:** Axel Mierczuk

## When to Use

- Hunt for bug variants after finding an initial vulnerability
- Build CodeQL or Semgrep queries from a known bug pattern
- Perform systematic code audits across large codebases
- Create reusable patterns for recurring vulnerability classes

## What It Does

A five-step process: extract the root cause, write a pattern matching only the known bug,
generalize it one element at a time, triage what it finds, and report.

Each step has its own strategy reference under `skills/sf-variant-analysis/references/`.

## Entry Points

| | Use when |
|---|---|
| `/sf-security-deep:variants` | Workflow, for a large codebase or a root cause with many manifestations. Runs the steps across parallel subagents, one per expansion axis (generalizing variable names, function names, sink APIs, …), looping until the sweep stops finding anything new. Takes `bug`, `root`, `lang`, `out` as a JSON object, which Claude fills from the current context. Below ~40 source files (the primary language's, excluding vendored and fixture trees) it sweeps narrow and once, because fan-out buys nothing at that size. |
| The `sf-variant-analysis` skill | The knowledge behind the workflow, and the path for a narrow hunt you want to drive yourself — a handful of files, pasted snippets, or a candidate list to triage against a known root cause. Both fire on their own from a conversational "are there others like this?"; measured on a real codebase, Claude reaches for the workflow more often than the skill, so ask for the skill by name if you want to weigh in on each generalization. |

## Included

- Tool selection guidance (ripgrep, Semgrep, CodeQL)
- Ready-to-use CodeQL and Semgrep templates for Python, JavaScript, Java, Go, and C++
- A report template, and the pitfalls that most often cause hunts to miss variants

## Installation

```
/plugin install sf-security-deep --marketplace rishabh0111/software-factory
```

## Related tools

- CodeQL: deep interprocedural variant analysis
- Semgrep: fast pattern matching for simpler variants
- A SARIF viewer or parser: to process the results either tool emits
