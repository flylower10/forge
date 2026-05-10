# forge-live-canvas

## What this is

A live HTML companion for active Forge sessions. When a structured moment occurs in the CLI — a decision with options and tradeoffs, a pipeline proposal, a blocker requiring a choice — the relevant agent writes `output/[project]/live-canvas.md`. A hook opens `viewer/canvas.html` in the browser automatically. The canvas displays that moment with designed layout: context first (above fold), options or findings second (below fold), explanation subordinate. The terminal stays primary; the browser enriches the moment.

This is a Phase 1 extension of the existing `viewer/` app. No new server, no new build toolchain.

## The user

A Forge builder deep in a long session — focused but stretched, accumulating decisions. Also the framework designer: poor decisions here compound across every future session.

**Primary JTBD:** When Forge presents a structured choice or conclusion, make sense of the options clearly so I can decide confidently and produce better outputs.

## Architecture principles

1. **Single live file.** `output/[project]/live-canvas.md` is always the current moment. Each new structured event overwrites it completely. No accumulating history — the canvas is present tense.

2. **Direct file poll — not manifest.** `canvas.html` fetches `live-canvas.md` directly every 3 seconds. The manifest poll (30s) is for `project.html` only. Keep these loops separate.

3. **Canvas is a separate page.** `canvas.html` is not integrated into `project.html`. Different URL, different layout (full-bleed, no sidebar), different purpose.

4. **Agent-initiated write.** The canvas file is explicitly written by the agent as a step in its output sequence. No post-processing or extraction. The agent authors the content; the mechanism delivers it.

5. **Hook is the enforcement mechanism.** The browser-open is not a convention — it fires automatically when `live-canvas.md` is written. The agent writes the file; the hook does the rest.

## Key constraints

- `live-canvas.md` frontmatter must include: `type: "live-canvas"`, `output_type` (one of: `decision`, `pipeline`, `blocker`), `phase`, `title`, `lastEdit`
- Poll interval: 3 seconds. Do not go below 2s or above 5s.
- v1 scope: decision moment, pipeline proposal, blocker escalation **only**. Do not build additional output type renderers until these three are validated in real sessions.
- `canvas.html` opens in a separate tab. Do not redirect or replace the project viewer.
- The canvas page must not modify `live-canvas.md` — read-only from the browser.

## MVP scope

1. `viewer/canvas.html` — React page; polls `live-canvas.md` at 3s; renders current structured moment
2. `live-canvas.md` frontmatter schema — `type`, `output_type`, `phase`, `title`, `lastEdit` + content per type
3. 3 output type renderers: decision moment, pipeline proposal, blocker escalation
4. `hooks/post-write.sh` update — detect `/live-canvas.md` → open `canvas.html?id=[project]`
5. Agent protocol — canvas-write step added to 3 agent definition files
6. Live indicator — phase-coloured left border, pulse/timestamp

## What done looks like

1. Agent writes `output/[project]/live-canvas.md` with valid frontmatter and content
2. `post-write.sh` fires and opens `viewer/canvas.html?id=[project]` in the browser
3. Canvas renders the structured moment within 3 seconds of the write
4. Canvas shows: phase-coloured left border, live indicator, context above fold, options/findings below
5. When a new moment overwrites `live-canvas.md`, the canvas re-renders within 3 seconds
6. Builder can read, engage, decide, and return to the terminal

## Build sequence

1. Define `live-canvas.md` frontmatter schema and content structure for 3 output types (spec step)
2. Build `canvas.html` shell — project ID from query param, 3s poll, raw content display (proves mechanism)
3. Build decision-moment renderer (highest value type — full designed layout)
4. Build pipeline-proposal and blocker-escalation renderers (extend patterns from step 3)
5. Update `post-write.sh` — detect `live-canvas.md`, open `canvas.html`
6. Add canvas-write protocol to 3 agent definition files (after format is confirmed working)

## Known technical risks

- **Agent protocol timing:** Canvas-write protocol goes into agent definition files LAST — after format and renderer are confirmed. Writing the protocol before the format is finalised creates instructions that need updating.
- **Browser tab visibility:** If `canvas.html` opens behind other tabs, the builder may miss it. Session setup convention: pin the canvas tab or use a second monitor. Not a code fix.
- **`live-canvas.md` in sidebar:** The file appears in `project.html`'s sidebar under agent outputs. Benign, but may look odd. Minor follow-up: filter `type: "live-canvas"` from the sidebar.

## Existing viewer infrastructure (extend, don't replace)

- `viewer/forge-styles.css` — design system (`fg-` prefix). Canvas uses this.
- `viewer/forge-md.js` — markdown parser. Canvas may use for body content.
- `viewer/project.html` — existing manifest-driven viewer. Do not modify for canvas concerns.
- `hooks/post-write.sh` — already fires on every write to `output/[project]/`. Extend it.
- `output/manifest.json` — generated by `generate-manifest.py`. Canvas does not use the manifest.
