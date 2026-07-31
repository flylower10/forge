# Forge Sheet — decisions.md

Architectural Decision Record. Append-only.
Initialised by Synthesis, 2026-07-31.

---

## ADR 001 · Build Option 3: static shell + state.json polling

**Date:** 2026-07-12
**Status:** Decided
**Deciders:** Human

**Context:**
Three options evaluated during Tech Feasibility wave:
- Option 1: Custom React/Svelte app with file watcher + dev server
- Option 2: Claude streams directly to the page via server-sent events
- Option 3: Claude rewrites a local state.json; static HTML polls it; no server required

Anthropic Artifacts shipped to Pro/Max in July 2026 during the discovery wave, making a custom app potentially redundant within weeks-to-months.

**Decision:**
Option 3. No custom app. Claude writes `state.json` per project after each conversational exchange. A static HTML shell polls it (~1s) and patches DOM in place. The architecture is inline-able by design — migrating to Artifacts requires one skill instruction change, not a rebuild.

**Consequences:**
- No backend, no build step, no framework
- Must be served via `./forge serve` (not `file://`) for state.json reads
- Shell is built once; Claude never edits it during sessions
- Artifacts migration path exists by design; no rebuild needed when Artifacts becomes available

---

## ADR 002 · One continuous document per project, accreting across sessions

**Date:** 2026-07-12
**Status:** Decided
**Deciders:** Human

**Context:**
Two models evaluated: per-session state files (simple, isolated) vs one accreting file per project (complex, continuous). The product's lodestar — "never finish a session wondering what was decided" — was judged to extend to re-entry after a gap.

**Decision:**
One `state.json` per project that accretes across sessions. Sessions are grouped; older sessions render collapsed. Nothing is deleted. Growth/collapse policy beyond session-level collapse is a Refinement decision.

**Consequences:**
- State format must handle growth across ~10–30 sessions
- Session-level collapse is the minimum; further compression policy deferred to Refinement
- Full-density storage (inline vs reference) must be proved before build begins
- Re-entry experience is a first-class design requirement, not an afterthought

---

## ADR 003 · Content-kind taxonomy: 7 named kinds + mandatory untyped fallback

**Date:** 2026-07-13
**Status:** Decided — first iteration; expect revision after two weeks of real sessions
**Deciders:** Human sign-off

**Context:**
Typed rendering was build-blocked on having a taxonomy. An unvalidated taxonomy risks either being too coarse (high untyped rate) or too fine (artificial classifications). First iteration approved to unblock the build.

**Decision:**
Seven named kinds: question / decision / correction / commitment / finding / context / musing. Plus a mandatory `untyped` fallback — any block the skill cannot classify renders as untyped explicitly, never hidden or dropped.

**Revision trigger:** >15% untyped blocks in real sessions after two weeks, or a consistently misclassified content type identified.

**Consequences:**
- `blocks[].kind` field in state schema must accept these values + "untyped"
- Shell must render all eight kinds distinctly (or group by attention tier)
- Skill classification logic must default to untyped, never fail silently
- Taxonomy expected to be revised post-build

---

## ADR 004 · Two-tier smoke alarm: heuristic hook + semantic audit

**Date:** 2026-07-13
**Status:** Decided
**Deciders:** Synthesis

**Context:**
The sheet is only as reliable as the skill's habit. A single detection mechanism that shares the writer's blind spots cannot catch them. Two independent tiers required.

**Decision:**
- Tier 1 (heuristic): hook-based, always on. Fires when exchanges pass without state updates. Writes an alert to `alerts[]`. Marks recovered when updates resume. Proving required before build: do hooks fire per exchange and can they write a file mid-session?
- Tier 2 (semantic audit): independent Claude call. Reads conversation record + current sheet, identifies omissions. Independent of the skill — critical design constraint. Periodic or on-demand. Proving required before build: confirm access to conversation history and establish cadence/cost.

**Consequences:**
- Heuristic alarm is v1 build scope (not optional)
- Semantic audit proving determines whether it is v1 or post-v1
- Both tiers surface as a visible alarm banner on the sheet when fired

---

## ADR 005 · Product name: Forge Sheet

**Date:** 2026-07-31
**Status:** Decided
**Deciders:** Synthesis

**Context:**
Name collision: the session companion was being built under the slug "forge-viewer", but a viewer/ React app already in the Forge repo carries that name. Two products with the same name in the same repo.

**Decision:**
The session companion is named **Forge Sheet** (slug: `forge-sheet`, build directory: `sheet/`). The existing `viewer/` React app retains the name **Forge Viewer** and is unaffected.

**Consequences:**
- Build directory: `sheet/` (not `viewer-companion/` or `forge-viewer/`)
- Linear project: "Forge Sheet"
- All future references, CLAUDE.md, and artefacts use "Forge Sheet"
