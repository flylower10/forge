# Design brief · forge-knowledge-browser
Agent: The Blueprint
Date: 2026-05-10

---

## Context for Claude Design

This is an addition to an existing product, not a greenfield build.

The existing viewer has two screens:
- `viewer/index.html` — currently the Forge **agent reference** viewer (lists pipeline and lateral agents; renders agent .md files). This is being repurposed as the **project home screen**.
- `viewer/project.html` — the **project artefact viewer**. Exists and works. Needs updates to load from manifest instead of forge-config.js, default to last artefact, and poll for changes.
- `viewer/agents.html` — **does not exist yet**. The agent reference UI from index.html moves here.

The design system is `viewer/forge-styles.css` — `fg-` prefix classes, phase colour tokens (`data-phase="discovery|refinement|build|marketing|framework"`). Shells: `3col`, `2col-rail`, `2col`, `1col`. Block vocabulary described in `docs/forge-viewer-DESIGN.md`.

The user is the Forge builder — one person, power user, visual and systems-oriented. Local tool. No auth. No paywall.

**Principle that drives all three screens:** The primary failure mode is discoverability. Artefacts that aren't surfaced aren't reviewed. The design must surface the right artefact at the right moment without the builder having to go looking for it.

---

## Screen 1 · Home (`viewer/index.html`)

**Purpose:** Show all active projects at a glance; navigate to a project's artefacts in one click.
**Route/nav:** Root entry point. Navigation out: project cards → project view.
**Reference:** Vercel Dashboard (status communication per item; progressive disclosure; dense but not collapsed); Rasmus Andersson / Linear (every element earns its place; typographic hierarchy carries the weight).

### Information hierarchy

Most important → the projects list: project name, current phase, most recent artefact, artefact count.
Secondary → phase status indicator per project (which phase is active, roughly how far along).
On demand → nothing. This is a navigation surface. Every project should be readable at a glance; depth is in the project view.

### Component inventory

- **Project card** — project name, phase badge, artefact count, most-recently-modified artefact name and timestamp. Interaction: click → navigate to `project.html?id=[project-id]`.
- **Phase badge** — coloured chip using the phase colour token for that project's current phase. Shows phase label (Discovery / Refinement / Build / Marketing).
- **Empty state** — shown when manifest has no projects. Text: "No projects found. Run ./forge serve to generate the manifest."
- **Loading state** — shown while manifest.json is fetching.

### Access and entitlement

- Auth required: no — local tool, served via http.server
- Paid tier: none
- Lower-tier / unauthenticated view: not applicable

### Data requirements

- `output/manifest.json` — `projects[]` array → project cards — **not wired yet** (FLY-57/FLY-58)
- `project.generated` timestamp — loading indicator / staleness display — **not wired yet**
- `project.artefacts[-1]` (last item) — most-recent artefact name and timestamp — **not wired yet**

### DESIGN.md constraints

- **Progressive disclosure:** Project cards show summary only. No artefact list visible until user navigates into the project.
- **Hierarchy through scale alone:** Project name is the primary element. Phase badge and artefact count are secondary. No element should compete with the project name.
- **Data-ink ratio:** Phase colour already encodes phase information. Don't add a separate phase label if the colour does the work with a legend. Evaluate what earns its place.
- **Consistency:** Phase colour tokens are defined in forge-styles.css. Use them. Do not introduce new colours.

### Edge cases

- **Loading:** Show a skeleton or spinner state; manifest may take a moment on cold start.
- **No projects:** Empty state with instruction text (see component inventory above).
- **Stale manifest:** Manifest was generated but no projects have artefacts. Show empty state per project or omit projects with zero artefacts.
- **Single project:** Grid should not look sparse. Consider whether 1-column or 2-column layout is appropriate.

### Notes for Claude Design

The home screen doesn't exist yet — this is a full new layout. The existing `index.html` App component renders `AgentMdPage` with a full `fg-shell`. Claude Design should decide whether the project home uses the existing `fg-shell` shell pattern or a distinct layout. It has the product context needed to make this call — the brief doesn't prescribe it.

