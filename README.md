# Forge


A structured multi-agent framework for turning ideas into shipped products. Runs discovery, stress-tests assumptions, and hands off a Claude Code-ready brief — then orchestrates the build.

---

## What it does

Most ideas fail not because they were bad, but because they were built before they were understood. Forge fixes that. Every idea passes through a pipeline of specialist agents before a line of code is written. By the end, the problem is sharp, the assumptions are logged, the user is understood, and Claude Code has everything it needs to build.

Forge then stays active through the build — orchestrating a team of execution agents, managing sprint cycles, and connecting what gets shipped back to what was assumed in discovery.

---

## How it works

### Phase 1 · Discovery

A pipeline of specialist agents, each with a distinct role and personality. They are not assistants seeking validation — they hold positions, push back, and update their views only when genuinely persuaded.

```
00 · Intake            Determines the right pipeline for this specific idea
01 · PM Agent          The Interrogator — problem framing
02 · Design Agent      The Anthropologist — empathy and experience  
03 · Devil's Advocate  The Sceptic — assumption stress-test
04 · Tech Feasibility  The Pragmatist — tradeoffs and architecture
05 · User Researcher   The Advocate — what to validate before building
06 · Synthesis         Assembles all outputs into a complete brief
```

Some agents run as full conversations. Others run autonomously and surface one targeted question before finalising. The human is an active thinking partner throughout — not an approver.

### Handoff

Synthesis pushes structured artefacts to the right tools:

- **Notion** — brief, OST, assumption log, personas, research plan *(what you read)*
- **GitHub** — `CLAUDE.md`, `DESIGN.md`, ADR log *(what Claude Code reads)*
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
Engineer          Writes code
Reviewer          Checks quality and consistency
QA                Validates acceptance criteria
```

### The loop

```
08 · Sprint Review     End of every sprint — signal → learning → next sprint
```

Sprint signal feeds back into discovery. If an assumption is invalidated, the relevant discovery agent is re-invoked. The brief evolves. The build continues.

---

## Principles

**Agents are optional by default.** No agent runs unless the intake step selects it. The full pipeline is a maximum, not a standard. A personal tool might invoke three agents. A consumer product invokes all of them.

**The framework is extensible.** New agents drop into `/product-team/` or `/build-team/`. The intake agent discovers them automatically. No other files need updating.

**Conversation over approval.** Human involvement is not about sign-offs. It is about thinking alongside agents, holding positions, and making judgement calls that no agent should make unilaterally.

**Three sources of truth, clearly separated.** Notion for product thinking. GitHub for technical context. Linear for build execution. Nothing duplicated across tools.

**Decisions are recorded.** Every significant decision is written to `decisions.md` in the repo alongside the code it informed. Future sessions cannot unknowingly contradict settled decisions.

---

## Structure

```
forge/
  CLAUDE.md                    ← framework root — read this first

  product-team/
    00-intake.md               ← always runs first
    01-pm-agent.md             ← The Interrogator
    02-design-agent.md         ← The Anthropologist
    03-devils-advocate.md      ← The Sceptic
    04-tech-feasibility.md     ← The Pragmatist
    05-user-researcher.md      ← The Advocate
    06-synthesis.md            ← fully autonomous assembly
    07-refinement.md           ← discovery → build bridge
    08-sprint-review.md        ← end of sprint ceremony

  build-team/
    delivery-manager.md        ← The Conductor
    architect.md               ← consulted only
    engineer.md                ← execution
    reviewer.md                ← execution
    qa.md                      ← execution

  skills/
    frameworks.md              ← JTBD, OST, HEART reference
    linear-schema.md           ← epic and issue structure
    artefact-templates.md      ← standardised output formats
    design-md.md               ← how to write a good DESIGN.md

  hooks/
    pre-session.md             ← run at session start
    post-session.md            ← run at session end

  memory/
    decisions.md               ← ADR log, append-only
    signal-log.md              ← sprint learning template
```

---

## Getting started

**1. Create a repo and push**
Clone or fork this repo. Push to your own GitHub account.

**2. Connect your tools**
Configure MCP servers for Linear, Notion and GitHub in Claude Code.

**3. Open in Claude Code**
Claude Code reads `CLAUDE.md` at the root on session start.
The pre-session hook orients it from there.

**4. Run your first idea**
Open Claude Code in the repo root. Describe your idea and the intake agent takes over from there.

---

## Extending Forge

Forge is built to grow. The current agent library covers product and software development. Future domain libraries — legal, research, business cases — can be added as subdirectories without changing anything else.

To add a new agent: create a markdown file in `/product-team/` or `/build-team/` following the conventions in existing agent files. The intake agent discovers it automatically on the next run.

To add a new domain: create a subdirectory (e.g. `/product-team/legal/`) with its own specialist agents. Update the intake agent's orienting question to include the new domain.

---

## Status

Prototype. Being tested against real ideas. Agents, skills and hooks will evolve with usage. `decisions.md` is the record of how and why.
