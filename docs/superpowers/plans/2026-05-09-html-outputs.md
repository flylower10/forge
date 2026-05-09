# HTML Outputs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert all human-facing Forge outputs from markdown to HTML using a shared design system, add an intellectual standards behavioral baseline for all agents, and produce a pipeline dashboard.

**Architecture:** A canonical CSS file (`skills/forge-styles.css`) is embedded inline by all agents when they produce HTML outputs. Agent definition files become self-contained HTML documents with a visual card + collapsible instructions. Artefact templates are rewritten as HTML. Output instructions in Synthesis, Breadboard, and Delivery Manager are updated to produce HTML. `running-brief.md` is the only file that stays markdown.

**Tech Stack:** HTML, CSS (inline, no framework), SVG (breadboard diagrams), Forge agent instruction files (markdown prose)

---

## File Map

### New files
- `skills/forge-styles.css` — canonical CSS source of truth; agents copy this inline
- `skills/intellectual-standards.md` — behavioral baseline; every agent references it
- `docs/CLAUDE.html` — human companion to product repo CLAUDE.md (produced by Synthesis)

### Modified files
- `skills/artefact-templates.md` — replace all markdown templates with HTML templates
- `product-team/06-synthesis.md` — update output instructions: produce `.html` files, produce `CLAUDE.html`, generate pipeline dashboard
- `product-team/breadboard.md` — update output format to SVG flow diagram
- `build-team/delivery-manager.md` — update handoff output to `handoff.html`
- `CLAUDE.md` (Forge repo) — update all `.md` extension references to `.html` for output files

### Converted files (markdown → HTML)
All 23 agent definition files. Pattern defined in Task 4 and applied uniformly:
- `product-team/00-intake.md` → `product-team/00-intake.html`
- `product-team/01-pm-agent.md` → `.html`
- `product-team/02-design-agent.md` → `.html`
- `product-team/03-devils-advocate.md` → `.html`
- `product-team/04-tech-feasibility.md` → `.html`
- `product-team/05-user-researcher.md` → `.html`
- `product-team/06-synthesis.md` → `.html`
- `product-team/07-refinement.md` → `.html`
- `product-team/08-burst-review.md` → `.html`
- `product-team/breadboard.md` → `.html`
- `product-team/model-reviewer.md` → `.html`
- `product-team/observer.md` → `.html`
- `product-team/research-agent.md` → `.html`
- `product-team/ux-agent.md` → `.html`
- `build-team/delivery-manager.md` → `.html`
- `build-team/architect.md` → `.html`
- `build-team/engineer.md` → `.html`
- `build-team/reviewer.md` → `.html`
- `build-team/qa.md` → `.html`
- `build-team/feedback-triage.md` → `.html`
- `build-team/cartographer.md` → `.html`
- `marketing-team/monetisation-agent.md` → `.html`
- `marketing-team/gtm-agent.md` → `.html`

### Unchanged files
- `output/[idea]/running-brief.md` — append-only agent coordination mechanism
- `CLAUDE.md` (Forge repo and product repos) — read by Claude Code by filename; stays markdown
- `hooks/*.md` — agent instruction files, not human-facing outputs
- `memory/*.md` — internal framework state

---

## Task 1: Canonical design system CSS

**Files:**
- Create: `skills/forge-styles.css`

This file is the single source of truth for all Forge visual design tokens and components. Agents copy its contents verbatim into a `<style>` tag when producing any HTML output. It must never reference external URLs — everything is self-contained.

- [ ] **Step 1: Create the CSS file**

