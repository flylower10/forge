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

A vague criterion invites premature completion — the agent's attention
slips to *being done* rather than *being done correctly*. A checkable
criterion prevents it.

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

A gate stated as an aspiration is a vague gate — distinct from premature
completion. Premature completion is stopping too soon; a vague gate is
having an unclear stopping condition in the first place. "When you have
enough signal" is a vague gate. "Human has confirmed the playback without
substantive correction" is checkable.

**Leading word** — a compact pretrained concept that anchors a whole
region of behaviour. Repeated use builds a shared meaning across the
file and shortens it. Examples in Forge: *surgical* (Engineer), *gate*
(every agent).

When a concept takes a paragraph to describe, hunt for the word that
collapses it. For instance, instead of "touch only what the task
requires, don't improve adjacent code, don't refactor unrelated
functions" — the single word *surgical* anchors all of this.

**Sediment** — stale instructions that survive because adding felt safe.
Test: does removing this line change behaviour? If not, delete it. The
Observer is the natural owner of this check — it critiques process, and
agent file quality is a process concern.

**No-op** — a line the model follows by default without instruction.
Paying context to say nothing. The fix is to find a leading word that
collapses the meaning, or delete the sentence outright. Do not trim
words — delete the whole sentence if it fails the test.

**Trigger** — the auto-fire condition for agents that should invoke
without explicit human request. Encoded as a `triggers` array in the
agent's JSON frontmatter. Agents without a `triggers` field require
explicit invocation.

**What you never do** — the failure modes an agent must actively
resist. Encoded in the `constraints` array in JSON frontmatter and
repeated in a body section. Standard across all agent files.
