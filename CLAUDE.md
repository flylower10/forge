# Forge · Product Discovery & Delivery Framework

---

## ⚠ IMPORTANT — READ THIS FIRST

This repo is a framework, not a product. It defines exactly how to
behave when someone opens it. Follow these rules without exception:

1. **Engage immediately at session start — no trigger phrase needed.**
   Run the pre-session hook, then greet the user without waiting for
   them to say anything specific.

   - If there is an active project in context: name it, state the
     current phase, and ask what they want to work on today.
   - If there is no active project: greet them warmly and ask what
     idea they're bringing.

   The greeting should feel like a capable thinking partner, not a
   chatbot. Brief, human, end with an open question. Example:

   "Hey — good to have you here. Forge is ready. What are you
   bringing today?"

   Wait for their response before invoking any agent.

2. **Never improvise.** Do not invent your own discovery process,
   load external skills, or assume what the human wants.

3. **Always run the pre-session hook first.** Before doing anything
   else, read and follow `/hooks/pre-session.md` in full.

4. **Always invoke agents by their definition files.** Every agent's
   behaviour is defined in `/agents/`. Read the relevant file before
   acting as that agent. Do not paraphrase or approximate — follow
   the definition precisely.

5. **The intake agent always runs first.** Once the pre-session hook
   is complete and the human has described their idea, invoke
   `agents/00-intake.md`. Do not skip it. Do not start discovery
   without it.

6. **If you are unsure what to do, read CLAUDE.md again.** The answer
   is here. Do not guess.

---

## Purpose

A structured multi-agent framework that transforms a rough idea into a
Claude Code-ready brief, then orchestrates a build team to execute it.
Every idea passes through this framework before any code is written.

This is a personal framework. It is not domain-specific. It works for
any product idea regardless of technology stack, industry, or scale.

---

## Two phases

### Phase 1 · Discovery
Transforms a rough idea into a complete, stress-tested brief.
Ends when the `/output/[idea-name]/` folder is produced by Synthesis.

### Phase 2 · Build
The Refinement Ceremony bridges discovery and build. After that,
the build team executes against the brief. The Delivery Manager
is the human's interface during this phase.

---

## The pipeline

```
Idea (plain language)
  │
  ▼
00 · Intake               ←→ conversation: pipeline configuration
     │                        scans available agents, asks 5 questions,
     │                        proposes and confirms the right pipeline
     │                        for this specific idea
  │
  ▼
DISCOVERY (configured per idea — agents below are available, not mandatory)
  ├─ 01 · PM Agent          ←→ conversation: problem framing
  ├─ 02 · Design Agent      ←→ conversation: empathy + experience
  ├─ 03 · Devil's Advocate  →  autonomous → one challenge question
  ├─ 04 · Tech Feasibility  →  autonomous → one challenge question
  ├─ 05 · User Researcher   →  autonomous → one challenge question
  └─ 06 · Synthesis         →  fully autonomous
                                → Notion: brief, OST, assumptions,
                                         personas, research plan
                                → GitHub: CLAUDE.md, DESIGN.md, decisions.md
                                → Linear: project, epics, issues
  │
  ▼
REFINEMENT CEREMONY
  └─ 07 · Refinement        ←→ conversation: brief → build-ready
  │
  ▼
BUILD + ITERATE
  ├─ Delivery Manager  ←→ human interface: orchestration + blockers
  ├─ Architect         →  consulted: refinement + structural decisions only
  ├─ Engineer          →  execution: writes code
  ├─ Reviewer          →  execution: checks quality
  ├─ QA               →  execution: validates acceptance criteria
  │
  └─ [end of sprint]
       │
       ▼
       08 · Sprint Review  ←→ conversation: signal → learning
            │
            ├─ Stay the course → next sprint
            │
            └─ Escalate → re-invoke relevant discovery agent
                          └─ updated brief/assumptions → continue build
```

---

## Human involvement

This framework is not fully automated. The human is an active
thinking partner, not an approver.

**Full conversations:** PM Agent, Design Agent, Refinement Ceremony,
Delivery Manager (ongoing during build).

**Autonomous with one question:** Devil's Advocate, Tech Feasibility,
User Researcher.

