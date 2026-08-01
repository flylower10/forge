# Design context: Forge Sheet

> Canonical visual foundations live in
> `output/forge-viewer/design-handoff/forge-viewer Style Tile rev D.dc.html` (rev D)
> and `output/forge-viewer/design-handoff/forge-viewer Style Sheet.dc.html` — this file
> summarises them for AI design and build tools. Binding guardrails:
> `output/forge-viewer/design-handoff/design-guardrails.md`. High-fidelity screens: 4a / 5a / 5b in
> `output/forge-viewer/design-handoff/forge-viewer.dc.html` (turns 4–5); turns 1–3 and 6–9 are
> exploration record only. Last updated: 2026-07-31 (rev D — heat system).
> Copied to sheet/docs/ by Delivery Manager, 2026-08-01.

## What this product is

Forge Sheet is an ambient second-monitor companion for solo Forge
sessions. It renders what the session's agents are writing, at the
moment it is written. It is a capture of work, not an application:
it renders session files, is read-only, and never acts. Lodestar:
never finish a session wondering what was decided.

## The user we're designing for

A solo builder running Forge sessions in a dark IDE all day, Claude
Code in the terminal, second monitor free. On complex projects he has
a growing feeling that decisions are being made and artefacts are
changing without full visibility. He doesn't want another tool to
operate — he wants shared presence: the sense of being in sync with
what Claude and the agents are doing while his attention stays on
the primary screen.

## How they should feel using this

- **In sync** — what's on the sheet is what's happening, now
- **Peripherally aware, not monitored** — it draws the eye when
  something changes and recedes when nothing does
- **Clear at a glance** — a look, not a read; engineered for the
  glance like a road sign

## Design principles

- **The work is the hero:** the sheet of prose being written is the
  centre of the screen. The pipeline is demoted to a single phase
  phrase in the chrome — it is the only pipeline indicator in the
  product.
- **Colour = state, never decoration:** if nothing is active the
  screen sits near-monochrome. Accent appears only where something
  is happening now.
- **Marks accrete, nothing disappears:** settled prose grays back,
  resolved concerns fade to 50% but stay in the margin, revisions
  carry a wash. The sheet is a record — earlier states remain legible.
- **The sheet breathes with exchanges, not keystrokes:** one state
  write per conversational exchange (typically every 30s–3min);
  re-renders debounced 400ms after a write-burst; unchanged prose
  never repaints. Nothing else moves — no entrance animations,
  no hover theatre.
- **Two voices, two faces:** if an agent wrote it, it's Overpass;
  if the system knows it, it's Overpass Mono. Mono never sets prose;
  Overpass never sets status.

## Voice

> Derived from `skills/voice.md` (framework standard; anchors settled
> 2026-07-13). Applies to everything the sheet says: chrome, labels,
> error messages, alarm text, and the generated sheet prose.

- **Russell's structure at The Economist's length.** Build the idea in
  the order the reader needs it; no throat-clearing; sentences only as
  long as their construction can carry.
- **The precise word over the familiar approximation** — an uncommon
  word is welcome when it is the right one; a borrowed phrase never is.
- **Wit is never bought at the idea's expense.** No cleverness that
  makes the reader work out what was meant.
- **Banned families (worst first):** consultant abstraction, text speak
  and initialisms, corporate buzzword, startup-casual American, AI
  filler, engineering shorthand. "Gate" as a verb is banned.
- **Terse machine-voice strings are still words:** "in progress", never
  "WIP"; "reading project state…", never "loading, pls wait".

## Visual direction

