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
- Open and in-progress issues
- Any open blockers
- What was recently completed
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

## 7. Invoke the Delivery Manager if in build phase

If the active idea is in Development phase (any Linear issues In Progress,
In Review, In QA, or the next issue is Ready to start), you MUST invoke
`build-team/delivery-manager.md` before any other action.

The Delivery Manager owns task assignment. No code is written until the
Delivery Manager has formally handed the task to the Engineer. The human
saying "yes" or "let's start" is not a Delivery Manager handoff.

**Re-entry check:** If the last handoff note (`output/[idea-name]/handoff.md`)
exists and is more than one day old, the Delivery Manager must run The Re-entry
ceremony (defined in `product-team/08-burst-review.md`) before starting any
new work. This orients the session after an idle gap without requiring the
human to reconstruct context.

This step cannot be skipped. If unsure whether the project is in build
phase, check Linear issue statuses — if any exist, invoke the Delivery
Manager.

## 8. Check for session-end signal

If the human indicates they are done for this session ("I'm done", "let's
stop here", "that's enough for today"), invoke the Delivery Manager to run
The Handoff before closing. The Handoff writes `output/[idea-name]/handoff.md`
and ensures the next burst can start immediately without reconstruction.