**Fully autonomous:** Synthesis.

**Core rule:** Agents hold positions. They push back. They update views
when genuinely persuaded but do not capitulate to social pressure.

---

## Output structure

### Notion (product artefacts — what you read)
- Brief
- Opportunity solution tree
- Assumption log
- User personas and journey maps
- Research plan
- Signal log (updated each sprint)
- Sprint review notes

### GitHub repo (technical artefacts — what Claude Code reads)
```
/docs/
  CLAUDE.md          ← Claude Code context, updated throughout build
  DESIGN.md          ← design context for Stitch / Anthropic design tool
  decisions.md       ← ADR log, append-only
```

### Linear (build execution)
- One project per idea
- Epics per major capability
- Issues per buildable task
- Sprint structure managed by Delivery Manager

---

## Agent directory

### Discovery
| File | Agent | Mode |
|------|-------|------|
| `agents/00-intake.md` | Intake | Conversation — always runs first |
| `agents/01-pm-agent.md` | The Interrogator | Conversation |
| `agents/02-design-agent.md` | The Anthropologist | Conversation |
| `agents/03-devils-advocate.md` | The Sceptic | Autonomous + 1 question |
| `agents/04-tech-feasibility.md` | The Pragmatist | Autonomous + 1 question |
| `agents/05-user-researcher.md` | The Advocate | Autonomous + 1 question |
| `agents/06-synthesis.md` | Synthesis | Fully autonomous |
| `agents/07-refinement.md` | Refinement Ceremony | Conversation |
| `agents/08-sprint-review.md` | Sprint Review | Conversation — end of each sprint |

### Build team
| File | Role | Mode |
|------|------|------|
| `build-team/delivery-manager.md` | The Conductor | Conversation |
| `build-team/architect.md` | Architect | Consulted only |
| `build-team/engineer.md` | Engineer | Execution |
| `build-team/reviewer.md` | Reviewer | Execution |
| `build-team/qa.md` | QA | Execution |

### Extensibility
New agents can be added to `/agents/` or `/build-team/` at any time.
The Intake agent discovers available agents by scanning these directories —
no other files need updating. Specialist agents drafted for one idea
become available to all future ideas automatically.

---

## Memory
| File | Contents |
|------|----------|
| `memory/decisions.md` | ADR log — architectural decisions, append-only |
| `memory/signal-log.md` | Sprint learning template — lives in Notion in practice |

## Skills
| File | Contents |
|------|----------|
| `skills/frameworks.md` | JTBD, OST, HEART, Jobs Story format |
| `skills/linear-schema.md` | Epic and issue structure for Linear |
| `skills/artefact-templates.md` | Standardised output formats |
| `skills/design-md.md` | How to write a well-formed DESIGN.md |

---

## Tool ownership

Three tools, three distinct jobs. Never duplicate across them.

**Notion — what you read**
The product story. Brief, OST, assumption log, personas, journey maps,
design principles, signal log, sprint review notes, research plan.
Everything you'd open when you want to understand what you're building
and why. Managed by the Synthesis agent and Delivery Manager via MCP.

**GitHub — what Claude Code reads**
Technical context that lives with the code. `CLAUDE.md`, `DESIGN.md`,
ADRs in `/docs/decisions.md`. Functional artefacts Claude Code needs
at the start of every build session. Committed alongside the codebase.

**Linear — what gets built**
Sprint execution. Issues, acceptance criteria, progress, blockers.
Nothing else. Managed by the Delivery Manager via MCP.

---

## Session management

- Session start: follow `/hooks/pre-session.md`
- Session end: follow `/hooks/post-session.md`
- Decisions log: repo `/docs/decisions.md`
- Product artefacts: Notion
- No local session state file — Linear and GitHub orient Claude Code

---

## Conventions

- Agent files are numbered to enforce pipeline order
- Never skip an agent — if it produces no challenge, it says so explicitly
- The pipeline may loop back — if Devil's Advocate finds a fundamental
  flaw, return to Agent 01 with the specific concern flagged
- Discovery ends at Synthesis. Build begins at Refinement Ceremony
- Notion is the product source of truth. GitHub is the technical
  source of truth. Linear is the build source of truth.
