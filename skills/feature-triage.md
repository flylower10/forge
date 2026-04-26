# Skill · Feature Triage

**Invoked by:** The Delivery Manager (during build phase)
**When:** A feature request, enhancement, or scope addition arrives mid-project — outside of a formal discovery or refinement session

---

## Purpose

Not every new idea needs full discovery. Not every new idea can skip it.
This skill classifies incoming feature requests and routes them to the
right process — so XS tasks reach the build queue in minutes and XL
tasks don't get built on unexamined assumptions.

The output is a triage note. The Delivery Manager produces it, presents
it to the human, and waits for confirmation before routing.

---

## Step 1: Classify

Answer these four questions in order. Stop at the first question that
determines the size.

**Q1: Can acceptance criteria be written right now — completely, without
asking anyone?**
The what, the how, the edge cases, and the definition of done are all
clear from the request itself.

→ Yes → proceed to Q2
→ No → go to Q3

**Q2: Does the feature involve any of the following?**
- A new or materially changed user-facing screen or interaction
- A change to the data model, entitlement logic, or API contract
- A new third-party integration or external dependency

→ None of the above: **XS** — stop here
→ One of the above, scope is clear: **S** — stop here
→ More than one: **M** — stop here

**Q3: How many things are genuinely unknown?**
Count only real unknowns — things where reasonable people could
disagree or where you cannot write the AC without first resolving
the question.

→ 1–3 unknowns: **M**
→ 4+ unknowns, significant new capability: **L**
→ Challenges or invalidates a core product assumption: **XL**

---

## Step 2: Route

| Size | Route |
|------|-------|
| **XS** | DM writes AC → creates Linear issue → enters build queue |
| **S** | DM writes AC → creates Linear issue → enters build queue |
| **M** | Identify targeted agents (Step 3) → run them → DM writes AC → creates Linear issue → enters build queue |
| **L** | DM selects 2–4 agents for mini-discovery → agents run → DM writes AC → Linear issue → human approves before build queue |
| **XL** | Present to human as a discovery-level question → human decides whether to re-enter via The Scout |

For XS and S: the Delivery Manager creates the Linear issue immediately.
No human approval needed before the issue is created — but the DM
presents the triage note before routing to the Engineer.

For M and above: present the triage note and wait for human confirmation
before running agents or creating issues.

---

## Step 3: Agent mapping (M and L only)

Select only agents whose question is genuinely open. Do not run an
agent if their question is already answered by the request.

| Open question | Agent to consult |
|---------------|-----------------|
| New or changed UI screen or interaction | The Blueprint (`product-team/ux-agent.md`) |
| Pricing, entitlement, or access model | The Merchant (`marketing-team/monetisation-agent.md`) |
| Data model, architecture, or new dependency | The Pragmatist (`product-team/04-tech-feasibility.md`) |
| User experience arc or user behaviour | The Narrator (`product-team/02-design-agent.md`) |
| Product assumption being challenged | The Sceptic (`product-team/03-devils-advocate.md`) |

When invoking a targeted agent for M/L triage, give them a specific
question — not an open brief. Example: "Does adding X require a schema
change, and if so, what?" — not "review this feature request."

The agent produces a short focused output (not a full discovery output)
and hands back to the Delivery Manager. The DM writes the AC from
that output.

---

## Step 4: Output format

Produce a triage note before any action is taken:

```
Feature triage: [feature name]
Date: [date]

Classification: [XS / S / M / L / XL]
Reason: [one sentence — why this size]

Agents to consult: [list with specific question for each, or "None"]

Acceptance criteria (draft):
- [ ] [criterion]
- [ ] [criterion]
- [ ] [criterion]

Recommendation: [route — build queue immediately / run agents first / full discovery]
Waiting for: [human confirmation / agent outputs / nothing]
```

For XS/S: include the full AC in the triage note. Create the Linear
issue as part of presenting the note — do not wait.

For M+: AC draft may be incomplete. State what is missing and which
agent will close the gap.

---

## What this skill never does

- Route a feature request directly to the Engineer without a triage note
- Classify a request as XS/S to avoid process when real unknowns exist
- Run more agents than the unknowns justify
- Write acceptance criteria that contain open questions
- Approve its own routing — the human confirms before agents run (M+)
  or before the Engineer starts (XS/S)
