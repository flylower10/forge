# Forge Sheet — CLAUDE.md

> Produced by Synthesis 2026-07-31. This is what Claude Code reads at the start
> of every build session on Forge Sheet.

---

## What this is

A session companion for Forge: a browser page on the second monitor showing a continuously accreting "drafting sheet" per project — what agents are writing, which are active, what concerns are open — updated by Claude after each exchange during Forge sessions. Read-only: it renders session state, it never acts. The builder reads the sheet rather than the terminal during sessions; the terminal is the drill-down, not the primary view.

**Lodestar:** Never finish a session wondering what was decided.

## The user

A solo Forge builder (Aidan). Dark IDE primary screen, Claude Code in terminal, second monitor free. He runs complex multi-agent sessions and loses track of decisions as session complexity grows. He wants shared presence — in sync with Claude and agents without switching attention. Sole user today; shareability is a live ambition — no hardcoded personal paths or single-user assumptions in chrome or copy.

## Architecture

**Shell + state.** One static HTML shell (the rev D drafting-sheet design, built once) plus one `state.json` per project that Claude edits during sessions. Claude never touches the shell in a session.

**The page updates in place.** Inline JS in the shell polls `state.json` (~1s) and patches only the DOM that changed. No page reloads — scroll, expanded sections, and animations survive every update.

**Everything must remain inline-able.** No runtime dependency that cannot later be embedded into a single page — this keeps the Anthropic Artifacts migration a one-step instruction change, not a rebuild.

**One continuous document per project, accreting across sessions.** Sessions are grouped; older sessions render collapsed. Earlier content retained, never deleted. Growth/collapse policy beyond session-level collapse is a Refinement decision.

## Key constraints

- Served via `./forge serve` (a bare `file://` page cannot read the state file)
- **No backend, no build step, no framework.** Plain HTML/CSS/JS.
- Visual contract: rev D style tile at `output/forge-viewer/design-handoff/forge-viewer Style Tile rev D.dc.html`. Canonical design system in `output/forge-viewer/DESIGN.md`. Binding guardrails in `output/forge-viewer/design-handoff/design-guardrails.md`.
- **Heat system (not fuchsine):** ember #C22400 → cherry #E62E0F → furnace #FF7A1A → lemon #FFC940 (gradient cores only). Glow on marks ≤12px only. Quench = resolve (cool to warm-grey ramp).
- **Type:** Overpass (agent voice) + Overpass Mono (machine voice). Loaded from Google Fonts — must be embedded before any Artifacts migration.
- Smoke alarm is two-tier: heuristic hook (always on) + semantic audit (independent Claude call, periodic or on demand).
- Content-kind taxonomy: question / decision / correction / commitment / finding / context / musing + mandatory untyped fallback. Approved as first iteration; expect revision after two weeks of real sessions.

## Design vocabulary (use in code, copy, and comments)

- Agents are **quenched** (not "done") when their work is complete
- Concerns are **quenched** (not "resolved" or "closed")
- Active agents are **at heat** (not "active")
- Aged concerns with ≥2 waves open earn **STRIKE** (not "urgent" or "critical")
- The four places: **the sheet** (live and at rest), **passage detail**, **no-state**
- The state file: **state.json** (not "data.json", "session.json")
- The alarm: **smoke alarm** (two tiers — heuristic + semantic audit)

## Build sequence

1. **Three provings first** (before any shell work):
   - Full-density storage: measure realistic per-session state sizes; decide inline vs reference
   - Heuristic alarm: confirm hooks fire per exchange and can write a file mid-session
   - Semantic audit: confirm independent Claude call can access conversation history; establish cadence and cost

2. **State format** — schema: `sessions[]` → `blocks[]` (id, kind, digest, fullContent?, state, attribution, concernRefs, sessionId), `agents[]` (name, role, state, minutesAtHeat), `concerns[]` (id, state, wavesOpen, closedBy?, anchorBlockId), `alerts[]` (type, state, detail), `handover`, `phase`. Growth/collapse policy is a Refinement decision — design for ~10–30 sessions.

3. **The shell** — built from the rev D style tile, verified against fixtures of the four captured states (live/alarm, passage detail, at rest, no-state). Reference canvas 1180×720.

4. **Poll-and-patch JS** — ~1s interval, diff before repaint, surviving motion spec (quench fade, status pip, halo). Nothing else moves.

5. **Sheet-writing Forge skill** — per-exchange state discipline. Classify content by kind; write roster states, concerns, phase. Unclassifiable content → untyped block, never dropped.

6. **Heuristic smoke alarm** — hook-based; writes an alert when exchanges pass without state updates; marks recovered when updates resume.

7. **Click log** — localStorage; every passage detail open logged with timestamp; powers the two-week usage test.

8. **Semantic audit** — after provings confirm feasibility. Independent Claude call comparing conversation vs sheet.

## Known technical risks

- **Skill discipline drift** — the sheet is only as complete as the skill's habit; mitigated by the smoke alarm
- **State growth** — months of accretion in one file; collapse/summarise policy is a design requirement
- **Font loading** — Overpass from Google Fonts must be embedded before any Artifacts migration (CSP blocks external fonts)
- **Hooks API evolution** — public interface, low risk, but the heuristic alarm depends on it
- **Full-density storage** — unresolved until proving; do not build passage detail before the proving completes

## What done looks like (v1)

- Shell renders the four captured states faithfully from `state.json` fixtures
- A Forge skill maintains `state.json` through a real session, updating after each exchange
- The heuristic smoke alarm raises a visible banner when updates stall
- A click log records every passage detail open
- Reopening a week-old project shows prior sessions collapsed with the latest handover pinned
- The two-week usage test can begin: click log wired, smoke alarm active

## Open decisions for Refinement

- YAML vs JSON frontmatter format
- Growth/collapse policy beyond session-level collapse
- Concurrent sessions (two sessions, one state file)
- Search across the sheet (U14) — scope decision
- Forge mark + favicon build-target status

## Artefact locations

All discovery artefacts live in the Forge repo at `output/forge-viewer/`:
- `brief.html` — canonical product brief
- `assumption-log.html` — 6 assumptions, status, provings needed
- `personas.html` — Aidan (the builder)
- `research-plan.html` — two-week usage test plan
- `ost-decisions.html` — 5 strategic decisions, append-only
- `breadboard.md` — full journey map (4 places, 14 UI affordances, 6 mechanisms, 4 stores)
- `DESIGN.md` — canonical design context (rev D)
- `design-handoff/forge-viewer Style Tile rev D.dc.html` — visual contract
