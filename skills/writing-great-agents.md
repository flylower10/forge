# Skills · Writing Great Agents

> Authoring standard for all Forge agent files. Read this before
> creating or editing an agent. This is reference, not steps —
> it defines the vocabulary and failure modes that govern agent quality.

---

## Vocabulary

**Completion criterion** — the checkable condition that ends each
phase of an agent's work. Must be binary: either met or not.

"The human confirmed the framing is accurate" is a completion criterion.
"When you have enough signal" is not.

Every agent phase gets one. Format:

```
**Done when:** [checkable condition in one sentence]
```

For multi-part conditions:

```
**Done when:**
- [ ] [condition one]
- [ ] [condition two]
```

**Gate** — the output condition for the whole agent: what it produces
before the pipeline advances. Distinct from a completion criterion,
which is per-phase within the agent. Both are required. A gate states
what the agent hands off; a completion criterion states when the work
to produce that handoff is done.

**Leading word** — a compact pretrained concept that anchors a whole
region of behaviour. Repeated use accumulates a distributed definition
and shortens the file. Examples in Forge: *surgical* (Engineer), *gate*
(every agent). When a concept takes a paragraph to describe, hunt for
the word that collapses it.

**Sediment** — stale instructions that survive because adding felt safe.
Test: does removing this line change behaviour? If not, delete it.
Every agent file accumulates sediment over time.

**No-op** — a line the model follows by default without instruction.
Paying context to say nothing. The fix is a stronger word, not a
different technique.

**Trigger** — the auto-fire condition for agents that should invoke
without explicit human request. Encoded as a `triggers` array in the
agent's JSON frontmatter. Agents without a `triggers` field require
explicit invocation.

**What you never do** — the failure modes an agent must actively
resist. Encoded in the `constraints` array in JSON frontmatter and
repeated in a body section. Standard across all agent files.

---

## Failure modes

**Premature completion** — ending a phase before it is genuinely done,
attention slipping to *being done*. Defence: sharpen the completion
criterion. A vague criterion invites this; a checkable one prevents it.

**Vague gate** — a gate stated as an aspiration rather than a checkable
condition. "When you have enough signal" is vague. "Human has confirmed
the playback without substantive correction" is checkable.

**Sediment** — stale layers that settle because adding felt safe.
Cure: periodic pruning against the no-op test. The Observer owns
this check.

**No-op inflation** — instructions the model already follows cluttering
the file and consuming context. Test each sentence: does it change
behaviour versus the default? If not, delete the whole sentence rather
than trim words from it.

---

## Pruning discipline

Every agent file should be reviewed periodically for sediment, no-ops,
and vague gates. The Observer is the natural owner of this check —
it critiques process, and agent file quality is a process concern.

When reviewing an agent file:
1. Run the no-op test sentence by sentence. Delete full sentences that
   fail — not just words.
2. Check every gate and completion criterion. Is it checkable? Binary?
3. Hunt for concepts described in multiple sentences that a leading word
   would collapse.
4. Check the `constraints` / `What you never do` section — are these
   still the real failure modes, or have they drifted?
