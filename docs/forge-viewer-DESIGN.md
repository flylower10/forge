# Forge · Design system

A small, opinionated grammar for rendering Forge's `.md` artefacts as
`.html` presentation layers. One CSS file (`forge-styles.css`), one
parser (`forge-md.js`), one config (`forge-config.js`), and a thin
React renderer per artefact family.

The contract: **the markdown is the source of truth; the HTML is a
presentation layer**. Edit the `.md`, reload, the page reflects it.
No artefact stores content in JSX.

---

## Files

| File | Role |
|------|------|
| `forge-styles.css`  | Design tokens, shells, component vocabulary. Embed inline in every output. |
| `forge-md.js`       | `.md` → `{ frontmatter, sections: [{ title, blocks }] }`. ~250 lines. |
| `forge-config.js`   | Framework wiring: `PHASES`, `PIPELINE`, `LATERAL`. Idea-agnostic. |
| `forge-tweaks.css`  | Tweaks-panel axes (phase / density / rail). Optional. |
| `forge-tweaks.jsx`  | Tweaks-panel UI. Optional. |
| `artefacts/*.jsx`   | One renderer per artefact family. Section-agnostic; dispatches blocks. |
| `output/[idea]/*.md`| Per-idea artefact sources (brief, personas, breadboard, …). |
| `output/agents/*.md`| Per-agent reference sources. |

---

## Phases

Five phases, four with accent colours, one neutral. Apply via
`data-phase="…"` on `.fg-shell` (or any ancestor). Cascading custom
properties (`--fg-accent`, `--fg-accent-dim`, `--fg-accent-tint`,
`--fg-ink-tone`) light up every phase-aware component.

| Phase | Hue | Used by |
|-------|-----|---------|
| `discovery`  | blue (232°) | Intake, PM, Design, Sceptic, Pragmatist, Advocate, Synthesis, Tracer |
| `refinement` | violet (282°) | Refinement Ceremony |
| `build`      | green (156°) | Delivery Manager, Engineer, Reviewer, QA, Burst Review |
| `marketing`  | amber (38°) | Merchant, Campaigner |
| `framework`  | neutral grey | Observer, Researcher, Arbiter, Cartographer (always-on / triggered / lateral) |

Don't introduce new phases ad-hoc. If an artefact doesn't have a
phase, it's `framework`.

---

## Shells

`.fg-shell` is the page chrome. Pick by `data-shell`:

| Shell | Columns | When |
|-------|---------|------|
| `3col`      | dir-rail · main · context-rail (260 / 1fr / 320) | In-pipeline navigation views — agent reference, anything where "where am I in the framework" matters |
| `2col-rail` | main · context-rail (1fr / 320) | Read-in-isolation artefacts — brief, personas, handoff, research-plan |
| `2col`      | dir-rail · main (260 / 1fr) | Cross-idea views — pipeline dashboard, idea index |
| `1col`      | main (1fr, max 1100) | Full-bleed — breadboard, decision logs, anything diagrammatic |

The rails do **not** swap roles between shells. The directory rail is
always navigation; the context rail is always "what is non-negotiable
about this view" — constraints, north-stars, blockers, open concerns.

---

## Header card

Every artefact opens with the same header card:

```
┌───────────────────────────────────────────────────────────────┐
│ [n] · [eyebrow path] · [phase chip]                           │
│                                                               │
│ Big Title                                                     │
│ Optional tagline                                              │
│                                                               │
│ [stat] [stat] [stat] [stat] [stat]                            │
│                                                               │
│ [pipeline tape — only if frontmatter.trail/n is set]          │
└───────────────────────────────────────────────────────────────┘
```

`n` is two characters: `01`–`08` for pipeline-numbered agents, `··`
for unnumbered or framework agents, `◉` for always-on agents. Use
`fm.glyph` to override.

---

## Block vocabulary

`forge-md.js` recognises these `:::name` blocks. Authors compose
artefacts from this set; renderers dispatch on `block.kind`. Plain
markdown (paragraphs, `- ` lists) works inline alongside.

| Block | Shape | Used for |
|-------|-------|----------|
| `:::jts`      | single paragraph | Jobs Story |
| `:::ledger`   | `state \| text \| label` rows | Evidence, decisions, anything with status colouring |
| `:::feature`  | `metric \| target \| note` | North-star metric callout |
| `:::io reads` / `:::io produces` | `kind \| path \| note` | Input/output contracts |
| `:::arc`      | `n \| title \| when \| body` | Discovery arcs, multi-step procedures with conditions |
| `:::steps`    | `n \| text` | Numbered execution sequences (autonomous agents) |
| `:::schema`   | `heading \| description` | Output schemas |
| `:::table`    | `tag \| description` (first row = header) | Two-column reference tables — refusals, classifications, surfaces |
| `:::feed`     | `timestamp \| text` | Recent-notes, activity logs |
| `:::persona`  | `key \| value` pairs (multiple `job` keys list) | Persona cards |
| `:::question` | `key \| value` pairs | Open research questions |
| `:::diagram`  | `@place / @store / @wire` DSL | Breadboard SVG |