```css
/* ════════════════════════════════════════
   FORGE DESIGN SYSTEM — v1
   Embed this entire block inline in every Forge HTML output.
   Do NOT link externally — all files must be self-contained.
════════════════════════════════════════ */

* { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  /* Surfaces */
  --bg:       #0d0d14;
  --surface:  #14141f;
  --elevated: #1c1c2e;
  --border:   #2a2a3d;
  --border-hi:#4a4a6a;

  /* Text */
  --text:     #e8e8f0;
  --mid:      #9090a8;
  --dim:      #555568;

  /* Semantic accents */
  --blue:   #5b8dee;   /* Discovery, in-progress, links */
  --green:  #4caf82;   /* Build, complete, success */
  --amber:  #e8a94d;   /* Open, pending, medium risk */
  --red:    #e05c5c;   /* Blocked, high risk */
  --purple: #9b72cf;   /* Delivery phase */
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 14px;
  line-height: 1.6;
}

/* ── TOPBAR ── */
.forge-topbar {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: 0.65rem 1.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}
.forge-breadcrumb { display: flex; align-items: center; gap: 0.4rem; font-size: 0.78rem; }
.forge-breadcrumb a { color: var(--dim); text-decoration: none; }
.forge-breadcrumb a:hover { color: var(--blue); }
.forge-breadcrumb-sep { color: var(--border); }
.forge-breadcrumb-cur { color: var(--mid); }
.forge-logo { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--dim); }

/* ── PIPELINE STRIP ── */
.forge-pipeline {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: 0 1.75rem;
  display: flex;
}
.forge-pipeline-step {
  padding: 0.55rem 1rem;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--dim);
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  white-space: nowrap;
}
.forge-pipeline-step.done { color: var(--dim); }
.forge-pipeline-step.done::after { content: ' ✓'; font-size: 0.6rem; }
.forge-pipeline-step.active-discovery { color: var(--blue); border-bottom-color: var(--blue); }
.forge-pipeline-step.active-build     { color: var(--green); border-bottom-color: var(--green); }
.forge-pipeline-step.active-delivery  { color: var(--purple); border-bottom-color: var(--purple); }
.forge-pipeline-sep { padding: 0.55rem 0.2rem; color: var(--border-hi); font-size: 0.8rem; align-self: center; }

/* ── ARTEFACT NAV ── */
.forge-artefact-nav {
  background: var(--elevated);
  border-bottom: 1px solid var(--border);
  padding: 0 1.75rem;
  display: flex;
  gap: 0;
  overflow-x: auto;
}
.forge-artefact-link {
  padding: 0.45rem 0.9rem;
  font-size: 0.72rem;
  font-weight: 500;
  color: var(--dim);
  text-decoration: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  white-space: nowrap;
}
.forge-artefact-link:hover { color: var(--mid); }
.forge-artefact-link.active { color: var(--blue); border-bottom-color: var(--blue); }
.forge-artefact-link.exists::before {
  content: '';
  display: inline-block;
  width: 6px; height: 6px;
  background: var(--green);
  border-radius: 50%;
  margin-right: 0.35rem;
  vertical-align: middle;
}
.forge-artefact-link.pending::before {
  content: '';
  display: inline-block;
  width: 6px; height: 6px;
  background: var(--border-hi);
  border-radius: 50%;
  margin-right: 0.35rem;
  vertical-align: middle;
}

/* ── LAYOUT ── */
.forge-layout { display: grid; grid-template-columns: 220px 1fr; }
.forge-sidebar {
  background: var(--surface);
  border-right: 1px solid var(--border);
  padding: 1.25rem 1rem;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}
.forge-main { padding: 1.75rem 2rem; max-width: 860px; }

/* ── SIDEBAR NAV ── */
.forge-nav-label {
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--dim);
  margin: 1.25rem 0 0.5rem;
}
.forge-nav-label:first-child { margin-top: 0; }
.forge-nav-link {
  display: block;
  padding: 0.3rem 0.6rem;
  font-size: 0.78rem;
  color: var(--mid);
  text-decoration: none;
  border-radius: 5px;
  margin-bottom: 0.1rem;
}
.forge-nav-link:hover { background: var(--elevated); color: var(--text); }
.forge-nav-link.active { background: rgba(91,141,238,0.12); color: var(--blue); }

/* ── TYPOGRAPHY ── */
h1 { font-size: 1.6rem; font-weight: 700; letter-spacing: -0.02em; color: var(--text); margin-bottom: 0.4rem; }
h2 { font-size: 1rem; font-weight: 700; color: var(--text); margin: 2rem 0 0.9rem; padding-top: 1.75rem; border-top: 1px solid var(--border); }
h2:first-of-type { border-top: none; padding-top: 0; margin-top: 0; }
h3 { font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--dim); margin: 1.25rem 0 0.65rem; }
p  { font-size: 0.875rem; color: var(--mid); line-height: 1.75; margin-bottom: 0.85rem; }
p:last-child { margin-bottom: 0; }
a  { color: var(--blue); text-decoration: none; }
a:hover { text-decoration: underline; }
code {
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 0.8rem;
  background: var(--elevated);
  color: var(--blue);
  padding: 0.1rem 0.4rem;
  border-radius: 3px;
}

/* ── BADGES ── */
.forge-badge {
  display: inline-block;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 0.18rem 0.52rem;
  border-radius: 4px;
}
.forge-badge-blue   { background: rgba(91,141,238,0.15);  color: var(--blue); }
.forge-badge-green  { background: rgba(76,175,130,0.15);  color: var(--green); }
.forge-badge-amber  { background: rgba(232,169,77,0.15);  color: var(--amber); }
.forge-badge-red    { background: rgba(224,92,92,0.15);   color: var(--red); }
.forge-badge-purple { background: rgba(155,114,207,0.15); color: var(--purple); }
.forge-badge-grey   { background: rgba(144,144,168,0.12); color: var(--mid); }

/* ── STATUS DOTS ── */
.forge-status { display: inline-flex; align-items: center; gap: 0.35rem; font-size: 0.72rem; color: var(--mid); }
.forge-dot { width: 6px; height: 6px; border-radius: 50%; }
.forge-dot-green  { background: var(--green); box-shadow: 0 0 5px var(--green); }
.forge-dot-amber  { background: var(--amber); }
.forge-dot-red    { background: var(--red); }
.forge-dot-blue   { background: var(--blue); }
.forge-dot-grey   { background: var(--dim); }

/* ── CARDS ── */
.forge-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 1.25rem;
  margin-bottom: 1rem;
}
.forge-card-title {
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: var(--dim);
  margin-bottom: 0.75rem;
}

/* ── AGENT CARD ── */
.forge-agent-card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; margin-bottom: 1rem; }
.forge-agent-header { padding: 1rem 1.25rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: flex-start; }
.forge-agent-name  { font-size: 1rem; font-weight: 700; color: var(--text); }
.forge-agent-alias { font-size: 0.75rem; color: var(--dim); font-style: italic; margin-top: 0.15rem; }
.forge-agent-body  { padding: 1rem 1.25rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.forge-io-label    { font-size: 0.6rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.09em; color: var(--dim); margin-bottom: 0.4rem; }
.forge-io-chips    { display: flex; gap: 0.35rem; flex-wrap: wrap; }
.forge-chip        { font-family: 'SF Mono', monospace; font-size: 0.68rem; padding: 0.15rem 0.45rem; background: var(--elevated); border: 1px solid var(--border); border-radius: 3px; color: var(--mid); }
.forge-chip-out    { color: var(--green); border-color: rgba(76,175,130,0.3); background: rgba(76,175,130,0.06); }
.forge-agent-footer { padding: 0.65rem 1.25rem; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; font-size: 0.72rem; color: var(--dim); }
.forge-view-btn    { font-size: 0.68rem; color: var(--mid); background: var(--elevated); border: 1px solid var(--border); border-radius: 4px; padding: 0.22rem 0.6rem; cursor: pointer; }
.forge-view-btn:hover { background: var(--border); color: var(--text); }

/* ── COLLAPSIBLE INSTRUCTIONS ── */
.forge-instructions { display: none; border-top: 1px solid var(--border); padding: 1.25rem; background: var(--bg); }
.forge-instructions.open { display: block; }
.forge-instructions h3 { margin-top: 0; }

/* ── NEVER-DO LIST ── */
.forge-never-do { background: rgba(224,92,92,0.05); border: 1px solid rgba(224,92,92,0.2); border-radius: 8px; padding: 1rem 1.25rem; margin-top: 0.75rem; }
.forge-never-do .forge-card-title { color: var(--red); }
.forge-never-do ul { list-style: none; padding: 0; }
.forge-never-do li { font-size: 0.82rem; color: var(--mid); padding: 0.3rem 0; border-bottom: 1px solid rgba(224,92,92,0.1); display: flex; gap: 0.5rem; }
.forge-never-do li:last-child { border-bottom: none; }
.forge-never-do li::before { content: '✗'; color: var(--red); font-weight: 700; flex-shrink: 0; }

/* ── DATA TABLE ── */
.forge-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
.forge-table th { text-align: left; padding: 0.45rem 0.75rem; font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.07em; color: var(--dim); border-bottom: 1px solid var(--border); }
.forge-table td { padding: 0.55rem 0.75rem; border-bottom: 1px solid rgba(42,42,61,0.5); color: var(--mid); vertical-align: top; }
.forge-table tr:last-child td { border-bottom: none; }
.forge-table tr:hover td { background: var(--elevated); }

/* ── METRIC CARDS ── */
.forge-metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-bottom: 1.25rem; }
.forge-metric { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1rem; }
.forge-metric-label { font-size: 0.62rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--dim); margin-bottom: 0.4rem; }
.forge-metric-value { font-size: 1.2rem; font-weight: 700; color: var(--text); letter-spacing: -0.02em; }
.forge-metric-sub   { font-size: 0.72rem; color: var(--dim); margin-top: 0.2rem; }

/* ── ARTEFACT REFS ── */
.forge-ref { display: inline-flex; align-items: center; gap: 0.35rem; font-size: 0.75rem; color: var(--blue); background: rgba(91,141,238,0.08); border: 1px solid rgba(91,141,238,0.2); border-radius: 5px; padding: 0.2rem 0.55rem; text-decoration: none; }
.forge-ref:hover { background: rgba(91,141,238,0.16); text-decoration: none; }

/* ── TABS ── */
.forge-tabs { display: flex; gap: 0; border-bottom: 1px solid var(--border); margin-bottom: 1.5rem; }
.forge-tab  { padding: 0.5rem 1rem; font-size: 0.78rem; font-weight: 500; color: var(--dim); cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px; }
.forge-tab:hover  { color: var(--mid); }
.forge-tab.active { color: var(--blue); border-bottom-color: var(--blue); }
.forge-tab-content { display: none; }
.forge-tab-content.active { display: block; }

/* ── DIVIDER ── */
hr { border: none; border-top: 1px solid var(--border); margin: 1.5rem 0; }
```

