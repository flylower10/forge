# Skill · Claude Design Handoff

How to run a Claude Design session from a Blueprint brief.
Written for a human taking the brief into Claude Design for the first time.

---

## Before you start

Have these three things open and ready to paste:

1. `docs/DESIGN.md` — the design system. Paste this first, every session.
2. `docs/design-brief.md` — the Blueprint brief. Paste this second.
3. The existing frontend (if one exists) — point Claude Design at it or
   paste the relevant component code. This is context, not instruction.

Do not start asking Claude Design to design screens until you have
provided all three. Designing without the design system produces work
that will need to be redone.

---

## Opening the session

Do not open with a vague request. Claude Design works best with a
specific framing that tells it what kind of session this is.

**If extending an existing product:**

> "I have an existing product with a design system defined in DESIGN.md
> and a built frontend. I need to design [N] new screens. Here is the
> design system: [paste DESIGN.md]. Here is the Blueprint brief for the
> new screens: [paste design-brief.md]. Here is the existing frontend for
> context: [paste or reference]. Design the new screens to extend what
> exists — don't redesign the product."

**If greenfield:**

> "I am designing a new product from scratch. Here is the design system
> to work from: [paste DESIGN.md]. Here is the Blueprint brief:
> [paste design-brief.md]. Design the screens described in the brief."

The key phrase for extensions is **"extend, don't redesign"**. Without
it, Claude Design may produce something coherent in isolation that does
not fit the product it lives inside.

---

## Working through the brief

Work screen by screen, not all at once. After each screen:

1. Review the output against the brief's **information hierarchy** —
   is the most important element the most prominent?
2. Review against the brief's **DESIGN.md constraints** — are the
   named principles applied correctly to this screen?
3. Check the **edge cases** — loading, empty, error states. Ask
   explicitly if Claude Design hasn't shown them.

One screen at a time gives you a natural checkpoint and prevents
Claude Design from making assumptions on subsequent screens that
propagate from a mistake on an early one.

---

## What Claude Design decides — don't intervene

These are Claude Design's calls. Trust the output unless it violates
a named principle from DESIGN.md or the brief:

- Which existing components to reuse vs introduce new ones
- Visual treatment of any element (spacing, weight, colour application,
  motion, border radius, shadow)
- How to handle transitions between old and new screens
- Which nav pattern to use on mobile (bottom bar, compressed top nav, etc.)
- Whether an interaction is a modal, drawer, inline expand, or new route
- Typography sizing and weight hierarchy within the design system

The brief defined intent and structure. Everything listed above is
execution. Do not second-guess execution decisions on aesthetic grounds.

---

## What the brief decides — push back if Claude Design overrides it

These are not Claude Design's calls. If the output contradicts the
brief on any of these, redirect:

- **Information hierarchy** — if the most important element per the
  brief is not the most prominent on screen, say so explicitly.
  Example: "The brief says prob_top_scorer is the most important number
  on the Scorers screen. In this design it's competing with the player
  name. Resolve through reduction."

- **Concealment treatment** — `??` is specified. Not blur, not lock
  icons, not dimming. If Claude Design uses a different treatment,
  correct it.

- **Component inventory** — if a component specified in the brief is
  absent, ask for it. If Claude Design adds a component not in the
  brief, ask whether it's necessary (it may be — Claude Design sees
  things the brief didn't anticipate).

- **Acceptance criteria** — the brief's AC are functional, not visual.
  Claude Design cannot override them. They are what QA tests against.

- **Desktop-only constraints** — the brief specifies Elo override
  controls are desktop-only. If Claude Design puts them on mobile,
  remove them.

**How to redirect without breaking the session:**

> "The brief specifies [X] for this screen. The current design has [Y].
> Can you revise to honour the brief on this point, while keeping your
> visual decisions elsewhere?"

Keep redirects specific. Do not say "I don't like this" — say "the
brief specifies X and the design currently shows Y."

---

## Handling the open items

The Blueprint brief includes open items — decisions explicitly left for
Claude Design. When Claude Design resolves one, note it:

- What the decision was
- What Claude Design chose
- Whether it creates any implication for the Engineer (e.g. a new
  component that needs to be built, a nav pattern that affects routing)

These notes come back to the Delivery Manager with the confirmation
that Claude Design is done.

---

## What "done" looks like

A Claude Design session is complete for a screen when:

