# Contributing to Awesome Antigravity Skills

Thanks for helping keep this list useful. The bar: **every entry must be something a stranger would thank you for installing.**

## Entry format

Add entries under the most specific existing category:

```markdown
- [name](https://github.com/owner/repo) - One-line description of what it does (★ count, month year).
```

Rules:

- Separator is ` - ` (hyphen, not em-dash) and the description starts with a capital letter and ends with a period — this keeps `awesome-lint` green.
- Description states what the skill *does*, not marketing copy.
- Include the star count and the month you checked it — counts drift and readers deserve to know the vintage.
- Link to the canonical repo, not a fork or a landing page. Each URL may appear only once in the README (`double-link` lint rule).
- Skills that live inside a larger repo may link to the skill's `tree/<branch>/<path>` URL directly; use the parent repo's star count and label it `(part of <parent>, ★ count, month year)`. Use `tree` URLs, never `blob` URLs for directories (those 301-redirect and fail the link check).

## Quality bar

An entry is accepted if:

1. It is a skill (folder + `SKILL.md` per the [official format](https://antigravity.google/docs/skills)) or a collection/list of such skills.
2. It works in Antigravity — either tested directly or format-compatible (Agent Skills open standard).
3. The repo has a README, a license, and signs of maintenance (commit within ~6 months).
4. It is not a duplicate of an existing entry.

Self-promotion is fine **if** the skill works and includes a demo or usage example. PRs that only add a link to your own empty repo will be closed.

## How to submit

1. Fork this repo.
2. Add your entry to `README.md` (one link per PR).
3. Run the link check: `bash scripts/check-links.sh`.
4. Open a PR with title `add: <name>` and a one-line justification of which category and why.

## Removing entries

Open an issue or PR if a listed repo is dead (404), unmaintained (>12 months silent with open breakage), or turned into spam. Removal PRs are prioritized over additions.

## Updating star counts

Bulk refreshes of star counts are welcome — update the `(★ …, month year)` suffix and note the new date in `docs/research-notes.md`.
