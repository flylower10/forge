# Design context: Forge Sheet

> Canonical visual foundations:
> `output/forge-dashboard/design-handover/forge-viewer Style Tile rev E.dc.html`
> (rev E, approved 2026-08-03 — G-B · D-A · H-C · S-B) and
> `output/forge-dashboard/design-handover/forge-viewer Screens - Iteration 2.dc.html`
> (P-A chosen), amending — not superseding — rev D
> (`.../forge-viewer Style Tile rev D.dc.html` and the Style Sheet, in the
> same folder). Binding guardrails: `design_handoff_forge_viewer/design-guardrails.md`
> beside them. Rev D screens 4a / 5a / 5b remain lineage; turns 1–3 and 6–9
> are exploration record only.
> Last updated: 2026-08-03 (rev E — temperature, glyph family, direct address).

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

**The temperature law (rev E).** The ≤5% mark budget stands for the
record. While a state **demands the human** — a question open, a risk
awaiting acceptance, the live exchange — its object may carry heat as
a *field*: a full-ground wash, hairline frame (top+bottom or full box,
never a left edge), display-scale type. Demanding fields together
≤ ~15% of surface; hottest sits highest. Demand met → the field
quenches exactly as marks do. At rest the sheet cools below rev D:
near-monochrome, ≤2%.

**Neutrals:** an all-warm ramp, no pure black or grey — ink #1A1A17,
live prose #3A3934, body #54534D, settled #8C8A80, done #94897C /
ring #CFC6BB / attribution #B3A99B, pending #ACACA3 / ring #D6D6CF,
always-on graphite #6A7075 (#5B6066 text), machine-label #A7A498,
desk #F6F5F1, sheet #FFFFFF, borders #DEDCD2 / #E2E1D9 / #ECECE6.

**Radii:** sheet 0 · margin cards 5px · badges 3–4px · stamp outlines 2px. No other rounding.

**The glyph family (stamped construction, G-B — rev E).** One family
carries kinds, artefact things, and the mark: **a single Overpass Mono
character, weight 600, inside a 17px stamp outline** (1.2px border,
2px radius, white fill). Heat stamps (border + character in ember)
only while their demand is open, then quench to grey in place; ink
stamps never take colour. Glow lives on the character, never the box.
Tier 3 kinds (finding, context, musing) carry no stamp — tag only.

| Mark | Meaning | Colour |
|---|---|---|
| ? | question | ember while open |
| ! | risk put to you | ember while awaiting |
| ■ (6px square) | decision | ink; grey when settled/resurfaced |
| ▲ | correction / changed passage | ink; superseded text takes the wash |
| → | commitment | ink; ember "open" tag until kept |
| ¶ | problem statement | ink |
| ✓ | success test | ink |
| ≈ | assumption | ink |
| ◌ dotted | unclassified fallback | graphite |
| ◆ | alarm record | cold-shut firing; graphite after |

A glyph never appears without its word nearby at digest scale; at
display scale (the hero) it may stand alone. Deviation named: 17px
stamps bend the ≤12px mark law; watched against badge creep.

**The Forge mark (rev E — resolved).** The mark is the writer's dot —
radial gradient (lemon core → furnace → cherry) with glow. Favicon:
inline SVG, static (never animated in the tab), legible at 16px; set
per FLY-76 (SVG + 32/16 ICO + 180 apple-touch + 192/512 maskable).
Clear space one dot-width; minimum 12px. The dot joins the wordmark
in chrome at 12px; quenches to grey ramp when the session is at rest.

**Motion (complete list — nothing else moves; rev E):** pour unchanged ·
active-dot halo 2.6s ease-out · status pip 1.4s sine · quench 3s
ease-out (hold full opacity 45%, land at 50%; glow → 0; strikethrough
appears at start) · agent heat steps: →cherry ~10 min, →furnace
~25 min · concern heat steps per wave · revision wash cools over 24h ·
**the follow:** at the live edge, a new exchange eases in 700ms
cubic-bezier(.22,.9,.28,1); away from the edge the pane holds, an
ember ↓ "new below" mark sits at the pane foot, one click rejoins
(400ms); only the stream pane scrolls · **field grant/quench:** fields
arrive with the pour, quench 3s on resolution · **passage fold:**
open/close ≤200ms ease-out · **glyphs never animate** — the
open-question glow is a held state; the favicon never animates.
Cursor blink and re-render debounce: removed (stay removed).

