// viewer/v2/running-brief-parser.js
// Parses forge running-brief markdown into structured data for HandoffTimeline and PipelineMap.
// Written for the format produced by Forge agents — not the YAML-based HANDOFF.md format.
//
// Exports: window.ForgeRunningBriefParser = { parseHandoffLog, parsePipelineConfig, buildAgentPhase }

(function () {

  const TAG_KINDS = new Set([
    'DECISION', 'OPEN QUESTION', 'TECH FEASIBILITY', 'DESIGN REVIEW',
    'SPIKE', 'REFINEMENT AGENDA ITEM', 'SCOPE GAP',
  ]);

  /**
   * Build AGENT_PHASE lookup from FORGE_CONFIG.PIPELINE.
   * Returns { agentName → phase }.
   */
  function buildAgentPhase() {
    const map = { 'The Scout': 'discovery' };
    const pipeline = (window.FORGE_CONFIG && window.FORGE_CONFIG.PIPELINE) || [];
    pipeline.forEach(a => { if (a.name) map[a.name] = a.phase || 'discovery'; });
    return map;
  }

  /**
   * Parse a single list-item body string into either a plain string or a tagged object.
   * Input: "[TECH FEASIBILITY — RESOLVED] Some text" | "plain text"
   * Output: string | { tag, body, resolved?, n? }
   */
  function parseItem(raw) {
    const text = raw.replace(/^\s*-\s+/, '').trim();
    const m = text.match(/^\[([^\]]+)\]\s*(.*)/s);
    if (!m) return text;

    const tagContent = m[1].trim();
    const body = m[2].trim();

    const resolved = /—\s*RESOLVED\s*$/i.test(tagContent) || undefined;
    const cleanTag = tagContent.replace(/\s*—\s*RESOLVED\s*$/i, '').trim();

    // "REFINEMENT AGENDA ITEM 1" → tag + n
    const nMatch = cleanTag.match(/^(.+?)\s+(\d+)$/);
    let tag, n;
    if (nMatch && TAG_KINDS.has(nMatch[1].toUpperCase())) {
      tag = nMatch[1].toUpperCase();
      n = parseInt(nMatch[2], 10);
    } else {
      tag = cleanTag.toUpperCase();
      n = undefined;
    }

    if (!TAG_KINDS.has(tag)) {
      console.warn('[running-brief-parser] Unknown badge kind:', tag);
      tag = 'UNKNOWN';
    }

    const result = { tag, body };
    if (resolved) result.resolved = true;
    if (n != null) result.n = n;
    return result;
  }

  /**
   * Parse a block of text into list items (lines starting with "- ").
   */
  function parseList(text) {
    return text.split('\n')
      .filter(l => l.trimStart().startsWith('- '))
      .map(parseItem)
      .filter(Boolean);
  }

  /**
   * Extract a **Label:** subsection from entry body text.
   * Returns the raw lines of that subsection.
   */
  function extractSubsection(body, ...labelPatterns) {
    for (const pattern of labelPatterns) {
      const re = new RegExp(
        `\\*\\*${pattern}\\*\\*:?\\s*\\n([\\s\\S]*?)(?=\\n\\*\\*|\\n###|$)`,
        'i'
      );
      const m = body.match(re);
      if (m) return m[1];
    }
    return '';
  }

  /**
   * Extract a section of markdown from a given heading to the next same-level heading or EOF.
   * Returns null if the heading is not found.
   */
  function extractSection(md, heading) {
    const re = new RegExp(`^##\\s+${heading}\\s*$`, 'm');
    const start = re.exec(md);
    if (!start) return null;
    const rest = md.slice(start.index + start[0].length);
    const nextH2 = /^##\s/m.exec(rest);
    return nextH2 ? rest.slice(0, nextH2.index) : rest;
  }

  /**
   * Parse the ## Handoff log section into entries for HandoffTimeline.
   * Entry format:
   *   ### AgentName · Date
   *   **Established:**
   *   - items
   *   **Concerns flagged:** / **Spikes flagged (for Refinement):**
   *   - [TAG] items
   *   **Scope gap flagged:**
   *   - item
   *   **Passing forward:** inline text
   */
  function parseHandoffLog(md) {
    const agentPhase = buildAgentPhase();
    const entries = [];

    const section = extractSection(md, 'Handoff log');
    if (!section) return entries;

    // Split on ### headings; each piece is one agent entry
    const parts = section.split(/^###\s+/m).filter(p => p.trim());

    for (const part of parts) {
      const newline = part.indexOf('\n');
      const headerLine = (newline > -1 ? part.slice(0, newline) : part).trim();
      const body = newline > -1 ? part.slice(newline + 1) : '';

      // "AgentName · Date"  or  "AgentName"
      const headerMatch = headerLine.match(/^(.+?)\s*[·•]\s*(.+)$/);
      const agent = headerMatch ? headerMatch[1].trim() : headerLine;
      const date = headerMatch ? headerMatch[2].trim() : undefined;

      const phase = agentPhase[agent] || 'discovery';

      const establishedText = extractSubsection(body, 'Established');
      const concernsText = [
        extractSubsection(body, 'Concerns flagged'),
        extractSubsection(body, 'Spikes flagged[^*]*'),
      ].join('\n');
      const scopeGapText = [
        extractSubsection(body, 'Scope gap flagged'),
        extractSubsection(body, 'Scope gap'),
      ].join('\n');

      // Passing forward: inline after **Passing forward:**
      const pfMatch = body.match(/\*\*Passing forward:\*\*\s*(.+?)(?=\n\n|\n\*\*|###|$)/s);
      const passingForward = pfMatch ? pfMatch[1].replace(/\n\s*/g, ' ').trim() : undefined;

      const entry = { agent, phase };
      if (date) entry.date = date;

      const established = parseList(establishedText);
      if (established.length) entry.established = established;

      const concerns = parseList(concernsText);
      if (concerns.length) entry.concerns = concerns;

      const scopeGapItems = parseList(scopeGapText);
      if (scopeGapItems.length) entry.scopeGap = scopeGapItems[0]; // single item

      if (passingForward) entry.passingForward = passingForward;

      entries.push(entry);
    }

    return entries;
  }

  /**
   * Parse the pipeline config code block under ## Pipeline configuration.
   * Returns a PipelineMap data object or null if parsing fails.
   *
   * Block format:
   *   Pipeline: name
   *   Type: one-liner
   *         continuation line
   *   Agents selected:
   *     n · Name  — role
   *   Agents skipped:
   *     Name    — reason
   *   Execution order:
   *     Wave n (kind):    Agent + Agent — note
   *     [Then: A → B → C]
   *   Estimated pipeline length: medium
   */
  function parsePipelineConfig(md) {
    const section = extractSection(md, 'Pipeline configuration');
    if (!section) return null;

    const codeMatch = section.match(/```[^\n]*\n([\s\S]*?)```/);
    if (!codeMatch) return null;

    try {
      return _parseConfigBlock(codeMatch[1]);
    } catch (e) {
      console.warn('[running-brief-parser] Pipeline config parse error:', e);
      return null;
    }
  }

  function _parseConfigBlock(block) {
    const lines = block.split('\n');
    const result = {
      project: '', typeLines: [], estimate: 'medium',
      selected: [], skipped: [], waves: [], trailing: [],
    };
    let mode = null;
    let typeContd = false;

    for (let i = 0; i < lines.length; i++) {
      const raw = lines[i];
      const t = raw.trim();
      if (!t) { typeContd = false; continue; }

      if (t.startsWith('Pipeline:')) {
        result.project = t.replace(/^Pipeline:\s*/, '').trim();
        continue;
      }
      if (t.startsWith('Type:')) {
        result.typeLines = [t.replace(/^Type:\s*/, '').trim()];
        typeContd = true; mode = null; continue;
      }
      if (typeContd && /^\s{2,}/.test(raw) && !t.match(/^(Agents|Execution|Estimated)/i)) {
        result.typeLines.push(t); continue;
      }
      typeContd = false;

      if (t.match(/^Agents selected:/i)) { mode = 'selected'; continue; }
      if (t.match(/^Agents skipped:/i))  { mode = 'skipped';  continue; }
      if (t.match(/^Execution order:/i)) { mode = 'waves';    continue; }
      if (t.match(/^Estimated pipeline length:/i)) {
        result.estimate = t.replace(/^Estimated pipeline length:\s*/i, '').trim();
        continue;
      }

      if (mode === 'selected' && t) {
        // "1 · The Interrogator  — role"
        const m = t.match(/^(\d+)\s*[·•]\s*(.+?)\s+—\s+(.+)$/);
        if (m) result.selected.push({ n: parseInt(m[1], 10), name: m[2].trim(), role: m[3].trim() });
      }

      if (mode === 'skipped' && t) {
        // "Name    — reason"
        const m = t.match(/^(.+?)\s+—\s+(.+)$/);
        if (m) result.skipped.push({ name: m[1].trim(), reason: m[2].trim() });
      }

      if (mode === 'waves' && t) {
        // "[Then: A → B → C]"
        const thenM = t.match(/^\[Then:\s*(.+)\]$/);
        if (thenM) {
          result.trailing = thenM[1].split(/\s*→\s*/).map(s => s.trim()).filter(Boolean);
          continue;
        }
        // "Wave n (kind):    Agents — note"
        const waveM = t.match(/^Wave\s+(\d+)\s+\((\w+)\):\s+(.+?)(?:\s+—\s+(.+))?$/);
        if (waveM) {
          const agents = waveM[3].split(/\s*\+\s*/).map(s => s.trim()).filter(Boolean);
          const wave = { n: parseInt(waveM[1], 10), kind: waveM[2].toLowerCase(), agents };
          if (waveM[4]) wave.note = waveM[4].trim();
          result.waves.push(wave);
        }
      }
    }

    // Infer wave states: complete kind → state "complete"; first non-complete → "current"; rest → "upcoming"
    let foundNonComplete = false;
    for (const w of result.waves) {
      if (w.kind === 'complete') {
        w.state = 'complete';
      } else if (!foundNonComplete) {
        w.state = 'current';
        foundNonComplete = true;
      } else {
        w.state = 'upcoming';
      }
    }

    return result;
  }

  window.ForgeRunningBriefParser = { parseHandoffLog, parsePipelineConfig, buildAgentPhase };
})();