The project cards should feel like navigation, not like data cards. The distinction: data cards summarise for reading; navigation cards orient for choosing. The user's job here is to pick a project, not to read project details. Design for fast selection, not for richness.

### Acceptance criteria

- [ ] Page loads manifest from `output/manifest.json` on startup
- [ ] Each project in the manifest renders as a clickable project card
- [ ] Clicking a project card navigates to `project.html?id=[project-id]`
- [ ] Empty state renders when manifest has zero projects
- [ ] Phase badge colour matches the phase token for that project's current phase

---

## Screen 2 · Project view (`viewer/project.html`) — updates only

**Purpose:** Browse a project's artefacts in the sidebar; read the selected artefact in the main panel.
**Route/nav:** `project.html?id=[project-id]`. Navigation out: sidebar rail → home screen (`index.html` after rename); "← Forge agents" → `agents.html`.
**Reference:** Linear (sidebar + content pane; keyboard-first navigation feel); Stripe Dashboard (typographic consistency; columns that breathe).

This screen already exists and works. The changes are:
1. Load project data from `output/manifest.json` instead of `window.FORGE_CONFIG.PROJECTS`
2. Default to the **last** artefact in the list (most recently written), not the first
3. Poll `manifest.json` every 30 seconds; new artefacts appear without browser restart
4. Update "← Forge agents" link to point to `agents.html` (not `index.html`)
5. Support `?artefact=[id]` URL param for deep-linking to a specific artefact

### Information hierarchy

Most important → the artefact content (main panel). This is the primary job: reading and reviewing agent output.
Secondary → the artefact rail (sidebar): which artefacts exist, which is active.
On demand → artefact metadata (frontmatter stats, phase, last edit). Already visible in the header card of each artefact — no change needed.

### Component inventory

- **ProjectRail** (existing) — lists artefacts grouped by type. Update: load from manifest, not forge-config.js. Update: "← Forge agents" link → `agents.html`.
- **ArtefactMdPage** (existing) — renders the selected artefact. No visual changes in this task.
- **Polling indicator** — optional: subtle indicator that manifest is being polled. Decide whether this is worth the space; could be as simple as a timestamp in the rail footer.
- **New artefact indicator** — if a new artefact appears during polling, indicate it in the rail without disrupting the current view.

### Access and entitlement

- Auth required: no
- Paid tier: none
- Lower-tier / unauthenticated view: not applicable

### Data requirements

- `output/manifest.json` — `projects[id].artefacts[]` → sidebar rail — **not wired yet** (FLY-58)
- `output/[project]/[artefact].md` — selected artefact content → main panel — **already wired**
- `?artefact=[id]` URL param — initial artefact selection — **not wired yet** (FLY-58)

### DESIGN.md constraints

- **Consistency:** ProjectRail and ArtefactMdPage visual language must not change. These changes are data-source and behaviour only.
- **Interaction as state change:** Polling indicator, if present, should communicate "data updated" not "page is busy." Only show something when the manifest actually changes.

### Edge cases

- **Project not in manifest:** Show error state — "Project not found."
- **?artefact param not in manifest:** Fall back to last artefact, no error.
- **Manifest unavailable during poll:** Keep current content; retry silently.
- **New artefact arrives during poll:** Append to rail; do not auto-navigate away from the current artefact.

### Notes for Claude Design

These are incremental changes to an existing screen. The visual treatment should be invisible — a user who doesn't know the manifest change happened shouldn't notice anything different. The polling indicator is the only new UI element; it should be as subtle as possible.

The deep-link behaviour (`?artefact=[id]`) is important for the `open` command convention: when an agent writes a new artefact, the terminal `open` command should land on that specific artefact. Claude Design should ensure the artefact ID from the URL param resolves correctly.

### Acceptance criteria

