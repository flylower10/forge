# Forge


A structured multi-agent framework for turning ideas into shipped products. Runs discovery, stress-tests assumptions, and hands off a Claude Code-ready brief — then orchestrates the build.

---

## What it does

Most ideas fail not because they were bad, but because they were built before they were understood. Forge fixes that. Every idea passes through a pipeline of specialist agents before a line of code is written. By the end, the problem is sharp, the assumptions are logged, the user is understood, and Claude Code has everything it needs to build.

Forge then stays active through the build — orchestrating a team of execution agents, managing build bursts, and connecting what gets shipped back to what was assumed in discovery.

---

## How it works

### Phase 1 · Discovery

A pipeline of specialist agents, each with a distinct role and personality. They are not assistants seeking validation — they hold positions, push back, and update their views only when genuinely persuaded.

The core pipeline:

```
00 · Intake            Determines the right pipeline for this specific idea
01 · PM Agent          The Interrogator — problem framing
02 · Design Agent      The Narrator — empathy and experience
03 · Devil's Advocate  The Sceptic — assumption stress-test
04 · Tech Feasibility  The Pragmatist — tradeoffs and architecture
05 · User Researcher   The Advocate — what to validate before building
06 · Synthesis         Assembles all outputs into a complete brief
```

Plus specialist agents Intake selects per idea: **Breadboard** (mapping places, affordances and wiring before code), **Model Reviewer** (model architecture and calibration), **UX Agent** (design briefs for Claude Design), **Observer** (process critique, runs after every handoff), **Research Agent** (mid-conversation factual gaps), and the **Marketing team** (pricing, go-to-market) when commercial thinking is needed.

Some agents run as full conversations. Others run autonomously and surface one targeted question before finalising. The human is an active thinking partner throughout — not an approver.

### Handoff

Synthesis writes structured artefacts to the right places:

- **`/output/[idea-name]/`** — brief, OST, ost-decisions, assumption log, personas, research plan *(what you read — `.md` source + `.html` view)*
- **GitHub `/docs/`** — `CLAUDE.md`, `DESIGN.md`, ADR log *(what Claude Code reads at build time)*
- **Linear** — project, epics, issues *(what gets built)*

### Phase 2 · Refinement

A focused ceremony that bridges discovery and build. The brief is read through an engineering lens. Ambiguities are resolved. The build team gets a clear start point.

```
07 · Refinement        Discovery → build-ready brief
```

### Phase 3 · Build

A team of execution agents orchestrated by the Delivery Manager.

```
Delivery Manager  The Conductor — orchestration, blockers, human interface
Architect         Consulted at refinement and structural decisions only
Cartographer      Documents an existing codebase on first contact
Engineer          Writes code
Reviewer          Checks quality and consistency
QA                Validates acceptance criteria
```

Two triggered processes guard the queue. **Feedback Triage** (The Arbiter) fires before any action is taken on product criticism — criticism is not a task assignment. **Feature Triage** classifies and routes new feature requests so they enter the build queue with the right level of scoping.

### The loop

```
08 · Burst Review      End of every burst — handoff + re-entry
Signal log             On-demand or fortnightly — empirical learning from shipped work
```

Bursts trigger handoff and re-entry rituals. The signal log runs on a separate clock — observation arrives weeks after shipping, not at the end of a work session. When a signal invalidates an assumption, the relevant discovery agent is re-invoked. The brief evolves. The build continues.

### Phase 4 · Delivery

Shipping, deployment, user onboarding, release notes and marketing handoff. Specialist agents for this phase are planned and will be added when first needed.

---

## Principles

**Agents are optional by default.** No agent runs unless the intake step selects it. The full pipeline is a maximum, not a standard. A personal tool might invoke three agents. A consumer product invokes all of them.

**The framework is extensible.** New agents drop into `/product-team/` or `/build-team/`. The intake agent discovers them automatically. No other files need updating.

**Conversation over approval.** Human involvement is not about sign-offs. It is about thinking alongside agents, holding positions, and making judgement calls that no agent should make unilaterally.

**Two sources of truth, clearly separated.** GitHub holds product thinking (in `/output/`) and technical context (in `/docs/`). Linear holds build execution. Nothing duplicated across stores.

**Decisions are recorded.** Every significant decision is written to `decisions.md` in the repo alongside the code it informed. Future sessions cannot unknowingly contradict settled decisions.

---

## Structure

```
forge/
  CLAUDE.md                    ← framework root — read this first
  README.md                    ← this file

  product-team/                ← discovery agents (numbered) + specialists
                                 (breadboard, ux-agent, observer, research-agent,
                                  model-reviewer)
  build-team/                  ← execution agents + triggered processes
                                 (delivery-manager, architect, cartographer,
                                  engineer, reviewer, qa, feedback-triage)
  marketing-team/              ← pricing, go-to-market (selected by Intake when
                                 commercial thinking is needed)

  skills/                      ← shared protocols (handoff, prioritisation,
                                 feature-triage, research, design, intellectual
                                 standards) + artefact templates + style system
  hooks/                       ← pre-session and post-session rituals
  viewer/                      ← React app that renders agent reference pages
                                 from .md sources (no static per-agent HTML)
  docs/                        ← project-level technical context (CLAUDE.md,
                                 DESIGN.md, ADR log) — what Claude Code reads
                                 at build time

  memory/
    decisions.md               ← framework-level ADR log, append-only
    signal-log.md              ← shipped-work learning template
    framework-backlog.md       ← open improvements to Forge itself

  output/[idea-name]/          ← per-idea product artefacts (.md + .html pairs)
```

The canonical agent directory — every agent, its alias, and how it runs — lives in `CLAUDE.md`. The README describes the shape; `CLAUDE.md` is the source of truth.

---

## Getting started

**1. Create a repo and push**
Clone or fork this repo. Push to your own GitHub account.

**2. Connect your tools**
Configure MCP servers for Linear and GitHub in Claude Code.

**3. Open in Claude Code**
Claude Code reads `CLAUDE.md` at the root on session start.
The pre-session hook orients it from there.

**4. Browse agents via the viewer**
Run `python3 -m http.server 8080` from the repo root and open
`http://localhost:8080/viewer/`. The viewer renders every agent reference
page live from its `.md` source — no static HTML to keep in sync.

**5. Run your first idea**
Open Claude Code in the repo root. Describe your idea and the intake agent takes over from there.

---

## Extending Forge

Forge is built to grow. The current agent library covers product and software development. Future domain libraries — legal, research, business cases — can be added as subdirectories without changing anything else.

To add a new agent: create a markdown file in `/product-team/` or `/build-team/` following the conventions in existing agent files. The intake agent discovers it automatically on the next run.

To add a new domain: create a subdirectory (e.g. `/product-team/legal/`) with its own specialist agents. Update the intake agent's orienting question to include the new domain.

---

## Status

Prototype. Being tested against real ideas. Agents, skills and hooks will evolve with usage. `decisions.md` is the record of how and why.
