# Framework backlog

Open improvements to Forge itself. Append-only. Each entry is a real
to-do, not a wish list — if it gets removed, it's because it was
implemented or explicitly killed (with a reason).

This is the equivalent of `decisions.md` for things not yet decided
but worth tracking. When an entry is implemented, move it to a
"Done" section at the bottom with the date and a one-line reference
to the change.

---

## Open

### Forge-on-Forge agent
**Captured:** 2026-05-09
**Why it matters:** Forge edits keep happening ad-hoc inside regular
sessions. The framework has a strong "no code outside the pipeline"
rule for product code, but applies no equivalent rule to itself. As
Forge is iterated on constantly, this gap will compound — undocumented
changes, drift between agent definitions and the docs that reference
them, hygiene issues like the Notion residue and burst/sprint naming
drift that surfaced on 2026-05-09.

**Shape (rough):** an agent that handles framework changes the way
the build team handles product code — captures the change as a
proposal, surfaces affected files, makes the edits, records the
decision somewhere durable. Triggered when the human says "let's
update Forge" or when an agent notices its own definition is
inconsistent with what it's being asked to do.

**Lives outside the existing teams** — it's not a discovery agent,
not a build agent, not a marketing agent. Probably a new directory:
`/framework-team/` or similar. Don't fold it into `product-team/`
or `build-team/` since it operates on the framework, not on products.

**Open questions before drafting:**
- Trigger: explicit invocation only, or also on detected drift?
- Output: does it write a "framework decision" log analogous to
  `decisions.md`? Append to this backlog when it spots gaps?
- Scope: does it own README/CLAUDE.md hygiene too, or just agent
  and skill changes?
- Relationship to The Observer (which critiques process during
  sessions) — is this its persistent counterpart?

### UI QA agent — design-to-build delta checker
**Captured:** 2026-05-10
**Why it matters:** Consistent gap between Claude Design intent and what
gets built. First surfaced in the forge-viewer fixlist: badges rendering as
block cards, phantom dots, section chrome wrong, sidebar numbering mixed —
all because the build happened without a structured comparison pass against
the design spec. The cost of the gap is a human QA pass that produces a
fixlist, which then goes back to the engineer. That loop should be automated.

**Shape (rough):** an agent that sits between QA and delivery in the build
pipeline. Takes a screenshot of the rendered output (or a set of screenshots)
and the Claude Design brief / DESIGN.md, compares them, and produces a
structured fixlist in the same format as `forge-viewer-FIXLIST-01.md`:
Critical (spec violations) and Refinements (polish), each with Symptom /
Expected / Likely cause / Reference. Loops back to the Engineer for Critical
items; Refinements can be batched as a follow-up issue.

**Trigger:** after the Engineer completes a frontend task and before QA
signs off. Also on-demand when the human suspects visual drift.

**Open questions before drafting:**
- Screenshot mechanism: does this require a headless browser (Puppeteer/
  Playwright), or can the human supply screenshots manually for the first
  version?
- Does it compare against the Claude Design handover URL, DESIGN.md,
  or the Blueprint brief — or all three?
- Relationship to the existing QA agent: separate agent, or an extended
  mode of QA that activates for frontend tasks?
- How does it handle "Claude Design decides" items vs "brief decides"
  items? The handoff skill distinguishes these — the UI QA agent should too.

### README structure block staleness
**Captured:** 2026-05-09 (mitigated, not solved)
**Why it matters:** The structure block was badly out of date when
last touched (missing breadboard, ux-agent, observer, research-agent,
several skills). Mitigated by replacing the verbose enumeration with
a category-level view that points at CLAUDE.md as the canonical
agent directory. Still worth thinking about: agents/skills are added
frequently and the README will keep drifting unless something
auto-generates the agent list — possibly a job for the Forge-on-Forge
agent above.

---

## Done

[Implemented entries move here with date + reference]