- [ ] All components in the brief's component inventory are present
- [ ] Information hierarchy matches the brief (most important = most prominent)
- [ ] Edge cases (loading, empty, error) are shown
- [ ] DESIGN.md constraints named in the brief are visibly applied
- [ ] Mobile and desktop variants exist (for screens that require both)
- [ ] Any open items from the brief have been resolved and noted

Do not mark a screen done if edge cases are missing. They will be
built — the Engineer needs to know what they look like.

---

## DESIGN.md sync — required before closing the session

Before the Claude Design session ends, request a DESIGN.md diff.
**This is not optional.** Claude Design makes design decisions throughout
the session — new component patterns, resolved layout questions, mobile
behaviour, interaction details — that are not automatically written back
to DESIGN.md. If they are not captured, the design system diverges from
what was built and future sessions start from a stale baseline.

Use this prompt at the end of every session, before the handover:

> "Before we finish: produce a summary of every design decision made in
> this session that should be written back into DESIGN.md. Include:
> new component patterns, updated or new layout rules, mobile-specific
> additions, resolved open items, and any decisions that extend or
> override the existing design system. Format it as proposed additions
> to DESIGN.md so I can apply them directly."

If Claude Design cannot produce this summary — do not close the session.
Ask again. A handover without a DESIGN.md sync is incomplete.

### Applying the diff

Once you have the summary:
1. Read the current `docs/DESIGN.md`
2. Apply Claude Design's additions — new sections, updated rules,
   mobile patterns
3. Do not remove existing rules unless Claude Design explicitly
   proposed overriding them and you agreed
4. Commit the updated DESIGN.md before the first frontend Engineer
   task starts

The Delivery Manager must confirm DESIGN.md has been updated before
unlocking any frontend task. An Engineer working from a stale design
system will make decisions Claude Design already resolved.

---

## Handing back to the Delivery Manager

When Claude Design is complete and DESIGN.md has been updated,
return to the build pipeline and confirm with the Delivery Manager:

> "Claude Design is done. DESIGN.md updated. Screens cleared for
> frontend build: [list screen names]. Notes from the session:
> [any component decisions or resolved open items that affect the
> Engineer]. Open items resolved: [list]."

The Delivery Manager will then unlock the frontend tasks for those
screens. Backend tasks that were running in parallel are unaffected.

**The Delivery Manager must not unlock frontend tasks until
DESIGN.md sync is confirmed.** If the confirmation does not include
"DESIGN.md updated", ask before proceeding.

---

## Receiving the Claude Design handover

When Claude Design is complete it produces a handover — typically a URL
and an instruction that reads something like:

> "Fetch this design file, read its readme, and implement the relevant
> aspects of the design."

**This is not how it works in Forge.** That instruction assumes a naked
Claude Code session with no pipeline. Do not run it as a standalone
command.

### How to use the handover in Forge

The Claude Design handover URL is **task context for the Engineer**,
not a replacement for the pipeline. Here is the correct flow:

1. Copy the handover URL from Claude Design
2. Return to Forge and confirm to the Delivery Manager that Claude
   Design is done (per the "Handing back" section above)
3. The Delivery Manager creates the frontend Engineer tasks with:
   - Title and acceptance criteria from the Blueprint brief
   - The handover URL included in the task description as
     "Claude Design reference: [URL]"
4. The Engineer fetches the design file as **visual and structural
   reference** and implements against the task's acceptance criteria
5. The Engineer does not treat the handover's "implement" instruction
   as the task definition — the AC defines done, not Claude Design

### Why this matters

The handover contains Claude Design's implementation intent. The
acceptance criteria contain what the product actually requires. These
are not the same thing. The Engineer reads both and produces an
implementation that satisfies the AC and reflects the design.

If there is a conflict between the handover and the AC, the AC wins.
Flag the conflict to the Delivery Manager rather than silently
resolving it.

---

## Common mistakes

**Pasting the brief without DESIGN.md first.**
Claude Design will make up a visual language. It won't look like
your product.

**Working all screens at once.**
Mistakes on screen 1 propagate silently. Work screen by screen.

**Redirecting on aesthetic grounds.**
"I don't like how that looks" is not a reason to redirect. The
brief defines what matters. If the brief doesn't prohibit it,
trust Claude Design's visual judgment.

**Forgetting edge cases.**
Every screen has a loading state, an empty state, and an error
state. If Claude Design hasn't shown them, ask. The Engineer
will build them regardless — they need to know what they look like.

**Not noting resolved open items.**
The brief flags decisions left for Claude Design. If you don't
record what was decided, the Engineer will have to guess.
