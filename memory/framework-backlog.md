# Framework backlog

Open improvements to Forge itself. Append-only. Each entry is a real
to-do, not a wish list — if it gets removed, it's because it was
implemented or explicitly killed (with a reason).

This is the equivalent of `decisions.md` for things not yet decided
but worth tracking. When an entry is implemented, move it to a
"Done" section at the bottom with the date and a one-line reference
to the change.

---

## Open

### Extend provings with prototype discipline (Matt Pocock's skill)
**Captured:** 2026-08-03 · flagged by the human as a side quest during the forge-dashboard discovery
**Source:** github.com/mattpocock/skills — skills/engineering/prototype/SKILL.md. The human tends to agree with the intent.
**Why it matters:** Forge's provings answer feasibility questions ("does the hook fire per exchange?"). This skill applies the same throwaway-code move to design-feel questions — a logic branch (small interactive terminal app to exercise a state model) and a UI branch (multiple variants behind a URL switcher) — with six disciplines worth adopting nearly verbatim: disposable by name and location, one command to run, in-memory state only, no tests or abstractions, visible state after every action, findings harvested then the prototype archived to a throwaway branch.
**Before inclusion, two rulings needed:** (1) the boundary with Claude Design — Claude Design owns how it looks; a UI proving owns how it behaves in the real stack; draw the line explicitly. (2) Vocabulary — this lands as an extension of *proving* (the house term that replaced "spike"), not a parallel "prototype" concept. Shape: extend or create `skills/proving.md`, referenced by the Engineer and the Refinement Ceremony (provings are how unknowns are burned down before ACs lock).

### Repo hygiene check ("forge doctor")
**Captured:** 2026-08-02 · Routed by The Arbiter, approved by the human
**Why it matters:** A manual audit against a set of AGENTS.md-style
principles found sediment no Forge surface was scoped to catch: a
backward-compatibility clause living in `hooks/pre-session.md`, a
committed `.superpowers/` scratch directory, dead viewer test files,
a duplicate pre-override plan file, and a stale serve instruction in
CLAUDE.md (all cleaned 2026-08-02). The criticism "why didn't the
viewer surface this" was triaged: rejected as a defect (neither the
agent-pages viewer, Forge Sheet, nor the knowledge browser was scoped
for repo health), re-entered here as a feature candidate.

**Shape (rough):** a check, not a view — a `forge doctor`-style pass
run by the `forge` script or pre-session hook. Candidate signals:
tracked files matching scratch/cache patterns, `.md`/`.html` artefact
pairs where one is orphaned, filename references that resolve to
nothing, superseded-name residue after renames. The knowledge browser
could later display findings, but the check is the feature. Needs
intake (The Scout) before any build.

