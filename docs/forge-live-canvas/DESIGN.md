# forge-live-canvas · DESIGN.md

**Status:** Discovery complete — draft for Claude Design session. Requires Blueprint brief before build.

---

## What this is

A live HTML companion to active Forge sessions. When a structured moment occurs in the CLI, it surfaces in the browser as a clean, focused view. The user is stretched and cognitively loaded; the canvas must make the moment clear without adding to the load.

The design reference: the car theory test. Every element on the page serves one job — help you understand clearly enough to choose confidently. Context first. Options or findings second. Explanation where necessary, subordinate to the content. Nothing decorative.

---

## Register

The canvas is **related but distinct** from the Forge viewer (`project.html`).

| | Viewer | Canvas |
|---|---|---|
| **Tense** | Past — here is the record | Present — this requires something from you |
| **Surface** | Warm off-white `#f7f7f5` | Cooler neutral `#f4f6f8` |
| **Left accent** | None | Phase-colour border, prominent |
| **Live indicator** | None | Pulse dot or "live" label in header |
| **Layout** | Sidebar + artefact list | Full-bleed, no sidebar, single moment |
| **Chrome** | Archival, quiet | Active, present |

Same typographic family (fg- design system). Different register.

---

## Visual direction

### Primary references

**Swiss International Style (Müller-Brockmann):** Invisible grid felt through section separation. Hierarchy through scale and weight alone. Typography does the work. White space is active — separates sections that must not bleed into each other.

**Dieter Rams (Braun):** "Good design is unobtrusive. Products are tools. A tool that draws attention to itself is failing at its job." The canvas recedes. The content advances. Every element that cannot justify its presence is removed.

### What to avoid

- Flat pastel palettes of modern SaaS
- Rounded cards with heavy drop shadows on content sections
- Gradients
- Any decoration that makes the canvas feel like a product rather than a tool
- Anything that makes the structured content compete with the chrome

---

## Information hierarchy (all 3 output types)

**Above fold (always):**
- What this moment is (output type: decision / pipeline / blocker)
- Why it's surfacing now (context, one or two sentences)
- Live indicator + phase colour

**Below fold:**
- The structured content (options with tradeoffs / pipeline structure / blocker options)
- Explanation where needed, subordinate to the content

**Five engagement modes to support:**
1. Careful read — all information present and well-structured
2. Skim — options scannable without reading prose
3. Ask for clarification — terminal stays live; canvas doesn't block it
4. Push back — same as above
5. Raise a related point — same

---

## Output type layouts

### Decision moment

```
[Phase indicator] [live] [timestamp]
─────────────────────────────────────
Context: why this decision exists now

Options:
  A · [label]     [tradeoff]
  B · [label]     [tradeoff]
  C · [label]     [tradeoff]

Recommendation: [if present]
```

### Pipeline proposal

```
[Phase indicator] [live] [timestamp]
─────────────────────────────────────
Pipeline: [name] · [type]

Agents selected:
  1 · [name]  [role/mode]
  2 · [name]  [role/mode]
  ...

Execution order:
  Wave 1 (parallel): [agents]
  Wave 2 (sequential): [agents — note]

Rationale: [one or two sentences]
```

### Blocker escalation

```
[Phase indicator] [live] [timestamp]
─────────────────────────────────────
Blocked: [what is blocked, one line]

Context: [why it's blocked]

Options:
  A · [resolution path]
  B · [resolution path]

Recommendation: [if present]
```

---

## Colour system

Uses the existing `fg-` design system from `viewer/forge-styles.css`.

Phase colours (left border accent):
- Discovery: `var(--fg-phase-discovery)` — blue
- Refinement: `var(--fg-phase-refinement)` — amber
- Build: `var(--fg-phase-build)` — green
- Marketing: `var(--fg-phase-marketing)` — purple

Canvas surface: `#f4f6f8` (cooler than viewer's `#f7f7f5`, no warmth)

Left border: 3–4px solid, phase colour, full height of the content area

---

## Live indicator

A small signal in the header that this is not an archived artefact.

**Option A (preferred):** A dim pulsing dot. 6px circle, phase colour, CSS `@keyframes` pulse that fades opacity 1 → 0.4 → 1 on a 2s loop. Subtle — doesn't compete with content.

**Option B:** A small "live" label in mono caps next to the timestamp. No animation. More legible at a glance.

Claude Design to choose. Both are acceptable.

---

## Open items for Claude Design

1. Exact visual treatment of phase-coloured left border — width, opacity, whether it extends into the header or starts below it
2. Live indicator choice: pulse dot vs "live" label
3. Typography sizing hierarchy within the fg- system for decision option rows
4. Edge cases: loading state (canvas opened before agent writes the file), no-canvas-yet state (first session open), update transition (new moment written while canvas is open)
5. Mobile layout — is this needed? The builder is on desktop. Defer to Claude Design's judgment.

---

## What done looks like (design session)

- [ ] Decision-moment layout: context block, options table/list, recommendation (if present)
- [ ] Pipeline-proposal layout: agent list, execution order, rationale
- [ ] Blocker-escalation layout: blocked statement, options, recommendation
- [ ] Loading state (before first write)
- [ ] Live indicator treatment chosen and applied
- [ ] Phase-colour left border specified
- [ ] Edge cases shown for all 3 types
- [ ] DESIGN.md updated with all design decisions made in the session
