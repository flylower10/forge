# Skills · Artefact Templates

Standardised HTML output templates for every artefact this framework produces.
Agents must use these skeletons as the basis for their HTML outputs — filling
placeholder comments with real content while preserving the structure exactly.

## Why consistent templates matter

- The build team reads briefs, handoffs, and dashboards at the start of every
  session. Predictable structure means faster orientation.
- The Delivery Manager reads handoff.html and pipeline-dashboard.html to resume
  state after a gap. Missing sections break re-entry.
- Linear issues and acceptance criteria follow a predictable shape the Delivery
  Manager depends on — artefact consistency enforces that discipline upstream.
- Agents that produce artefacts are read by downstream agents. Structural
  consistency means no agent has to guess where to find information.

## CSS embedding rule

**Embed the full contents of `skills/forge-styles.css` inside a `<style>` tag
in every HTML output. Do not link externally. Read the file and paste its
contents verbatim.** Every artefact must be a self-contained file that works
offline and survives being moved to any directory.

---

## Markdown source templates

Agents write the `.md` source first — clean, human-editable content. Then generate the `.html` presentation from it. The markdown is the canonical source of truth. The HTML is the browsable view.

### `brief.md`

```markdown
# [Product Name] — Brief

**Status:** [Draft / Approved]  **Phase:** [Discovery / Build]

## Problem
[One paragraph — who has the problem, what it costs them, why now]

## Users
[Personas — name, role, primary job-to-be-done]

## Solution
[What we're building and why it's the right solution]

## Scope (MVP)
[Bulleted feature list — what's in, what's explicitly out]

## Pricing
[Model and rationale]

## Risks
[Top 3 risks with mitigation notes]

## How we'll know it's working
[Observation sources — where signal will come from once this ships.
Be honest about what's real today vs what would need to be wired up.

Examples:
- Direct human observation (default — what you watch yourself)
- Analytics tool (name + what you'll measure)
- Error tracking (name)
- User feedback channel (support inbox, app store reviews, in-product)
- Direct user conversations (cadence)

This is what the signal log will be drawn from. If the only source
is "I'll watch and see", say so explicitly — that is a real choice,
not a placeholder.]

## Open questions
[Any unresolved questions requiring human sign-off]
```

### `assumption-log.md`

```markdown
# [Product Name] — Assumption Log

| # | Assumption | Risk | Status | Owner | Notes |
|---|---|---|---|---|---|
| 1 | [assumption text] | High / Medium / Low | Open / Defended / Accepted | [agent or human] | [rationale] |
```

### `personas.md`

```markdown
# [Product Name] — Personas

## [Persona Name]
**Role:** [job title or context]
**Quote:** "[verbatim quote capturing their worldview]"

### Jobs to be done
- [primary JTBD]
- [secondary JTBD]

### Journey
| Stage | Action | Pain | Gain |
|---|---|---|---|
| Discovery | | | |
| Evaluation | | | |
| Adoption | | | |
| Retention | | | |

### Pain points
- [pain 1]

### What they value
- [gain 1]
```

### `research-plan.md`

```markdown
# [Product Name] — Research Plan

## Knowledge map

| Know | Assume | Must learn |
|---|---|---|
| [fact] | [assumption] | [question] |

## Validation priorities

| # | Question | Method | Owner | Status |
|---|---|---|---|---|
| 1 | [research question] | Interview / Survey / Test | | Open |

## Interview guide

### Screener
[Who we're looking for]

### Questions
1. [question]
```

### `ost-decisions.md`

```markdown
# [Product Name] — OST Decisions

Append-only log of strategic decisions that shaped or reshaped the
opportunity tree. The OST itself shows the current shape; this log
shows how it got there.

Owned by Synthesis at initialisation; appended to by PM Agent or
Synthesis whenever the opportunity tree changes — opportunity added,
killed, paused, deprioritised, or user description shifted.

Never edited. If a decision is reversed, append a new entry that
references the prior one.

---

### YYYY-MM-DD · [What changed in one line]

**Trigger:** [signal log entry / human input / re-framing in this session / new evidence]
**Decision:** [what is now true that wasn't before]
**Why:** [evidence or reasoning — link to the signal log entry, assumption, or conversation]
**Affects:** [which opportunity nodes, which assumptions, which scope items]
**Revisit when:** [condition, or "—" if permanent]
```

### `handoff.md`

```markdown
# Handoff — Burst [N] — [Date]

## Product state
**Phase:** [current phase]  **Sprint:** [N]  **Status:** [On track / At risk / Blocked]

### Key metrics
- [metric]: [value]

## Last burst — what shipped
- [issue/task]: [brief description]

## Next 3 actions (priority order)
1. [action] — [owner]
2. [action] — [owner]
3. [action] — [owner]

## Open blockers
| Blocker | Owner | Since |
|---|---|---|
| [description] | | [date] |

## Key decisions made
- [decision]: [rationale]

## Linear
[project URL]
```

### `breadboard.md`

```markdown
# [Product Name] — Breadboard

## Places
| ID | Name | Description |
|---|---|---|
| P1 | [name] | [what the user can do here] |

## UI Affordances
| ID | Place | Affordance | Wires Out | Returns To |
|---|---|---|---|---|
| U1 | P1 | [button/input/display] | [what it triggers] | [where result goes] |

## Non-UI Affordances
| ID | Place | Affordance | Wires Out | Returns To |
|---|---|---|---|---|
| N1 | P1 | [system behaviour] | [what it triggers] | [where result goes] |

## Stores
| ID | Place | Store | Description |
|---|---|---|---|
| S1 | P1 | [store name] | [what it holds] |

## Flagged unknowns
| Mechanism | What is unknown | Spike needed? |
|---|---|---|
| [mechanism] | [question] | Yes / No |
```

---

## Template 1 — `brief.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><!-- [agent fills: product name] --> — Brief</title>
  <style>
    /* PASTE CONTENTS OF skills/forge-styles.css HERE */
  </style>
  <script>
    function showTab(id) {
      document.querySelectorAll('.forge-tab-panel').forEach(p => p.classList.remove('is-active'));
      document.querySelectorAll('.forge-tabs__tab').forEach(t => t.classList.remove('is-active'));
      document.getElementById('panel-' + id).classList.add('is-active');
      document.getElementById('tab-' + id).classList.add('is-active');
    }
  </script>