Rejected during design (do not reintroduce): Space Grotesk (drifted
into AI-startup default), fuchsine #C2185B (superseded — synthesis
story, but no forge identity), vermilion #CB4B16 (Anthropic terracotta),
teal #0A7A72 (inert), blue #33518E (drifts corporate).

## Key screens / surfaces

Iteration 2's five (reference: `Screens - Iteration 2.dc.html`; rev D's
three captured states remain lineage):

- **Master (desk, three-column):** H-C hero pinned above a stream pane
  that scrolls independently; roster left, concerns right; two heat
  fields max in play, hottest in the hero.
- **Master (~720, FLY-81):** roster folds to a horizontal strip under
  chrome; concerns stack beneath the folded hero (leader lines retire —
  the triangle carries the heat); hot-element type never shrinks below
  glance scale.
- **Passage detail:** P-A **inline expansion** — the block grows in
  place; fold via header click, esc, or opening another block. Overlay
  retired as the sheet's mechanism.
- **Artefact review:** an artefact-carrying question's click-through
  renders **the document itself** (P-B overlay shell — a document earns
  a room of its own): real title, 13.5/1.8 measure, doc gutter with ▲
  on changed passages, wash-only on new, margin notes in machine voice,
  "sign off in the session" framing.
- **At rest:** all dots quenched, pip static, phase phrase settled
  grey, "Nothing needs you." as hero; carried concerns keep flat ember
  triangles — no glow.

**The hero (H-C).** Pinned outside the stream's scroll pane; the page
never scrolls away from it. Frame (endeavour): project name in agent
voice + phase phrase — answers "where are we". Hot element (attention):
the single hottest open demand at 19px/600 with its stamp at 22–24px
and a machine-voice "for you —" line — answers "what needs me". Foot:
≤3 bullets, 11.5px. When nothing demands: the frame stands alone
("Nothing needs you." at rest). Glance budget 3–5 points, a long
tweet; glance layer ≥15px, readable without glasses — binding.

**Chrome (rev E).** 52px white bar — FORGE wordmark + the writer's dot
at 12px · identity is human, agent voice: `Forge Sheet — session 2 · 3 aug`
(machine id demoted to hover title) · current phase phrase in ember
(Mono 11px — still the only pipeline indicator). Right: **S-B recency** —
pip + `updated 40s ago` (mono, graphite-text); goes cold-shut when
stale — the alarm's front door. `renders session files · read-only`
deleted; bottom-of-desk counts strip retired.

**Digests (D-A).** True bullets, ink markers (▪), for multi-point
digests; enumerated content in passage detail renders as structured
lists (mono numerals), never flowed prose. Schema gains
`digestPoints[]` alongside `digest`.

**Direct address (component rules).** A question awaiting the human
**is the question**, second person, 16px/600, ember field while open,
machine-voice `for you — answer in the session · the sheet only
records`. **Artefact-carrying question (tier 1+):** deeper wash + full
hairline frame + artefact chip (stamp glyph + filename + `N passages
changed since your last read`). **Risk object:** its own thing — `!`
stamp, `RISK · HIGH · PUT TO YOU`, the stake stated (`if wrong — …`),
`accept or reject in the session`. No buttons; read-only holds.

**File references.** Machine-voice objects inside agent prose: mono
12px in 13.5px prose, graphite-text, dotted ring-grey underline; hover
ember-deep + solid underline + ↗; opens `vscode://file/<abs-path>:line`.
Filename only at digest scale; full path in hover/detail.

**Vocabulary of record:** agents are "quenched" (not "done"); resolution
is a "quench"; concerns are "at heat" (not "active"); aged concerns
earn "STRIKE" at ≥2 waves open · **"put to you"** (a risk awaiting
ruling) · **"carried"** (a demand outliving its session) · **"new
below"** (the follow, held) · **"for you —"** (the address prefix,
machine voice).

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

Rev E deviations, named and bounded (not new licence):
- **Colour beyond marks** — permitted only as temperature-law fields,
  granted by open demand, quenched on resolution
- **17px stamps** — certification stamps, not badges; watched against
  badge creep
- **The artefact chip** — a file object, square-cornered, never
  navigation
