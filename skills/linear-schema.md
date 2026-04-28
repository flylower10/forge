# Skills · Linear Schema

How to structure work in Linear. Used by the Delivery Manager
and Synthesis agent when pushing artefacts.

---

## Structure

```
Project (the idea / product)
  └── Epic (a major capability or theme)
        └── Issue (a specific, buildable task)
              └── Sub-issue (if a task is too large — break it down)
```

---

## Project

One project per idea. Named after the idea (title case).
Description: one paragraph from `brief.md` — the problem and
the user, not the solution.

---

## Epic format

Epics map to major capabilities or user outcomes. Not technical
layers (don't create a "Backend" epic and a "Frontend" epic).

**Title format:** Verb phrase describing the user outcome
Examples:
- "User can create and save a project"
- "User receives useful notifications"
- "Admin can manage team members"

**Description:** 2–3 sentences on what this epic delivers for
the user and why it matters. Link to the relevant section of `brief.md`.

---

## Issue format

Issues are specific, buildable tasks. A good issue can be completed
by the Engineer in a single focused session.

**Title format:** "[Component/area] — [what it does]"
Examples:
- "Auth — email and password sign-in"
- "Dashboard — display last 5 projects"
- "API — POST /projects endpoint"

**Description template:**
```
## What
[One sentence: what needs to be built]

## Why
[One sentence: which user outcome this serves]

## Acceptance criteria
- [ ] [specific, testable criterion]
- [ ] [specific, testable criterion]
- [ ] [specific, testable criterion]

## Notes
[Anything the Engineer needs to know — relevant conventions,
edge cases to consider, related issues]
```

**Labels:** Use consistently
- `discovery` — from discovery pipeline
- `build` — active build task
- `blocked` — waiting on a decision or dependency
- `in-review` — with Reviewer
- `in-qa` — with QA
- `done` — complete

---

## Spike issue type

When a mechanism is not yet understood well enough to write
acceptance criteria, create a Spike — a time-boxed investigation
that produces a concrete finding, not an open-ended exploration.

**Title format:** "Spike — [what question needs answering]"
Examples:
- "Spike — how does the duplicate check work at the DB layer?"
- "Spike — what does the third-party API return for edge case X?"

**Description template:**
```
## Question
[The specific unknown that is blocking progress]

## Why it's blocking
[Which downstream tasks cannot be sequenced until this is resolved]

## Time box
[Maximum time to spend — default: 2 hours. Longer than 4 hours
 means the question needs decomposing.]

## Definition of done
[What a successful spike produces — not "we understand it better",
 but a concrete output: a decision, a code sample, a confirmed constraint]

## Finding
[Completed after the spike — what was learned, and what is now decided]
```

**Label:** `spike`

Spikes resolve to one of:
- A finding that unblocks downstream tasks (write it in the Finding field)
- A decision to descope the mechanism (flag to Delivery Manager)
- A signal that the question needs discovery-level work (escalate to the brief)

A spike that produces "we need more investigation" is not done.

---

## Acceptance criteria rules

Good acceptance criteria are:
- Specific and testable — "works correctly" is not testable
- Written from the user's perspective where possible
- Binary — either met or not met, no partial credit

Bad: "The login page should work"
Good:
- [ ] User can enter email and password and submit the form
- [ ] Submitting with correct credentials redirects to the dashboard
- [ ] Submitting with incorrect credentials shows an error message
- [ ] Error message does not reveal whether the email or password was wrong
