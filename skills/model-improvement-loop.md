# Skill · Model Improvement Loop

Used during the Development phase to iteratively improve an analytical model.
Referenced by The Calibrator and the Delivery Manager when model work is in progress.

---

## When to invoke

- After The Calibrator has produced a ranked improvements list
- When a model parameter change is being considered
- After new data becomes available (mid-tournament results, updated squad values)
- When market disagreement with model output suggests a systematic error

---

## The loop

Each iteration is one hypothesis. Run the full loop before starting the next.

### 1. Hypothesis
State precisely what you expect to improve and why.

Format:
> "Enabling [specific change] should improve [metric] by approximately [amount]
> because [reasoning grounded in the model's known behaviour]."

Vague hypotheses produce uninterpretable results. If you cannot state the
expected direction and rough magnitude of improvement, the hypothesis is
not ready.

### 2. Implement
Engineer makes the change. **One change per iteration — never bundle multiple
hypotheses.** Bundled changes make it impossible to know which change drove
the result.

### 3. Backtest
Run the backtest suite with and without the change. Record all three metrics:
- Brier score (group-stage)
- Brier score (match-level)
- RPS (Ranked Probability Score)

Run across all available validation datasets:
- WC2022 (primary)
- Euro 2024 (secondary — if data available)
- Copa America 2024 (secondary — if data available)

### 4. Measure
Did the metrics improve? In what direction and by how much?
Was the improvement consistent across validation datasets, or only on one?
Consistency across datasets is evidence of genuine signal. Single-dataset
improvement may be overfitting.

### 5. Decide

| Result | Action |
|--------|--------|
| Consistent improvement | Merge. Update `config.py` comment with metrics before and after. |
| No improvement | Revert. Document in `config.py` that this was tried and failed — this is as valuable as a positive result. |
| Improvement on one dataset only | Flag for The Calibrator before deciding. Do not merge without review. |
| Improvement on primary metric, regression on another | Flag for The Calibrator. Trade-offs need explicit human sign-off. |

### 6. Calibrator review
After every 3–5 completed iterations, invoke The Calibrator to:
- Review the accumulated changes and their documented evidence
- Update the ranked improvements list — priorities shift as the model changes
- Identify any emergent interactions between changes
- Assess whether the validation dataset is becoming saturated

---

## Rules

1. **One hypothesis per iteration.** No exceptions.
2. **Never skip the backtest.** Intuition about model improvements is unreliable.
3. **Document all results** — positive and negative — in `config.py`. A failed experiment is not wasted; an undocumented experiment is.
4. **Baseline is sacred.** Before any iteration, confirm the baseline metrics. Do not compare against memory.
5. **The Calibrator reviews periodically, not at every iteration.** Frequent reviews slow the loop without proportionate benefit. Every 3–5 iterations is the right cadence unless a result is ambiguous.
6. **Human and PM Agent must sign off before any parameter change that affects live output.** Model changes are not engineering decisions — they are product decisions.

---

## Documentation format

Each completed iteration should produce a one-line entry in `config.py`:

```python
# [Parameter] — [date]
# Hypothesis: [one sentence]
# Result: [Brier before] → [Brier after], RPS [before] → [after]
# Decision: Kept / Reverted / Pending Calibrator review
```

---

## What this loop is not

- A substitute for The Calibrator's structural review — the loop refines
  parameters within the current architecture. Architectural changes (e.g.
  replacing Poisson with a different distribution) are a Calibrator decision,
  not a loop iteration.
- A research process — the loop is not for exploring whether an approach
  is theoretically interesting. It is for answering "does this specific
  change improve measured output quality?"
