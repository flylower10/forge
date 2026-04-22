# Skill · Design References

A curated reference library for the Design Agent. Use this to ground
visual direction in specific, influential work rather than generic
design language. "Clean and minimal" is not a direction. "Tufte's
data-ink principle applied to a dark palette" is.

This skill is not exhaustive. It covers the references most likely
to be relevant to digital product design. Add to it as new ideas
surface references not yet here.

---

## How to use this skill

When the user gives you a visual direction — a mood, an era, a
reference, a feeling — find the corresponding entry here. Extract
the specific principles that apply. Name them in your DESIGN.md
output. The more specific the reference, the more distinctive the
output from any downstream design tool.

Do not apply all references at once. One or two anchors, precisely
chosen, are better than five competing influences.

---

## Data visualisation

### Edward Tufte
**Works:** The Visual Display of Quantitative Information (1983),
Envisioning Information (1990)

**Core principles:**
- **Data-ink ratio:** Every mark on the page should encode data.
  Remove anything that doesn't. Borders, backgrounds, grid lines —
  all of it is ink that isn't doing work unless it must be there.
- **Chartjunk:** Decoration that obscures data is not neutral —
  it actively misleads. Gradients on bar charts, 3D effects,
  unnecessary icons around numbers: all chartjunk.
- **Small multiples:** Repeat the same graphic form across
  different slices of data. The eye compares across them effortlessly.
- **Layered information:** Dense data can be made readable through
  hierarchy, not simplification. Don't reduce — stratify.

**When to invoke:** Any product where the primary job is reading
numbers. Data tables, probability displays, comparison views.

**In practice:** No borders on table cells if spacing does the
job. No background fill on chart areas. Numbers in a tight,
consistent typeface. The data is the visual.

---

### FiveThirtyEight (Nate Silver, 2008–present)
**Core principles:**
- Confidence intervals and uncertainty are first-class data —
  shown, not hidden
- Charts have visible methodology: axis labels are honest,
  scales are not manipulated
- Probability is displayed as probability, not as false certainty
- Editorial voice in the data: the most important number is
  given visual weight

**When to invoke:** Probability tables, model outputs, any view
that shows "what the model thinks" vs what the market says.

---

## Typographic precision

### Dieter Rams — Braun, 1955–1995
**10 principles (the relevant ones for digital product):**
- **Good design is as little design as possible:** Every element
  that remains must justify its presence. The default is removal.
- **Good design is honest:** Don't make a product look more
  innovative, powerful, or valuable than it is.
- **Good design is unobtrusive:** Products are tools. A tool
  that draws attention to itself is failing at its job.
- **Good design is long-lasting:** Avoid fashionable. Fashionable
  ages. Timeless is harder but better.

**When to invoke:** When the user wants something that feels
serious and lasting rather than trendy. Products that are tools,
not experiences.

---

### Swiss International Style — Müller-Brockmann, Ruder, 1950s–70s
**Core principles:**
- Grid systems as structure: everything on the page relates to
  a grid. The grid is invisible but felt.
- Typography as primary visual element: type does the work that
  imagery might otherwise do
- Hierarchy through scale and weight, not decoration
- White space as a positive element, not absence

**When to invoke:** Data-heavy layouts, dashboard structures,
any product where information density needs to be readable.

---

## Retro digital / pixel aesthetic

### Early personal computer graphics — Amiga, Atari ST, 1985–1992
**The constraint that became the aesthetic:**
- Limited colour palettes (16–32 colours) forced deliberate choice.
  Every colour used had to earn its place.
- Dithering as gradient: two colours alternated in a checkerboard
  pattern to simulate a third. This is a specific, recognisable texture.
- Pixel fonts: designed on a grid, each character built from visible
  units. Weight comes from pixel count, not bezier curves.
- Scanline texture: the visible horizontal lines of a CRT monitor.
  Subtle as a texture, not a filter.
- Hard edges: no antialiasing. Shapes are crisp because the pixels
  are large enough to see.

**Specific works to reference:**
- Deluxe Paint (EA, 1985): the tool that defined the Amiga aesthetic
- Cinemaware games (Defender of the Crown, 1986): cinematic ambition
  within pixel constraints
- Early Bitmap Brothers games (Speedball 2, 1990): dark palettes,
  heavy UI chrome, functional-feeling interfaces

**When to invoke:** When the user references early gaming, retro
digital, or the specific visual quality of late-80s/early-90s software.

**In practice:**
- Use pixel or bitmap-style fonts for headlines and key numbers
- Limit the palette to 6–8 deliberate colours; don't use more
- Use dithering as a texture or transition effect, not smooth gradients
- CRT warmth is amber/green tint, not blue. Warm cathode, not cold LED.
- Dark backgrounds (#1a1008 or similar — near-black with warm undertone,
  not pure black)

---

### Championship Manager / early football simulation UI, 1992–1996
**The aesthetic:**
- Tables as the primary UI element. Everything is a table.
- Monospace or near-monospace type for data alignment
- Minimal colour: one accent colour for highlighted rows or values,
  everything else in a neutral
- No images. Pure text and data.
- The interface communicates seriousness: this is a tool for
  people who take football seriously

**When to invoke:** Football analytics, betting tools, any product
where the user is an expert who does not need things explained visually.

---

## Dark + warm palette

