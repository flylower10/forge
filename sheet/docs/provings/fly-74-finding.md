# FLY-74 · Proving: Semantic audit — conversation history access and cost

**Question:** Can an independent Claude call access the full conversation history of the current session? What does it cost per run? What is the right cadence?

**Status:** DECIDED — semantic audit is v1 scope. Mechanism confirmed, cost negligible.
**Date:** 2026-08-01
**Time spent:** within 2h box

---

## Method

1. Verified the Claude Code session JSONL is readable mid-session
2. Analysed the current session's JSONL to understand format and realistic token size
3. Ran a sample `claude -p` audit call (Haiku model) against a mock conversation and mock state.json
4. Calculated cost for a typical 20-exchange session

---

## Findings

### 1. Conversation history is accessible

Claude Code writes all session messages to a JSONL file at:
```
~/.claude/projects/[encoded-working-dir]/[session-uuid].jsonl
```

For Forge sessions: `~/.claude/projects/-Users-aidanmaughan-my-projects-forge/[session-id].jsonl`

This file is readable mid-session — the OS does not lock it during Claude Code's writes. An independent script can read it at any point during or after the session.

**Entry structure:** Each line is a JSON object with `type`, `leafUuid`, `sessionId`, and a `message` object containing `role` and `content`. Types include: `assistant`, `user`, `attachment`, `last-prompt`, `mode`, `ai-title`, `file-history-snapshot`.

**Extracting the conversation:** Filter entries where `message.role` is `user` or `assistant`. Text content is in `message.content` (either a string or an array of objects — extract `text` fields from the array form).

### 2. Realistic token sizes

Analysis of the current session JSONL (a very long session, running across two context windows):
- 487 entries total (189 human, 298 assistant)
- ~66,600 chars of text content ≈ 16,600 tokens

A typical 20-exchange Forge session: ~4,000–6,000 tokens of conversation text. With state.json (~3,000 tokens for 30 blocks) and audit prompt (~300 tokens): **~7,000–9,000 tokens total input per audit**.

### 3. Sample audit call confirmed

A test call using `claude haiku` with a 3-exchange mock conversation and a 2-block mock state.json correctly identified:
- The most important omission (update frequency decision — genuinely absent from the sheet)
- A secondary gap (amendment A1 history, not captured)
- A minor detail (sessionId stamping spec)

The model correctly ranked them by importance. Output was specific, actionable, and free of false positives in the non-omitted items.

### 4. Independence confirmed

The audit subprocess (`claude -p ...`) is a fresh Claude process — no memory of having written state.json. It receives only the conversation history and state.json as inputs. The independence constraint is satisfied by the mechanism itself.

### 5. Cost

| Model | Per audit | Daily (1 session/day) | Annual |
|---|---|---|---|
| Haiku | $0.003 | ~$0.003 | ~$1/year |
| Sonnet | $0.034 | ~$0.034 | ~$12/year |

Cost is not a constraint. Haiku is appropriate for the audit — the task is comparison, not generation.

---

## Decision

**Semantic audit is v1 scope.** Mechanism works, cost is negligible, independence is guaranteed by the subprocess model. Not post-v1.

---

## Recommended implementation (for FLY-79 / FLY-78 extension)

**Access mechanism:**
- A script reads the most recently modified JSONL in `~/.claude/projects/[encoded-dir]/` — this is the current session's transcript
- Extracts `user` and `assistant` messages (text only)
- Reads `sheet/state/[slug].json`
- Sends both to `claude haiku -p [audit-prompt]`
- Writes findings to `sheet/state/[slug].audit.json`
- Shell polls `[slug].audit.json` and renders the alarm banner if omissions exist

**Identifying the active project:**
The state.json should include a `projectSlug` field at the top level. The audit script reads this field to know which state file to compare against. (This is a schema addition for FLY-75.)

**Cadence — recommended: on demand + session end**

- **On demand:** the human invokes the audit explicitly ("audit the sheet") or the Delivery Manager runs it periodically during long sessions
- **Session end:** the Banking the Fire ceremony always runs a final audit before writing the handover — this is the most valuable use, ensuring the handover is complete
- **Every 10 exchanges (optional):** adds reliability during very long sessions; acceptable at Haiku cost; this is a v1 option, not a requirement

**Not recommended:** every exchange — the heuristic alarm already catches mechanical failures (the skill didn't write at all); the semantic audit catches conceptual failures (the skill wrote but missed something). Different cadences are appropriate.

---

## Completion note

What was built: JSONL format analysis script; sample audit call (confirmed working); cost calculations; this finding.

Decisions made: Haiku is the right model (cost and task match); on-demand + session-end is the right cadence; `projectSlug` must be added to state.json schema (note for FLY-75).

Reviewer should check: the "most recently modified JSONL" approach to session identification — is there a race condition where a new session's JSONL is created mid-audit? Answer: the audit reads the file once at invocation time; subsequent exchanges write to the same JSONL until the session ends. No race condition within a session.
