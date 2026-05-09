# forge-knowledge-browser

## What this is

A local browser that renders Forge markdown artefacts (agent outputs, briefs,
running briefs, handoff logs) as structured HTML, browsable by project. Served
via a lightweight HTTP server from the forge root. No build step, no deployment,
no external dependencies beyond what the existing viewer already uses.

This is a Phase 1 extension of the existing `viewer/` app — not a new product.

## The problem it solves

Agent outputs are written to `output/[project]/` but do not appear in the viewer
without manual config edits. The primary failure is discoverability: artefacts
that aren't surfaced cannot be reviewed. The secondary failure is presentation:
when surfaced via CLI or the existing viewer, the format doesn't engage the
builder's visual, systems-oriented processing style.

## Architecture principles

- **Manifest-driven discovery** — `output/manifest.json` is the source of truth
  for what projects and artefacts exist. The viewer fetches it on load. Never
  read the filesystem from the browser.
- **Static browser app** — no server-side logic in the viewer itself. The manifest
  generator is a pre-flight script, not a running service.
- **Extend, don't replace** — the existing Forge design system (forge-styles.css,
  forge-config.js, forge-md.js, artefact-md.jsx) is the foundation. Build on it.
- **Frontmatter discipline** — every artefact in `output/[project]/` must have
  valid `---json` frontmatter. The manifest generator enforces this with loud warnings.
- **`forge-config.js` is framework-only** — PHASES, PIPELINE, LATERAL. Project
  artefacts come from the manifest. Remove PROJECTS from forge-config.js after
  the manifest is live.

## Key constraints

- Works via `./forge serve` (wrapper: generate manifest → start python3 http.server)
- No npm, no build toolchain, no node_modules — plain JS + React from CDN
- Must work universally for any Forge user who clones the repo; zero configuration

## MVP scope

1. `generate-manifest.sh` — scans `output/`, reads frontmatter, writes `output/manifest.json`
2. `./forge serve` wrapper script
3. Viewer loads project artefacts from manifest (remove PROJECTS from forge-config.js)
4. Post-output hook: regenerate manifest on agent completion
5. Bespoke layout: running-brief handoff timeline (visual, not H3 cards)
6. Bespoke layout: pipeline configuration (visual pipeline map, not code block)
7. Tagged entries (`[DECISION]`, `[OPEN QUESTION]`, `[TECH FEASIBILITY]`, `[DESIGN REVIEW]`)
   rendered as styled badges
8. Project home screen — all projects, pipeline status at a glance

## What done looks like

- `./forge serve` starts the server and generates the manifest
- `http://localhost:8080/viewer/` shows all projects from `output/` with no config
- New artefacts written by agents appear in the viewer after manifest regeneration
- Running brief, handoff log, agent outputs all render with appropriate layouts
- The builder reads newly-surfaced outputs without being prompted

## Known risks

- **Frontmatter discipline** — files without valid frontmatter are silently invisible;
  enforce with loud warnings or validation in the post-output hook
- **Manifest staleness** — new files are invisible between agent completion and next
  manifest regeneration; post-output hook mitigates; decide on polling vs manual refresh

## Build sequence

1. Manifest generator + `./forge serve` wrapper
2. Viewer loads from manifest; remove PROJECTS from forge-config.js
3. Post-output hook
4. Bespoke layouts (running-brief, pipeline config, badge tags)
5. Project home screen