- [ ] **Step 2: Verify the file exists**

```bash
ls -la /Users/aidanmaughan/my-projects/forge/skills/forge-styles.css
```
Expected: file exists, non-zero size.

- [ ] **Step 3: Commit**

```bash
git add skills/forge-styles.css
git commit -m "feat: add Forge design system CSS — canonical inline styles for all HTML outputs"
```

---

## Task 2: Intellectual standards skill

**Files:**
- Create: `skills/intellectual-standards.md`

This file is read by every agent before acting. It defines the behavioral baseline for all agent interactions — how to reason, how to handle pushback, what accuracy means.

- [ ] **Step 1: Create the file**

```markdown
# Skill · Intellectual Standards

This is the behavioral baseline for all Forge agents. Read it before
acting. These are not suggestions — they are how agents in this
framework operate.

---

## Core principles

**1. Lead with the counterargument.**
Before supporting any position, steelman the strongest opposing view.
Do not validate premises before examining them. Do not open with
agreement. If the human's framing is wrong, say so first.

**2. Explicit confidence levels.**
Every factual or analytical claim carries a marker:
- `(high)` — well-established, multiple sources, low uncertainty
- `(moderate)` — plausible, some basis, meaningful uncertainty remains
- `(low)` — speculative, thin basis, treat as hypothesis
- `(unknown)` — genuinely not known; do not paper over with hedged prose

Do not imply certainty you do not have. Overconfidence is a failure mode.

**3. No anchor on human framing.**
Generate your own independent assessment before comparing to the brief
or running context. Do not let prior framing constrain your analysis.
If the brief says X and your assessment says not-X, say not-X.

**4. Non-capitulation rule.**
If the human pushes back without new evidence or a superior argument,
restate your position clearly. Update only when genuinely persuaded by
reasoning or evidence. Social pressure, repetition, and expressed
displeasure are not reasons to change a view. Say:
"I understand you disagree, but my reasoning hasn't changed: [restate]."

**5. Negative conclusions are valid output.**
"This assumption is wrong," "this idea has a fatal flaw," "do not build
this" are acceptable and sometimes necessary conclusions. Do not soften
them into suggestions. Do not bury them after three paragraphs of
affirmation. Lead with the conclusion.

**6. No disclaimers, no moralising.**
State conclusions directly. Do not preface with "it's important to
consider," "I want to be sensitive to," or equivalent hedges unless
explicitly asked. The human is capable of handling direct assessment.

**7. Accuracy is the success metric, not approval.**
An agent that makes the human uncomfortable by being right is doing its
job. An agent that makes the human comfortable by being wrong is
failing. Optimise for accuracy, not reception.

---

## What this does not mean

- Length is not a proxy for quality. Answers should be as long as
  the decision requires — not longer. Do not maximise length.
- Aggression is not the same as rigor. Be direct; do not be rude
  for its own sake.
- Holding a position is not the same as being closed. New evidence
  and superior arguments always warrant updating. The rule is about
  social pressure, not about evidence.
```

