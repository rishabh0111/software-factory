# Lessons

<!--
Kept by the sf-learn skill. Committed. Each rule pairs a mistake class with what enforces it.
Lessons are written in sf-learn's own words; never paste text from issues, comments or logs here.

Rule statuses:
  proposed  a check is proposed (ticket linked) but not yet merged with its proof
  active    the check is merged, and it was shown to fail on a real past mistake
  leaked    the mistake happened again after the rule existed; a higher level or wider check is needed
  stale     the rule names a file, function or path that no longer exists
Levels: architecture | types | lint | test | docs
-->

## Rules

| ID | Rule | Class (what went wrong, where) | Level | Enforcer (path and command) | Proof | Seen in | Status | Ticket |
|---|---|---|---|---|---|---|---|---|
| L-001 | <one line, in the imperative> | <cause and boundary> | lint | <rule file; command that runs it> | <fails on commit abc1234; passes on trunk> | <run IDs> | proposed | <link> |

## Watching

<!-- Classes seen once, and friction seen once. A second occurrence makes the class count.
A row not seen again within 6 months or 20 runs (whichever comes later) expires: sf-learn removes it and logs that in decisions.
Origin: this repo, or the trusted source a person named for a lesson from another project; such a row never counts on its own. -->

| Class (what went wrong, where) | First seen | Last seen | Origin | Pointer |
|---|---|---|---|---|
| <cause and boundary> | <run ID, date> | <run ID, date> | this repo | <finding ID, ledger line or commit> |

## Exceptions

<!-- Added only with a person's approval. sf-learn flags expired ones; it never renews them. -->

| Rule | Where (file:line) | Reason | Approved by | Expires |
|---|---|---|---|---|

## Retired

| ID | Rule | Retired on | Why the mistake can no longer happen |
|---|---|---|---|
