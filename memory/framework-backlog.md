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
