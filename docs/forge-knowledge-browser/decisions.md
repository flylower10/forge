# Decisions · forge-knowledge-browser
Format: append-only ADR log

---

## 2026-05-10 · File discovery: manifest-based

**Status:** Accepted

A script scans `output/` and writes `output/manifest.json`. The viewer loads from
this manifest. Startup becomes `./forge serve` (wrapper: generate manifest → start
http.server).

Rejected alternatives: directory listing parsing (fragile), manual forge-config.js
registration (the current broken state).

---

## 2026-05-10 · Scope: local browser, phase 1

**Status:** Accepted

Phase 1 is local only. Public hosting is a deferred Phase 2 with different architecture.

---

## 2026-05-10 · Design: extend existing Forge design system

**Status:** Accepted

New artefact types get bespoke layouts within the existing visual language (forge-styles.css,
fg- prefix classes, phase colour coding). No new design system.
