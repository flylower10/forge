# Skills · Research Protocol

A standard approach for any agent that needs current knowledge before
forming a view or producing an output. Follow this whenever your task
requires understanding the current state of a domain you may not have
up-to-date information on.

---

## The core problem this solves

Static knowledge files go stale. Curated source lists create derivative
outputs — the agent becomes a remix of whatever it was pointed at.
The human may not be the expert, so manual curation is unreliable.

The solution: **stable principles live in files, volatile knowledge is
fetched fresh at invocation.**

---

## When to invoke this protocol

Use this protocol before forming a view on any of the following:
- Current best practice in a domain (design, engineering, product, quant)
- Whether a technology, approach, or tool is still the right choice
- What competitors or comparable products are doing
- What the current state of a market, method, or field looks like

Do not use this protocol for:
- Questions answerable from the project brief or CLAUDE.md
- Decisions grounded in timeless principles already documented in skills files
- Technical implementation details resolvable by reading the codebase

---

## The protocol

### Step 1 — State what you need to know

Before searching, write one sentence: what specific question am I
trying to answer? Unfocused research produces unfocused outputs.

Example: "What are the current best approaches for calibrating a
Poisson goal model for football prediction?"

Not: "What is the state of football analytics?"

### Step 2 — Search across source types

Search for at least three distinct source types. Do not over-weight
any single source or publication. Source types to draw from:

- **Academic / research** — papers, preprints, published studies
- **Practitioner / industry** — blog posts, conference talks, case studies
  from people actively doing the work
- **Community** — forums, discussions, open disagreements
  (Stack Overflow, Reddit, Hacker News, specialist communities)
- **Contrarian** — explicitly search for critiques of the dominant view.
  Search for "problems with [X]", "why [X] fails", "[X] criticism".

### Step 3 — Seek the contrarian view

Before forming a conclusion, explicitly search for the strongest
argument against the direction you are leaning. This is not optional.

If all sources agree, that is worth noting — but it is also a signal
to look harder for dissent. Consensus in a fast-moving field often
means the contrarian view hasn't been published yet, not that it
doesn't exist.

### Step 4 — Synthesise, do not aggregate

Do not produce a list of links. Produce a synthesis: what the field
currently believes, where the genuine disagreements are, and what
the implications are for this specific project.

Flag explicitly when sources conflict. Do not smooth over disagreement —
it is often the most useful information.

### Step 5 — State your confidence level

After synthesising, state how confident you are in the view you've
formed and why. If the field is moving fast, say so. If your search
was limited by what is publicly available, say so.

Format:
```
Confidence: [high / medium / low]
Reason: [one sentence — what would change this view]
```

---

## Anti-over-indexing rules

These are structural guards against derivative outputs:

1. **No single source dominates.** If one source is providing more
   than half of your synthesis, search for alternatives before
   proceeding.

2. **Name your sources by type, not by brand.** "Three practitioners
   and one academic" is more useful than "I read Linear's blog."

3. **Separate the timeless from the current.** Tufte's data-ink
   principle is timeless. What's trending on Dribbble this week is
   not. Weight them accordingly.

4. **Principles beat examples.** An example shows one solution.
   A principle generates many. Prefer to extract principles from
   examples rather than referencing the example directly.

---

## What to produce

A brief research note before your main output:

```
## Research note — [topic]

Question: [the specific question you set out to answer]

Sources consulted:
- [type]: [what you found]
- [type]: [what you found]
- [contrarian]: [what the strongest counter-argument is]

Current consensus: [one to two sentences]

Key disagreement: [where the field genuinely conflicts, if anywhere]

Implication for this project: [one sentence — how this changes or
confirms your approach]

Confidence: [high / medium / low] — [reason]
```

This note does not need to be long. It needs to be honest.

---

## Updating skills files

If your research reveals that a principle or reference in a skills
file is outdated or wrong, flag it explicitly:

```
Skills file update needed: [file name]
What has changed: [one sentence]
Suggested update: [draft new text or note to update manually]
```

Do not silently use a different approach from what the skills file
says. Either follow the file or flag that it needs updating.
