# FLY-72 · Proving: Full-density storage

**Question:** Should passage content be stored inline in state.json (simpler, grows the file) or as a reference to source (requires source availability, smaller file)?

**Status:** DECIDED — inline storage
**Date:** 2026-08-01
**Time spent:** within 2h box

---

## Method

A representative fixture was built for one realistic Forge session:
- 30 blocks (all 7 content kinds + untyped, plus 4 agents, 3 concerns)
- fullContent averaged 413 bytes/block (ranging from ~150 to ~600 bytes)
- digest averaged 95 bytes/block

Two versions measured: with fullContent inline vs. digest-only (no fullContent).

Fixtures: `fly-72-fixture-inline.json` and `fly-72-fixture-digest.json`

---

## Measurements

| Sessions | Inline (with fullContent) | Digest-only |
|---|---|---|
| 1 | 24.4 KB | 11.3 KB |
| 5 | 122 KB | 56 KB |
| 10 | 244 KB | 113 KB |
| 20 | 488 KB | 226 KB |
| 30 | 732 KB | 338 KB |

Assumption: 30 blocks per session. Real sessions will vary — short sessions may have 10–15 blocks; long, parallel-wave sessions may have 40–50. The 30-block model represents a typical mid-complexity session.

---

## Analysis

**The numbers are not a problem.** 732 KB at 30 sessions (roughly 6 weeks of daily use) is well within browser JSON.parse capability. At >100 MB/s parse throughput, 732 KB takes approximately 7ms — less than 1% of the 1s poll interval. This is imperceptible.

**Reference storage introduces complexity with no practical benefit at this scale.** The "source" for a reference approach would be the conversation transcript, which is not a stable or accessible reference target from the shell — it would require either a running process (violating the no-backend constraint) or a secondary file written by the skill per exchange (equivalent overhead, more moving parts). The shell would need fetch() calls per passage-detail open, adding latency and failure modes.

**Inline storage makes P2 (passage detail) instant and reliable.** A click on any passage opens the full content from memory — no fetch, no round-trip, no failure mode beyond the initial poll. This is the right design for a product where the drill-down is the escape hatch that makes trusting the digest safe.

**Scale ceiling:** At 100+ sessions (approximately 20 weeks of daily use), the file reaches ~2.4 MB. Parse time rises to ~24ms — still imperceptible, but worth noting. The collapse/summarise policy (a Refinement-deferred decision) should trigger at around 50–70 sessions to keep the file comfortably under 2 MB. This is not a v1 constraint.

---

## Decision

**Store fullContent inline in state.json.**

The schema field `fullContent` is not optional — it is a first-class field. The skill writes it on every block. The shell reads it on passage-detail open without an additional fetch.

Downstream unblocked by this decision:
- **FLY-75 (state format schema):** `fullContent?` is confirmed as `fullContent` — not optional, always present
- **FLY-77 (shell P2):** passage detail reads from `state.json` directly; no secondary fetch needed
- **Growth/collapse policy:** design for collapse at ~50–70 sessions; not a v1 constraint for the current 10–30 session target window

---

## Completion note

What was built: a 30-block representative fixture (inline and digest variants), a measurement script, and this written finding.

Decisions made during proving: none required — the numbers resolved the question clearly.

Reviewer should check: the block density assumption (30 blocks/session). If real sessions consistently run longer (40–50 blocks), the growth curve shifts — but the decision does not change; even at 50 blocks/session and 30 sessions, inline storage is 1.2 MB, still within comfortable range.

Out of scope: the collapse policy threshold (50–70 sessions) is a recommendation for future planning, not a v1 build requirement.