- [ ] Project data loads from `output/manifest.json`, not forge-config.js PROJECTS
- [ ] Default artefact on load is the last item in `manifest.artefacts[]` (or `?artefact` param if present)
- [ ] Manifest polls every 30 seconds; new artefacts appear in the sidebar rail
- [ ] "← Forge agents" link navigates to `agents.html`
- [ ] `?artefact=[id]` URL param selects the matching artefact on load

---

## Screen 3 · Agents reference (`viewer/agents.html`) — new, content migrated

**Purpose:** Browse the Forge agent pipeline and read agent definitions. Identical to current `viewer/index.html` App component — this is a rename + route change, not a redesign.
**Route/nav:** `agents.html`. Linked from project view sidebar ("← Forge agents").
**Reference:** No change from current index.html.

This screen is a structural migration, not a design task. The App component from `index.html` moves to `agents.html`. The visual output is identical.

### Notes for Claude Design

The only design decision here is: does the "← Forge agents" link in ProjectRail need visual treatment to distinguish it from the artefact list? Currently it's a small text link. If the home screen is now `index.html`, users may navigate home vs agents via different paths. Claude Design should flag if the navigation affordances need clarification.

### Acceptance criteria

- [ ] `agents.html` renders the agent reference UI identically to the current `index.html`
- [ ] All agent pages accessible via `agents.html`

---

## Component A · Handoff timeline (bespoke layout for running-brief)

**Purpose:** Render the `## Handoff log` section of a running-brief artefact as a visual timeline — each agent entry as a distinct, visually separated entry — so the builder can read the history of thinking, not a flat document.
**Route/nav:** Embedded in the project view's ArtefactMdPage when rendering a `running-brief` type artefact.
**Reference:** Linear issue history (each action is visually distinct; timestamp + actor + content; reading top-to-bottom reveals evolution); The Athletic (long-form data journalism — context alongside the data; each voice is distinct).

This is a bespoke renderer for a specific artefact section. The existing ArtefactMdPage renders the handoff log as flat H3 headings followed by bullet lists. The problem: every agent entry looks identical. The design must make each agent entry feel like a distinct voice.

### Information hierarchy

Most important → agent name and the "established" items (what this agent concluded).
Secondary → concerns flagged, passing-forward note.
On demand → timestamp (already in the H3 heading).

The established items are the primary reading path. Concerns and passing-forward are secondary context that the builder may or may not need.

### Component inventory

- **Timeline container** — vertical strip with agent entries stacked top-to-bottom, newest first (or oldest first — Claude Design to decide based on reading flow; the intent is to read the evolution, which argues oldest-first).
- **Agent entry card** — one per `### Agent · Date` H3 in the handoff log. Contains: agent name (large, distinct), date (small, secondary), "Established" list (primary content), "Concerns flagged" list (secondary, visually softer), "Passing forward" note (tertiary, distinct treatment).
- **Phase accent** — each agent entry inherits the phase colour of the agent (The Tracer = discovery, etc.). This makes the entry look different from other entries without requiring new colours.
- **Timeline connector** — visual element connecting entries. Should not compete with content. Minimal.

### Access and entitlement

Not applicable — same as parent screen.

### Data requirements

- Running-brief markdown source — `## Handoff log` section — `### [Agent name] · [Date]` entries — already fetched by ArtefactMdPage.
- The section structure: `### Agent · Date` heading, `**Established:**` bullet list, `**Concerns flagged:**` bullet list, `**Passing forward:**` paragraph.
- These are currently parsed as H3 + list blocks. The bespoke renderer needs to consume these blocks and recompose them into the timeline visual.

### DESIGN.md constraints

- **Hierarchy through scale alone:** Agent name must be the largest element in the entry card. Don't use colour to carry hierarchy — scale does it.
- **Consistency:** Phase colour tokens from forge-styles.css only. No new colours.
- **Data-ink ratio:** The timeline connector should be minimal — a line, not a decorative element.
- **Interaction as state change:** No motion unless it communicates something.

