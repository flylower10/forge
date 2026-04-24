# Skill · Handoff Protocol

Every agent in the pipeline follows this protocol. It exists in one
place so changing it changes it everywhere.

---

## Purpose

Agents should not start from scratch. The running brief is the shared
memory of the pipeline — what has been established, what is open,
what has been flagged for specific agents. Without it, each agent
re-covers ground, context is lost between sessions, and concerns
raised in one agent evaporate before the next agent can act on them.

---

## The running brief

A single document that grows as the pipeline runs:

```
output/[idea-name]/running-brief.md
```

Intake creates it. Every subsequent agent reads it first and appends
to it at the end. Synthesis reads it as a primary input. The human
can read it at any time to see the current state of the pipeline.

---

## Structure

```markdown
# Running brief: [idea-name]
Date started: [date]

---

## Pipeline configuration
[Copied from Intake output — which agents, in what order, dependency map, and why]

---

## What's been established
[Each agent appends a section here — see handoff format below]

---

## Open concerns
[Flags raised by agents for downstream review.
Format: [AGENT TAG] Description of concern
Example: [TECH FEASIBILITY] No clean API for sourcing expected squads — fallback needed
Example: [PM REVIEW] User journey reveals a second user type not in original framing
Example: [RESEARCH] Competitive pricing data not available — The Researcher to fill before The Merchant runs]

---

## Research log
[Findings from The Researcher, appended chronologically. Any agent may add a
[RESEARCH REQUEST] mid-conversation; The Researcher fills the finding here.]

---

## Handoff log
[One entry per agent — appended in order]
```

---

## Handoff format

Each agent appends this block to the running brief when it completes:

```markdown
### [Agent name] · [date]

**Established:**
- [Key output 1]
- [Key output 2]
- [Key output 3 — aim for 2–4 bullets, not a summary of the full output]

**Concerns flagged:**
- [TECH FEASIBILITY] [description] — or "None"
- [PM REVIEW] [description]
- [OPEN QUESTION] [description]

**Passing forward:**
[One sentence: what the next agent most needs to know from this output]
```

---

## Concern tags

Use these tags precisely. Downstream agents check for their tag
in the open concerns section and address any flags before proceeding.

| Tag | Who acts on it |
|-----|---------------|
| `[TECH FEASIBILITY]` | Agent 04 · The Pragmatist |
| `[PM REVIEW]` | Agent 01 · The Interrogator |
| `[DESIGN REVIEW]` | Agent 02 · The Narrator |
| `[USER RESEARCH]` | Agent 05 · The Advocate |
| `[RESEARCH]` | The Researcher — fills immediately when invoked, or queued for async fill |
| `[OPEN QUESTION]` | Human — surfaces in Synthesis for resolution |
| `[REFINEMENT]` | Agent 07 · Refinement Ceremony |

---

## What each agent does

**At the start:** Read the running brief. Note what has been
established. Check the open concerns section for flags addressed
to this agent. Check the research log for findings relevant to
your work. Do not re-cover settled ground.

**Mid-session:** If you encounter a factual gap that would materially
change your output, do not defer it. Invoke The Researcher immediately:

```
[RESEARCH REQUEST]
Question: [precise question]
Context: [what it feeds into and why it matters now]
Depth: Surface / Deep
```

The Researcher returns findings before you continue. If research
is blocked, flag it as `[RESEARCH]` in open concerns and proceed.

**At the end:** Append your handoff block. If you have raised
concerns that belong to another agent, flag them with the correct
tag in the open concerns section. Then invoke The Observer
(`product-team/observer.md`) — read its definition and deliver
its note to the human before the next agent begins.

---

## When there is no running brief

If the running brief does not exist — this is the first agent running,
or Intake skipped the step — create the file at
`output/[idea-name]/running-brief.md` with the structure above,
filling in what you know, and proceed.

---

## What the running brief is not

- It is not a substitute for the full agent outputs. Those remain
  the authoritative record. The brief is a navigation layer.
- It is not a Notion page or a GitHub file. It lives locally during
  the pipeline run. Synthesis decides what gets pushed where.
- It is not a changelog. Do not log every minor decision — only
  what a downstream agent needs to know.