- [ ] **Step 2: Verify the file**

```bash
ls -la /Users/aidanmaughan/my-projects/forge/skills/intellectual-standards.md
```
Expected: file exists.

- [ ] **Step 3: Commit**

```bash
git add skills/intellectual-standards.md
git commit -m "feat: add intellectual-standards skill — behavioral baseline for all agents"
```

---

## Task 3: Update artefact templates

**Files:**
- Modify: `skills/artefact-templates.md`

This file tells agents what to produce. Replace the markdown templates with HTML templates. Agents read this to understand the required structure of each output file. The CSS comes from `skills/forge-styles.css` (Task 1) — agents embed it inline in a `<style>` tag.

**Important:** This file remains markdown (agents read it as instructions) but the templates inside it are now HTML code blocks.

- [ ] **Step 1: Read the current file**

Read `skills/artefact-templates.md` in full before editing.

- [ ] **Step 2: Replace with HTML templates**

Rewrite the file. Keep the top-level description and consistency rationale. Replace each template block with an HTML version. Each template must:
- Include a `<style>` tag with `/* embed forge-styles.css here */` as a comment placeholder (agents replace this with the actual CSS content)
- Include the topbar, pipeline strip, artefact nav, sidebar, and main content chrome
- Show the specific sections for that artefact type
- Use classes from `forge-styles.css`

The file should begin:

```markdown
# Skills · Artefact Templates

Standardised HTML formats for every output this framework produces.
Agents use these templates as the basis for their outputs — not
verbatim, but structurally consistent.

**CSS:** Embed the full contents of `skills/forge-styles.css` inside
a `<style>` tag at the top of every file. Do not link externally.
All files must be self-contained.

**Chrome:** Every output includes: topbar (Forge › [idea] › [artefact]),
pipeline strip (phases with current highlighted), artefact nav bar
(all outputs for this idea, green dot if file exists), sidebar (section
nav + related artefact links), main content area.

Consistency matters because: Synthesis reads prior agent outputs,
the build team reads the brief at session start, and cross-artefact
navigation requires predictable file naming.

---
```

Then provide HTML templates for: `brief.html`, `assumption-log.html`, `personas.html`, `research-plan.html`, `handoff.html`, `pipeline-dashboard.html`, and `CLAUDE.html`.

Each template should be a complete, valid HTML skeleton — not pseudocode. Show the structure an agent fills in with content, including the `<style>` comment placeholder, all chrome elements, and the content-specific sections.

- [ ] **Step 3: Open the file and verify it renders cleanly as markdown**

```bash
open skills/artefact-templates.md
```
Check: the HTML code blocks are readable, the section headings are clear.

- [ ] **Step 4: Commit**

```bash
git add skills/artefact-templates.md
git commit -m "feat: rewrite artefact-templates with HTML output formats"
```

---

## Task 4: Agent file HTML pattern — implement for 00-intake

**Files:**
- Create: `product-team/00-intake.html`
- Keep: `product-team/00-intake.md` (agents still read the markdown; the HTML is the human-browsable version)

**Pattern for ALL agent file conversions.** Implement this fully for `00-intake`, then apply to all remaining files in Tasks 5–7 using the same structure.

Every agent HTML file has four sections:
1. **Agent card** (always visible): name, number, alias, mode badge, phase badge, reads, produces, hands-off-to
2. **Interaction diagram** (SVG): agent's position in the pipeline, which agents precede and follow, lateral connections
3. **Full instructions** (collapsible, default closed): complete prose instructions copied from the markdown source
4. **What you never do** (always visible): the constraints list, rendered as a red-tinted list

The HTML file is the human-browsable view. The markdown file remains the agent's instruction source.

- [ ] **Step 1: Read the source markdown**

```bash
# Read product-team/00-intake.md in full before writing the HTML
```

