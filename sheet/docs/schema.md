# Forge Sheet · state.json schema

Canonical schema for v1. Locked by FLY-75 (2026-08-01).
Extended by FLY-86 (2026-08-04): artefact refs, risk objects, link fields,
`digestPoints[]`, the `carried` concern state, and the top-level `resurfacingLog[]`.
Both the shell (reader) and the sheet-writing skill (writer) must conform to this exactly.
All FLY-86 block fields are optional — the shell ignores fields it does not know,
so state written to this schema renders on the pre-FLY-86 shell without breakage.

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
  "alerts": [],
  "resurfacingLog": []
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `projectSlug` | string | yes | Identifies which project this state belongs to. Used by the semantic audit script to locate the correct state file. |
| `phase` | string | yes | Current pipeline phase: `"discovery"` / `"refinement"` / `"development"` / `"delivery"` |
| `handover` | string \| null | yes | Text of the most recent Banking the Fire handover. Pinned at the top of P3 (sheet at rest). Null until the first heat ends. |
| `sessions` | array | yes | Ordered oldest-first. Never deleted — sessions accrete. |
| `agents` | array | yes | Current roster across the whole project (not per-session). |
| `concerns` | array | yes | All concerns, open, carried, and quenched. Never deleted. |
| `alerts` | array | yes | Active and cleared smoke alarm alerts. |
| `resurfacingLog` | array | no | One entry per decision-record check the writer performs. Append-only. Absent in pre-FLY-86 state files. See `resurfacingLog[]` below. |

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
  "agentName": "PM Agent",
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
  "attribution": "PM Agent",
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
| `digestPoints` | array | no | Structured bullets alongside `digest`, one short string per point. Written when the digest's content enumerates (D-A rendering: true bullets, never flowed prose). `digest` remains required and remains the one-glance sentence. |
| `fullContent` | string | yes | Full text. Required — not optional. P2 (passage detail) reads this directly from state.json. |
| `state` | string | yes | `"live"` — the most recent block(s) in the current session; `"settled"` — written and no longer the latest; `"quenched"` — a concern or question this block anchored has been resolved. |
| `attribution` | string | yes | Agent name or `"Human"`. |
| `concernRefs` | array | yes | Array of concern ids (`con-NNN`) this block is tied to. Empty array if none. |
| `sessionId` | string | yes | Must match the parent session's `id`. |
| `arrivedAt` | string | yes | ISO datetime when this block was written. Used for arrival treatment animation timing. |
| `artefactRef` | object | no | Present on artefact-carrying blocks (typically a question putting a document to the human). See "Artefact references" below. |
| `risk` | object | no | Present when the block puts a risk to the human or records its ruling. See "Risk objects" below. |
| `linearUrl` | string | no | Full URL of the Linear issue this block concerns, when there is one. |
| `mergeRequestUrl` | string | no | Full URL of the merge/pull request this block concerns, when there is one. |
| `fileRefs` | array | no | Files this block's prose refers to. See "File references" below. |

### Artefact references (`blocks[].artefactRef`)

An artefact-carrying block ties the passage to a document under review.
The snapshot is captured **at the moment review is requested** — it is what
the human is signing off against, even if the file changes afterwards.

