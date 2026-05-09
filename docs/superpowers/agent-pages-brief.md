# Design Brief — Forge Agent Reference Pages

## What these are

23 reference pages — one per agent in a product framework called Forge. Each page is the definitive reference for a single agent: who it is, what it does, where it fits, and what it must never do.

Readers are product managers, engineers, and designers navigating the framework. They may be looking up a specific agent mid-project, or exploring the framework for the first time.

## What information must appear

**Agent identity**
- Name (e.g. "The Scout")
- Alias/number (e.g. "00 · Intake")
- Mode — how it operates: Conversation / Autonomous / Triggered / Always on
- Phase — where in the lifecycle: Discovery / Refinement / Build / Marketing / Framework

**I/O**
- What it reads before acting (file references, artefacts, other agents' outputs)
- What it produces (file references, artefacts it hands off)

**Pipeline position**
- Where this agent sits in the sequence
- What precedes it and what follows it
- Any agents with lateral, always-on, or consultative relationships

**Hard constraints**
- A short list of things this agent must never do
- Non-negotiable: this content must be immediately visible to any visitor. It cannot be hidden.

**Full instructions**
- Detailed procedures and decision rules
- Reference material — important, but most visitors won't need it on every visit

**Navigation**
- Each agent belongs to a team: `product-team`, `build-team`, or `marketing-team`
- Visitors move between agent pages — they need orientation

## Information hierarchy

1. Agent identity — graspable in 3 seconds
2. I/O summary — what triggers it, what it hands off
3. Pipeline position — where it sits and who it connects to
4. Hard constraints — always visible, authoritative
5. Full instructions — accessible but not dominant

## Tone

Precise and authoritative. These are instructions for AI agents — the design should communicate that each agent has a defined role, clear scope, and a specific place in a larger system. Not playful. Not corporate. Closer to well-designed technical documentation.

## Constraints

- Desktop only
- One page design that works as a template for all 23 agents
- No external fonts or assets

## What done looks like

- [ ] Agent identity is graspable in 3 seconds
- [ ] I/O (reads vs produces) distinction is visually clear
- [ ] Pipeline position is legible at a glance
- [ ] Hard constraints are always visible — not hidden
- [ ] Full instructions are accessible but not competing for attention
- [ ] Navigation orients the visitor within the framework