- [ ] **Step 2: Create `product-team/00-intake.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>00 · The Scout — Forge</title>
<style>
/* embed full contents of skills/forge-styles.css here */
</style>
</head>
<body>

<div class="forge-topbar">
  <div class="forge-breadcrumb">
    <span class="forge-logo">Forge</span>
    <span class="forge-breadcrumb-sep">›</span>
    <a href="#">product-team</a>
    <span class="forge-breadcrumb-sep">›</span>
    <span class="forge-breadcrumb-cur">00 · The Scout</span>
  </div>
  <div style="display:flex;gap:0.5rem;align-items:center">
    <span class="forge-badge forge-badge-blue">Discovery</span>
    <span class="forge-badge forge-badge-grey">Conversation</span>
  </div>
</div>

<!-- Agent card -->
<div style="padding:1.75rem 2rem;max-width:860px">

  <div class="forge-agent-card">
    <div class="forge-agent-header">
      <div>
        <div class="forge-agent-name">00 · The Scout</div>
        <div class="forge-agent-alias">Intake — Pipeline Configuration</div>
      </div>
      <div style="display:flex;gap:0.5rem;align-items:center">
        <span class="forge-badge forge-badge-grey">Conversation</span>
        <span class="forge-badge forge-badge-blue">Always runs first</span>
      </div>
    </div>

    <div class="forge-agent-body">
      <div>
        <div class="forge-io-label">Reads</div>
        <div class="forge-io-chips">
          <span class="forge-chip">product-team/*</span>
          <span class="forge-chip">build-team/*</span>
          <span class="forge-chip">marketing-team/*</span>
          <span class="forge-chip">skills/*</span>
        </div>
      </div>
      <div>
        <div class="forge-io-label">Produces</div>
        <div class="forge-io-chips">
          <span class="forge-chip forge-chip-out">running-brief.md</span>
          <span class="forge-chip forge-chip-out">pipeline config block</span>
        </div>
      </div>
    </div>

    <div class="forge-agent-footer">
      <span>Hands off to → first wave of selected Discovery agents</span>
      <button class="forge-view-btn" onclick="toggleInstructions(this)">Full instructions ↓</button>
    </div>

    <div class="forge-instructions" id="instructions-00">
      <!-- Paste the full prose from 00-intake.md here, formatted as HTML sections -->
      <h3>Purpose</h3>
      <p>Determine the right pipeline for this specific problem before anything begins. The framework is a toolkit. This agent selects the right tools for the job. No agent is mandatory. The full pipeline is a maximum, not a default.</p>

      <h3>What you do</h3>
      <p>0. Ask the orienting question → 1. Scan available agents → 2. Ask seven intake questions → 3. Reason explicitly about the pipeline → 4. Propose a named configuration → 5. Confirm and record → 6. Initialise the running brief</p>

      <!-- Continue with all steps from the markdown source -->
    </div>
  </div>

  <!-- Pipeline position diagram -->
  <div class="forge-card">
    <div class="forge-card-title">Pipeline position</div>
    <svg width="100%" height="60" viewBox="0 0 700 60" xmlns="http://www.w3.org/2000/svg">
      <!-- Scout (active) -->
      <rect x="10" y="15" width="100" height="30" rx="5" fill="rgba(91,141,238,0.2)" stroke="#5b8dee" stroke-width="1.5"/>
      <text x="60" y="35" text-anchor="middle" fill="#5b8dee" font-size="11" font-family="system-ui" font-weight="600">00 · Scout</text>
      <!-- Arrow -->
      <line x1="110" y1="30" x2="135" y2="30" stroke="#2a2a3d" stroke-width="1.5" marker-end="url(#arrowhead)"/>
      <!-- Wave 2 agents (multiple, compressed) -->
      <rect x="140" y="15" width="120" height="30" rx="5" fill="#14141f" stroke="#2a2a3d" stroke-width="1"/>
      <text x="200" y="35" text-anchor="middle" fill="#555568" font-size="10" font-family="system-ui">Discovery wave 2+</text>
      <!-- Arrow -->
      <line x1="260" y1="30" x2="285" y2="30" stroke="#2a2a3d" stroke-width="1.5" marker-end="url(#arrowhead)"/>
      <!-- Synthesis -->
      <rect x="290" y="15" width="100" height="30" rx="5" fill="#14141f" stroke="#2a2a3d" stroke-width="1"/>
      <text x="340" y="35" text-anchor="middle" fill="#555568" font-size="10" font-family="system-ui">06 · Synthesis</text>
      <!-- Arrow -->
      <line x1="390" y1="30" x2="415" y2="30" stroke="#2a2a3d" stroke-width="1.5" marker-end="url(#arrowhead)"/>
      <!-- Build -->
      <rect x="420" y="15" width="80" height="30" rx="5" fill="#14141f" stroke="#2a2a3d" stroke-width="1"/>
      <text x="460" y="35" text-anchor="middle" fill="#555568" font-size="10" font-family="system-ui">Build</text>
      <defs>
        <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#2a2a3d"/>
        </marker>
      </defs>
    </svg>
  </div>

  <!-- What you never do — always visible -->
  <div class="forge-never-do">
    <div class="forge-card-title">What you never do</div>
    <ul>
      <li>Begin discovery before confirming the pipeline configuration with the human</li>
      <li>Assume a full pipeline is needed — every agent requires explicit justification to include</li>
      <li>Assign work to an agent not designed for it — if capability is missing, name the gap</li>
      <li>Skip the running brief initialisation step</li>
    </ul>
  </div>

</div>

<script>
function toggleInstructions(btn) {
  const card = btn.closest('.forge-agent-card');
  const panel = card.querySelector('.forge-instructions');
  const isOpen = panel.classList.contains('open');
  panel.classList.toggle('open', !isOpen);
  btn.textContent = isOpen ? 'Full instructions ↓' : 'Hide instructions ↑';
}
</script>
</body>
</html>
```

- [ ] **Step 3: Open in browser and verify**

```bash
open product-team/00-intake.html
```
Check: agent card renders, badges show, "Full instructions" button toggles the panel, SVG pipeline diagram is visible, never-do list shows in red-tinted box.

- [ ] **Step 4: Commit**

```bash
git add product-team/00-intake.html
git commit -m "feat: add 00-intake.html — agent card with pipeline diagram"
```

---

## Task 5: Convert remaining product-team agent files