**The drafting sheet.** A white sheet (#FFFFFF, hairline border,
soft drop shadow) on a warm desk (#F6F5F1). Agents are a roster in
the left margin; concerns are annotation cards in the right margin,
tied to their passages with dashed leader lines.

**Type:** Overpass (agent voice) + Overpass Mono (machine voice).
Grounding: FHWA Highway Gothic — engineered to be read at a glance,
at distance. Weights 400/500/600; 700 for the wordmark only.
Letter-spacing (.04–.12em) on mono labels at small sizes only.

**Accent — the heat system.** Grounding: black-body incandescence —
a smith reads readiness by colour. Heat is information, not decoration.
The ramp runs from first-lit to forging temperature:

| Name | Hex | Use |
|---|---|---|
| Ember | #C22400 (deep #8F1A00) | Base "now" — just lit, text-safe |
| Cherry | #E62E0F | Sustained work (~10 min); fresh revisions |
| Furnace | #FF7A1A | Strike — aged concerns, long at-heat (~25 min); mark-only on white |
| Forging lemon | #FFC940 | Gradient cores only — never flat, never text |
| White heat | #E9F1FF | Dark-ground reserve; unused in current product |

Rules: ≤5% of the surface, never a background, never in the chrome.
Glow (box-shadow) only on marks ≤12px — never on text, never on containers.
Halo at 14–22% furnace. **Resolve = quench:** marks cool into the warm-grey
ramp (cooled metal). Revision wash: `linear-gradient(90deg, rgba(230,46,15,.08),
transparent 80%)`, cools to grey over 24h.

Agent roster heat steps: just lit → cherry ~10 min → furnace ~25 min.
Concern heat steps per wave open: fresh = ember; aged ≥2 waves = furnace + glow
+ "— STRIKE" suffix. Margin sorts hottest first.

**Neutrals:** an all-warm ramp, no pure black or grey — ink #1A1A17,
live prose #3A3934, body #54534D, settled #8C8A80, done #94897C /
ring #CFC6BB / attribution #B3A99B, pending #ACACA3 / ring #D6D6CF,
always-on graphite #6A7075 (#5B6066 text), machine-label #A7A498,
desk #F6F5F1, sheet #FFFFFF, borders #DEDCD2 / #E2E1D9 / #ECECE6.

**Radii:** sheet 0 · margin cards 5px · badges 3–4px. No other rounding.

**Motion (complete list — nothing else moves):** cursor blink 1.05s
steps(1) · active-dot halo 2.6s ease-out · status pip 1.4s sine ·
quench 3s ease-out (hold full opacity 45%, land at 50%; glow → 0;
strikethrough appears at start) · re-render debounce 400ms ·
agent heat steps: →cherry ~10 min, →furnace ~25 min ·
concern heat steps per wave · revision wash cools over 24h.

Rejected during design (do not reintroduce): Space Grotesk (drifted
into AI-startup default), fuchsine #C2185B (superseded — synthesis
story, but no forge identity), vermilion #CB4B16 (Anthropic terracotta),
teal #0A7A72 (inert), blue #33518E (drifts corporate).

## Key screens / surfaces

One screen, three captured states (reference canvas 1180×720):

- **The sheet (4a — discovery mid-session):** live prose with block
  cursor, settled paragraphs with attributions, revised passages with
  cherry wash, roster of active/quenched agents, two open concerns with
  leader lines (sorted hottest first), one quenched.
- **Mid-development (5a):** Engineer writing, Reviewer on diff, QA
  queued (pending ring), discovery roster collapsed ("Discovery ✓ ×9"),
  one concern marked "Blocks merge".
- **Concern resolving (5b):** quench animation — strikethrough +
  3s ease-out to 50% opacity, glow dies; the sheet records the closure
  as a revised passage; the card stays in the margin permanently.

Shared chrome: 52px white bar — FORGE wordmark (Overpass 700, 14px,
letter-spacing .2em) · "/ sheet" (Overpass Mono 500 11px) · session id
(Mono 11px) · current phase phrase in ember (Mono 11px — the only
pipeline indicator). Right: "renders session files · read-only" (Mono 10px).
Status strip bottom-left of the desk ("4 writing · 2 settled · 2 concerns open").

**Forge mark:** the mark is inline CSS/SVG — no separate asset files.
Extract from the rev D style tile when building the shell and favicon set.
Favicon set required: SVG favicon + 32/16 PNG-ICO fallback + 180×180
apple-touch-icon + 192/512 manifest icons (maskable variant).
Build as part of FLY-76 (shell P1).

**Vocabulary of record:** agents are "quenched" (not "done"); resolution
is a "quench"; concerns are "at heat" (not "active"); aged concerns
earn "STRIKE" at ≥2 waves open.

## What to avoid

Binding — audit every screen; state "clear" or name the deviation
(full list in `output/forge-viewer/design-handoff/design-guardrails.md`):

- Inter as default type; purple→blue gradients; coloured left-border
  cards; landing-page grammar; permanent dark mode + grey body text;
  oversized italic serif h1 — the universal AI tells
- Badges/pill chips as a navigation language
- Rows of KPI cards, generic SaaS dashboard layouts
- Decorative metadata — timestamps or word counts that inform nothing
- Dark mode anywhere: the sheet's lightness is deliberate contrast
  with the dark IDE beside it
- Any pipeline visualisation beyond the chrome phrase — the tube-map
  instinct is explicitly wrong for this product
- Entrance animations, parallax, hover theatre, scroll hijack —
  the motion list above is exhaustive
- Glow on text or containers — glow is only for marks ≤12px
- Flat furnace colour on text — furnace (#FF7A1A) is mark-only on white;
  ember (#C22400) is the text-safe heat colour
