# Forge Agent Quality — Design Spec
**Date:** 2026-06-28
**Status:** Approved

---

## Problem

Matt Pocock's skills repo surfaced four improvements worth evaluating for Forge. After evaluation, all four are worth implementing — one rejected in its original form and reshaped into something more appropriate for Forge's architecture. The improvements address real AI agent failure modes: premature completion, vocabulary drift, framework decay, and unreliable auto-invocation.

The implementation follows a meta-skill-first sequence: `writing-great-agents.md` establishes shared vocabulary, then the other three improvements are applied using that vocabulary consistently.

---

## Improvement 1: `skills/writing-great-agents.md`

A reference skill defining the vocabulary and standards for authoring Forge agent files. Lives alongside `intellectual-standards.md`. Consulted when writing a new agent, editing an existing one, or diagnosing unexpected agent behaviour.

This is reference, not steps — it defines terms and failure modes, not a process.

### Vocabulary defined

**Completion criterion** — the checkable condition that ends each phase of an agent's work. Must be binary: either met or not. "The human confirmed the framing is accurate" is a completion criterion. "When you have enough signal" is not. Every agent phase gets one.

**Gate** — the output condition for the whole agent: what it produces before the pipeline advances. Distinct from a completion criterion (which is per-phase). Both are required for every agent.

**Leading word** — a compact pretrained concept that anchors a whole region of behaviour in fewer tokens. Examples already in Forge: *surgical* (Engineer), *gate* (every agent). When a concept takes a paragraph to describe, look for the word that collapses it. Repeated use accumulates a distributed definition.

**Sediment** — stale instructions that survive because adding felt safe. Test: does removing this line change behaviour? If not, delete it. Every agent file accumulates sediment. The Observer owns the periodic check.

**No-op** — a line the model follows by default without instruction. Paying context to say nothing. The fix is a stronger word, not a different technique.

**Trigger** — the auto-fire condition for agents that should invoke without explicit human request. Encoded in agent frontmatter. Agents without a `triggers` field require explicit invocation.

**What you never do** — the failure modes an agent must actively resist. Standard section across all agent files. Named in constraints frontmatter and repeated in the body.

### Failure modes

**Premature completion** — ending a phase before it is genuinely done. Defence: sharpen the completion criterion. A vague criterion invites premature completion; a checkable one prevents it.

**Sediment** — stale layers that settle because adding feels safe. Cure: periodic pruning against the no-op test. The Observer surfaces this.

**No-op inflation** — instructions the model already follows cluttering the file and consuming context. Test each line: does it change behaviour versus the default?

**Vague gates** — gates stated as aspirations rather than checkable conditions. "When you have enough signal" is not a gate. "Human has confirmed the playback without substantive correction" is.

### Pruning discipline

Every agent file should be reviewed periodically for sediment, no-ops, and vague gates. The Observer is the natural owner of this check — it critiques process, and agent file quality is a process concern.

---

## Improvement 2: Completion criteria in existing agent files

The Engineer already has the strongest completion criterion in Forge: "done when the acceptance criterion is met — not before, not after." All other agents are brought up to this standard.

### Format

Single-condition phases:
```
**Done when:** The human has confirmed the framing playback without substantive correction.
```

Multi-part conditions:
```
**Done when:**
- [ ] Human has confirmed the framing playback
- [ ] All six discovery areas have specific (not aspirational) content
- [ ] Evidence is explicitly categorised as known vs assumed
```

### Changes per agent

**PM Agent (01)**
- Conversation done when: human confirms the framing playback without substantive correction
- Output done when: all six sections populated; evidence explicitly split into known vs assumed

**Synthesis (06)**
- Done when: all required output files written to `output/[idea-name]/`; every `[OPEN QUESTION]` flag from the running brief surfaced in the final brief (not resolved — surfaced)

**Refinement Ceremony (07)**
- Conversation done when: every item surfaced has been resolved in conversation or explicitly deferred with a written note
- Output done when: updated CLAUDE.md committed; build kickoff note written with a specific and unambiguous first task

**Devil's Advocate (03), Tech Feasibility (04), User Researcher (05)**
- Done when: the challenge question tests one specific assumption (not a general area); the assumption log entry is written

