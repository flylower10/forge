# Grill-Me Skill — Design Spec
**Date:** 2026-06-09
**Status:** Approved

---

## Summary

A cross-cutting skill for stress-testing plans through sequential, codebase-aware questioning with recommended answers. Invokable by any Forge agent when holding a plan, approach, or implementation decision before execution.

---

## Problem

Forge has strong stress-testing for ideas and assumptions (PM Agent, Devil's Advocate) and for ambiguities before build (Refinement Ceremony). But once a plan is in hand — a burst plan, an implementation approach, a complex task — there is no structured protocol for working through it before execution. Agents proceed on assumptions or ask ad-hoc questions without a systematic decision-tree approach.

---

## What grill-me does

Provides a structured questioning protocol that:
1. Reads the plan fully before asking anything
2. Checks the codebase for questions it can answer itself
3. Builds an ordered decision tree (upstream dependencies resolved first)
4. Works through questions one at a time, each with a recommended answer and reasoning
5. Produces a decision log

---

## Scope and constraints

**This skill is for:** stress-testing a plan before execution — "given we are building this, is the plan sound?"

**This skill is not:**
- A discovery tool (doesn't question the problem or user framing — that's PM Agent + Sceptic)
- A scope tool (doesn't challenge whether to build — that's feature-triage)
- A review tool (doesn't evaluate completed work — that's Reviewer/QA)

---

## Integration points

| File | Change |
|------|--------|
| `skills/grill-me.md` | Create — the protocol |
| `build-team/delivery-manager.md` | Add: burst kickoff gate, complex task gate, burst-start planning gate |
| `product-team/07-refinement.md` | Add: invoke on build sequence before handoff |

---

## Primary invokers

- **Delivery Manager** — burst kickoff, complex tasks, burst-start planning (after re-entry orientation)
- **Refinement Ceremony** — build sequence before handoff
- **Engineer** — implementation fork mid-task (self-invoke)
- **Architect** — architectural decision review

Not a hard gate. The invoking agent decides whether it applies.

---

## Skill structure

### Process

1. **Read the full plan** — understand the shape before asking anything
2. **Check the codebase** — any question answerable by reading files is answered there, not asked to the human
3. **Build a decision tree** — identify all open questions, ordered by dependency (upstream decisions first)
4. **Work sequentially** — one question at a time. For each:
   - State the question clearly
   - Offer a recommended answer with brief reasoning and the assumption it rests on
   - Wait for confirmation, correction, or elaboration
   - Resolve before moving on
5. **Produce a decision log**

### Recommended answer format

Each question includes:
- The recommendation (one clear answer)
- One sentence of reasoning
- The assumption the recommendation rests on

This lets the human accept quickly ("yes, that") or correct with minimal friction. It is the key differentiator from existing Forge agents, which question without suggesting.

### Output format

```
## Grill-me: [plan name / task title]
**Invoked by:** [agent]
**Context:** pre-build | mid-burst | implementation fork

### Decisions
1. [Question] → [Decision made] _(recommended | corrected | human-directed)_
2. ...

### Unresolved
- [Anything that couldn't be resolved — flagged for human escalation]

### Plan notes
[Short summary of how the plan changes in light of the decisions — optional]
```

The `(recommended | corrected | human-directed)` tag on each decision records whether the human took the recommended path, overrode it, or drove the answer themselves. Useful signal for the invoking agent and for future bursts.

---

## Files to create / update

### `skills/grill-me.md` (create)
Full protocol as described above. Includes: when to invoke, the five-step process, recommended answer format, output format.

### `build-team/delivery-manager.md` (update)
Add a **Grill-me gate** section under Build Kickoff:

> Before proposing the build sequence, invoke `skills/grill-me.md` on the burst plan. Work through any open questions before handing to the Engineer.

Add to the complex task section:

> For any task the DM judges too ambiguous to execute directly, invoke `skills/grill-me.md` before assigning to the Engineer.

### `product-team/07-refinement.md` (update)
Add to the Output section:

> Before handing off to the build team, invoke `skills/grill-me.md` on the proposed build sequence. Resolve any open questions and include the decision log in the build kickoff note.

### `build-team/delivery-manager.md` — burst-start (update)
Add after the re-entry orientation section:

> After presenting the re-entry orientation and getting a green light from the human, if the proposed next tasks have open questions or unresolved dependencies, invoke `skills/grill-me.md` before assigning to the Engineer. The Re-entry ceremony stays lightweight; grill-me runs in the DM's planning step that follows it.
