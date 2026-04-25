# Hook · Pre-session

⚠ Follow these steps exactly and in order. Do not skip steps.
Do not begin any agent work until all steps are complete.

---

---

## 1. Read the framework CLAUDE.md
Confirm you understanding of the pipeline, the agents, the
tool ownership model, and the current phase.

## 2. Read current state from GitHub
If a repo exists for the active idea, read `/docs/CLAUDE.md`.
This is the technical source of truth. It contains:
- What the product is and who it's for
- Current architecture principles and constraints
- Build sequence and what has been completed
- Any open technical decisions

## 3. Read current state from Linear
Query the active project in Linear via MCP:
- Current sprint and its contents
- Any open blockers
- What was completed last sprint
- What is in progress now

If Linear is unavailable, note it and proceed — flag any
build work for manual Linear update at session end.

## 4. Read product context from local output folder
If discovery is complete, read `output/[idea-name]/brief.md`.
This is the product source of truth — use it to understand
what is being built and why before touching any code.

If no brief exists yet, read the running brief at
`output/[idea-name]/running-brief.md` for current pipeline state.

## 5. Confirm MCP connections
Verify:
- GitHub (read/write — technical artefacts)
- Linear (read/write — build execution)

Note any unavailable connections. Do not block the session —
produce outputs locally and push when connections restore.

## 6. State the plan
Before starting work, briefly state:
- What idea is active
- What phase the pipeline is in
- What the current session will do
- Any blockers or open items to be aware of

Then proceed.
