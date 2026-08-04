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

**Question blocks speak to the human directly.** When a question is
for the human, the block *is* the question — plain words, second
person, no preamble: "What is this thing, in a sentence?" Never a
process report about a question ("Question 1 of 7 posed... awaiting
confirm/correct"). The digest is the question itself, short enough to
answer from the glance; fullContent carries the question plus only the
context needed to answer it. This applies to every block kind: write
for the human reading the sheet, not as a log of what the machine did.
Pipeline mechanics (step numbers, protocol names, "awaiting X") are
jargon on the sheet — leave them in the running brief.

**The test:** would someone who has never heard of Forge's pipeline
understand every word? "Before discovery configures itself" fails —
it means "before we choose which specialists work on this", so write
that. Framework nouns (discovery, intake, refinement, wave) are
internal vocabulary; on the sheet, say the plain thing they stand for.
The sheet is always speaking to a human.

**Enumerations are lists, never paragraphs.** Six items with
"(1)...(6)" inline in a flowed paragraph is unreadable (ruled by the
human, 2026-08-03). When content enumerates - decisions, options,
steps - write one item per line, each item one short sentence, the
choice or recommendation stated first. fullContent carries real line
breaks; the shell renders them.

**No metaphor that needs decoding.** "Building layer two before layer
one has proven itself" reads as nothing to a tired reader (ruled by
the human, 2026-08-03: "I don't know what this means"). If a metaphor
needs its backstory, say the plain thing instead: "the dashboard bets
the sheet works, and that bet is untested." One metaphor family is
already licensed — the heat vocabulary — because the design teaches it
visually. Everything else earns its place or stays out.

