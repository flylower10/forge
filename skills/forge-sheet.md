---json
{
  "id": "forge-sheet",
  "name": "forge-sheet",
  "summary": "Per-exchange state writer for Forge Sheet. Writes sheet/state/[slug].json after every conversational exchange. Classifies content by kind, updates agent roster, manages concerns and alerts.",
  "file": "skills/forge-sheet.md"
}
---
# Forge Sheet · State Writer

**Write `sheet/state/[projectSlug].json` at the end of every conversational exchange.**

Not per tool call. Not at session end. After every exchange — including the one that invoked this skill.

Full schema reference: `sheet/docs/schema.md`.

---

## When to run

After your substantive response is complete, before ending the turn: read the current state, update it, write it back. This is the last action of every exchange.

If no state file exists for this project, create it (see Session initialisation).

---

## State file path

`sheet/state/[projectSlug].json`

Get `projectSlug` from the running brief or build kickoff document. If no slug is established, derive it from the project name: lowercase, hyphens, no spaces. Write it as `projectSlug` in the top-level JSON.

---

## Exchange update — step by step

Read the current state.json. Then:

**1. Identify this exchange's content**

Survey what happened in this exchange — your response plus any significant human input. Find the logical "moments": decisions made, questions raised, corrections issued, commitments given, findings stated, context set, speculative thoughts. Each distinct moment becomes a block.

Do not create a block per sentence. Do not create a block per tool call. Create a block per logical moment. Aim for 1–4 blocks per typical exchange; a complex exchange may produce more.

**2. Classify each block**

| Kind | Use when |
|------|----------|
| `question` | An open question is raised — unresolved at the point of writing. Tier 1: these interrupt. |
| `decision` | Something previously open is now resolved. "We will X" / "X is confirmed." |
| `correction` | A correction to something previously stated — by any participant. |
| `commitment` | A commitment to build or do something specific. More concrete than a decision. |
| `finding` | A concrete research finding, measurement, or empirical observation. |
| `context` | Background information for orientation — who, what, why. Not a decision. |
| `musing` | A speculative thought, hypothesis, or "what if." |
| `untyped` | Mandatory fallback. Use when none of the above fits clearly. Never skip a significant moment. An untyped block is always preferable to a dropped block. |

**Classification bias:** err toward any kind over `untyped`. If a moment is borderline between decision and commitment, pick one — the distinction matters less than the presence.

**3. Transition block states**

Every block currently marked `state: "live"` becomes `state: "settled"`.

New blocks for this exchange enter as `state: "live"`.

A block becomes `state: "quenched"` when the concern it anchors is resolved — do this at the same step as quenching the concern.

**4. Construct each block**

```json
{
  "id": "blk-[session]-[seq]",
  "kind": "[kind]",
  "digest": "[1–2 sentences — what a builder scanning the sheet needs to know]",
  "fullContent": "[Complete text of the passage. Not abbreviated. Use the actual exchange content.]",
  "state": "live",
  "attribution": "[Agent name or Human]",
  "concernRefs": [],
  "sessionId": "[current session id]",
  "arrivedAt": "[ISO datetime now]"
}
```

`fullContent` is required — never omit it. It is what P2 (passage detail) reads directly.

`digest` is the one-glance summary. Write it for someone who hasn't read this exchange.

`concernRefs`: if this block opens or closes a concern, add the concern's id here.

**5. Update agent roster**

Agents active in this exchange: `state: "atHeat"`, increment `minutesAtHeat` by 2 (one exchange ≈ 2 minutes — rough but consistent).

Agents who were `atHeat` in the previous exchange but not active now: `state: "settled"`.

Agents not seen in the current session: `state: "quenched"`, `minutesAtHeat: 0`.

Human counts as an agent if they drove significant content; otherwise omit.

`minutesAtHeat` heat steps:
- `< 10` → ember ("just lit")
- `10–24` → cherry
- `≥ 25` → furnace

**6. Update concerns**

