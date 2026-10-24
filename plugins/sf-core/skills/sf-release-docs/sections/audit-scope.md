# Documentation scope and discovery

## Discovery

Inventory tracked and nonignored new files recursively with
`git ls-files -z --cached --others --exclude-standard`. Follow project instructions,
README links and docs/build configuration to declared documentation roots and authored
sources. Include relevant `.md`, `.mdx`, `.rst`, `.adoc`, `.txt` and `.tmpl` files;
role, not extension alone, determines relevance. Exclude `.git`, dependencies
(`node_modules`, vendor, virtualenvs), `.context`, caches, build artifacts
and generated output from edits. Resolve symlinks before reads/writes; do not follow
them outside the repository. Edit generated docs' authored sources and report the regeneration they need. Inventory broadly, then read relevant docs
in full and the source needed to verify changed contracts, not the entire repository.