### Edge cases

- **One entry:** Timeline should not look sparse. A single entry should still read well.
- **Many entries:** Ten or more agent entries should scroll without performance issues. No lazy loading needed at this scale.
- **Missing sections:** Some agents may not have all three sub-sections (Established / Concerns / Passing forward). The entry card should render gracefully with missing sections.
- **Long passing-forward note:** Should not break the card. Wrap naturally.

### Notes for Claude Design

The key tension: each entry should feel distinct (different voice) but the series should feel coherent (same timeline). Solve this through variation in the secondary elements (phase accent, subtle card treatment) while keeping the primary structure consistent.

The current format has the newest entry at the top of the markdown file. Claude Design should decide the read order — the brief does not prescribe it. The product intent is for the builder to read the evolution of thinking; decide which direction serves that intent.

### Acceptance criteria

- [ ] Each `### Agent · Date` entry in the handoff log renders as a visually distinct card
- [ ] Agent name is the dominant text element in each entry card
- [ ] `**Established:**` list is visually primary; `**Concerns flagged:**` is visually secondary
- [ ] Phase colour token is applied per agent entry based on the agent's phase
- [ ] Missing sub-sections (no Concerns, no Passing forward) render without empty gaps

---

## Component B · Pipeline configuration visual (bespoke layout for running-brief)

**Purpose:** Render the pipeline configuration block in a running-brief artefact as a visual pipeline map — wave structure visible as a system — so the builder can grasp agent sequencing at a glance, not by parsing text.
**Route/nav:** Embedded in ArtefactMdPage for `running-brief` artefacts, replacing the fenced code block that contains the pipeline config.
**Reference:** Vercel Dashboard (pipeline/process states communicated visually; status per item); Linear project milestones (stages, dependencies, ordering).

The pipeline config is currently a fenced code block:
```
Agents selected:
  1 · The Interrogator  — sharpen JTBD; lock local vs public scope
  2 · The Narrator      — reading experience and emotional arc
  ...
Execution order:
  Wave 1 (complete): The Scout
  Wave 2 (sequential): The Interrogator
  Wave 3 (parallel): The Narrator + The Pragmatist
  ...
```
This is readable but not visual. The wave structure (parallel vs sequential) and completion state are the most information-dense parts — they should be immediately visible, not read.

### Information hierarchy

Most important → wave structure (which agents run in parallel, which are sequential, which are complete).
Secondary → agent name and role per entry.
On demand → agent description / rationale (the "sharpen JTBD" part). Consider whether this is shown inline or on hover.

### Component inventory

- **Wave row** — one row per wave. Label: "Wave N" + "(sequential)" or "(parallel)". Contains agent chips for that wave.
- **Agent chip** — agent name, completion state (complete / current / upcoming). Completion drives visual treatment (done = muted; current = phase accent; upcoming = neutral).
- **Agents-skipped section** — the "Agents skipped" list. Visually distinct from the wave map — these are absent, not upcoming.
- **Pipeline type label** — the "Type:" line from the config. Shown at the top.

### Access and entitlement

Not applicable — same as parent screen.

### Data requirements

- Running-brief markdown source — the fenced code block under `## Pipeline configuration` — parsed as a `code` block kind. The bespoke renderer needs to parse this code block's text to extract wave structure and agent list.
- The code block text follows a consistent format. The renderer should parse it with clear error handling for malformed blocks.

### DESIGN.md constraints

- **Consistency:** Agent completion states should use the existing phase colour tokens where applicable (e.g., a completed discovery agent uses the discovery phase colour at reduced opacity).
- **Hierarchy through scale alone:** Wave label is larger than agent name; agent name is larger than agent description.
- **Data-ink ratio:** Wave rows do not need decorative backgrounds. Spacing does the structural work.

### Edge cases

- **Malformed code block:** Fall back to rendering the code block as-is (plain text). Do not crash.
- **Single-agent waves:** Still render as a wave row; don't collapse single-agent waves.
- **All agents complete:** Entire map should be visually settled — no current/upcoming treatment.