</head>
<body>

  <!-- TOPBAR -->
  <header class="forge-topbar">
    <nav class="forge-topbar__breadcrumb">
      <a href="pipeline-dashboard.html">Forge</a>
      <span class="forge-topbar__sep">/</span>
      <a href="pipeline-dashboard.html"><!-- [agent fills: idea slug] --></a>
      <span class="forge-topbar__sep">/</span>
      <span class="forge-topbar__current">Brief</span>
    </nav>
    <span class="forge-topbar__logo">Forge</span>
    <div class="forge-topbar__right">
      <!-- [agent fills: status badge, e.g. Draft / Refined / Build-ready] -->
      <span class="forge-badge forge-badge--amber"><!-- [agent fills: status] --></span>
      <span><!-- [agent fills: date] --></span>
    </div>
  </header>

  <!-- PIPELINE STRIP -->
  <nav class="forge-pipeline-strip">
    <a class="forge-pipeline-strip__item is-done" href="#">
      <span class="forge-pipeline-strip__dot"></span>Intake
    </a>
    <span class="forge-pipeline-strip__sep">›</span>
    <a class="forge-pipeline-strip__item is-done" href="#">
      <span class="forge-pipeline-strip__dot"></span>Discovery
    </a>
    <span class="forge-pipeline-strip__sep">›</span>
    <a class="forge-pipeline-strip__item is-current" href="#">
      <span class="forge-pipeline-strip__dot"></span>Refinement
    </a>
    <span class="forge-pipeline-strip__sep">›</span>
    <a class="forge-pipeline-strip__item" href="#">
      <span class="forge-pipeline-strip__dot"></span>Development
    </a>
    <span class="forge-pipeline-strip__sep">›</span>
    <a class="forge-pipeline-strip__item" href="#">
      <span class="forge-pipeline-strip__dot"></span>Delivery
    </a>
  </nav>

  <!-- ARTEFACT NAV -->
  <nav class="forge-artefact-nav">
    <a class="forge-artefact-nav__item is-active file-exists" href="brief.html">
      <span class="forge-artefact-nav__dot"></span>Brief
    </a>
    <a class="forge-artefact-nav__item" href="assumption-log.html">
      <span class="forge-artefact-nav__dot"></span>Assumptions
    </a>
    <a class="forge-artefact-nav__item" href="personas.html">
      <span class="forge-artefact-nav__dot"></span>Personas
    </a>
    <a class="forge-artefact-nav__item" href="research-plan.html">
      <span class="forge-artefact-nav__dot"></span>Research Plan
    </a>
    <a class="forge-artefact-nav__item" href="handoff.html">
      <span class="forge-artefact-nav__dot"></span>Handoff
    </a>
    <a class="forge-artefact-nav__item" href="pipeline-dashboard.html">
      <span class="forge-artefact-nav__dot"></span>Dashboard
    </a>
  </nav>

  <!-- LAYOUT -->
  <div class="forge-layout">

    <!-- SIDEBAR -->
    <aside class="forge-sidebar">
      <p class="forge-sidebar__label">Sections</p>
      <a class="forge-sidebar__link is-active" href="#" onclick="showTab('summary'); return false;">Summary</a>
      <a class="forge-sidebar__link" href="#" onclick="showTab('problem'); return false;">Problem &amp; Users</a>
      <a class="forge-sidebar__link" href="#" onclick="showTab('solution'); return false;">Solution</a>
      <a class="forge-sidebar__link" href="#" onclick="showTab('pricing'); return false;">Pricing</a>
      <a class="forge-sidebar__link" href="#" onclick="showTab('scope'); return false;">Scope</a>
      <a class="forge-sidebar__link" href="#" onclick="showTab('risks'); return false;">Risks</a>

      <p class="forge-sidebar__label">Linked artefacts</p>
      <a class="forge-artefact-ref" href="assumption-log.html">
        <span class="forge-artefact-ref__dot"></span>assumption-log.html
      </a>
      <br><br>
      <a class="forge-artefact-ref" href="personas.html">
        <span class="forge-artefact-ref__dot"></span>personas.html
      </a>
      <br><br>
      <a class="forge-artefact-ref" href="research-plan.html">
        <span class="forge-artefact-ref__dot"></span>research-plan.html
      </a>
    </aside>

    <!-- MAIN -->
    <main class="forge-main">
      <h1><!-- [agent fills: product name or working title] --></h1>
      <p style="color: var(--dim); font-size: 0.78rem; margin-bottom: 1.5rem;">
        Idea slug: <code class="forge-code"><!-- [agent fills: idea-slug] --></code>
        &nbsp;·&nbsp; Last updated: <!-- [agent fills: date] -->
      </p>

      <!-- TABS -->
      <div class="forge-tabs">
        <button class="forge-tabs__tab is-active" id="tab-summary" onclick="showTab('summary')">Summary</button>
        <button class="forge-tabs__tab" id="tab-problem" onclick="showTab('problem')">Problem &amp; Users</button>
        <button class="forge-tabs__tab" id="tab-solution" onclick="showTab('solution')">Solution</button>
        <button class="forge-tabs__tab" id="tab-pricing" onclick="showTab('pricing')">Pricing</button>
        <button class="forge-tabs__tab" id="tab-scope" onclick="showTab('scope')">Scope</button>
        <button class="forge-tabs__tab" id="tab-risks" onclick="showTab('risks')">Risks</button>
      </div>

      <!-- TAB: SUMMARY -->
      <div class="forge-tab-panel is-active" id="panel-summary">
        <div class="forge-metrics">
          <div class="forge-metric forge-metric--blue">
            <div class="forge-metric__value"><!-- [agent fills: e.g. 2.4M] --></div>
            <div class="forge-metric__label">Target market</div>
          </div>
          <div class="forge-metric forge-metric--green">
            <div class="forge-metric__value"><!-- [agent fills: e.g. £8/mo] --></div>
            <div class="forge-metric__label">Price point</div>
          </div>
          <div class="forge-metric forge-metric--amber">
            <div class="forge-metric__value"><!-- [agent fills: e.g. 6 wks] --></div>
            <div class="forge-metric__label">Build horizon</div>
          </div>
          <div class="forge-metric">
            <div class="forge-metric__value"><!-- [agent fills: e.g. 3] --></div>
            <div class="forge-metric__label">Open risks</div>
          </div>
        </div>

        <div class="forge-card">
          <div class="forge-card__title">One-liner</div>
          <p><!-- [agent fills: one-sentence product description] --></p>
        </div>

        <div class="forge-card">
          <div class="forge-card__title">North star metric</div>
          <p><!-- [agent fills: north star metric and definition] --></p>
        </div>

        <div class="forge-card">
          <div class="forge-card__title">Research recommendation</div>
          <p><!-- [agent fills: Validate before building / Validate in parallel / Build and learn, + one sentence rationale] --></p>
        </div>
      </div>

      <!-- TAB: PROBLEM & USERS -->
      <div class="forge-tab-panel" id="panel-problem">
        <h2>The problem</h2>
        <p><!-- [agent fills: 2–3 sentences — who has it, what it is, why it matters now] --></p>

        <h2>The user</h2>
        <p><!-- [agent fills: specific human description — not a demographic. Who they are, their situation, what this problem costs them.] --></p>

        <h2>Job-to-be-done</h2>
        <div class="forge-card forge-card--blue">
          <div class="forge-card__title">Primary job</div>
          <p>When <!-- [situation] -->, I want to <!-- [motivation] -->, so I can <!-- [outcome] -->.</p>
        </div>

        <h3>Sub-jobs</h3>
        <ul>
          <li>When <!-- [situation] -->, I want to <!-- [motivation] -->, so I can <!-- [outcome] -->.</li>
          <li>When <!-- [situation] -->, I want to <!-- [motivation] -->, so I can <!-- [outcome] -->.</li>
        </ul>

        <h2>The opportunity</h2>
        <p><!-- [agent fills: what changes for the user if this works — functionally, emotionally, what they can now do or stop doing] --></p>
      </div>

      <!-- TAB: SOLUTION -->
      <div class="forge-tab-panel" id="panel-solution">
        <h2>Solution direction</h2>
        <p><!-- [agent fills: what the product does — intent, not implementation. 2–4 sentences.] --></p>

        <h2>Supporting metrics</h2>
        <ul>
          <li><!-- [metric] --> — <!-- [what it measures] --></li>
          <li><!-- [metric] --> — <!-- [what it measures] --></li>
        </ul>

        <h2>Open questions</h2>
        <p><!-- [agent fills: anything unresolved the build team should be aware of] --></p>
      </div>

      <!-- TAB: PRICING -->
      <div class="forge-tab-panel" id="panel-pricing">
        <h2>Pricing model</h2>
        <div class="forge-card">
          <div class="forge-card__title">Model</div>
          <p><!-- [agent fills: free/paid split, trial strategy, price points] --></p>
        </div>

        <h2>Free tier</h2>
        <p><!-- [agent fills: what is free and why] --></p>

        <h2>Paid tier</h2>
        <p><!-- [agent fills: what is paid, price, rationale] --></p>

        <h2>Pricing risks</h2>
        <ul>
          <li><!-- [agent fills: pricing assumption or risk] --></li>
          <li><!-- [agent fills: pricing assumption or risk] --></li>
        </ul>
      </div>

      <!-- TAB: SCOPE -->
      <div class="forge-tab-panel" id="panel-scope">
        <h2>In v1</h2>
        <ul>
          <li>As a <!-- [user] -->, I can <!-- [action] -->, so that <!-- [outcome] -->.</li>
          <li>As a <!-- [user] -->, I can <!-- [action] -->, so that <!-- [outcome] -->.</li>
          <li>As a <!-- [user] -->, I can <!-- [action] -->, so that <!-- [outcome] -->.</li>
        </ul>

        <h2>Out of v1 (and why)</h2>
        <ul>
          <li><!-- [feature] --> — <!-- [reason for deferral] --></li>
          <li><!-- [feature] --> — <!-- [reason for deferral] --></li>
        </ul>
      </div>

      <!-- TAB: RISKS -->
      <div class="forge-tab-panel" id="panel-risks">
        <h2>Key risks</h2>
        <p style="font-size: 0.78rem; color: var(--dim); margin-bottom: 1rem;">
          Top risks from the assumption log — with current status.
        </p>

        <div class="forge-card forge-card--red">
          <div class="forge-card__title">Risk 1</div>
          <p><!-- [agent fills: risk description] --></p>
          <span class="forge-badge forge-badge--red">Open</span>
        </div>

        <div class="forge-card forge-card--amber">
          <div class="forge-card__title">Risk 2</div>
          <p><!-- [agent fills: risk description] --></p>
          <span class="forge-badge forge-badge--amber">Defended</span>
        </div>

        <div class="forge-card">
          <div class="forge-card__title">Risk 3</div>
          <p><!-- [agent fills: risk description] --></p>
          <span class="forge-badge forge-badge--dim">Accepted</span>
        </div>
      </div>

    </main>
  </div><!-- /forge-layout -->

