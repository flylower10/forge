# Skill · Prioritisation

**Invoke when:** there is a genuine opportunity cost decision — building X
in this window means not building Y. Do not invoke for routine sequencing
where dependencies make the order obvious.

---

## Framework: WSJF (Weighted Shortest Job First)

WSJF captures cost of delay relative to effort. It is lightweight enough
for personal projects and rigorous enough for genuine trade-off decisions.

```
WSJF = Cost of Delay / Job Size

Cost of Delay = User/Business Value + Time Criticality + Risk Reduction
```

Score each dimension 1–5:

| Dimension | 1 | 3 | 5 |
|---|---|---|---|
| **User/Business Value** | Nice to have | Important | Directly enables north star |
| **Time Criticality** | No deadline | Soft deadline | Hard deadline (revenue, launch) |
| **Risk Reduction** | No risk addressed | Reduces known risk | Eliminates blocking risk |
| **Job Size** | XS (hours) | M (days) | L (weeks) |

Divide Cost of Delay by Job Size. Highest score = highest priority.

---

## When to use a lighter touch

For projects with a single primary user and a hard external deadline
(tournament start, release date), a simpler heuristic often suffices:

1. What fails silently if this isn't done before the deadline?
2. What becomes worthless after the deadline passes?
3. What serves the north star directly vs supporting metrics?

Use WSJF when these questions don't produce a clear answer.

---

## Output format

Present results as a table with scores and a brief rationale per item.
Then state the recommended order clearly.

```
| Issue | Value | Time | Risk | CoD | Size | WSJF | Notes |
|-------|-------|------|------|-----|------|------|-------|
| FLY-X | 5 | 4 | 3 | 12 | 2 | 6.0 | ... |
```

---

## Surface in Linear

Prioritisation decisions are not CLI output — they are product decisions
with an audit trail. After running this framework:

1. Post the scored table as a comment on the relevant epic in Linear
2. Note the decision and rationale
3. Tag it for human sign-off before the Delivery Manager proceeds

The decision is not confirmed until the human approves it in Linear.
