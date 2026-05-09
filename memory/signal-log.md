# Signal Log: [idea name]

**Template.** Copy to `output/[idea-name]/signal-log.md` for each idea.

A living record of what has been learned from shipped work.
Owned by the Delivery Manager. Triggered on demand or by the
Re-entry ceremony's fortnightly floor check — never per-burst.

This is not a status report. It is an evidence base.
Observations, surprises, user behaviour, metric movements —
anything that tells you whether your assumptions were right.

Feeds future discovery conversations: when an assumption is
invalidated by signal, the relevant discovery agent is re-invoked
with the entry attached.

---

## How to read this

Each entry has four sections:
- **What we shipped** — what actually went out (Delivery Manager can
  fill from Linear / git)
- **What we expected** — what you believed would happen (the
  assumption being tested)
- **What we observed** — what actually happened (signal, not spin —
  sourced from the channels named in the brief's "How we'll know
  it's working" section)
- **What it means** — honest interpretation, open questions it raises

Entries are appended chronologically. Never edited retroactively —
if an interpretation changes, add a note in the next entry.

---

## Entries

---

### Entry [number] · [date]

#### What we shipped
[List of features or changes released since last entry — link to
Linear issues or commit refs]

#### What we expected
[What you believed users would do, what metrics you expected to move,
what assumptions you were implicitly testing]

#### What we observed
**Quantitative**
- [Metric]: [value] — [vs expectation: above / below / as expected]
- [Metric]: [value] — [vs expectation]

**Qualitative**
- [Observation from user feedback, support, direct conversations]
- [Unexpected behaviour noticed]
- [Things users did that weren't anticipated]

If nothing has been observed yet, say so explicitly. Do not
fabricate signal to fill the section.

#### What it means
[Honest interpretation — what this entry's signal tells you
about your assumptions, your user, or your opportunity map]

**Assumptions affected:**
- [Assumption from log] — [strengthened / weakened / unchanged]

**Open questions raised:**
- [New question this signal has surfaced]

**Recommendation:**
[One of: Stay the course / Adjust scope / Re-examine assumption /
Consult PM Agent / Consult Design Agent / Append to ost-decisions
and re-invoke discovery]

---

[Subsequent entries appended below]
