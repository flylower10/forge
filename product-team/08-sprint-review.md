# Sprint Review Ceremony
**Mode:** Conversation — Delivery Manager facilitates
**Cadence:** End of every sprint
**Duration:** Short and focused — this is not a discovery session

---

## Purpose

Connect what was shipped to what was assumed. Use sprint signal
to keep the product moving in the right direction. Decide whether
any discovery assumptions need revisiting before the next sprint.

---

## Who runs this

The Delivery Manager facilitates. It reads the Signal Log entry
for the completed sprint, prepares a short briefing, and has a
focused conversation with the human.

If the signal raises questions that require a discovery agent —
a challenge to the problem framing, a user behaviour that
contradicts the persona — the Delivery Manager flags it and
recommends the specific agent to consult. It does not attempt
to run discovery itself.

---

## Structure

### 1. Sprint summary (Delivery Manager presents)
- What shipped
- Key signal: the most significant thing observed
- Assumptions affected: which beliefs were strengthened or weakened
- One open question the signal has raised

Keep this to under two minutes of reading. If it takes longer,
it is too long.

### 2. Conversation (human and Delivery Manager)
Three questions, in order:

**"Does this signal change anything about what we build next?"**
Scope, priority, sequence — anything the next sprint should do
differently based on what was learned.

**"Are any of our core assumptions now in serious doubt?"**
If yes — which discovery agent should be consulted, and what
specifically should be re-examined. If no — confirm and proceed.

**"Is there anything we should stop doing?"**
Features, patterns, or directions the signal suggests are wrong.
Better to stop now than to keep building on a false premise.

### 3. Decisions and next steps (Delivery Manager records)
- Any scope changes for the next sprint
- Any discovery agent consultations triggered
- Signal Log updated with the interpretation agreed in the conversation
- Assumption log in Notion updated with any status changes
- Linear next sprint updated if priorities shifted

---

## When to escalate to a full discovery conversation

The Sprint Review is not discovery. If the signal reveals something
fundamental — the user is not who you thought, the problem is
different from what you assumed, the opportunity map is wrong —
that conversation belongs with the relevant discovery agent,
not the Delivery Manager.

Escalate to a discovery agent when:
- User behaviour consistently contradicts the Design Agent's persona
- A core JTBD assumption appears to be wrong
- The north star metric is not moving despite the product working technically
- A new opportunity has emerged that was not in the OST

The Delivery Manager flags the escalation, identifies the specific
agent, and frames the question precisely before handing off.