Unknown `:::name` blocks fall back to `kind: 'p'` (raw text).
Authors can introduce new dialect without breaking the renderer; you
only need to teach a renderer to handle a new kind once.

---

## Frontmatter

A JSON object between `---json` and `---`. Two fingerprints:

### Agent reference (`type: "agent"`)

```json
{
  "type": "agent",
  "id": "01-pm-agent",
  "n": "01",
  "name": "The Interrogator",
  "role": "Problem framing",
  "file": "product-team/01-pm-agent.md",
  "phase": "discovery",
  "mode": "Conversation",
  "summary": "...",
  "neighbours": { "prev": {…}, "next": {…} },
  "constraints": ["…", "…"],
  "glyph": "··"   // optional, overrides `n`
}
```

### Idea artefact (brief, personas, handoff, …)

```json
{
  "type": "brief",
  "file": "output/fieldnotes/brief.md",
  "title": "…",
  "tagline": "…",
  "phase": "discovery",
  "stats":  [{ "k": "…", "v": "…", "phase": true }],
  "trail":  [{ "n": "01", "name": "…", "state": "done|current|next" }],
  "rail":   { "title": "…", "intro": "…", "items": [{ "tag": "…", "text": "…" }] },
  "neighbours": { "prev": {…}, "next": {…} }
}
```

All keys are optional. Renderers feature-detect.

---

## Adding a new artefact type

1. Write the `.md` source under `output/[idea]/<name>.md` with JSON
   frontmatter and `## Section` headings.
2. Reuse existing `:::` blocks where you can.
3. If you need a new content shape, add a new block kind to
   `forge-md.js` and a corresponding case in the renderer.
4. Pick the right shell. Default to `2col-rail`. Use `1col` only for
   diagrams or full-bleed layouts.
5. Decide the rail's role: open concerns, constraints, north-star,
   blockers — pick one and stick to it for that artefact type.

---

## Adding a new block kind

1. Add a branch in `parseCustom` in `forge-md.js` returning
   `{ kind: 'newkind', …fields }`.
2. Add the matching CSS component class in `forge-styles.css`
   (prefix `.fg-`).
3. Add the dispatch case in the artefact's renderer.
4. Document the row shape above.

Keep block kinds primitive. If you find yourself adding three new
kinds for one artefact, you're probably building a one-off renderer
when you should be reusing an existing kind.

---

## Tweaks

`forge-tweaks.{css,jsx}` exposes three axes via the host's tweak
protocol:

- **Phase** — switch the active accent without editing source.
- **Density** — `comfortable` / `compact`. Adjusts vertical rhythm.
- **Rail visibility** — show / hide the context rail at the shell level.

Tweaks are non-destructive: they set CSS custom properties or toggle
data attributes on `.fg-shell`. The `.md` source is unchanged.

---

## What this system is not

- Not a CMS. There is no edit-in-place; authors edit the `.md`.
- Not a markdown superset. The dialect is intentionally tiny — JSON
  frontmatter, `##` sections, six-ish custom blocks. Don't add inline
  syntax (footnotes, admonitions, tables); use a `:::` block instead.
- Not responsive past tablet. These artefacts are read on a desktop.
  Narrow viewports collapse the rails but don't reflow the content.
- Not themed. Phase tokens are the only colour variation. Don't
  introduce per-artefact colours.

---

## Viewer v2 — Project home + running-brief renderer

Design decisions made in Claude Design session (2026-05-10). These extend
the existing design system — they don't replace it. CSS class prefix is
still `fg-`. New classes live in a merged section of `forge-styles.css`.

### Project home screen (`viewer/index.html`)

**Layout chosen:** Index (typographic table-of-contents). Rejected: Grid
(too card-heavy for 5+ projects), Card (adds chrome without signal).

The Index layout uses large typography as the primary navigation affordance.
Each project is a full-width row. The project name is the headline; the
one-liner is the subtitle. No card borders, no thumbnail images.

**Phase legend filter** sits below the top chrome. Clicking a phase filters
the list. Filter is combinatorial: one phase at a time. A "clear filter"
button appears when active.

**Sort controls:** three sort modes — `recent` (default, by last artefact
mtime), `name` (alphabetical), `artefacts` (by count). Rendered as small
toggles. State is transient — does not persist across page loads.