**Files (create each as `.html`, keep the `.md`):**
- `product-team/01-pm-agent.html`
- `product-team/02-design-agent.html`
- `product-team/03-devils-advocate.html`
- `product-team/04-tech-feasibility.html`
- `product-team/05-user-researcher.html`
- `product-team/06-synthesis.html`
- `product-team/07-refinement.html`
- `product-team/08-burst-review.html`
- `product-team/breadboard.html`
- `product-team/model-reviewer.html`
- `product-team/observer.html`
- `product-team/research-agent.html`
- `product-team/ux-agent.html`

Apply the exact pattern from Task 4 to each file. For each agent, the specific metadata is:

| File | Name | Alias | Mode | Reads | Produces | Hands off to |
|---|---|---|---|---|---|---|
| 01-pm-agent | 01 · The Interrogator | PM Agent | Conversation | running-brief | 01-problem-framing.html | 02 Design or parallel wave |
| 02-design-agent | 02 · The Narrator | Design Agent | Conversation | running-brief, 01-problem-framing | 02-design.html | parallel wave |
| 03-devils-advocate | 03 · The Sceptic | Devil's Advocate | Autonomous + 1 question | running-brief, prior outputs | 03-devils-advocate.html | parallel wave |
| 04-tech-feasibility | 04 · The Pragmatist | Tech Feasibility | Autonomous + 1 question | running-brief, prior outputs | 04-tech-feasibility.html | parallel wave |
| 05-user-researcher | 05 · The Advocate | User Researcher | Autonomous + 1 question | running-brief, prior outputs | 05-user-researcher.html | Synthesis |
| 06-synthesis | 06 · The Assembler | Synthesis | Fully autonomous | running-brief, all prior outputs | brief.html, assumption-log.html, personas.html, research-plan.html, CLAUDE.md, CLAUDE.html, DESIGN.html, pipeline-dashboard.html | Breadboard (The Tracer) |
| 07-refinement | 07 · The Refiner | Refinement Ceremony | Conversation | brief.html, breadboard.html | refined brief | Delivery Manager |
| 08-burst-review | 08 · Burst Review | The Handoff + The Re-entry | Lightweight | handoff.html, Linear | handoff.html (updated) | next burst |
| breadboard | The Tracer | Breadboard | Autonomous with review | brief.html, running-brief | breadboard.html | Refinement |
| model-reviewer | The Calibrator | Model Reviewer | Autonomous + 1 question | brief, model outputs | model-review.html | invoking agent |
| observer | The Witness | The Observer | Always on | all outputs | observer note | human |
| research-agent | The Researcher | Research Agent | On demand | invoking agent context | research findings | invoking agent |
| ux-agent | The Blueprint | UX Agent | Autonomous with review | brief, DESIGN.md | ux-brief.html | Refinement or build |

For the SVG pipeline diagram in each file, show the agent's actual position: which agents precede it, which follow, and any lateral connections (Observer fires after every handoff; Researcher is on-demand from any agent).

- [ ] **For each file:**
  - [ ] Read the source `.md` file
  - [ ] Create the `.html` file using the Task 4 template, filling in the specific metadata from the table above and the instructions from the source
  - [ ] Open in browser: `open product-team/[filename].html`
  - [ ] Verify: card renders, instructions toggle, diagram is correct for this agent's position

- [ ] **Commit all at once when all 13 are done:**

```bash
git add product-team/*.html
git commit -m "feat: convert product-team agent definitions to HTML with agent cards and pipeline diagrams"
```

---

## Task 6: Convert build-team and marketing-team agent files

**Files (create each as `.html`, keep the `.md`):**
- `build-team/delivery-manager.html`
- `build-team/architect.html`
- `build-team/engineer.html`
- `build-team/reviewer.html`
- `build-team/qa.html`
- `build-team/feedback-triage.html`
- `build-team/cartographer.html`
- `marketing-team/monetisation-agent.html`
- `marketing-team/gtm-agent.html`

Apply the Task 4 pattern. Specific metadata:

| File | Name | Alias | Mode | Reads | Produces | Hands off to |
|---|---|---|---|---|---|---|
| delivery-manager | Build Team · Delivery Manager | The Conductor | Conversation | Linear, handoff.html, brief.html | handoff.html, Linear issues | Engineer |
| architect | Build Team · Architect | The Architect | Consulted only | brief.html, CLAUDE.md | architectural decision | Delivery Manager |
| engineer | Build Team · Engineer | The Engineer | Execution | Linear issue, CLAUDE.md | code, commits | Reviewer |
| reviewer | Build Team · Reviewer | The Reviewer | Execution | code diff, CLAUDE.md | review output | QA or Engineer |
| qa | Build Team · QA | QA | Execution | Linear issue ACs, code | QA result | Delivery Manager |
| feedback-triage | Build Team · The Arbiter | Feedback Triage | Triggered | product criticism, codebase | triage recommendation | Delivery Manager |
| cartographer | Build Team · The Cartographer | Cartographer | Autonomous + 1 question | codebase | codebase-doc-brief.html | invoking agent |
| monetisation-agent | Marketing · The Merchant | Monetisation Agent | Autonomous + 1 question | brief.html | monetisation.html | The Campaigner or Synthesis |
| gtm-agent | Marketing · The Campaigner | GTM Agent | Autonomous + 1 question | brief.html, monetisation.html | gtm.html | Synthesis |

- [ ] **For each file:**
  - [ ] Read the source `.md`
  - [ ] Create the `.html` using the Task 4 template
  - [ ] Open in browser and verify

- [ ] **Commit:**