```json
{
  "path": "output/forge-dashboard/brief.md",
  "reviewSnapshot": "sha256:9f2c…"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `path` | string | yes | Repo-relative path to the artefact. Never absolute — state files travel between machines. |
| `reviewSnapshot` | string | yes | The artefact's text at the moment review was requested, or a content hash of it in the form `sha256:<hex>`. Use the full text when the artefact is short enough to carry inline (≲ 4 KB); use the hash above that — it still proves whether the file changed since review. |

### Risk objects (`blocks[].risk`)

A risk put to the human is its own thing on the sheet (`RISK · HIGH · PUT
TO YOU`). The object records the stake, the ruling state, and who ruled when.

```json
{
  "level": "high",
  "stake": "if wrong — the builder delegates on the strength of a net that catches only sometimes",
  "state": "proposed",
  "proposedBy": "Devil's Advocate",
  "proposedAt": "2026-08-03T20:00:00Z",
  "ruledBy": null,
  "ruledAt": null
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `level` | string | yes | `"high"` / `"medium"` / `"low"`. Rendered upper-case in the risk stamp. |
| `stake` | string | yes | What happens if the risk lands, stated plainly — the "if wrong — …" line. |
| `state` | string | yes | `"proposed"` — put to the human, awaiting ruling; `"accepted"` / `"rejected"` — ruled. Rulings happen in the session; the sheet only records. |
| `proposedBy` | string | yes | Agent name (or `"Human"`) that raised the risk. |
| `proposedAt` | string | yes | ISO datetime the risk was put. |
| `ruledBy` | string \| null | yes | Who ruled — `"Human"` in practice. Null while `state` is `"proposed"`. |
| `ruledAt` | string \| null | yes | ISO datetime of the ruling. Null while `state` is `"proposed"`. |

### File references (`blocks[].fileRefs[]`)

Machine-voice file objects inside agent prose. The shell composes the
`vscode://file/…` link at render time from the repo root it is served from —
state carries repo-relative paths only.

```json
{
  "path": "sheet/index.html",
  "line": 904
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `path` | string | yes | Repo-relative path. Filename only is shown at digest scale; the full path appears in hover/detail. |
| `line` | number | no | Line number for the `vscode://` link. Omit when the reference is to the whole file. |

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
  "name": "Delivery Manager",
  "role": "Delivery Manager",
  "state": "atHeat",
  "minutesAtHeat": 22
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | yes | Agent name (e.g. `"Delivery Manager"`, `"Engineer"`, `"Human"`). |
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
  "state": "carried",
  "wavesOpen": 2,
  "closedBy": null,
  "anchorBlockId": "blk-004"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | yes | Unique concern id. Format: `con-NNN`. |
| `title` | string | yes | Short concern title (1 line). Shown on the margin card. |
| `state` | string | yes | `"open"` — raised this session, unresolved; `"carried"` — unresolved and it has outlived the session that raised it (a demand outliving its session); `"quenched"` — resolved. The skill moves `open` → `carried` at session start, at the same step that increments `wavesOpen`. Carried concerns keep flat ember triangles at rest — no glow. |
| `wavesOpen` | number | yes | Number of sessions this concern has been open. Incremented by the skill at each session start if still open. At `≥ 2`: STRIKE treatment (furnace + glow + `— STRIKE` suffix). A carried concern therefore always has `wavesOpen ≥ 2`. |
| `closedBy` | string \| null | yes | Block id of the block that resolved this concern. Null if open or carried. |
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

## resurfacingLog[]

The instrumentation for the resurfacing bet (accepted High risk, Challenge 3
of `output/forge-dashboard/03-risk-review.md`): the writer checks every
exchange against the decision record, and **every check writes an entry** —
hit or miss. Misses are countable from the first day the log exists: a
matched decision that was not surfaced is a recorded failure, and a topic
later shown to have touched a decision with `matchedDecision: null` is a
detection failure the semantic audit can find. Append-only; never pruned.

```json
{
  "topic": "state file location for a second project",
  "matchedDecision": "blk-004",
  "surfaced": "yes",
  "checkedAt": "2026-08-04T09:00:00Z"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `topic` | string | yes | What the exchange touched, in plain words — specific enough that a later audit can judge whether the match was right. |
| `matchedDecision` | string \| null | yes | Block id of the settled decision this topic touches, or null if the check found none. |
| `surfaced` | string | yes | `"yes"` — the decision was said aloud in the session when the topic arose; `"no"` — it was not. A `matchedDecision` with `surfaced: "no"` is a countable miss. |
| `checkedAt` | string | yes | ISO datetime of the check. This is what makes misses countable per day. |

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
| `live.json` | P1 | Active session, two agents at heat, one open concern, no alarm. Exercises the FLY-86 block fields (`digestPoints`, `artefactRef`, `risk`, `linearUrl`, `mergeRequestUrl`, `fileRefs`) and the top-level `resurfacingLog[]` |
| `alarm.json` | P1 | Same as live but with an active heuristic alarm in `alerts[]` |
| `at-rest.json` | P3 | Two sessions: first collapsed with agentDigests, second settled; handover pinned. Exercises the `carried` concern state |
| `no-state.json` | P4 | `_noState: true` with errorKind and troubleshooting entries |