</body>
</html>
```

---

## Template 2 — `assumption-log.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><!-- [agent fills: product name] --> — Assumption Log</title>
  <style>
    /* PASTE CONTENTS OF skills/forge-styles.css HERE */
  </style>
  <script>
    function filterTable(status) {
      const rows = document.querySelectorAll('.forge-table tbody tr');
      rows.forEach(row => {
        if (status === 'all' || row.dataset.status === status) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
      document.querySelectorAll('.forge-filter-btn').forEach(btn => btn.classList.remove('is-active'));
      document.getElementById('filter-' + status).classList.add('is-active');
    }

    function toggleNotes(btn) {
      const cell = btn.closest('td');
      const full = cell.querySelector('.forge-notes-full');
      const short = cell.querySelector('.forge-notes-short');
      if (full.style.display === 'none') {
        full.style.display = 'block';
        short.style.display = 'none';
        btn.textContent = 'less';
      } else {
        full.style.display = 'none';
        short.style.display = 'inline';
        btn.textContent = 'more';
      }
    }
  </script>
  <style>
    .forge-filter-btn {
      background: var(--elevated);
      border: 1px solid var(--border);
      border-radius: 5px;
      color: var(--mid);
      cursor: pointer;
      font-size: 0.72rem;
      padding: 0.3rem 0.65rem;
      margin-bottom: 0.4rem;
      display: block;
      width: 100%;
      text-align: left;
      transition: background 0.12s, color 0.12s;
    }
    .forge-filter-btn:hover { background: var(--surface); color: var(--text); }
    .forge-filter-btn.is-active { background: var(--blue-surface); color: var(--blue); border-color: var(--blue-border); }
    .forge-notes-full { display: none; margin-top: 0.3rem; }
    .forge-expand-btn { color: var(--blue); cursor: pointer; font-size: 0.7rem; background: none; border: none; padding: 0; }
  </style>
</head>
<body>

  <!-- TOPBAR -->
  <header class="forge-topbar">
    <nav class="forge-topbar__breadcrumb">
      <a href="pipeline-dashboard.html">Forge</a>
      <span class="forge-topbar__sep">/</span>
      <a href="pipeline-dashboard.html"><!-- [agent fills: idea slug] --></a>
      <span class="forge-topbar__sep">/</span>
      <span class="forge-topbar__current">Assumption Log</span>
    </nav>
    <span class="forge-topbar__logo">Forge</span>
    <div class="forge-topbar__right">
      <span>Last updated: <!-- [agent fills: date] --></span>
    </div>
  </header>

  <!-- ARTEFACT NAV -->
  <nav class="forge-artefact-nav">
    <a class="forge-artefact-nav__item" href="brief.html">
      <span class="forge-artefact-nav__dot"></span>Brief
    </a>
    <a class="forge-artefact-nav__item is-active file-exists" href="assumption-log.html">
      <span class="forge-artefact-nav__dot"></span>Assumptions
    </a>
    <a class="forge-artefact-nav__item" href="personas.html">
      <span class="forge-artefact-nav__dot"></span>Personas
    </a>
    <a class="forge-artefact-nav__item" href="research-plan.html">
      <span class="forge-artefact-nav__dot"></span>Research Plan
    </a>
    <a class="forge-artefact-nav__item" href="handoff.html">
      <span class="forge-artefact-nav__dot"></span>Handoff
    </a>
    <a class="forge-artefact-nav__item" href="pipeline-dashboard.html">
      <span class="forge-artefact-nav__dot"></span>Dashboard
    </a>
  </nav>

  <!-- LAYOUT -->
  <div class="forge-layout">

    <!-- SIDEBAR — filter controls -->
    <aside class="forge-sidebar">
      <p class="forge-sidebar__label">Filter by status</p>
      <button class="forge-filter-btn is-active" id="filter-all" onclick="filterTable('all')">All assumptions</button>
      <button class="forge-filter-btn" id="filter-open" onclick="filterTable('open')">Open</button>
      <button class="forge-filter-btn" id="filter-defended" onclick="filterTable('defended')">Defended</button>
      <button class="forge-filter-btn" id="filter-accepted" onclick="filterTable('accepted')">Accepted</button>

      <p class="forge-sidebar__label" style="margin-top: 1.5rem;">Filter by risk</p>
      <button class="forge-filter-btn" id="filter-high" onclick="filterTable('high')">
        <span class="forge-dot forge-dot--red" style="margin-right: 0.4rem;"></span>High risk
      </button>
      <button class="forge-filter-btn" id="filter-medium" onclick="filterTable('medium')">
        <span class="forge-dot forge-dot--amber" style="margin-right: 0.4rem;"></span>Medium risk
      </button>
      <button class="forge-filter-btn" id="filter-low" onclick="filterTable('low')">
        <span class="forge-dot forge-dot--green" style="margin-right: 0.4rem;"></span>Low risk
      </button>

      <p class="forge-sidebar__label" style="margin-top: 1.5rem;">Filter by type</p>
      <button class="forge-filter-btn" id="filter-desirability" onclick="filterTable('desirability')">Desirability</button>
      <button class="forge-filter-btn" id="filter-viability" onclick="filterTable('viability')">Viability</button>
      <button class="forge-filter-btn" id="filter-feasibility" onclick="filterTable('feasibility')">Feasibility</button>
    </aside>

    <!-- MAIN -->
    <main class="forge-main">
      <h1>Assumption Log</h1>
      <p style="color: var(--dim); font-size: 0.78rem; margin-bottom: 1.5rem;">
        <!-- [agent fills: idea name] --> &nbsp;·&nbsp; <!-- [agent fills: date] -->
      </p>

      <table class="forge-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Assumption</th>
            <th>Type</th>
            <th>Risk</th>
            <th>Status</th>
            <th>Owner</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          <!-- Row example — agent replicates this pattern for each assumption -->
          <tr data-status="open" data-risk="high" data-type="desirability">
            <td style="color: var(--dim);">1</td>
            <td><!-- [agent fills: assumption text] --></td>
            <td><span class="forge-badge forge-badge--blue">Desirability</span></td>
            <td><span class="forge-badge forge-badge--red">High</span></td>
            <td><span class="forge-badge forge-badge--amber">Open</span></td>
            <td style="color: var(--dim);"><!-- [agent fills: owner name or role] --></td>
            <td>
              <span class="forge-notes-short"><!-- [agent fills: short note preview] --></span>
              <button class="forge-expand-btn" onclick="toggleNotes(this)">more</button>
              <div class="forge-notes-full"><!-- [agent fills: full validation method and notes] --></div>
            </td>
          </tr>
          <tr data-status="defended" data-risk="medium" data-type="viability">
            <td style="color: var(--dim);">2</td>
            <td><!-- [agent fills: assumption text] --></td>
            <td><span class="forge-badge forge-badge--purple">Viability</span></td>
            <td><span class="forge-badge forge-badge--amber">Medium</span></td>
            <td><span class="forge-badge forge-badge--green">Defended</span></td>
            <td style="color: var(--dim);"><!-- [agent fills: owner] --></td>
            <td>
              <span class="forge-notes-short"><!-- [agent fills: short note preview] --></span>
              <button class="forge-expand-btn" onclick="toggleNotes(this)">more</button>
              <div class="forge-notes-full"><!-- [agent fills: full notes] --></div>
            </td>
          </tr>
          <tr data-status="accepted" data-risk="low" data-type="feasibility">
            <td style="color: var(--dim);">3</td>
            <td><!-- [agent fills: assumption text] --></td>
            <td><span class="forge-badge forge-badge--dim">Feasibility</span></td>
            <td><span class="forge-badge forge-badge--green">Low</span></td>
            <td><span class="forge-badge forge-badge--dim">Accepted</span></td>
            <td style="color: var(--dim);"><!-- [agent fills: owner] --></td>
            <td>
              <span class="forge-notes-short"><!-- [agent fills: short note] --></span>
              <button class="forge-expand-btn" onclick="toggleNotes(this)">more</button>
              <div class="forge-notes-full"><!-- [agent fills: full notes] --></div>
            </td>
          </tr>
          <!-- [agent fills: add more rows following the same pattern] -->
        </tbody>
      </table>

      <hr class="forge-divider">

      <h2>Notes on defended assumptions</h2>
      <p><!-- [agent fills: for each Defended assumption — the human's defence in one sentence] --></p>

      <h2>Notes on accepted risks</h2>
      <p><!-- [agent fills: for each Accepted assumption — acknowledgement that the risk is known and the decision to proceed is deliberate] --></p>

    </main>
  </div><!-- /forge-layout -->

</body>
</html>
```

---

## Template 3 — `personas.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><!-- [agent fills: product name] --> — Personas</title>
  <style>
    /* PASTE CONTENTS OF skills/forge-styles.css HERE */
  </style>
  <style>
    .forge-persona-journey {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.65rem;
      margin: 1rem 0 1.5rem;
    }
    .forge-journey-stage {
      background: var(--elevated);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 0.85rem;
    }
    .forge-journey-stage__label {
      font-size: 0.6rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.09em;
      color: var(--dim);
      margin-bottom: 0.5rem;
    }
    .forge-journey-stage__content {
      font-size: 0.8rem;
      color: var(--mid);
      line-height: 1.55;
    }
    .forge-persona-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.65rem;
      margin-bottom: 1rem;
    }
    .forge-persona-quote {
      font-size: 0.9rem;
      font-style: italic;
      color: var(--mid);
      border-left: 3px solid var(--blue);
      padding: 0.5rem 1rem;
      margin: 0.75rem 0;
    }
  </style>
</head>
<body>

  <!-- TOPBAR -->
  <header class="forge-topbar">
    <nav class="forge-topbar__breadcrumb">
      <a href="pipeline-dashboard.html">Forge</a>
      <span class="forge-topbar__sep">/</span>
      <a href="pipeline-dashboard.html"><!-- [agent fills: idea slug] --></a>
      <span class="forge-topbar__sep">/</span>
      <span class="forge-topbar__current">Personas</span>
    </nav>
    <span class="forge-topbar__logo">Forge</span>
    <div class="forge-topbar__right">
      <span><!-- [agent fills: date] --></span>
    </div>
  </header>

  <!-- ARTEFACT NAV -->
  <nav class="forge-artefact-nav">
    <a class="forge-artefact-nav__item" href="brief.html">
      <span class="forge-artefact-nav__dot"></span>Brief
    </a>
    <a class="forge-artefact-nav__item" href="assumption-log.html">
      <span class="forge-artefact-nav__dot"></span>Assumptions
    </a>
    <a class="forge-artefact-nav__item is-active file-exists" href="personas.html">
      <span class="forge-artefact-nav__dot"></span>Personas
    </a>
    <a class="forge-artefact-nav__item" href="research-plan.html">
      <span class="forge-artefact-nav__dot"></span>Research Plan
    </a>
    <a class="forge-artefact-nav__item" href="handoff.html">
      <span class="forge-artefact-nav__dot"></span>Handoff
    </a>
    <a class="forge-artefact-nav__item" href="pipeline-dashboard.html">
      <span class="forge-artefact-nav__dot"></span>Dashboard
    </a>
  </nav>

  <!-- LAYOUT -->
  <div class="forge-layout">

    <!-- SIDEBAR — persona nav -->
    <aside class="forge-sidebar">
      <p class="forge-sidebar__label">Personas</p>
      <!-- [agent fills: one link per persona, mark primary persona is-active] -->
      <a class="forge-sidebar__link is-active" href="#persona-1"><!-- [agent fills: persona 1 name] --></a>
      <a class="forge-sidebar__link" href="#persona-2"><!-- [agent fills: persona 2 name] --></a>
      <a class="forge-sidebar__link" href="#persona-3"><!-- [agent fills: persona 3 name, if applicable] --></a>

      <p class="forge-sidebar__label" style="margin-top: 1.5rem;">Journey stages</p>
      <a class="forge-sidebar__link" href="#stage-discovery">Discovery</a>
      <a class="forge-sidebar__link" href="#stage-evaluation">Evaluation</a>
      <a class="forge-sidebar__link" href="#stage-adoption">Adoption</a>
      <a class="forge-sidebar__link" href="#stage-retention">Retention</a>
    </aside>

    <!-- MAIN -->
    <main class="forge-main">
      <h1>Personas</h1>
      <p style="color: var(--dim); font-size: 0.78rem; margin-bottom: 1.5rem;">
        <!-- [agent fills: idea name] --> &nbsp;·&nbsp; <!-- [agent fills: date] -->
      </p>

      <!-- PERSONA 1 -->
      <div id="persona-1">
        <div class="forge-agent-card">
          <div class="forge-agent-card__head">
            <div>
              <div class="forge-agent-card__name"><!-- [agent fills: persona name, e.g. "Marcus"] --></div>
              <div class="forge-agent-card__alias"><!-- [agent fills: role/description, e.g. "Weekend league manager, 34"] --></div>
            </div>
            <div class="forge-agent-card__badges">
              <span class="forge-badge forge-badge--blue">Primary</span>
              <!-- [agent fills: additional trait badges as appropriate] -->
            </div>
          </div>
          <div class="forge-agent-card__body" style="grid-template-columns: 1fr;">
            <blockquote class="forge-persona-quote">
              <!-- [agent fills: representative quote from this persona's perspective] -->
            </blockquote>
            <p style="font-size: 0.83rem; color: var(--mid);">
              <!-- [agent fills: 2–3 sentence description of this person — situation, context, what they care about] -->
            </p>
          </div>
          <div class="forge-agent-card__footer">
            <span><!-- [agent fills: key demographic note] --></span>
            <span class="forge-badge forge-badge--green"><!-- [agent fills: segment size estimate] --></span>
          </div>
        </div>

        <!-- JOURNEY MAP -->
        <h3>Journey map</h3>
        <div class="forge-persona-journey">
          <div class="forge-journey-stage" id="stage-discovery">
            <div class="forge-journey-stage__label">Discovery</div>
            <div class="forge-journey-stage__content"><!-- [agent fills: how this persona first encounters the problem or product] --></div>
          </div>
          <div class="forge-journey-stage" id="stage-evaluation">
            <div class="forge-journey-stage__label">Evaluation</div>
            <div class="forge-journey-stage__content"><!-- [agent fills: how they evaluate whether to use it] --></div>
          </div>
          <div class="forge-journey-stage" id="stage-adoption">
            <div class="forge-journey-stage__label">Adoption</div>
            <div class="forge-journey-stage__content"><!-- [agent fills: what makes them commit and start using it] --></div>
          </div>
          <div class="forge-journey-stage" id="stage-retention">
            <div class="forge-journey-stage__label">Retention</div>
            <div class="forge-journey-stage__content"><!-- [agent fills: what keeps them coming back] --></div>
          </div>
        </div>

        <!-- PAIN POINTS & GAINS -->
        <div class="forge-persona-section">
          <div class="forge-card forge-card--red">
            <div class="forge-card__title">Pain points</div>
            <ul>
              <li><!-- [agent fills: pain point] --></li>
              <li><!-- [agent fills: pain point] --></li>
              <li><!-- [agent fills: pain point] --></li>
            </ul>
          </div>
          <div class="forge-card forge-card--green">
            <div class="forge-card__title">Gains sought</div>
            <ul>
              <li><!-- [agent fills: gain] --></li>
              <li><!-- [agent fills: gain] --></li>
              <li><!-- [agent fills: gain] --></li>
            </ul>
          </div>
        </div>
      </div><!-- /persona-1 -->

      <hr class="forge-divider">

      <!-- PERSONA 2 — agent repeats the same structure above for each additional persona -->
      <div id="persona-2">
        <div class="forge-agent-card">
          <div class="forge-agent-card__head">
            <div>
              <div class="forge-agent-card__name"><!-- [agent fills: persona 2 name] --></div>
              <div class="forge-agent-card__alias"><!-- [agent fills: role/description] --></div>
            </div>
            <div class="forge-agent-card__badges">
              <span class="forge-badge forge-badge--dim">Secondary</span>
            </div>
          </div>
          <div class="forge-agent-card__body" style="grid-template-columns: 1fr;">
            <blockquote class="forge-persona-quote">
              <!-- [agent fills: representative quote] -->
            </blockquote>
            <p style="font-size: 0.83rem; color: var(--mid);">
              <!-- [agent fills: description] -->
            </p>
          </div>
          <div class="forge-agent-card__footer">
            <span><!-- [agent fills: key demographic note] --></span>
            <span class="forge-badge forge-badge--dim"><!-- [agent fills: segment size estimate] --></span>
          </div>
        </div>

        <h3>Journey map</h3>
        <div class="forge-persona-journey">
          <div class="forge-journey-stage">
            <div class="forge-journey-stage__label">Discovery</div>
            <div class="forge-journey-stage__content"><!-- [agent fills] --></div>
          </div>
          <div class="forge-journey-stage">
            <div class="forge-journey-stage__label">Evaluation</div>
            <div class="forge-journey-stage__content"><!-- [agent fills] --></div>
          </div>
          <div class="forge-journey-stage">
            <div class="forge-journey-stage__label">Adoption</div>
            <div class="forge-journey-stage__content"><!-- [agent fills] --></div>
          </div>
          <div class="forge-journey-stage">
            <div class="forge-journey-stage__label">Retention</div>
            <div class="forge-journey-stage__content"><!-- [agent fills] --></div>
          </div>
        </div>

        <div class="forge-persona-section">
          <div class="forge-card forge-card--red">
            <div class="forge-card__title">Pain points</div>
            <ul>
              <li><!-- [agent fills] --></li>
              <li><!-- [agent fills] --></li>
            </ul>
          </div>
          <div class="forge-card forge-card--green">
            <div class="forge-card__title">Gains sought</div>
            <ul>
              <li><!-- [agent fills] --></li>
              <li><!-- [agent fills] --></li>
            </ul>
          </div>
        </div>
      </div><!-- /persona-2 -->

    </main>
  </div><!-- /forge-layout -->

</body>
</html>
```

---

## Template 4 — `research-plan.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><!-- [agent fills: product name] --> — Research Plan</title>
  <style>
    /* PASTE CONTENTS OF skills/forge-styles.css HERE */
  </style>
  <style>
    .forge-knowledge-map {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.65rem;
      margin-bottom: 1.5rem;
    }
    .forge-knowledge-col__header {
      font-size: 0.65rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.09em;
      margin-bottom: 0.65rem;
      padding-bottom: 0.4rem;
      border-bottom: 1px solid var(--border);
    }
    .forge-knowledge-col__item {
      font-size: 0.8rem;
      color: var(--mid);
      padding: 0.35rem 0;
      border-bottom: 1px solid rgba(42, 42, 61, 0.3);
      line-height: 1.5;
    }
    .forge-knowledge-col__item:last-child { border-bottom: none; }
    .forge-knowledge-col__basis {
      font-size: 0.7rem;
      color: var(--dim);
      margin-top: 0.15rem;
    }
  </style>
</head>
<body>

  <!-- TOPBAR -->
  <header class="forge-topbar">
    <nav class="forge-topbar__breadcrumb">
      <a href="pipeline-dashboard.html">Forge</a>
      <span class="forge-topbar__sep">/</span>
      <a href="pipeline-dashboard.html"><!-- [agent fills: idea slug] --></a>
      <span class="forge-topbar__sep">/</span>
      <span class="forge-topbar__current">Research Plan</span>
    </nav>
    <span class="forge-topbar__logo">Forge</span>
    <div class="forge-topbar__right">
      <span class="forge-badge forge-badge--blue"><!-- [agent fills: Validate before / during / after build] --></span>
      <span><!-- [agent fills: date] --></span>
    </div>
  </header>

  <!-- ARTEFACT NAV -->
  <nav class="forge-artefact-nav">
    <a class="forge-artefact-nav__item" href="brief.html">
      <span class="forge-artefact-nav__dot"></span>Brief
    </a>
    <a class="forge-artefact-nav__item" href="assumption-log.html">
      <span class="forge-artefact-nav__dot"></span>Assumptions
    </a>
    <a class="forge-artefact-nav__item" href="personas.html">
      <span class="forge-artefact-nav__dot"></span>Personas
    </a>
    <a class="forge-artefact-nav__item is-active file-exists" href="research-plan.html">
      <span class="forge-artefact-nav__dot"></span>Research Plan
    </a>
    <a class="forge-artefact-nav__item" href="handoff.html">
      <span class="forge-artefact-nav__dot"></span>Handoff
    </a>
    <a class="forge-artefact-nav__item" href="pipeline-dashboard.html">
      <span class="forge-artefact-nav__dot"></span>Dashboard
    </a>
  </nav>

  <!-- LAYOUT -->
  <div class="forge-layout">

    <!-- SIDEBAR -->
    <aside class="forge-sidebar">
      <p class="forge-sidebar__label">Sections</p>
      <a class="forge-sidebar__link is-active" href="#knowledge-map">Knowledge map</a>
      <a class="forge-sidebar__link" href="#priorities">Validation priorities</a>
      <a class="forge-sidebar__link" href="#interview-guide">Interview guide</a>

      <p class="forge-sidebar__label" style="margin-top: 1.5rem;">Approach</p>
      <div style="padding: 0.3rem 0.6rem;">
        <span class="forge-badge forge-badge--blue"><!-- [agent fills: Validate before / during / after build] --></span>
      </div>
      <p style="font-size: 0.72rem; color: var(--dim); padding: 0.3rem 0.6rem; margin-top: 0.4rem;">
        <!-- [agent fills: one-sentence rationale] -->
      </p>
    </aside>

    <!-- MAIN -->
    <main class="forge-main">
      <h1>Research Plan</h1>
      <p style="color: var(--dim); font-size: 0.78rem; margin-bottom: 1.5rem;">
        <!-- [agent fills: idea name] --> &nbsp;·&nbsp; <!-- [agent fills: date] -->
      </p>

      <!-- KNOWLEDGE MAP -->
      <h2 id="knowledge-map">Knowledge map</h2>
      <div class="forge-knowledge-map">

        <div class="forge-card">
          <div class="forge-knowledge-col__header" style="color: var(--green);">Known</div>
          <!-- [agent fills: one item per piece of grounded evidence] -->
          <div class="forge-knowledge-col__item">
            <!-- [claim] -->
            <div class="forge-knowledge-col__basis"><!-- [basis / source] --></div>
          </div>
          <div class="forge-knowledge-col__item">
            <!-- [claim] -->
            <div class="forge-knowledge-col__basis"><!-- [basis] --></div>
          </div>
        </div>

        <div class="forge-card">
          <div class="forge-knowledge-col__header" style="color: var(--amber);">Assumed</div>
          <!-- [agent fills: one item per plausible but unverified claim] -->
          <div class="forge-knowledge-col__item">
            <!-- [claim] -->
            <div class="forge-knowledge-col__basis"><!-- [what would verify it] --></div>
          </div>
          <div class="forge-knowledge-col__item">
            <!-- [claim] -->
            <div class="forge-knowledge-col__basis"><!-- [what would verify it] --></div>
          </div>
        </div>

        <div class="forge-card">
          <div class="forge-knowledge-col__header" style="color: var(--red);">Unknown</div>
          <!-- [agent fills: one item per unaddressed question] -->
          <div class="forge-knowledge-col__item">
            <!-- [claim] -->
            <div class="forge-knowledge-col__basis"><!-- [why it matters] --></div>
          </div>
          <div class="forge-knowledge-col__item">
            <!-- [claim] -->
            <div class="forge-knowledge-col__basis"><!-- [why it matters] --></div>
          </div>
        </div>

      </div>

      <!-- VALIDATION PRIORITIES -->
      <h2 id="priorities">Validation priorities</h2>

      <h3>Before building</h3>
      <table class="forge-table">
        <thead>
          <tr>
            <th>Assumption being tested</th>
            <th>Method</th>
            <th>Success signal</th>
            <th>Screener</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><!-- [agent fills: what you need to know] --></td>
            <td><!-- [agent fills: interview / landing page / prototype / survey] --></td>
            <td><!-- [agent fills: what good looks like] --></td>
            <td><!-- [agent fills: 2–3 screener questions to find right participants] --></td>
          </tr>
          <!-- [agent fills: add more rows as needed] -->
        </tbody>
      </table>

      <h3>During build</h3>
      <p><!-- [agent fills: what can be validated through early releases] --></p>

      <!-- INTERVIEW GUIDE -->
      <h2 id="interview-guide">Interview guide</h2>
      <details class="forge-collapsible">
        <summary>Interview guide — click to expand</summary>
        <div class="forge-collapsible__body">
          <p><strong>Session length:</strong> 30 minutes</p>
          <p><strong>Goal:</strong> <!-- [agent fills: what you're trying to learn] --></p>

          <h4 style="margin-top: 1rem; margin-bottom: 0.5rem;">Warm-up</h4>
          <ol>
            <li>Tell me a bit about how you currently <!-- [agent fills: relevant activity] -->.</li>
          </ol>

          <h4 style="margin-top: 1rem; margin-bottom: 0.5rem;">Core questions</h4>
          <ol start="2">
            <li>Tell me about the last time you <!-- [agent fills: situation where problem occurs] -->.</li>
            <li>What did you do when that happened?</li>
            <li>What was frustrating about that? What worked?</li>
            <li>How often does this come up?</li>
            <li>What would have to be true for you to change how you do this?</li>
          </ol>

          <h4 style="margin-top: 1rem; margin-bottom: 0.5rem;">Close</h4>
          <ol start="7">
            <li>Is there anything about <!-- [agent fills: problem area] --> I haven't asked about that you think would be useful to know?</li>
          </ol>
        </div>
      </details>

    </main>
  </div><!-- /forge-layout -->

</body>
</html>
```

---

## Template 5 — `handoff.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><!-- [agent fills: product name] --> — Handoff · Burst <!-- [agent fills: N] --></title>
  <style>
    /* PASTE CONTENTS OF skills/forge-styles.css HERE */
  </style>
  <style>
    .forge-handoff-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .blockers-table td:first-child { font-weight: 600; color: var(--text); }
  </style>
</head>
<body>

  <!-- TOPBAR -->
  <header class="forge-topbar">
    <nav class="forge-topbar__breadcrumb">
      <a href="pipeline-dashboard.html">Forge</a>
      <span class="forge-topbar__sep">/</span>
      <a href="pipeline-dashboard.html"><!-- [agent fills: idea slug] --></a>
      <span class="forge-topbar__sep">/</span>
      <span class="forge-topbar__current">Handoff · Burst <!-- [agent fills: N] --></span>
    </nav>
    <span class="forge-topbar__logo">Forge</span>
    <div class="forge-topbar__right">
      <span class="forge-badge forge-badge--green"><!-- [agent fills: phase, e.g. Development] --></span>
      <span><!-- [agent fills: date] --></span>
    </div>
  </header>

  <!-- ARTEFACT NAV -->
  <nav class="forge-artefact-nav">
    <a class="forge-artefact-nav__item" href="brief.html">
      <span class="forge-artefact-nav__dot"></span>Brief
    </a>
    <a class="forge-artefact-nav__item" href="assumption-log.html">
      <span class="forge-artefact-nav__dot"></span>Assumptions
    </a>
    <a class="forge-artefact-nav__item" href="personas.html">
      <span class="forge-artefact-nav__dot"></span>Personas
    </a>
    <a class="forge-artefact-nav__item" href="research-plan.html">
      <span class="forge-artefact-nav__dot"></span>Research Plan
    </a>
    <a class="forge-artefact-nav__item is-active file-exists" href="handoff.html">
      <span class="forge-artefact-nav__dot"></span>Handoff
    </a>
    <a class="forge-artefact-nav__item" href="pipeline-dashboard.html">
      <span class="forge-artefact-nav__dot"></span>Dashboard
    </a>
  </nav>

  <!-- LAYOUT — full width, no sidebar needed for handoff -->
  <div class="forge-layout">
    <aside class="forge-sidebar">
      <p class="forge-sidebar__label">This burst</p>
      <div style="padding: 0.3rem 0.6rem;">
        <div style="font-size: 1.2rem; font-weight: 700; color: var(--text);">Burst <!-- [agent fills: N] --></div>
        <div style="font-size: 0.72rem; color: var(--dim); margin-top: 0.2rem;"><!-- [agent fills: date range] --></div>
      </div>

      <p class="forge-sidebar__label" style="margin-top: 1.5rem;">Issues closed</p>
      <div style="padding: 0.3rem 0.6rem; font-size: 1.5rem; font-weight: 700; color: var(--green);">
        <!-- [agent fills: count] -->
      </div>

      <p class="forge-sidebar__label" style="margin-top: 1.5rem;">Phase</p>
      <div style="padding: 0.3rem 0.6rem;">
        <span class="forge-badge forge-badge--green"><!-- [agent fills: phase] --></span>
      </div>

      <p class="forge-sidebar__label" style="margin-top: 1.5rem;">Linear</p>
      <a class="forge-sidebar__link" href="<!-- [agent fills: Linear project URL] -->" target="_blank">
        Open project ↗
      </a>

      <p class="forge-sidebar__label" style="margin-top: 1.5rem;">Previous bursts</p>
      <!-- [agent fills: link to previous handoff files] -->
      <a class="forge-sidebar__link" href="#">Burst <!-- [agent fills: N-1] --></a>
    </aside>

    <main class="forge-main">
      <h1>Handoff — Burst <!-- [agent fills: N] --></h1>
      <p style="color: var(--dim); font-size: 0.78rem; margin-bottom: 1.5rem;">
        <!-- [agent fills: idea name] --> &nbsp;·&nbsp; <!-- [agent fills: date] -->
      </p>

      <div class="forge-handoff-grid">

        <!-- LEFT COLUMN -->
        <div>
          <!-- PRODUCT STATE CARD -->
          <div class="forge-card forge-card--green">
            <div class="forge-card__title">Product state</div>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem;">
              <span class="forge-badge forge-badge--green"><!-- [agent fills: phase] --></span>
              <span class="forge-badge forge-badge--blue">Sprint <!-- [agent fills: N] --></span>
            </div>
            <div class="forge-metrics" style="grid-template-columns: repeat(2, 1fr);">
              <div class="forge-metric forge-metric--green">
                <div class="forge-metric__value"><!-- [agent fills: issues closed this burst] --></div>
                <div class="forge-metric__label">Issues closed</div>
              </div>
              <div class="forge-metric">
                <div class="forge-metric__value"><!-- [agent fills: issues remaining] --></div>
                <div class="forge-metric__label">Remaining</div>
              </div>
            </div>
            <p><!-- [agent fills: one sentence on product state — what is shipped and working] --></p>
          </div>

          <!-- LAST BURST SUMMARY -->
          <div class="forge-card">
            <div class="forge-card__title">What happened this burst</div>
            <ul>
              <li><!-- [agent fills: key thing completed] --></li>
              <li><!-- [agent fills: key thing completed] --></li>
              <li><!-- [agent fills: key thing completed] --></li>
              <li><!-- [agent fills: notable decision or pivot] --></li>
            </ul>
          </div>
        </div>

        <!-- RIGHT COLUMN -->
        <div>
          <!-- NEXT ACTIONS CARD -->
          <div class="forge-card forge-card--blue">
            <div class="forge-card__title">Next actions (start here on re-entry)</div>
            <ul>
              <li><!-- [agent fills: first thing to do on re-entry] --></li>
              <li><!-- [agent fills: second priority] --></li>
              <li><!-- [agent fills: third priority] --></li>
            </ul>
          </div>

          <!-- OPEN BLOCKERS TABLE -->
          <div class="forge-card">
            <div class="forge-card__title">Open blockers</div>
            <table class="forge-table blockers-table">
              <thead>
                <tr>
                  <th>Blocker</th>
                  <th>Type</th>
                  <th>Owner</th>
                </tr>
              </thead>
              <tbody>
                <!-- [agent fills: one row per open blocker; remove table if none] -->
                <tr>
                  <td><!-- [agent fills: blocker description] --></td>
                  <td><span class="forge-badge forge-badge--red"><!-- [agent fills: Technical / Product / External] --></span></td>
                  <td style="color: var(--dim);"><!-- [agent fills: owner] --></td>
                </tr>
                <!-- [agent fills: additional blocker rows as needed] -->
              </tbody>
            </table>
            <!-- [agent fills: if no blockers, replace table with:] -->
            <!-- <p style="color: var(--green); font-size: 0.83rem;">No open blockers.</p> -->
          </div>

          <!-- LINEAR LINK -->
          <div class="forge-card">
            <div class="forge-card__title">Linear project</div>
            <a class="forge-artefact-ref file-exists" href="<!-- [agent fills: Linear project URL] -->" target="_blank">
              <span class="forge-artefact-ref__dot"></span><!-- [agent fills: Linear project name] -->
            </a>
          </div>
        </div>

      </div><!-- /forge-handoff-grid -->

      <hr class="forge-divider">

      <h2>Key decisions this burst</h2>
      <p style="font-size: 0.78rem; color: var(--dim); margin-bottom: 0.75rem;">
        Decisions that changed direction, scope, or architecture. Full ADR log in
        <a href="../docs/decisions.md" class="forge-link">docs/decisions.md</a>.
      </p>
      <div class="forge-card forge-card--decision">
        <div class="forge-card__title">Decision</div>
        <p><!-- [agent fills: decision taken and rationale] --></p>
      </div>
      <!-- [agent fills: additional decision cards as needed] -->

    </main>
  </div><!-- /forge-layout -->

</body>
</html>
```

---

## Template 6 — `pipeline-dashboard.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><!-- [agent fills: product name] --> — Pipeline Dashboard</title>
  <style>
    /* PASTE CONTENTS OF skills/forge-styles.css HERE */
  </style>
  <style>
    .forge-burst-block {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 1rem 1.25rem;
      margin-bottom: 0.65rem;
      display: grid;
      grid-template-columns: 80px 1fr auto;
      gap: 1rem;
      align-items: start;
    }
    .forge-burst-block__number {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--dim);
    }
    .forge-burst-block__date {
      font-size: 0.68rem;
      color: var(--dim);
      margin-top: 0.2rem;
    }
    .forge-burst-block__decisions {
      font-size: 0.78rem;
      color: var(--dim);
      margin-top: 0.35rem;
    }
    .forge-burst-block.is-current {
      border-color: var(--green-border);
      background: var(--green-surface-subtle);
    }
    .forge-burst-block.is-current .forge-burst-block__number {
      color: var(--green);
    }
  </style>
</head>
<body>

  <!-- TOPBAR -->
  <header class="forge-topbar">
    <nav class="forge-topbar__breadcrumb">
      <a href="pipeline-dashboard.html">Forge</a>
      <span class="forge-topbar__sep">/</span>
      <span class="forge-topbar__current"><!-- [agent fills: idea slug] --></span>
    </nav>
    <span class="forge-topbar__logo">Forge</span>
    <div class="forge-topbar__right">
      <span class="forge-badge forge-badge--green"><!-- [agent fills: current phase] --></span>
      <span><!-- [agent fills: date] --></span>
    </div>
  </header>

  <!-- PIPELINE STRIP — marks current position -->
  <nav class="forge-pipeline-strip">
    <a class="forge-pipeline-strip__item is-done" href="#">
      <span class="forge-pipeline-strip__dot"></span>Intake
    </a>
    <span class="forge-pipeline-strip__sep">›</span>
    <a class="forge-pipeline-strip__item is-done" href="#">
      <span class="forge-pipeline-strip__dot"></span>Discovery
    </a>
    <span class="forge-pipeline-strip__sep">›</span>
    <a class="forge-pipeline-strip__item is-done" href="#">
      <span class="forge-pipeline-strip__dot"></span>Breadboard
    </a>
    <span class="forge-pipeline-strip__sep">›</span>
    <a class="forge-pipeline-strip__item is-done" href="#">
      <span class="forge-pipeline-strip__dot"></span>Refinement
    </a>
    <span class="forge-pipeline-strip__sep">›</span>
    <!-- [agent fills: mark the current phase is-current, completed phases is-done] -->
    <a class="forge-pipeline-strip__item is-current" href="#">
      <span class="forge-pipeline-strip__dot"></span>Development
    </a>
    <span class="forge-pipeline-strip__sep">›</span>
    <a class="forge-pipeline-strip__item" href="#">
      <span class="forge-pipeline-strip__dot"></span>Delivery
    </a>
  </nav>

  <!-- ARTEFACT NAV -->
  <nav class="forge-artefact-nav">
    <a class="forge-artefact-nav__item" href="brief.html">
      <span class="forge-artefact-nav__dot"></span>Brief
    </a>
    <a class="forge-artefact-nav__item" href="assumption-log.html">
      <span class="forge-artefact-nav__dot"></span>Assumptions
    </a>
    <a class="forge-artefact-nav__item" href="personas.html">
      <span class="forge-artefact-nav__dot"></span>Personas
    </a>
    <a class="forge-artefact-nav__item" href="research-plan.html">
      <span class="forge-artefact-nav__dot"></span>Research Plan
    </a>
    <a class="forge-artefact-nav__item" href="handoff.html">
      <span class="forge-artefact-nav__dot"></span>Handoff
    </a>
    <a class="forge-artefact-nav__item is-active file-exists" href="pipeline-dashboard.html">
      <span class="forge-artefact-nav__dot"></span>Dashboard
    </a>
  </nav>

  <!-- LAYOUT -->
  <div class="forge-layout">

    <!-- SIDEBAR -->
    <aside class="forge-sidebar">
      <p class="forge-sidebar__label">Project</p>
      <a class="forge-sidebar__link is-active" href="pipeline-dashboard.html">Dashboard</a>
      <a class="forge-sidebar__link" href="brief.html">Brief</a>
      <a class="forge-sidebar__link" href="handoff.html">Latest handoff</a>

      <p class="forge-sidebar__label" style="margin-top: 1.5rem;">Artefacts</p>
      <a class="forge-sidebar__link" href="assumption-log.html">Assumption log</a>
      <a class="forge-sidebar__link" href="personas.html">Personas</a>
      <a class="forge-sidebar__link" href="research-plan.html">Research plan</a>

      <p class="forge-sidebar__label" style="margin-top: 1.5rem;">External</p>
      <a class="forge-sidebar__link" href="<!-- [agent fills: Linear URL] -->" target="_blank">Linear ↗</a>
      <a class="forge-sidebar__link" href="../docs/CLAUDE.html" target="_blank">CLAUDE.html ↗</a>
    </aside>

    <!-- MAIN -->
    <main class="forge-main">
      <h1><!-- [agent fills: product name] --></h1>
      <p style="color: var(--dim); font-size: 0.78rem; margin-bottom: 1.5rem;">
        <!-- [agent fills: idea slug] --> &nbsp;·&nbsp; Started <!-- [agent fills: start date] -->
      </p>

      <!-- LIVE STATE CARD -->
      <div class="forge-card forge-card--green">
        <div class="forge-card__title">Live state — right now</div>
        <div class="forge-metrics" style="grid-template-columns: repeat(4, 1fr);">
          <div class="forge-metric forge-metric--green">
            <div class="forge-metric__value"><!-- [agent fills: sprint number] --></div>
            <div class="forge-metric__label">Sprint</div>
          </div>
          <div class="forge-metric forge-metric--blue">
            <div class="forge-metric__value"><!-- [agent fills: issues in progress] --></div>
            <div class="forge-metric__label">In progress</div>
          </div>
          <div class="forge-metric">
            <div class="forge-metric__value"><!-- [agent fills: issues remaining] --></div>
            <div class="forge-metric__label">Remaining</div>
          </div>
          <div class="forge-metric forge-metric--amber">
            <div class="forge-metric__value"><!-- [agent fills: open blockers] --></div>
            <div class="forge-metric__label">Blockers</div>
          </div>
        </div>
        <p><!-- [agent fills: one sentence on what is actively being built right now] --></p>
        <p style="margin-top: 0.5rem;">
          <a class="forge-artefact-ref file-exists" href="handoff.html">
            <span class="forge-artefact-ref__dot"></span>Latest handoff
          </a>
        </p>
      </div>

      <!-- BURST HISTORY — newest first, accumulates over time -->
      <h2>Burst history</h2>
      <p style="font-size: 0.78rem; color: var(--dim); margin-bottom: 1rem;">
        Each block is a completed burst. Agent updates this file after every handoff.
      </p>

      <!-- CURRENT BURST (in progress) -->
      <div class="forge-burst-block is-current">
        <div>
          <div class="forge-burst-block__number"><!-- [agent fills: N] --></div>
          <div class="forge-burst-block__date"><!-- [agent fills: date] --> · In progress</div>
        </div>
        <div>
          <div style="font-size: 0.83rem; color: var(--text); margin-bottom: 0.35rem;">
            <!-- [agent fills: brief title of what this burst is building] -->
          </div>
          <div class="forge-burst-block__decisions">
            <!-- [agent fills: key decisions or pivots in this burst, if any so far] -->
          </div>
        </div>
        <div>
          <span class="forge-badge forge-badge--green">In progress</span>
        </div>
      </div>

      <!-- COMPLETED BURST — agent adds one block per completed burst, newest first -->
      <div class="forge-burst-block">
        <div>
          <div class="forge-burst-block__number"><!-- [agent fills: N-1] --></div>
          <div class="forge-burst-block__date"><!-- [agent fills: date] --></div>
        </div>
        <div>
          <div style="font-size: 0.83rem; color: var(--text); margin-bottom: 0.35rem;">
            <!-- [agent fills: burst summary, e.g. "Auth + onboarding shipped"] -->
          </div>
          <div class="forge-metrics" style="grid-template-columns: repeat(2, 1fr); margin-bottom: 0.35rem;">
            <div class="forge-metric">
              <div class="forge-metric__value" style="font-size: 1rem;"><!-- [agent fills: issues closed] --></div>
              <div class="forge-metric__label">Issues closed</div>
            </div>
          </div>
          <div class="forge-burst-block__decisions">
            <!-- [agent fills: key decisions made this burst] -->
          </div>
        </div>
        <div>
          <a class="forge-artefact-ref file-exists" href="handoff-<!-- [agent fills: N-1] -->.html">
            <span class="forge-artefact-ref__dot"></span>handoff-<!-- [agent fills: N-1] -->.html
          </a>
        </div>
      </div>

      <!-- [agent fills: add more burst blocks above as the project progresses, newest first] -->

      <hr class="forge-divider">

      <!-- MILESTONE OVERVIEW -->
      <h2>Milestones</h2>
      <table class="forge-table">
        <thead>
          <tr>
            <th>Milestone</th>
            <th>Target</th>
            <th>Status</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><!-- [agent fills: milestone name] --></td>
            <td style="color: var(--dim);"><!-- [agent fills: target date or sprint] --></td>
            <td><span class="forge-badge forge-badge--green"><!-- [agent fills: Done / In progress / Upcoming] --></span></td>
            <td><!-- [agent fills: brief note] --></td>
          </tr>
          <tr>
            <td><!-- [agent fills: milestone name] --></td>
            <td style="color: var(--dim);"><!-- [agent fills: target] --></td>
            <td><span class="forge-badge forge-badge--blue">In progress</span></td>
            <td><!-- [agent fills: brief note] --></td>
          </tr>
          <tr>
            <td><!-- [agent fills: milestone name] --></td>
            <td style="color: var(--dim);"><!-- [agent fills: target] --></td>
            <td><span class="forge-badge forge-badge--dim">Upcoming</span></td>
            <td><!-- [agent fills: brief note] --></td>
          </tr>
        </tbody>
      </table>

    </main>
  </div><!-- /forge-layout -->

</body>
</html>
```

---

## Template 7 — `CLAUDE.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><!-- [agent fills: product name] --> — CLAUDE Context</title>
  <style>
    /* PASTE CONTENTS OF skills/forge-styles.css HERE */
  </style>
  <script>
    function showSection(id) {
      document.querySelectorAll('.forge-tab-panel').forEach(p => p.classList.remove('is-active'));
      document.querySelectorAll('.forge-tabs__tab').forEach(t => t.classList.remove('is-active'));
      document.querySelectorAll('.forge-sidebar__link[data-section]').forEach(l => l.classList.remove('is-active'));
      document.getElementById('panel-' + id).classList.add('is-active');
      document.getElementById('tab-' + id).classList.add('is-active');
      const sidebarLink = document.querySelector('.forge-sidebar__link[data-section="' + id + '"]');
      if (sidebarLink) sidebarLink.classList.add('is-active');
    }
  </script>
</head>
<body>

  <!-- TOPBAR -->
  <header class="forge-topbar">
    <nav class="forge-topbar__breadcrumb">
      <a href="../output/<!-- [agent fills: idea-slug] -->/pipeline-dashboard.html">Forge</a>
      <span class="forge-topbar__sep">/</span>
      <a href="../output/<!-- [agent fills: idea-slug] -->/pipeline-dashboard.html"><!-- [agent fills: idea slug] --></a>
      <span class="forge-topbar__sep">/</span>
      <span class="forge-topbar__current">CLAUDE Context</span>
    </nav>
    <span class="forge-topbar__logo">Forge</span>
    <div class="forge-topbar__right">
      <span class="forge-badge forge-badge--green"><!-- [agent fills: current phase] --></span>
      <span>Last updated: <!-- [agent fills: date] --></span>
    </div>
  </header>

  <!-- ARTEFACT NAV -->
  <nav class="forge-artefact-nav">
    <a class="forge-artefact-nav__item" href="../output/<!-- [agent fills: idea-slug] -->/brief.html">
      <span class="forge-artefact-nav__dot"></span>Brief
    </a>
    <a class="forge-artefact-nav__item" href="../output/<!-- [agent fills: idea-slug] -->/pipeline-dashboard.html">
      <span class="forge-artefact-nav__dot"></span>Dashboard
    </a>
    <a class="forge-artefact-nav__item is-active file-exists" href="CLAUDE.html">
      <span class="forge-artefact-nav__dot"></span>CLAUDE.html
    </a>
    <a class="forge-artefact-nav__item" href="DESIGN.md">
      <span class="forge-artefact-nav__dot"></span>DESIGN.md
    </a>
    <a class="forge-artefact-nav__item" href="decisions.md">
      <span class="forge-artefact-nav__dot"></span>decisions.md
    </a>
  </nav>

  <!-- LAYOUT -->
  <div class="forge-layout">

    <!-- SIDEBAR -->
    <aside class="forge-sidebar">
      <p class="forge-sidebar__label">Sections</p>
      <a class="forge-sidebar__link is-active" data-section="overview" href="#"
         onclick="showSection('overview'); return false;">Product Overview</a>
      <a class="forge-sidebar__link" data-section="architecture" href="#"
         onclick="showSection('architecture'); return false;">Architecture</a>
      <a class="forge-sidebar__link" data-section="sequence" href="#"
         onclick="showSection('sequence'); return false;">Build Sequence</a>
      <a class="forge-sidebar__link" data-section="decisions" href="#"
         onclick="showSection('decisions'); return false;">Open Decisions</a>

      <p class="forge-sidebar__label" style="margin-top: 1.5rem;">Linked artefacts</p>
      <a class="forge-artefact-ref" href="../output/<!-- [agent fills: idea-slug] -->/brief.html">
        <span class="forge-artefact-ref__dot"></span>brief.html
      </a>
      <br><br>
      <a class="forge-artefact-ref" href="decisions.md">
        <span class="forge-artefact-ref__dot"></span>decisions.md
      </a>
    </aside>

    <!-- MAIN -->
    <main class="forge-main">
      <h1><!-- [agent fills: product name] --></h1>
      <p style="color: var(--dim); font-size: 0.78rem; margin-bottom: 1.5rem;">
        Claude Code context · Idea: <code class="forge-code"><!-- [agent fills: idea-slug] --></code>
        &nbsp;·&nbsp; Phase: <!-- [agent fills: current phase] -->
        &nbsp;·&nbsp; Updated: <!-- [agent fills: date] -->
      </p>

      <!-- TABS -->
      <div class="forge-tabs">
        <button class="forge-tabs__tab is-active" id="tab-overview"
                onclick="showSection('overview')">Product Overview</button>
        <button class="forge-tabs__tab" id="tab-architecture"
                onclick="showSection('architecture')">Architecture</button>
        <button class="forge-tabs__tab" id="tab-sequence"
                onclick="showSection('sequence')">Build Sequence</button>
        <button class="forge-tabs__tab" id="tab-decisions"
                onclick="showSection('decisions')">Open Decisions</button>
      </div>

      <!-- PANEL: PRODUCT OVERVIEW -->
      <div class="forge-tab-panel is-active" id="panel-overview">
        <h2>What this product is</h2>
        <p><!-- [agent fills: 2–3 sentences describing the product, the user, and the core problem it solves] --></p>

        <h2>North star metric</h2>
        <p><!-- [agent fills: the one metric that indicates real value is being delivered] --></p>

        <h2>Current status</h2>
        <div class="forge-card forge-card--green">
          <div class="forge-card__title">Phase</div>
          <p><!-- [agent fills: what phase we are in and what that means for this session] --></p>
        </div>

        <h2>Key constraints</h2>
        <ul>
          <li><!-- [agent fills: technical or product constraint Claude Code must be aware of] --></li>
          <li><!-- [agent fills: constraint] --></li>
          <li><!-- [agent fills: constraint] --></li>
        </ul>

        <h2>What Claude Code should NOT do</h2>
        <div class="forge-never-do">
          <div class="forge-never-do__title">Never do</div>
          <ul class="forge-never-do__list">
            <li class="forge-never-do__item"><!-- [agent fills: specific anti-pattern for this project] --></li>
            <li class="forge-never-do__item"><!-- [agent fills: specific anti-pattern] --></li>
            <li class="forge-never-do__item"><!-- [agent fills: specific anti-pattern] --></li>
          </ul>
        </div>
      </div>

      <!-- PANEL: ARCHITECTURE -->
      <div class="forge-tab-panel" id="panel-architecture">
        <h2>Tech stack</h2>
        <table class="forge-table">
          <thead>
            <tr><th>Layer</th><th>Technology</th><th>Notes</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><!-- [agent fills: layer, e.g. Frontend] --></td>
              <td class="forge-table__file"><!-- [agent fills: technology] --></td>
              <td><!-- [agent fills: notes] --></td>
            </tr>
            <tr>
              <td><!-- [agent fills: layer, e.g. Backend] --></td>
              <td class="forge-table__file"><!-- [agent fills: technology] --></td>
              <td><!-- [agent fills: notes] --></td>
            </tr>
            <tr>
              <td><!-- [agent fills: layer, e.g. Database] --></td>
              <td class="forge-table__file"><!-- [agent fills: technology] --></td>
              <td><!-- [agent fills: notes] --></td>
            </tr>
            <tr>
              <td><!-- [agent fills: layer, e.g. Auth] --></td>
              <td class="forge-table__file"><!-- [agent fills: technology] --></td>
              <td><!-- [agent fills: notes] --></td>
            </tr>
          </tbody>
        </table>

        <h2>Key directories</h2>
        <table class="forge-table">
          <thead>
            <tr><th>Path</th><th>Purpose</th></tr>
          </thead>
          <tbody>
            <tr>
              <td class="forge-table__file"><!-- [agent fills: path] --></td>
              <td><!-- [agent fills: purpose] --></td>
            </tr>
            <tr>
              <td class="forge-table__file"><!-- [agent fills: path] --></td>
              <td><!-- [agent fills: purpose] --></td>
            </tr>
            <!-- [agent fills: add more rows as needed] -->
          </tbody>
        </table>

        <h2>Architecture notes</h2>
        <p><!-- [agent fills: any structural decisions Claude Code needs to understand — data flow, auth model, deployment topology, etc.] --></p>

        <div class="forge-card forge-card--decision">
          <div class="forge-card__title">Key architectural decision</div>
          <p><!-- [agent fills: most important architectural decision and its rationale] --></p>
        </div>
      </div>

      <!-- PANEL: BUILD SEQUENCE -->
      <div class="forge-tab-panel" id="panel-sequence">
        <h2>Epics and current state</h2>
        <p style="font-size: 0.78rem; color: var(--dim); margin-bottom: 1rem;">
          Epics in priority order. Issues live in Linear.
          <a href="<!-- [agent fills: Linear project URL] -->" class="forge-link" target="_blank">Open in Linear ↗</a>
        </p>

        <table class="forge-table">
          <thead>
            <tr>
              <th>Epic</th>
              <th>Status</th>
              <th>Issues</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><!-- [agent fills: epic name] --></td>
              <td><span class="forge-badge forge-badge--green">Done</span></td>
              <td style="color: var(--dim);"><!-- [agent fills: count] --></td>
              <td><!-- [agent fills: note] --></td>
            </tr>
            <tr>
              <td><!-- [agent fills: epic name] --></td>
              <td><span class="forge-badge forge-badge--blue">In progress</span></td>
              <td style="color: var(--dim);"><!-- [agent fills: count] --></td>
              <td><!-- [agent fills: note] --></td>
            </tr>
            <tr>
              <td><!-- [agent fills: epic name] --></td>
              <td><span class="forge-badge forge-badge--dim">Upcoming</span></td>
              <td style="color: var(--dim);"><!-- [agent fills: count] --></td>
              <td><!-- [agent fills: note] --></td>
            </tr>
            <!-- [agent fills: add more rows as needed] -->
          </tbody>
        </table>

        <h2>What's in scope for the current sprint</h2>
        <ul>
          <li><!-- [agent fills: issue or task] --></li>
          <li><!-- [agent fills: issue or task] --></li>
          <li><!-- [agent fills: issue or task] --></li>
        </ul>

        <h2>What is explicitly out of scope (v1)</h2>
        <ul>
          <li><!-- [agent fills: deferred feature and reason] --></li>
          <li><!-- [agent fills: deferred feature and reason] --></li>
        </ul>
      </div>

      <!-- PANEL: OPEN DECISIONS -->
      <div class="forge-tab-panel" id="panel-decisions">
        <h2>Open decisions</h2>
        <p style="font-size: 0.78rem; color: var(--dim); margin-bottom: 1rem;">
          Questions that are unresolved but not yet blocking. Resolved decisions move to
          <a href="decisions.md" class="forge-link">docs/decisions.md</a>.
        </p>

        <div class="forge-card forge-card--exception">
          <div class="forge-card__title">Open decision</div>
          <p><!-- [agent fills: the question that is unresolved] --></p>
          <p style="margin-top: 0.5rem; font-size: 0.78rem; color: var(--dim);">
            Options: <!-- [agent fills: two or three options being considered] -->
          </p>
        </div>

        <!-- [agent fills: additional open decision cards as needed] -->

        <h2>Recent resolved decisions</h2>
        <p style="font-size: 0.78rem; color: var(--dim); margin-bottom: 0.75rem;">
          Most recent 3. Full log in <a href="decisions.md" class="forge-link">decisions.md</a>.
        </p>
        <table class="forge-table">
          <thead>
            <tr><th>Decision</th><th>Outcome</th><th>Date</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><!-- [agent fills: decision] --></td>
              <td><!-- [agent fills: what was decided] --></td>
              <td style="color: var(--dim);"><!-- [agent fills: date] --></td>
            </tr>
            <!-- [agent fills: add more rows] -->
          </tbody>
        </table>
      </div>

    </main>
  </div><!-- /forge-layout -->

</body>
</html>
```