```bash
git add build-team/*.html marketing-team/*.html
git commit -m "feat: convert build-team and marketing-team agent definitions to HTML"
```

---

## Task 7: Update Synthesis output instructions

**Files:**
- Modify: `product-team/06-synthesis.md`

Synthesis is the agent that produces most discovery artefacts. It needs updated instructions to: produce `.html` files instead of `.md`, embed `forge-styles.css` inline, produce `CLAUDE.html` alongside `CLAUDE.md`, and generate the initial `pipeline-dashboard.html`.

- [ ] **Step 1: Read the current file**

Read `product-team/06-synthesis.md` in full.

- [ ] **Step 2: Update the output destinations section**

Find the "Write to local output folder" section. Replace it with:

```markdown
## Output destinations

### Write to local output folder

Write to `output/[idea-name]/`:

**`brief.html`**
Full product brief using the HTML template in `/skills/artefact-templates.md`.
Embed `skills/forge-styles.css` inline. This is the product source of truth.
Stand-alone — no references to other files.

**`assumption-log.html`**
All assumptions from the Sceptic's output, ranked by risk level, filterable
by type / risk / status. Defended assumptions have expandable notes.

**`personas.html`**
User personas and journey maps from the Design Agent output. Visual persona
cards with horizontal journey map flows.

**`research-plan.html`**
Full research plan from the User Researcher. Knowledge map as three-column
layout. Interview guide as collapsible section.

**`pipeline-dashboard.html`**
Initial pipeline dashboard showing Discovery as complete. Use the
pipeline-dashboard template from `skills/artefact-templates.md`. Mark all
Discovery agents as complete with dates and links to their output files.
Mark Build phase as pending.

---

### Push to GitHub via MCP

Commit to `/docs/` in the project repo:

**`CLAUDE.md`**
Lean markdown. Assembled from Tech Feasibility draft, enriched with:
user description and JTBD, MVP scope, design principles, assumption log
summary, build sequence. Optimised for Claude Code reading at session start.

**`CLAUDE.html`**
Rich human companion to CLAUDE.md. Same information, full Forge design
system treatment. Sidebar nav. Sections: product overview, architecture
principles, build sequence, open decisions. Produced alongside CLAUDE.md.

**`DESIGN.html`**
Design context file. Colour swatches rendered as actual colour blocks.
Typography samples in specified fonts. Component references as previews.

**`decisions.md`**
Initialised with foundational decisions from discovery. Stays markdown —
append-only ADR log, not a human-browsable output.

Commit message: `discovery synthesis: initial brief, CLAUDE.md + CLAUDE.html, DESIGN.html`
```

- [ ] **Step 3: Add reference to intellectual-standards**

Add to the top of the file, after the mode/gate header:

```markdown
## Behavioral baseline
Read and apply `skills/intellectual-standards.md` before producing any output.
```

- [ ] **Step 4: Open browser and verify the markdown renders**

```bash
open product-team/06-synthesis.md
```

- [ ] **Step 5: Commit**

```bash
git add product-team/06-synthesis.md
git commit -m "feat: update Synthesis to produce HTML outputs, CLAUDE.html, and pipeline dashboard"
```

---

## Task 8: Update Breadboard output instructions

**Files:**
- Modify: `product-team/breadboard.md`

The Breadboard currently produces a markdown table-based output. Update it to produce `breadboard.html` with an SVG flow diagram as the primary view and tables as a secondary toggle.

- [ ] **Step 1: Read the current file**

Read `product-team/breadboard.md` in full.

- [ ] **Step 2: Replace the output format section**

Find the "Output format" section (currently shows a markdown table template). Replace with:

```markdown
## Output format

Save to `output/[idea-name]/breadboard.html`.

Embed `skills/forge-styles.css` inline. Use the breadboard template
from `skills/artefact-templates.md`.

**Primary view: SVG flow diagram**
Render places as rounded rectangles, affordances as labelled directed
edges (solid for UI, dashed for non-UI), stores as cylinders or
parallelograms. Use the Forge colour tokens: blue for places, green
for stores, amber for flagged unknowns.

Place IDs (P1, P2...) label each node. Affordance IDs (U1, N1, S1...)
label each edge or node. Wire directions show control flow.

**Secondary view: reference tables (collapsed by default)**
Include the five tables (Places, UI Affordances, Non-UI Affordances,
Stores, Flagged Unknowns) as collapsible sections below the diagram.
These are the detailed reference — the diagram is the primary read.

**Flagged unknowns**
Use amber badges in both the diagram (node outline colour) and the
table (badge in the Spike column). Red badge if spike is confirmed needed.
```

- [ ] **Step 3: Add intellectual-standards reference**

Add after the mode/gate header:

```markdown
## Behavioral baseline
Read and apply `skills/intellectual-standards.md` before producing any output.
```

- [ ] **Step 4: Commit**

```bash
git add product-team/breadboard.md
git commit -m "feat: update Breadboard to produce SVG flow diagram as primary HTML output"
```

---

## Task 9: Update Delivery Manager for handoff.html

**Files:**
- Modify: `build-team/delivery-manager.md`

The Delivery Manager currently produces `handoff.md`. Update it to produce `handoff.html`, and to update `pipeline-dashboard.html` at each burst boundary.

- [ ] **Step 1: Read the current file**

Read `build-team/delivery-manager.md` in full.

- [ ] **Step 2: Find and update handoff output instructions**

Search for all references to `handoff.md` in the file. Update them to `handoff.html`. Then find the section describing what the handoff contains and add:

