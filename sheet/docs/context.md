---json
{
  "type": "context",
  "file": "output/forge-viewer/context.md",
  "title": "Context: Forge Sheet",
  "tagline": "Domain glossary for Forge Sheet — definitions only, no implementation details.",
  "phase": "discovery",
  "status": "Active",
  "lastEdit": "2026-07-31 · Synthesis",
  "stats": [
    { "k": "Phase", "v": "Discovery", "phase": true },
    { "k": "Terms", "v": "10" },
    { "k": "Maintained by", "v": "Synthesis + Delivery Manager" }
  ]
}
---
# Context: Forge Sheet
Domain glossary — pure definitions, no implementation details.

## The sheet

The rendered page the builder reads on his second monitor. One continuous accreting document per project; all sessions grouped on it. "The sheet" refers to both the HTML shell when rendered and the metaphor it is built on (the physical drafting sheet a designer works on).
_Avoid:_ "the viewer", "the companion app", "the dashboard".

## state.json

One JSON file per project that Forge Sheet reads from. It is the sole source of truth the shell renders. Claude writes it during sessions; the shell polls it. It accretes across sessions.
_Avoid:_ "the database", "the data file", "session file".

## Content kind

The classification of a passage's role in the session. Seven named kinds plus a mandatory fallback. Determines how a passage renders on the sheet (its attention tier and visual treatment).
_Avoid:_ "content type", "message category".

## Untyped

The mandatory fallback content kind. Any passage the skill cannot classify renders as untyped — explicitly, visibly, never hidden or dropped. It is a small honest failure state, not a placeholder.

## Quench / quenched

Resolution of an agent or concern. Agents are "quenched" when their work on the project is done; concerns are "quenched" when resolved. Quenched marks cool into the warm-grey ramp visually — they remain in the margin but visually recede.
_Avoid:_ "done", "resolved", "completed", "closed" when referring to Forge Sheet states.

## At heat

An agent currently writing in the active session. Heat increases with time at work — an agent that has been writing for 25 minutes is hotter than one that just started. The roster communicates this through the incandescence heat system.
_Avoid:_ "active", "running", "in progress" when referring to the roster state.

## Smoke alarm

The two-tier coverage system that detects when the sheet may be falling behind the session. Tier 1: heuristic (hook-based, always on — fires when exchanges pass without state updates). Tier 2: semantic audit (independent Claude call — compares conversation against sheet). When either tier fires, a banner appears on the sheet.

## Semantic audit

The second tier of the smoke alarm. An independent Claude call that reads both the conversation record and the current sheet and identifies omissions. It is independent of the sheet-writing skill — a key constraint: an audit that shares the writer's blind spots cannot catch them.

## Passage detail

The drill-down view (P2). Full-density content behind a single passage, opened by clicking the passage or its digest line. One action returns the reader to their exact previous position. The escape hatch that makes trusting the digest safe.
_Avoid:_ "drill-down view", "detail pane", "expanded view".

## Heat system

The colour system for Forge Sheet's accent. Grounded in black-body incandescence — a smith reads metal readiness by colour. Ember (#C22400) → cherry (#E62E0F) → furnace (#FF7A1A) → lemon (#FFC940). Heat = now and energy. Quench = resolve, marks cool to the warm-grey ramp.
_Avoid:_ "colour system", "accent system", "theme".

## Relationships

- **state.json** is what the shell reads; the **sheet-writing skill** writes it; the **smoke alarm** monitors whether it is being written.
- **Content kind** determines how a **passage** renders on **the sheet**; **untyped** is the fallback when kind is unknown.
- **At heat** describes a roster entry; **quenched** is its terminal state. Same vocabulary applies to concerns.
- **Passage detail** is the escape hatch from the **sheet**; the click log inside it feeds the **two-week usage test**.
- **Smoke alarm** includes the **semantic audit** as its second tier; they are distinct mechanisms with different triggers and costs.