If a new concern was raised this exchange: create a concern entry:
```json
{
  "id": "con-[seq]",
  "title": "[Short concern title — one line]",
  "state": "open",
  "wavesOpen": 1,
  "closedBy": null,
  "anchorBlockId": "[block id of the block that raised this concern]"
}
```

If an existing open concern was resolved this exchange:
```json
{
  "state": "quenched",
  "closedBy": "[block id of the block that resolved it]"
}
```

`wavesOpen` is incremented for all still-open concerns at the start of each new session (not each exchange). Do not increment mid-session.

A concern with `wavesOpen ≥ 2` earns STRIKE treatment in the shell — this happens automatically by the renderer. Nothing extra to write.

**7. Update alerts**

If an active heuristic alert exists in `alerts[]` and the skill is now running (state is being updated): clear it.
```json
{
  "state": "cleared",
  "clearedAt": "[ISO datetime now]"
}
```

If the heuristic alarm sidecar (`sheet/state/[slug].alarm.json`) exists and contains an active alarm that is not yet in `alerts[]`: read it and write the alert entry:
```json
{
  "id": "alert-[seq]",
  "type": "heuristic",
  "state": "active",
  "detail": "[text from sidecar]",
  "firedAt": "[timestamp from sidecar]",
  "clearedAt": null
}
```

**8. Update phase**

Check the current pipeline phase (from the running brief or the Delivery Manager's context). If it has changed since the last write, update the top-level `phase` field. Valid values: `"discovery"` / `"refinement"` / `"development"` / `"delivery"`.

**9. Write the file**

Write the complete updated JSON to `sheet/state/[projectSlug].json`. The write is always a full file replacement — no partial updates.

---

## Session initialisation (first exchange of a new project)

If no state.json exists, create it:

```json
{
  "projectSlug": "[slug]",
  "phase": "[current pipeline phase]",
  "handover": null,
  "sessions": [
    {
      "id": "sess-001",
      "date": "[YYYY-MM-DD today]",
      "label": "[brief description of this session — e.g. 'Build kickoff · provings complete']",
      "collapsed": false,
      "agentDigests": [],
      "blocks": []
    }
  ],
  "agents": [],
  "concerns": [],
  "alerts": []
}
```

Then apply the exchange update steps above.

---

## New session start (returning after a gap)

**Detecting a new session:** treat this as a new session if either of these is true:
- This is a fresh conversation context and no state write has been made in this context yet
- Today's date (`YYYY-MM-DD`) differs from the non-collapsed session's `date` field

When a new session begins on an existing project:

1. Set the previous session's `collapsed: true`
2. Write `agentDigests` for the collapsing session — one entry per agent that was active. Fields: `agentName`, `role`, `established` (1–2 sentences on what they established), `view` (their stance or recommendation), `openItems` (unresolved items handed forward)
3. For all still-open concerns: increment `wavesOpen` by 1
4. Append a new session entry to `sessions[]` with `collapsed: false`, today's date, a label, and empty `blocks[]`
5. Set all previous `atHeat` agents to `quenched`

---

## Banking the Fire (heat end)

When a heat ends (Delivery Manager invokes Banking the Fire or the session is being wrapped up):

1. Write the handover text as `handover` at the top level — replace any previous value
2. Collapse the current session (as per New session start steps 1–2)
3. Do not create a new session entry yet — that happens when the next heat begins

---

## Presence invariant

Never drop a significant exchange moment. If in doubt whether something merits a block, create one with `kind: "untyped"`. The sheet is a record — earlier states remain legible. A block exists → it can be reviewed; a dropped block is gone.

Target ≥ 90% classification (≤ 10% untyped). Review: if more than 1 in 10 blocks is untyped, revisit the classification table and improve specificity.

---

## Failure modes to avoid

- Writing only a summary block for a complex exchange — each distinct moment needs its own block
- Leaving `fullContent` abbreviated — write the actual exchange content
- Forgetting to transition "live" → "settled" for previous blocks
- Incrementing `wavesOpen` mid-session (it increments once per session start, not per exchange)
- Dropping a concern without marking it quenched
- Omitting `arrivedAt` — needed for animation timing in the shell