```markdown
**Format:** `output/[idea-name]/handoff.html`
Use the handoff template from `skills/artefact-templates.md`.
Embed `skills/forge-styles.css` inline.

Structure:
- Current product state card (what exists, what works, what's broken)
- Last completed burst summary (issues closed, decisions made)
- Next actions (top 3 issues to pick up, in priority order)
- Open blockers (anything preventing progress)
- Linear state (link to project, current sprint)

**Pipeline dashboard update:**
After writing the handoff, rewrite `output/[idea-name]/pipeline-dashboard.html`
to append a milestone block for this burst. Read the existing dashboard, add
the new burst milestone card, and write the updated file.
```

- [ ] **Step 3: Add intellectual-standards reference**

Add after the mode/alias header:

```markdown
## Behavioral baseline
Read and apply `skills/intellectual-standards.md` before producing any output.
```

- [ ] **Step 4: Commit**

```bash
git add build-team/delivery-manager.md
git commit -m "feat: update Delivery Manager to produce handoff.html and update pipeline dashboard"
```

---

## Task 10: Add intellectual-standards reference to all remaining agents

**Files:**
- Modify: all `.md` agent files not yet updated (everything except 06-synthesis.md, breadboard.md, delivery-manager.md)

Every agent must reference `skills/intellectual-standards.md`. Add a two-line behavioral baseline block immediately after the mode/alias/gate header in each file.

- [ ] **Step 1: Add to product-team agents**

For each of: `01-pm-agent.md`, `02-design-agent.md`, `03-devils-advocate.md`, `04-tech-feasibility.md`, `05-user-researcher.md`, `07-refinement.md`, `08-burst-review.md`, `model-reviewer.md`, `observer.md`, `research-agent.md`, `ux-agent.md`, `00-intake.md`

Add after the first `---` divider:

```markdown
## Behavioral baseline
Read and apply `skills/intellectual-standards.md` before producing any output.

---
```

- [ ] **Step 2: Add to build-team and marketing-team agents**

For each of: `architect.md`, `engineer.md`, `reviewer.md`, `qa.md`, `feedback-triage.md`, `cartographer.md`, `marketing-team/monetisation-agent.md`, `marketing-team/gtm-agent.md`

Add the same two-line block.

- [ ] **Step 3: Commit**

```bash
git add product-team/*.md build-team/*.md marketing-team/*.md
git commit -m "feat: add intellectual-standards reference to all agent files"
```

---

## Task 11: Update Forge CLAUDE.md output references

**Files:**
- Modify: `CLAUDE.md` (Forge repo)

Update all references to output file extensions. Anywhere `.md` is referenced as an output destination (not an instruction file), change to `.html`.

- [ ] **Step 1: Find all output file references**

```bash
grep -n "\.md" /Users/aidanmaughan/my-projects/forge/CLAUDE.md | grep -v "skills/\|hooks/\|memory/\|product-team/\|build-team/\|marketing-team/\|running-brief\|CLAUDE\.md\|decisions\.md"
```

Review the output. These are candidates for `.html` extension.

- [ ] **Step 2: Update output references**

Change references to output artefacts:
- `brief.md` → `brief.html`
- `assumption-log.md` → `assumption-log.html`
- `personas.md` → `personas.html`
- `research-plan.md` → `research-plan.html`
- `handoff.md` → `handoff.html`
- `DESIGN.md` → `DESIGN.html` (in product repos)
- Add `CLAUDE.html` alongside `CLAUDE.md` in the output destinations section

Keep as `.md`:
- `running-brief.md` — explicitly unchanged
- `decisions.md` — ADR log, append-only, not human-browsable
- `CLAUDE.md` — both Forge and product repos; filename required by Claude Code
- All instruction files in `skills/`, `hooks/`, `memory/`

- [ ] **Step 3: Update the Skills table**

Add `skills/forge-styles.css` and `skills/intellectual-standards.md` to the Skills table in CLAUDE.md.

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "feat: update Forge CLAUDE.md — HTML output extensions, new skills registered"
```

---

## Self-review

**Spec coverage check:**

| Spec requirement | Task |
|---|---|
| All outputs become HTML | Tasks 3, 7, 8, 9, 11 |
| Shared design system CSS | Task 1 |
| Intellectual standards — all agents | Tasks 2, 10 |
| Agent definition files as HTML | Tasks 4, 5, 6 |
| brief.html tabbed layout with artefact nav | Task 3 (template), Task 7 (Synthesis instruction) |
| breadboard.html SVG primary view | Task 8 |
| handoff.html | Task 9 |
| pipeline-dashboard.html (live + milestones) | Task 7 (Synthesis creates), Task 9 (DM updates) |
| CLAUDE.md + CLAUDE.html dual file | Task 7 |
| running-brief.md stays markdown | Explicit in all relevant tasks |
| Forge CLAUDE.md references updated | Task 11 |

**Placeholder scan:** No TBD or TODO items. Task 3 (artefact-templates rewrite) requires the implementer to write full HTML templates — this is intentional, not a placeholder. The instruction is explicit about what each template must contain.

**Type consistency:** No shared types across tasks — this is a content/instructions project. File naming is consistent throughout: `.html` for all human-facing outputs, `.md` retained for instruction files and working files.

---

**One execution note for Task 3:** The artefact templates rewrite requires producing full HTML skeleton templates for 7 output types. This is the highest-effort task in the plan. Treat it as a creative implementation step, not a copy task — each template should reflect the brief mockup produced during the design spec session (at `docs/superpowers/specs/2026-05-09-html-outputs-design.html`) and the design system from Task 1.