**Row anatomy:**
- `n` — zero-padded ordinal (01, 02, 03 …) in mono
- Name — project slug in large weight
- One-liner — subtitle in muted ink
- Phase / artefact count — small meta row
- Last artefact — right-aligned, eyebrow + name + relative time
- Arrow `→` — rightmost, visible on hover

**Four states:**
- Populated: `HomeIndex` — the default
- Empty: `HomeIndexEmpty` — no projects in manifest; shows `./forge serve` hint
- Single: `HomeIndexSingle` — single project gets extra "Recent activity" list
- Loading: `HomeIndexLoading` — skeleton placeholders while manifest fetches

**Manifest fields required:**
- Per project: `id`, `name`, `phase`, `oneline` (project one-liner from brief tagline), `artefacts[]`
- Per artefact: `id`, `n`, `name`, `type`, `phase`, `modified` (ISO timestamp, for relative time and sort)

### Running-brief renderer (`viewer/project.html`)

Detection: if artefact frontmatter `type === "running-brief"`, route to the
running-brief renderer instead of the generic markdown renderer. Other artefacts
use the existing path unchanged.

Three custom block transforms applied to the running-brief markdown:

**1. Handoff log timeline** (`HandoffTimeline`)
- Triggered by `## Handoff:` headings (or `### AgentName · Date` in existing format)
- Each entry renders as a distinct timeline card with: agent name, role, date, phase
- Subsections: Established (bullet list), Concerns flagged (badge list), Scope gap, Passing forward
- Timeline direction: newest-first — most recent agent at top
- Agent entries are visually distinct (phase accent left border, phase chip)
- `isCurrent` flag on the newest entry

**2. Pipeline map** (`PipelineMap`)
- Triggered by the pipeline configuration section
- Input shape: `{ project, typeLines[], estimate, waves[], trailing[], skipped[], selected[] }`
- Each wave is a row: wave number + kind label + agent chips
- Chip states: `complete` (dim, struck role), `current` (phase ring), `upcoming` (dashed)
- Parallel waves show `+` glyph between chips
- `trailing[]` rendered as "Then → agent → agent" footer
- `skipped[]` rendered in a distinct strip beneath the wave map
- Fallback: if parsing fails, render as plain fenced code block

**3. Badge tokens** (`Badge`)
- Inline in any list item, rendered in place
- Format: `[TAG]` single-bracket (existing md format) → parsed to structured badge
- Tag kinds: `DECISION`, `OPEN QUESTION`, `TECH FEASIBILITY`, `DESIGN REVIEW`,
  `SPIKE`, `REFINEMENT AGENDA ITEM`
- `resolved` flag when the body contains `RESOLVED` or explicit marker
- Unknown kinds render as `[UNKNOWN]` with console warning

### New CSS classes (appended to `forge-styles.css`)

All use the `fg-` prefix. Applied via `data-phase` and `data-state` attributes.

| Class group | What it styles |
|---|---|
| `.fg-home__*` | Top chrome, brand, nav, legend, sort controls, poll indicator |
| `.fg-index-*` | Project list, rows, row content, empty/single states |
| `.fg-timeline-*` | Handoff timeline container, entries, connector, cards, sections |
| `.fg-pipemap__*` | Pipeline map container, header, wave rows, then-chain, skipped strip |
| `.fg-pchip__*` | Pipeline agent chips (name, role, state variations) |
| `.fg-wave__*` | Wave row, label, kind indicator, parallel plus glyph |
| `.fg-badge__*` | Inline badge tokens (kind colours, resolved state) |
| `.fg-skel*` | Skeleton loading placeholders |

### Routing

- `viewer/index.html` — project home (new, replaces old index)
- `viewer/agents.html` — Forge agent reference (moved from old index.html)
- `viewer/project.html?id={projectId}` — project artefact view
- `viewer/project.html?id={projectId}&artefact={artefactId}` — deep-link to artefact

### AGENT_PHASE lookup

The pipeline map chips need a phase for each agent name. Source: `FORGE_CONFIG.PIPELINE`
(available in viewer via `forge-config.js`). Map agent name → phase by reading the
pipeline array. Do not hardcode a static lookup — derive it at runtime from the config.

---

## Conventions

- Class prefix: `fg-` for everything.
- One `.fg-shell` per page. One `data-phase` per shell.
- Headings inside cards use `<h3 class="fg-card__title">`. The
  artefact's only `<h1>` is the header card title.
- Mono font for paths, IDs, eyebrows, frontmatter glyphs (`··`, `◉`).
  Sans for everything else.
- All text is `oklch()`-tuned against the active phase. Don't
  hardcode hex values inside cards.