**One question per question block.** A question block asks exactly
one question — never two joined by "and", never a question with its
follow-up riding along (ruled by the human, 2026-08-03: "two questions
bundled and the second one is incomprehensible"). If a second question
exists, it is a second block, or it waits for the first answer.

**Digests are short sentences, not compressed summaries.** A digest
that tries to cover everything invents compound phrases ("the
two-moment decision failure") and stacks parentheticals until nothing
lands — ruled awful by the human, 2026-08-03. Never coin a phrase to
compress an idea; never gloss inside brackets. If the digest cannot be
said plainly in one or two short sentences, the block covers too much:
split it or cut detail. The reader gets it on the first pass or the
digest has failed.

**3. Check the decision record**

Take each topic this exchange touched — anything discussed, proposed, or
worked on — and check it against the decision blocks already on the sheet
(every block with `kind: "decision"`, in any session). Ask: does this
topic touch something already decided?

**Every check writes an entry** to the top-level `resurfacingLog[]`,
hit or miss:

```json
{
  "topic": "[what the exchange touched, in plain words]",
  "matchedDecision": "[block id, or null if no decision matched]",
  "surfaced": "[yes | no]",
  "checkedAt": "[ISO datetime now]"
}
```

`surfaced: "yes"` means the decision was actually said aloud in the
session when the topic arose — not that you noticed it now. If you find
a match at write time that was not surfaced in the response, log it
honestly as `surfaced: "no"` and raise it at the next opportunity. A
match logged as unsurfaced is a countable miss — that is the point.
Do not skip the check on quiet exchanges; a check that finds nothing
writes `matchedDecision: null`. Never edit or prune old entries.

**4. Transition block states**

Every block currently marked `state: "live"` becomes `state: "settled"`.

New blocks for this exchange enter as `state: "live"`.

A block becomes `state: "quenched"` when the concern it anchors is resolved — do this at the same step as quenching the concern.

**5. Construct each block**

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

**Optional block fields — write them when they are earned:**

- `digestPoints[]` — when the digest's content enumerates (several
  decisions, options, steps), write the points as an array of short
  strings, one per line, alongside `digest`. The digest stays a plain
  one-glance sentence; the points carry the enumeration. Never pack an
  enumeration into the digest as flowed prose.

- `artefactRef` — when the block puts a document to the human for review
  (an artefact-carrying question), attach `{ "path": "[repo-relative
  path]", "reviewSnapshot": "[the artefact's text right now, or
  sha256:<hex> of it if the file is longer than ~4 KB]" }`. Capture the
  snapshot at the moment you write the block — it is what the human is
  signing off against, even if the file changes later. Paths are always
  repo-relative, never absolute.

- `risk` — when a risk is put to the human, the block carries
  `{ "level": "high|medium|low", "stake": "[what happens if it lands —
  the 'if wrong' line]", "state": "proposed", "proposedBy": "[agent]",
  "proposedAt": "[now]", "ruledBy": null, "ruledAt": null }`. When the
  human rules, write a new block for the ruling and update this risk's
  `state` to `"accepted"` or `"rejected"` with `ruledBy` and `ruledAt`
  filled in. The ruling happens in the session; the sheet only records.

- `linearUrl` / `mergeRequestUrl` — when the block concerns a specific
  Linear issue or merge request, carry its full URL.

- `fileRefs[]` — when the block's prose refers to specific files, list
  them as `{ "path": "[repo-relative]", "line": [number, optional] }`.
  Repo-relative always — the shell builds the editor link itself.

**6. Update agent roster**

Agents active in this exchange: `state: "atHeat"`, increment `minutesAtHeat` by 2 (one exchange ≈ 2 minutes — rough but consistent).

Agents who were `atHeat` in the previous exchange but not active now: `state: "settled"`.

Agents not seen in the current session: `state: "quenched"`, `minutesAtHeat: 0`.

Human counts as an agent if they drove significant content; otherwise omit.

`minutesAtHeat` heat steps:
- `< 10` → ember ("just lit")
- `10–24` → cherry
- `≥ 25` → furnace

**7. Update concerns**

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

If an existing open or carried concern was resolved this exchange:
```json
{
  "state": "quenched",
  "closedBy": "[block id of the block that resolved it]"
}
```

`wavesOpen` is incremented for all still-open concerns at the start of each new session (not each exchange). Do not increment mid-session.

A concern with `wavesOpen ≥ 2` earns STRIKE treatment in the shell — this happens automatically by the renderer. Nothing extra to write.

**8. Update alerts**

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

**9. Update phase**

Check the current pipeline phase (from the running brief or the Delivery Manager's context). If it has changed since the last write, update the top-level `phase` field. Valid values: `"discovery"` / `"refinement"` / `"development"` / `"delivery"`.

**10. Write the file**

Write the complete updated JSON to `sheet/state/[projectSlug].json`. The write is always a full file replacement — no partial updates.

**Apply the update with a script.** The state file accretes without
bound; never pass its full content through the model's context to
rewrite it. Read it programmatically, apply the changes (append blocks,
transition states, update the roster), and write it back in the same
script. Model tokens are spent on the new content only — the block
prose being added — never on re-emitting what is already there.
Cost ruling, 2026-08-04.

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
  "alerts": [],
  "resurfacingLog": []
}
```

Then apply the exchange update steps above.

If an existing state file predates the resurfacing log, add
`"resurfacingLog": []` at the top level on the next write — the log
counts from the first day it exists.

---

## New session start (returning after a gap)

**Detecting a new session:** treat this as a new session if either of these is true:
- This is a fresh conversation context and no state write has been made in this context yet
- Today's date (`YYYY-MM-DD`) differs from the non-collapsed session's `date` field

When a new session begins on an existing project:

1. Set the previous session's `collapsed: true`
2. Write `agentDigests` for the collapsing session — one entry per agent that was active. Fields: `agentName`, `role`, `established` (1–2 sentences on what they established), `view` (their stance or recommendation), `openItems` (unresolved items handed forward)
3. For all still-open concerns: increment `wavesOpen` by 1 and set
   `state: "carried"` — an unresolved concern that outlives its session
   is carried, and it stays carried until quenched
4. Append a new session entry to `sessions[]` with `collapsed: false`, today's date, a label, and empty `blocks[]`
5. Set all previous `atHeat` agents to `quenched`

---

## Heat handover (heat end)

When a heat ends (Delivery Manager invokes Heat handover or the session is being wrapped up):

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
- Skipping the decision-record check on a quiet exchange — every exchange logs a check, even one that finds nothing
- Logging `surfaced: "yes"` for a decision you only noticed at write time — if it wasn't said aloud in the session, it is a miss; log it as one
- Leaving `fullContent` abbreviated — write the actual exchange content
- Forgetting to transition "live" → "settled" for previous blocks
- Incrementing `wavesOpen` mid-session (it increments once per session start, not per exchange)
- Dropping a concern without marking it quenched
- Omitting `arrivedAt` — needed for animation timing in the shell