**Engineer** — unchanged. Already the model.

**Design Agent (02)** — to be assessed during implementation; the gate conversation pattern is similar to PM Agent and likely needs equivalent treatment.

---

## Improvement 3: `context.md` — optional domain glossary per idea

A pure domain glossary produced by Synthesis when an idea has non-trivial domain vocabulary. Not a spec, not architecture decisions — terms only.

### Decision rule

Synthesis produces `context.md` when the brief uses 3 or more terms that require domain knowledge to interpret correctly. Synthesis makes this call — the brief makes it obvious. If in doubt, produce it.

### Format

```
# Context: [Idea name]
Domain glossary — pure definitions, no implementation details.

## [Term]
[Canonical definition in one sentence]
_Avoid:_ [alternative phrasings to reject]

## Relationships
- [Term A] contains many [Term B]s
- [Term A] and [Term B] are distinct — [why the distinction matters]
```

### Output destinations

- `output/[idea-name]/context.md` — local artefact alongside the brief
- `docs/context.md` in the product repo — pushed during Synthesis' GitHub commit, alongside `docs/CLAUDE.md`

### Who reads it

- **Synthesis** — creates it
- **Refinement Ceremony** — reads and may refine terms when technical definitions sharpen during the bridge phase
- **Delivery Manager** — uses domain vocabulary when writing acceptance criteria
- **Engineer and Reviewer** — check for it at session start; terms in code, completion notes, and review comments should match

### Who maintains it

- **Synthesis** creates it
- **Delivery Manager** may append new terms mid-build when the codebase surfaces vocabulary the glossary didn't anticipate
- Append-only — never rewritten

### Constraint

`context.md` is a glossary, not a spec. If an entry explains *how* something works rather than *what it is called*, it belongs in the brief or decisions log. The Observer flags violations.

---

## Improvement 4: Triggers in frontmatter

Three Forge agents should fire without explicit human invocation: Observer, Feedback Triage, Research Agent. Their trigger conditions are currently in CLAUDE.md prose, making them easy to forget and impossible to discover from the agent file itself.

### Solution

A `triggers` field in agent frontmatter. Absence = explicit invocation required. Presence = fires when the condition is met.

### Agents that get triggers

A `triggers` array is added to each agent's existing `---json` frontmatter block:

```json
{ "triggers": ["after-handoff", "on-demand"] }      // Observer
{ "triggers": ["on-product-criticism"] }             // Feedback Triage
{ "triggers": ["on-factual-gap"] }                   // Research Agent
```

All other agents have no `triggers` field.

### Change to CLAUDE.md

Replace scattered per-agent invocation rules with one generalised rule:

> Any agent with a `triggers` field in its frontmatter fires automatically when its trigger condition is met — no explicit human invocation required.

Trigger definitions move from CLAUDE.md into the agent files. CLAUDE.md enforces the pattern, not the per-agent logic.

### Constraint

Never add a `triggers` field to agents that open a full conversation or require deliberate pipeline sequencing — The Interrogator, Synthesis, Refinement. Triggers are for lightweight automatic guardrails.

### Limitation

This is documentation, not enforcement. The model still has to act on the trigger. The value is co-location: trigger conditions live with the agent definition, so changes happen in one place and don't drift from the behaviour they're meant to enforce.

---

## Implementation sequence

Following the meta-skill-first approach:

1. Write `skills/writing-great-agents.md` — establishes vocabulary for everything that follows
2. Add completion criteria to agent files using the format and vocabulary from (1)
3. Add `context.md` production logic to Synthesis; update build-team agents to reference it
4. Add `triggers` frontmatter to Observer, Feedback Triage, Research Agent; update CLAUDE.md invocation rule

---

## Out of scope

- Applying the full writing-great-agents.md review to every existing agent file (that is an Observer-led pruning task, not part of this implementation)
- A `context.html` presentation layer (low value — the glossary is short, the audience is agents not humans)
- Technical enforcement of trigger conditions (no mechanism exists; this is a documentation improvement only)
- Design Agent (02) completion criteria — flagged for assessment during implementation rather than pre-specified here