### Notes for Claude Design

This requires parsing a structured text format from within the code block. Claude Design should decide: is this parsed at render time (the renderer reads the code block text and reconstructs the structure), or does The Blueprint define a new `:::pipeline` block that makes the structure explicit in the markdown source? The brief recommends the new block approach (cleaner, more reliable) but leaves the decision to Claude Design. If the new block approach is chosen, the block parser in forge-md.js will need a corresponding update.

### Acceptance criteria

- [ ] Wave structure (Wave 1, Wave 2, ...) renders as distinct visual rows
- [ ] Parallel vs sequential is communicated per wave without reading text
- [ ] Agent completion state (complete / current / upcoming) is visually distinct per chip
- [ ] Agents-skipped section is visually distinct from the wave map
- [ ] Malformed or missing pipeline config block falls back to plain code block rendering

---

## Component C · Badge tags (inline rendering)

**Purpose:** Render structured tags (`[DECISION]`, `[OPEN QUESTION]`, `[TECH FEASIBILITY]`, `[DESIGN REVIEW]`, `[SPIKE]`, `[REFINEMENT AGENDA ITEM]`) as styled inline chips, so the builder can scan a running-brief's open concerns at a glance.
**Route/nav:** Inline in any artefact section — primarily running-brief open concerns and handoff log entries.
**Reference:** Linear issue labels (colour-coded, tight, high contrast, scannable at density); GitHub PR labels.

### Information hierarchy

The tag is the primary element — the builder scans for tags before reading the surrounding text. The tag must be visually dominant enough to interrupt the paragraph flow.
Secondary → the text after the tag (the concern or decision note itself).

### Component inventory

- **Badge chip** — inline element. Tag text in caps: `DECISION`, `OPEN QUESTION`, etc. Colour coded by type. Replaces the `[TAG]` literal text in the rendered output.
- Tag type → colour mapping (Claude Design to determine colours; guidance: use existing phase tokens where the tag maps to a phase; for tags without a phase mapping, use neutral or amber):
  - `DECISION` → completed/resolved — suggest build phase green
  - `OPEN QUESTION` → unresolved — suggest discovery phase blue
  - `TECH FEASIBILITY` → technical flag — suggest neutral or amber
  - `DESIGN REVIEW` → design flag — suggest refinement phase violet
  - `SPIKE` → investigation needed — suggest amber
  - `REFINEMENT AGENDA ITEM` → ceremony flag — suggest refinement phase violet

### Access and entitlement

Not applicable — inline component.

### Data requirements

- Paragraph text from artefact markdown — the `[TAG]` literal in the text — parsed inline by the renderer. The `inlineMd()` function in `artefact-md.jsx` already handles `**bold**` and `_italic_` — badge tags can be added to the same function.

### DESIGN.md constraints

- **Consistency:** Badge colours must use phase tokens, not hardcoded hex values. If a new colour is introduced for a badge type, it must be added to forge-styles.css as a token.
- **Data-ink ratio:** The chip should be tight. No padding excess. If the chip is doing the work with colour, it doesn't also need a border and a drop shadow.

### Edge cases

- **Unknown tag type:** Fall back to a neutral chip with the raw tag text. Do not crash.
- **Tag mid-sentence:** The chip must not break line flow. Inline element only.
- **Tag at line start:** Should work equally well at the start of a bullet point.

### Notes for Claude Design

The badge chips are inline components within paragraph text. They cannot be block-level. Claude Design should verify the chip height is consistent with the surrounding text line height — a chip that is taller than the text it sits in will break line rhythm.

The current running-brief has many `[RESOLVED]` suffixes after some tags (e.g., `[OPEN QUESTION] ... **Resolved: local, phase 1.**`). Claude Design should decide: does a resolved tag look different from an open one? The brief recommends yes — reduced opacity or a strikethrough treatment communicates closure without removing the record.

