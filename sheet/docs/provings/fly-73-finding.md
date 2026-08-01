# FLY-73 · Proving: Heuristic alarm hooks

**Question:** Do Claude Code hooks fire reliably after every conversational exchange, and can a hook write a file mid-session? What hook event maps to "Claude finished a response"?

**Status:** DECIDED — hook-based detection is viable. Use the `Stop` event.
**Date:** 2026-08-01
**Time spent:** within 2h box

---

## Method

A `Stop` hook was added to `.claude/settings.json` for one exchange. The hook appended a timestamp line to a test log file. The hook was then removed. The test log was checked at the start of the next exchange.

Test hook used:
```json
{
  "type": "command",
  "command": "date -u '+%Y-%m-%dT%H:%M:%SZ exchange-stop' >> sheet/docs/provings/fly-73-stop-hook-test.log 2>&1"
}
```

---

## Findings

**1. Which hook event fires after each exchange?**

`Stop` — confirmed empirically. The previous exchange contained approximately 10 tool calls (Read, Edit, Bash, and others). The `Stop` hook fired exactly once, after all tool calls completed and Claude's response was written. Log contents:

```
2026-08-01T21:09:01Z exchange-stop
```

One entry. One exchange. Correct.

**2. Can a hook write a file mid-session?**

Yes — confirmed. The `Stop` hook created and appended to the test log file without error. The existing `PostToolUse/Write` hook (`hooks/post-write.sh`) further demonstrates file writes from hooks work reliably in this environment.

**3. Does the hook fire during long agentic sequences?**

`Stop` fires once when Claude's full turn completes — after all tool calls in that turn. It does not fire between individual tool calls within a single exchange. This is the correct behaviour for the alarm: the check happens at the exchange boundary, not mid-turn. A session is a sequence of exchanges; `Stop` fires at the end of each one.

**4. Is hook-based detection viable?**

Yes.

---

## Decision

**The `Stop` hook is the mechanism for the heuristic alarm.** Hook-based detection is fully viable.

---

## Recommended alarm design for FLY-79

The `Stop` hook runs a shell script after every exchange. The script:

1. Reads the mtime of `sheet/state/[slug].json`
2. Reads the timestamp written by the *previous* `Stop` invocation from a sidecar file (`sheet/state/[slug].heartbeat`)
3. If state.json mtime ≤ heartbeat timestamp: the skill was skipped this exchange → write a simple alert sidecar (`sheet/state/[slug].alert`) containing the count of consecutive missed exchanges
4. If state.json mtime > heartbeat timestamp: the skill ran → clear the alert sidecar if present
5. Always write the current timestamp to the heartbeat sidecar for the next exchange to compare against

The shell polls both `state.json` and `[slug].alert`. If the alert sidecar is present and its count ≥ 2 (configurable), the shell renders the alarm banner on the sheet. The banner clears when the next successful skill write causes the hook to delete the alert sidecar.

**Why a sidecar rather than writing into state.json's alerts[] from bash?**
JSON surgery from shell is fragile — the hook runs in a constrained environment, and a partially written state.json is exactly the failure mode the alarm is designed to detect. The sidecar is a simple text file; the shell reads it independently of state.json.

---

## Completion note

What was built: a live empirical test using a temporary `Stop` hook; the test log (`fly-73-stop-hook-test.log`); this written finding.

Decisions made: `Stop` is the right event; sidecar pattern is the right alarm architecture.

Reviewer should check: the sidecar design (does it handle the P4 no-state case where state.json doesn't exist yet? Answer: if state.json is absent, mtime comparison fails gracefully — the hook treats absence as "missed" and starts the alarm count).
