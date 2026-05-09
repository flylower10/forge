# Hook · Post-session

Run these steps at the end of every framework session before closing.

---

## 1. Regenerate and publish product artefacts
Any artefacts produced or updated this session live in
`/output/[idea-name]/`. For every `.md` source that changed:

- Regenerate the corresponding `.html` using the templates in
  `skills/artefact-templates.md` (embed `forge-styles.css` inline)
- Confirm the running brief reflects the latest agent handoffs
- Stage and commit `/output/[idea-name]/` alongside any `/docs/` updates

Nothing produced in a session should exist only in conversation.
The HTML companion is the browsable view — a session is not closed
until both source and view are current.

## 2. Push technical artefacts to GitHub
Commit any updates to:
- `/docs/CLAUDE.md` — if decisions were made or scope changed
- `/docs/DESIGN.md` — if design context was updated
- `/docs/decisions.md` — if an ADR was written

Commit message format:
`[phase] [agent/role]: [one sentence describing what changed]`
Example: `discovery synthesis: initial brief and CLAUDE.md`

## 3. Update Linear
If this was a build session:
- Mark completed issues as done with a brief completion note
- Create new issues for anything discovered during the session
- Update any issues whose scope or understanding changed
- Create blocker issues for anything escalated

## 4. Signal log check
Ask the human: "Any new signal worth logging since the last entry?"

If yes, invoke the Delivery Manager's signal log ritual
(see `build-team/delivery-manager.md`).

If no, skip — the fortnightly floor check at Re-entry will catch
anything that's been sitting too long.

The signal log is empirical learning from shipped work, not a
status report. An entry that says "no signal yet" is noise. Silence
is honest.

## 5. Log architectural decisions
If any foundational decisions were made, append an ADR to
`/docs/decisions.md` using the format in
`/build-team/architect.md`. Commit to GitHub.

If a strategic decision changed the opportunity tree (added,
killed, paused, or reordered an opportunity), append to
`output/[idea-name]/ost-decisions.md` instead — that's the
strategic equivalent of `decisions.md`.

## 6. End with a clear next step
End every session with one sentence stating exactly what
happens next. This is what the pre-session hook will
reconstruct from GitHub and Linear.

If there is nothing to do next — the pipeline is complete,
the build is done — state that explicitly.