### Acceptance criteria

- [ ] `[DECISION]`, `[OPEN QUESTION]`, `[TECH FEASIBILITY]`, `[DESIGN REVIEW]`, `[SPIKE]`, `[REFINEMENT AGENDA ITEM]` render as inline coloured chips
- [ ] Unknown tags fall back to a neutral chip
- [ ] Chips are inline — they do not break paragraph flow
- [ ] Chip colours use phase token variables, not hardcoded hex

---

## Real data for Claude Design

Paste these alongside the brief. Claude Design should design against the actual data shape, not a hypothesis.

### Manifest — forge-knowledge-browser slice

```json
{
  "generated": "2026-05-10T12:49:30.770734+00:00",
  "projects": [
    {
      "id": "forge-knowledge-browser",
      "name": "forge-knowledge-browser",
      "phase": "refinement",
      "artefacts": [
        { "id": "01-problem-framing",  "n": "01", "name": "Problem framing · forge-knowledge-browser",     "phase": "discovery",  "type": "agent-output"   },
        { "id": "02-design-agent",     "n": "02", "name": "UX framing · forge-knowledge-browser",           "phase": "discovery",  "type": "agent-output"   },
        { "id": "03-tech-feasibility", "n": "03", "name": "Tech feasibility · forge-knowledge-browser",     "phase": "discovery",  "type": "agent-output"   },
        { "id": "04-sceptic",          "n": "04", "name": "Assumption stress-test · forge-knowledge-browser","phase": "discovery",  "type": "agent-output"   },
        { "id": "assumption-log",      "n": "al", "name": "Assumption log · forge-knowledge-browser",       "phase": "discovery",  "type": "assumption-log" },
        { "id": "breadboard",          "n": "bb", "name": "Breadboard · forge-knowledge-browser",           "phase": "discovery",  "type": "breadboard"     },
        { "id": "brief",               "n": "br", "name": "Product brief: forge-knowledge-browser",         "phase": "discovery",  "type": "brief"          },
        { "id": "build-kickoff",       "n": "bk", "name": "Build kickoff · forge-knowledge-browser",        "phase": "refinement", "type": "build-kickoff"  },
        { "id": "ost-decisions",       "n": "od", "name": "OST decisions · forge-knowledge-browser",        "phase": "discovery",  "type": "ost-decisions"  },
        { "id": "running-brief",       "n": "rb", "name": "Running brief: forge-knowledge-browser",         "phase": "discovery",  "type": "running-brief"  }
      ]
    }
  ]
}
```

### Running-brief — pipeline configuration block (raw markdown source)

This is the exact text Component B (pipeline configuration visual) must parse and render visually.

```
Pipeline: forge-knowledge-browser
Type: Internal tool — framework extension for the builder.
      Two possible shapes (local browser vs public hosted site) need resolving in discovery.

Agents selected:
  1 · The Interrogator  — sharpen JTBD; lock local vs public scope
  2 · The Narrator      — reading experience and emotional arc
  3 · The Pragmatist    — file discovery architecture; hosting options
  4 · The Sceptic       — challenge: will this actually change behaviour?
  5 · Synthesis         — produce the brief
  6 · The Tracer        — breadboard interaction model post-Synthesis
  7 · The Blueprint     — Claude Design brief at build kickoff

Agents skipped:
  The Advocate    — builder is the user; user research overhead not warranted
  Merchant        — not a commercial product
  Campaigner      — not a commercial product

Execution order:
  Wave 1 (complete):    The Scout
  Wave 2 (sequential):  The Interrogator — scope must be locked before design or tech starts
  Wave 3 (parallel):    The Narrator + The Pragmatist
  Wave 4 (sequential):  The Sceptic — reads all Wave 3 output
  Wave 5 (sequential):  Synthesis
  [Then: The Tracer → Refinement Ceremony → The Blueprint → build team]

Estimated pipeline length: medium
```