### Apocalypse Now poster (Bob Peak / United Artists, 1979)
**The colour story:**
- Deep orange-amber as the dominant mid-tone (approximately #c4622d)
- Near-black with warm undertone as the base (#1a0f08)
- A single highlight colour: bright amber or gold (#e8a030)
- Deep red used sparingly for emphasis (#8b1a1a)
- No cool colours. No blue, no green, no grey. The warmth is total.

**The quality:**
- The orange reads as both sunset and fire — heat and scale
- High contrast between the near-black base and the orange mid-tones
- The palette feels like something is at stake

**When to invoke:** Any product that wants warmth over coolness,
drama over neutrality. Sports, betting, anything where the stakes
should feel real.

---

### Italia 90 aesthetic (1990 World Cup)
**The graphic direction (for reference — not the primary direction):**
- The Ciao mascot and tournament branding: geometric abstraction,
  the sphere made of football segments
- Terracotta and earth tones grounding warm oranges
- Bold, confident typography — the era's graphic design had weight

**Why the pixel/digital direction is richer:**
- The Italia 90 graphic style is fixed and iconic — you can reference
  it but can't build a flexible system from it
- The early-digital aesthetic of the same era has the same warmth
  but is a generative system: it produces layouts, typography,
  texture, and interaction patterns, not just a logo style

---

## Sports analytics / information design

### The Athletic (2016–present)
**Core principles:**
- Long-form data journalism: the data serves the story, not vice versa
- Typography-led: the writing and the numbers are given equal weight
- Context always accompanies data: a percentage means nothing without
  a comparison or a benchmark

---

### Opta / StatsBomb
**Core principles:**
- Pitch maps as primary visualisation: data shown in spatial context
- Colour encoding for intensity (heat maps, pass networks)
- The expert audience knows what they're looking at — no hand-holding

**When to invoke:** Any football product with spatial data (pass maps,
shot maps, pressure maps). Not directly relevant to tournament simulation
but useful if the product ever visualises match-level spatial data.

---

## Principles for the Design Agent

When writing the visual direction section of DESIGN.md:

1. **Name specific references** — "Tufte data-ink applied to a dark
   palette" not "clean data design"

2. **Specify the palette** — give approximate hex values or colour
   names with the reference they come from. "Near-black with warm
   amber undertone (#1a0f08), saturated orange mid-tone (#c4622d),
   amber highlight (#e8a030)" is actionable. "Dark with warm tones" is not.

3. **Specify the type treatment** — pixel/bitmap for headlines?
   Monospace for data? These are concrete decisions.

4. **Name what to avoid with the same specificity** — "not the
   flat pastel palette of modern SaaS" is more useful than "not minimal"

5. **Give the downstream tool a tension to resolve** — the best
   briefs have a productive contradiction: "data-dense but not
   overwhelming", "retro but functional", "serious but exciting".
   This gives the designer (human or AI) something to solve.

---

## Benchmark products — for the UX Agent

When the UX Agent specifies a screen, it should name at least one
benchmark product and what it is drawing from it. These are the
benchmarks most likely to be relevant to data and analytics products.

### Linear
The benchmark for fast, opinionated product UI.
- **Speed as a design constraint:** Every interaction is instant or
  communicates clearly that it isn't. Latency is never hidden — it is shown.
- **Keyboard-first:** Primary actions are reachable without a mouse.
  The product assumes a power user.
- **Typographic hierarchy:** Labels, values, and metadata have distinct
  and consistent visual weights. Nothing competes.
- **No decorative motion:** Transitions serve navigation, not aesthetics.
Apply when: specifying any view where the user has a specific thing they
came to do and needs to do it fast.

### Stripe Dashboard
Financial data at scale, made readable.
- **Information architecture:** Dense data is grouped, not compressed.
  The user always knows what section they are in.
- **Table design:** Rows breathe. Column alignment is precise. The most
  important column is visually dominant.
- **Typographic consistency:** One type scale, applied without exception.
  The system is felt before it is seen.
Apply when: specifying any table-heavy view or multi-column data display.

### Vercel Dashboard
Data density without visual collapse.
- **Progressive disclosure:** Summary at the top, detail below.
  The user can stop reading at any level and have something useful.
- **Status communication:** States (deploying, failed, ready) are
  communicated with colour and icon — never ambiguous.
- **Dark mode discipline:** High contrast between data and surface
  without the surface competing for attention.
Apply when: specifying screens with many simultaneous data points,
status indicators, or pipeline/process states.

---

## Designers — for the UX Agent

### Rasmus Andersson (Figma, Linear)
Systematic reduction. Every element earns its place. No decoration
without function. Reference when deciding component structure and
when in doubt about whether something should exist.

### Emil Kowalski
Interaction and motion done with restraint. Core principle: motion
should communicate state change, not decorate. If something moves,
it is because data changed or an action completed — not because the
page loaded. Reference when specifying any animated or interactive
behaviour.

### Paco Perez
Typography and layout. Reference for spacing systems, typographic
scale decisions, and how to create hierarchy without colour.

---

## Platforms — staying current

**Mobbin** — the best library of real product UI screenshots,
organised by pattern and platform. Use before specifying any screen
type to find real-world examples of how others have solved the same
problem. mobbin.com

**Godly** — curated high-quality web design and product UI.
Useful for visual direction and layout. godly.website

**Awwwards** — broader and noisier than Godly. Filter for tools and
data products, not marketing sites. awwwards.com

**Sidebar.io** — daily curated design links. Useful for staying current
with trends without noise. sidebar.io

**Fonts In Use** — documents real-world type applications. Use when
making or reviewing typography decisions. fontsinuse.com

---

## How to keep this file current

Update this file when:
- You encounter a product that solves a screen-level problem unusually well
- A designer publishes work worth referencing
- A benchmark product releases a significant redesign
- A new tool or platform becomes the standard for its category

This file is a living reference. It should feel more current each
time you open it, not more stale.