### Adopt AGENTS.md-style build principles
**Captured:** 2026-08-02
**Why it matters:** The build team's definitions carry almost none of
the discipline that prevents agent-typical failure modes. The Engineer
has one line ("write the simplest code that satisfies the acceptance
criterion"); nothing anywhere covers dependency discipline (check a
library's docs before reimplementing), no-compatibility-layers,
grow-in-layers, or no-stopgaps. The Reviewer is the natural
enforcement point — it is positioned to catch a compatibility shim on
its way in. Agreed direction: fold the principles into the Engineer
and Reviewer definitions, with "remove backward compatibility paths"
caveated for code with external consumers.

### Forge-on-Forge agent
**Captured:** 2026-05-09
**Why it matters:** Forge edits keep happening ad-hoc inside regular
sessions. The framework has a strong "no code outside the pipeline"
rule for product code, but applies no equivalent rule to itself. As
Forge is iterated on constantly, this gap will compound — undocumented
changes, drift between agent definitions and the docs that reference
them, hygiene issues like the Notion residue and burst/sprint naming
drift that surfaced on 2026-05-09.

**Shape (rough):** an agent that handles framework changes the way
the build team handles product code — captures the change as a
proposal, surfaces affected files, makes the edits, records the
decision somewhere durable. Triggered when the human says "let's
update Forge" or when an agent notices its own definition is
inconsistent with what it's being asked to do.

**Lives outside the existing teams** — it's not a discovery agent,
not a build agent, not a marketing agent. Probably a new directory:
`/framework-team/` or similar. Don't fold it into `product-team/`
or `build-team/` since it operates on the framework, not on products.

**Open questions before drafting:**
- Trigger: explicit invocation only, or also on detected drift?
- Output: does it write a "framework decision" log analogous to
  `decisions.md`? Append to this backlog when it spots gaps?
- Scope: does it own README/CLAUDE.md hygiene too, or just agent
  and skill changes?
- Relationship to The Observer (which critiques process during
  sessions) — is this its persistent counterpart?

### UI QA agent — design-to-build delta checker
**Captured:** 2026-05-10
**Why it matters:** Consistent gap between Claude Design intent and what
gets built. First surfaced in the forge-viewer fixlist: badges rendering as
block cards, phantom dots, section chrome wrong, sidebar numbering mixed —
all because the build happened without a structured comparison pass against
the design spec. The cost of the gap is a human QA pass that produces a
fixlist, which then goes back to the engineer. That loop should be automated.

**Shape (rough):** an agent that sits between QA and delivery in the build
pipeline. Takes a screenshot of the rendered output (or a set of screenshots)
and the Claude Design brief / DESIGN.md, compares them, and produces a
structured fixlist in the same format as `forge-viewer-FIXLIST-01.md`:
Critical (spec violations) and Refinements (polish), each with Symptom /
Expected / Likely cause / Reference. Loops back to the Engineer for Critical
items; Refinements can be batched as a follow-up issue.

**Trigger:** after the Engineer completes a frontend task and before QA
signs off. Also on-demand when the human suspects visual drift.

**Open questions before drafting:**
- Screenshot mechanism: does this require a headless browser (Puppeteer/
  Playwright), or can the human supply screenshots manually for the first
  version?
- Does it compare against the Claude Design handover URL, DESIGN.md,
  or the Blueprint brief — or all three?
- Relationship to the existing QA agent: separate agent, or an extended
  mode of QA that activates for frontend tasks?
- How does it handle "Claude Design decides" items vs "brief decides"
  items? The handoff skill distinguishes these — the UI QA agent should too.

### ~~Market signals capture — mid-discovery commercial observations have no home~~
**Captured:** 2026-06-28 · **Resolved:** 2026-06-29
**Why it matters:** During the family-nutrition discovery session, a mid-conversation observation arose about grocery store product data gaps and the commercial opportunity there. It didn't fit any existing Forge structure: not a research log finding (The Researcher wasn't invoked), not an open concern (it's not a risk), not an agent output (no agent owns commercial intelligence during discovery). It had to be written into a new ad-hoc "Market signals" section of the running brief.

This will recur. Discovery conversations regularly surface observations about market structure, data access, distribution gaps, and partnership opportunities. Currently these either get lost or require inventing a container for them each time.

**Shape (rough):** Two possibilities —
1. **Structural:** Add a "Market signals" section to the running brief template (`skills/artefact-templates.md`) as a standard capture point. Any participant (human or agent) can append observations. Synthesis picks these up and routes them to The Merchant or relevant agents.
2. **Agent:** A lightweight "The Cartographer for markets" — observes mid-discovery conversations, flags commercially significant observations (who holds the data, where distribution gaps lie, what partnership opportunities exist), and appends to the signals log. Not a full agent session — more like The Researcher but for commercial intelligence rather than factual gaps.

**Open questions before deciding:**
- Is this a structural fix (template section) or a behavioural one (new agent)?
- Should The Merchant be triggered earlier — mid-discovery rather than only when "an idea requires commercial thinking"?
- Is The Researcher's remit broad enough to cover this if explicitly invoked, or does commercial intelligence need a different agent personality?

### Forge design system — viewer-rendered artefacts via structured data
**Captured:** 2026-06-29
**Why it matters:** The current HTML output system requires Claude to hand-assemble CSS inline into each HTML file. The result is inconsistent across artefacts, hard to maintain, and produces UX that is difficult to read (wide tables, no interactivity, no shared component library). The `forge-styles.css` design system exists but is a CSS file that must be copied in full each time — not a real component system.

**The opportunity:** The viewer already reads frontmatter JSON from `.md` files and renders them. If agents produce structured data (which they already do) instead of hand-built HTML, the viewer can render artefacts consistently using a real component library. This is the same architecture as the Forge knowledge browser idea in memory.

**Shape:**
- Agents produce `.md` files with rich frontmatter JSON (tables as arrays, not markdown text) — the breadboard is a prototype of what this structured data could look like
- The viewer's React app renders these using a shared component library (table component, unknown card, metric grid, pipeline strip, tabs)
- HTML files become the exception (for truly bespoke layouts), not the rule
- The viewer becomes the canonical display surface for all Forge artefacts

**This is a product that should run through Forge's own pipeline before being built.** Treat it as a first-class idea: Scout → PM Agent (what does readable mean for each artefact type) → Synthesis → build.

**Immediate fix (while the bigger system is built):** Codify the breadboard HTML layout as the template for breadboard artefacts. Add an instruction to `product-team/breadboard.md` to produce and open a `breadboard.html` file using this layout — not a hand-assembled CSS dump, but following the tabbed structure with proper wide-table handling.

### Viewer underutilisation — agent outputs live only in chat
**Captured:** 2026-06-29
**Why it matters:** Discovery agent outputs (PM framing, design framing, assumption log, breadboard) are produced as long text in chat and are difficult to read and review. The viewer exists but is not being actively used during the pipeline. The only HTML artefacts currently produced come from Synthesis at the end of discovery — everything before that has no visual home. The output structure in CLAUDE.md already specifies `[agent-outputs].html` as individual retained files, but no agent is producing them.

**Two fixes needed:**

1. **Wave checkpoints** — Add a convention to the pipeline that after each wave completes, the running brief is opened in the viewer before the next wave begins. This makes the running brief the review surface between waves, not the chat transcript. Should be codified in `hooks/pre-session.md` or the agent handoff protocol.

2. **Individual agent HTML outputs** — Each agent that produces a substantial output should save it as `output/[idea-name]/[agent-slug]-output.html` immediately after producing it, and open it in the browser. This makes every agent output independently browsable and reviewable. Requires: a lightweight HTML template for agent outputs (in `skills/artefact-templates.md`), and an instruction in each agent definition to produce and open the file.

**Open questions before implementing:**
- Should the agent output HTML use the full Forge layout (sidebar, topbar) or a simpler reading view?
- Which agents should produce HTML outputs? All of them, or only the ones with substantial structured outputs (PM Agent, Design Agent, Devil's Advocate, Tech Feasibility, Breadboard)?
- Should the viewer serve these agent output files, or do they open directly in the browser?

### README structure block staleness
**Captured:** 2026-05-09 (mitigated, not solved)
**Why it matters:** The structure block was badly out of date when
last touched (missing breadboard, ux-agent, observer, research-agent,
several skills). Mitigated by replacing the verbose enumeration with
a category-level view that points at CLAUDE.md as the canonical
agent directory. Still worth thinking about: agents/skills are added
frequently and the README will keep drifting unless something
auto-generates the agent list — possibly a job for the Forge-on-Forge
agent above.

---

## Done

### Linear value threshold · 2026-08-03
Resolved same day it was captured. The human, after three XS items in
one session each forcing a routing decision ("there's a level of scope
that makes it academic and busy work"), adopted the heat-boundary
threshold the Observer recommended: Linear only for work that outlives
the session — crosses a boundary unfinished, needs multi-issue
sequencing (e.g. implementing an updated design system), or is a
planned heat. Session-scale XS/S work carries AC in the heat handover,
runs the full pipeline, and graduates to Linear at Banking the Fire if
unbuilt. Codified in `skills/feature-triage.md` (routing table +
threshold), CLAUDE.md (tool ownership + governance), and an ADR in
`memory/decisions.md`.

### Market signals capture · 2026-06-29
Resolved by: (1) `skills/market-landscape.md` — methodology for identifying structural market gaps; (2) step 5a added to The Interrogator's discovery arc invoking the skill; (3) Market signals section added to the running-brief.md template in artefact-templates.md. Decision: skill over dedicated agent — the PM function already owns this lens, the skill distributes it without creating a new pipeline step.

### Design Agent visual direction — moved to Claude Design · 2026-06-30
The Design Agent's step 7 (visual direction) was misassigned. Hand-coded HTML moodboards are an inferior output to what Claude Design can produce, and the recognition/iteration loop was painful and slow. Fixed: step 7 now writes a `claude-design-brief.md` and hands off to a Claude Design session. Steps 1–6 (empathy, context, interaction patterns, constraints) stay in Forge because they are framework-integrated (read/write running brief, seed DESIGN.md). Visual direction work belongs in Claude Design. The `skills/claude-design-handoff.md` skill governs the session. Open question: if Claude Design supports project-level instructions, the full Design Agent conversation (not just visual direction) could run there — test and update this entry if confirmed.

### Agent alias legibility · 2026-07-12
The human reports the agent aliases (The Narrator, The Sceptic, The Tracer…) have become so abstract that he no longer knows who they are — "honestly annoying." The aliases carry personality but not function. Improvement: every surface that names an agent (session prose, running briefs, handoff logs, viewer roster) must pair alias with plain function on first use — "The Sceptic (risk challenger)", "The Tracer (journey mapper)". Candidate deeper fix: add a `plain` field to agent frontmatter and render it everywhere the alias appears. The forge-viewer roster design should use both voices: alias in Overpass, function in Overpass Mono.

### Artefact rendering fragmentation · 2026-07-12
Three visual worlds now exist: dark artefact HTML outputs (skills/forge-styles.css), the viewer's agent pages (viewer/forge-styles.css, fg- prefix), and the forge-viewer drafting-sheet design (rev C, fuchsine/Overpass). The human flagged this while reviewing the forge-viewer breadboard: "why does it use a different style sheet... this should be rolled into the viewer too right?" Direction: once forge-viewer ships, per-artefact standalone HTML files should progressively be absorbed into a single served rendering path (relates to the existing "Forge knowledge browser" idea). Until then, artefact outputs keep following skills/forge-styles.css — do not restyle ad hoc.