### Running-brief — handoff log section (raw markdown source)

This is the exact structure Component A (handoff timeline) must parse and render as a timeline. Five entries, each with the same sub-sections (`**Established:**`, `**Concerns flagged:**` or variant, `**Passing forward:**`).

```markdown
### The Tracer · 2026-05-10

**Established:**
- Two places: P1 (Home — doesn't exist yet), P2 (Project view — project.html)
- Two stores: manifest.json (S1), artefact .md files (S2)
- Five non-UI affordances including manifest generation at startup and post-output hook

**Spikes flagged (for Refinement):**
- [SPIKE] Home page entry point — viewer/index.html vs new viewer/home.html
- [SPIKE] Deep-link to specific artefact — ?artefact= URL param needed for open command
- [SPIKE] Manifest polling vs manual refresh

**Scope gap flagged:**
- [REFINEMENT AGENDA ITEM 1] Decision surface — live in-session decision moments (question, options, tradeoffs) are not in current brief scope. Human confirmed this should be taken into Refinement as the first conversation before AC is locked.

**Passing forward:** Refinement Ceremony opens with the decision surface question: should the viewer render structured decision requests during live sessions, and if so, what does that look like?

### The Pragmatist · 2026-05-09

**Established:**
- All capabilities are Low–Medium complexity — no blockers to build
- [DECISION] File discovery architecture: **manifest-based**. A script scans `output/` and writes `output/manifest.json`. The viewer loads from manifest, not forge-config.js. Startup becomes `./forge serve`.
- forge-config.js shrinks to framework-only (PHASES, PIPELINE, LATERAL); project artefacts move to manifest
- Post-output hook regenerates manifest on agent completion → immediate arrival without config edits

**Concerns flagged:**
- [TECH FEASIBILITY — RESOLVED] File discovery: manifest approach selected. No remaining architectural unknowns for Phase 1.
- [OPEN QUESTION] Manifest staleness mid-session — post-output hook mitigates but doesn't eliminate.

**Passing forward:** The Sceptic should challenge whether manifest-based discovery + rendered HTML will actually change review behaviour.

### The Narrator · 2026-05-09

**Established:**
- User is a visual, systems-oriented builder — strongest processing mode is not engaged by CLI markdown
- Core failure mode: skimming and accepting agent work rather than reading and interrogating it
- Design direction: extend the existing Forge design system, not reinvent it
- Key surface: the handoff log is the emotional core — it should read as a timeline of evolving thinking, not a flat document

**Concerns flagged:**
- [DESIGN REVIEW] The pipeline configuration section needs bespoke treatment — a code block doesn't engage visual thinking.
- [DESIGN REVIEW] Agent entries in the handoff log should be visually distinct — each one is a different voice.

**Passing forward:** The Pragmatist must answer the file discovery question.

### The Interrogator · 2026-05-09

**Established:**
- Scope locked: local browser, phase 1. Public hosting is a deferred phase 2.
- JTBD sharpened: make agent outputs worth reading so the builder reads them properly and engages critically, not lazily
- Two surfaces identified: Forge framework files + project artefacts from discovery/build sessions

**Concerns flagged:**
- [DESIGN REVIEW] The rendering must engage visual, system-oriented thinking — not just display HTML.

**Passing forward:** The Narrator should focus on what "engaging visual thinking" means in practice.

### The Scout · 2026-05-09

**Established:**
- Pipeline configured: 7 agents, medium length, execution order with wave map
- Idea characterised: internal tool for Forge builders — renders markdown artefacts as readable HTML
- Builder fit confirmed: personal motivation, long-term commitment to AI tools, uses Forge themselves

**Concerns flagged:**
- [OPEN QUESTION] Local vs public scope — must be resolved in The Interrogator before any other agent starts
- [TECH FEASIBILITY] File discovery in a static browser app — no server means no directory listing without architectural decision

**Passing forward:** The Interrogator must lock the scope before The Narrator or The Pragmatist begin.
```
