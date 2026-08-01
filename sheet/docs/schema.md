# Forge Sheet · state.json schema

Canonical schema for v1. Locked by FLY-75 (2026-08-01).
Both the shell (reader) and the sheet-writing skill (writer) must conform to this exactly.

---

## Top level

```json
{
  "projectSlug": "forge-sheet",
  "phase": "development",
  "handover": "Latest handover text, or null if no heat has ended",
  "sessions": [],
  "agents": [],
  "concerns": [],
  "alerts": []
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `projectSlug` | string | yes | Identifies which project this state belongs to. Used by the semantic audit script to locate the correct state file. |
| `phase` | string | yes | Current pipeline phase: `"discovery"` / `"refinement"` / `"development"` / `"delivery"` |
| `handover` | string \| null | yes | Text of the most recent Banking the Fire handover. Pinned at the top of P3 (sheet at rest). Null until the first heat ends. |
| `sessions` | array | yes | Ordered oldest-first. Never deleted — sessions accrete. |
| `agents` | array | yes | Current roster across the whole project (not per-session). |
| `concerns` | array | yes | All concerns, open and quenched. Never deleted. |
| `alerts` | array | yes | Active and cleared smoke alarm alerts. |

---

## sessions[]

```json
{
  "id": "sess-001",
  "date": "2026-08-01",
  "label": "Build kickoff — provings complete",
  "collapsed": false,
  "agentDigests": [],
  "blocks": []
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | yes | Unique session identifier. Format: `sess-NNN` or UUID. |
| `date` | string | yes | ISO date string `YYYY-MM-DD`. Used for the collapsed session label. |
| `label` | string | yes | Short human-readable session description. Written by the skill at session start. |
| `collapsed` | boolean | yes | `false` for the current session (always expanded). `true` for all prior sessions. The skill sets `collapsed: true` on the previous session when a new session begins. |
| `agentDigests` | array | yes | Per-agent contribution summaries. Empty array for the current (non-collapsed) session. Written by the skill when collapsing a session. |
| `blocks` | array | yes | Ordered passages for this session, oldest first. |

### sessions[].agentDigests[]

Written when a session is collapsed. Assembled from the agents' handoff blocks for that session.

```json
{
  "agentName": "The Interrogator",
  "role": "PM Agent",
  "established": "1-2 sentences: what this agent established this session.",
  "view": "The agent's stance or recommendation.",
  "openItems": ["Any unresolved items handed forward"]
}
```

### sessions[].blocks[]

```json
{
  "id": "blk-001",
  "kind": "decision",
  "digest": "1-2 sentence summary shown on the sheet.",
  "fullContent": "Full text of the passage. Required — never omitted.",
  "state": "live",
  "attribution": "The Interrogator",
  "concernRefs": [],
  "sessionId": "sess-001",
  "arrivedAt": "2026-08-01T20:00:00Z"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | yes | Unique block id within the project. Format: `blk-NNN` or `blk-[sess]-NNN`. |
| `kind` | string | yes | One of: `question` / `decision` / `correction` / `commitment` / `finding` / `context` / `musing` / `untyped`. The skill must classify every block; `untyped` is the mandatory fallback — never omit a block. |
| `digest` | string | yes | 1-2 sentence summary. This is what the sheet shows without drill-down. |
| `fullContent` | string | yes | Full text. Required — not optional. P2 (passage detail) reads this directly from state.json. |
| `state` | string | yes | `"live"` — the most recent block(s) in the current session; `"settled"` — written and no longer the latest; `"quenched"` — a concern or question this block anchored has been resolved. |
| `attribution` | string | yes | Agent name or `"Human"`. |
| `concernRefs` | array | yes | Array of concern ids (`con-NNN`) this block is tied to. Empty array if none. |
| `sessionId` | string | yes | Must match the parent session's `id`. |
| `arrivedAt` | string | yes | ISO datetime when this block was written. Used for arrival treatment animation timing. |

**kind values and attention tiers:**

| Kind | Tier | Description |
|---|---|---|
| `question` | 1 — interrupting | An open question requiring an answer. The peak accent moment. |
| `decision` | 2 — state-changing | A decision made. Permanent mark. |
| `correction` | 2 — state-changing | A correction to something previously stated. Carries the cherry wash. |
| `commitment` | 2 — state-changing | A commitment to build or do something. Permanent mark. |
| `finding` | 3 — ambient | A research finding or observation. |
| `context` | 3 — ambient | Background information for orientation. |
| `musing` | 3 — ambient | A speculative thought or hypothesis. |
| `untyped` | fallback | Any block the skill cannot classify. Rendered explicitly — never hidden. |

**state transitions:**

- New blocks arrive as `"live"`.
- When the next block is written, prior blocks become `"settled"` (the most recent block remains `"live"`).
- When a concern anchored to a block is quenched, that block's state becomes `"quenched"`.

---

## agents[]

One entry per agent that has participated in the project. Updated each session.

```json
{
  "name": "The Conductor",
  "role": "Delivery Manager",
  "state": "atHeat",
  "minutesAtHeat": 22
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | yes | Agent name (e.g. `"The Conductor"`, `"Engineer"`, `"Human"`). |
| `role` | string | yes | Plain function (e.g. `"Delivery Manager"`, `"PM Agent"`). |
| `state` | string | yes | `"atHeat"` — currently writing this session; `"settled"` — wrote earlier in this session, no longer active; `"quenched"` — completed, not active in this session. |
| `minutesAtHeat` | number | yes | Minutes the agent has been at heat in the current session. Set to `0` when `state` is not `"atHeat"`. Used for heat step transitions (→ cherry ~10 min, → furnace ~25 min). |

---

## concerns[]

All concerns raised during the project. Never deleted — quenched concerns stay and render at 50% opacity in the margin.

```json
{
  "id": "con-001",
  "title": "Short concern title",
  "state": "open",
  "wavesOpen": 2,
  "closedBy": null,
  "anchorBlockId": "blk-004"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | yes | Unique concern id. Format: `con-NNN`. |
| `title` | string | yes | Short concern title (1 line). Shown on the margin card. |
| `state` | string | yes | `"open"` or `"quenched"`. |
| `wavesOpen` | number | yes | Number of sessions this concern has been open. Incremented by the skill at each session start if still open. At `≥ 2`: STRIKE treatment (furnace + glow + `— STRIKE` suffix). |
| `closedBy` | string \| null | yes | Block id of the block that resolved this concern. Null if open. |
| `anchorBlockId` | string | yes | Block id this concern is visually tied to (leader line target). |

---

## alerts[]

Smoke alarm events. Both tiers write here.

```json
{
  "id": "alert-001",
  "type": "heuristic",
  "state": "active",
  "detail": "3 exchanges without a state update. The sheet may be falling behind the session.",
  "firedAt": "2026-08-01T20:20:00Z",
  "clearedAt": null
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | yes | Unique alert id. |
| `type` | string | yes | `"heuristic"` (Stop hook) or `"semantic"` (audit call). |
| `state` | string | yes | `"active"` or `"cleared"`. |
| `detail` | string | yes | Human-readable explanation of why the alarm fired. |
| `firedAt` | string | yes | ISO datetime when the alert was created. |
| `clearedAt` | string \| null | yes | ISO datetime when cleared, or null if still active. |

---

## No-state detection

When the shell cannot load state.json (file missing or unreadable after 5 consecutive parse failures), it renders P4. The `no-state.json` fixture has a `_noState: true` top-level field — the shell detects this and renders P4 with the matching `errorKind` and troubleshooting entries.

```json
{
  "_noState": true,
  "errorKind": "file-not-found",
  "errorMessage": "...",
  "fix": "...",
  "troubleshooting": []
}
```

---

## Fixtures

Four fixture files in `sheet/fixtures/`:

| File | Place | Description |
|---|---|---|
| `live.json` | P1 | Active session, two agents at heat, one open concern, no alarm |
| `alarm.json` | P1 | Same as live but with an active heuristic alarm in `alerts[]` |
| `at-rest.json` | P3 | Two sessions: first collapsed with agentDigests, second settled; handover pinned |
| `no-state.json` | P4 | `_noState: true` with errorKind and troubleshooting entries |
