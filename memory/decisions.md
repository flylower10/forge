# Architecture Decision Records

A log of every significant decision made across all projects
in this framework. Each entry is an ADR — a record of what was
decided, why, and what it means going forward.

New ADRs are added by the Architect or Delivery Manager using
the format below. They are never deleted — if a decision is
reversed, a new ADR is written to record the reversal and why.

---

## ADR format

```
# ADR [number]: [Decision title]

**Date:** [date]
**Project:** [idea name]
**Status:** Decided / Superseded by ADR [number]

## Context
[What situation required a decision — 2–4 sentences]

## Decision
[What was decided, in one clear sentence]

## Rationale
[Why this option over the alternatives — be specific]

## Alternatives considered
[What else was considered and why it was not chosen]

## Consequences
[What this decision enables, and what it constrains going forward]
```

---

## Decision log

# ADR 001: Absorb brainstorming capability into PM Agent natively

**Date:** 2026-04-18
**Project:** Forge (framework)
**Status:** Decided

## Context
The structured discovery conversation that Forge relies on is currently provided by the external `superpowers:brainstorming` skill. A user who does not have that skill installed receives no structured exploration — Claude either improvises inconsistently or skips discovery entirely. This creates a dependency on an external plugin for a core framework capability.

## Decision
Absorb the brainstorming conversation flow natively into `product-team/01-pm-agent.md` so the framework is self-contained and works without the superpowers plugin.

## Rationale
The PM Agent is already responsible for problem framing and structured discovery. Building the brainstorming flow into it directly makes the framework robust and self-contained. Users should not need to install external plugins to get the core discovery experience.

## Alternatives considered
- **Document the dependency**: Adds a note to CLAUDE.md listing the skill as required. Fragile — still breaks if the skill is unavailable.
- **Detect and degrade gracefully**: PM Agent checks for the skill and falls back to its own flow. Adds complexity and still means maintaining two places where brainstorming logic lives.

## Consequences
- PM Agent becomes the single source of truth for structured discovery conversation
- Framework works out of the box without superpowers plugin
- If the brainstorming skill evolves, changes must be manually reflected in the PM Agent — no automatic inheritance
