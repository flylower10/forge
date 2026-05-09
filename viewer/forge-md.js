// forge-md.js — markdown source → component tree.
//
// Forge's contract: every artefact has a `.md` source and an `.html`
// presentation layer. This file is the bridge. It parses our markdown
// dialect (frontmatter + ## sections + ::: custom blocks) into a tree
// the renderer walks.
//
// Dialect — minimal by design:
//
//   ---json
//   { ...frontmatter as JSON... }
//   ---
//
//   ## Section title
//
//   Plain prose paragraph.
//
//   - Bullet list item
//   - Another item
//
//   :::jts
//   Jobs Story, single paragraph
//   :::
//
//   :::ledger
//   state | text | optional label
//   :::
//
//   :::feature
//   metric | target | note
//   :::
//
// Returns: { frontmatter, sections: [{ title, blocks: [...] }] }
// where each block is one of:
//   { kind: 'p',       text: string }
//   { kind: 'list',    items: string[] }
//   { kind: 'jts',     text: string }
//   { kind: 'ledger',  rows:  [{ state, text, label }] }
//   { kind: 'feature', cells: [string, string, string] }

(function () {
  function parseMd(src) {
    const fm = src.match(/^---json\n([\s\S]*?)\n---\n?/);
    let frontmatter = {};
    let body = src;
    if (fm) {
      try { frontmatter = JSON.parse(fm[1]); }
      catch (e) { console.warn('forge-md: frontmatter JSON parse failed', e); }
      body = src.slice(fm[0].length);
    }

    // Split into sections by ## headings (top-level only).
    const sections = [];
    const lines = body.split('\n');
    let cur = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const h = line.match(/^##\s+(.+?)\s*$/);
      if (h) {
        if (cur) sections.push(cur);
        cur = { title: h[1], raw: [] };
        continue;
      }
      if (cur) cur.raw.push(line);
    }
    if (cur) sections.push(cur);

    sections.forEach(s => {
      s.blocks = parseBlocks(s.raw.join('\n'));
      delete s.raw;
    });

    return { frontmatter, sections };
  }

  function parseBlocks(src) {
    const blocks = [];
    const lines = src.split('\n');
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];

      // Skip blank lines.
      if (!line.trim()) { i++; continue; }

      // Custom block: :::name [arg] ... :::
      const open = line.match(/^:::(\w+)(?:\s+(\S.*?))?\s*$/);
      if (open) {
        const name = open[1];
        const arg = open[2] || null;
        const inner = [];
        i++;
        while (i < lines.length && !/^:::\s*$/.test(lines[i])) {
          inner.push(lines[i]); i++;
        }
        i++; // skip closing :::
        blocks.push(parseCustom(name, arg, inner));
        continue;
      }

      // List: consecutive lines starting with `- `
      if (/^- /.test(line)) {
        const items = [];
        while (i < lines.length && /^- /.test(lines[i])) {
          items.push(lines[i].slice(2).trim()); i++;
        }
        blocks.push({ kind: 'list', items });
        continue;
      }

      // Paragraph: consecutive non-empty, non-special lines
      const para = [];
      while (i < lines.length && lines[i].trim() && !/^:::|^- /.test(lines[i])) {
        para.push(lines[i]); i++;
      }
      blocks.push({ kind: 'p', text: para.join(' ').trim() });
    }
    return blocks;
  }

  function pipeRows(innerLines) {
    return innerLines
      .map(l => l.trim()).filter(l => l && !l.startsWith('#'))
      .map(l => l.split('|').map(p => p.trim()));
  }

  function parseCustom(name, arg, innerLines) {
    const text = innerLines.join('\n').trim();
    if (name === 'ledger') {
      const rows = pipeRows(innerLines).map(parts => ({
        state: parts[0], text: parts[1] || '', label: parts[2] || ''
      }));
      return { kind: 'ledger', rows };
    }
    if (name === 'feature') {
      const parts = (innerLines.find(l => l.includes('|')) || '')
        .split('|').map(p => p.trim());
      return { kind: 'feature', cells: parts };
    }
    if (name === 'jts') {
      return { kind: 'jts', text };
    }
    if (name === 'io') {
      // arg = 'reads' | 'produces'
      const rows = pipeRows(innerLines).map(parts => ({
        kind: parts[0], path: parts[1] || '', note: parts[2] || ''
      }));
      return { kind: 'io', direction: arg || 'reads', rows };
    }
    if (name === 'arc') {
      const rows = pipeRows(innerLines).map(parts => ({
        n: parts[0], title: parts[1] || '', when: parts[2] || '', body: parts[3] || ''
      }));
      return { kind: 'arc', rows };
    }
    if (name === 'steps') {
      const rows = pipeRows(innerLines).map(parts => ({
        n: parts[0], text: parts[1] || ''
      }));
      return { kind: 'steps', rows };
    }
    if (name === 'schema') {
      // Output schema rows: heading | description
      const rows = pipeRows(innerLines).map(parts => ({
        h: parts[0], d: parts[1] || ''
      }));
      return { kind: 'schema', rows };
    }
    if (name === 'table') {
      // Two-column tag/desc table. First non-empty row is the header.
      const rows = pipeRows(innerLines);
      if (!rows.length) return { kind: 'p', text: '' };
      const [head, ...body] = rows;
      return {
        kind: 'table',
        head: { tag: head[0], d: head[1] || '' },
        rows: body.map(parts => ({ tag: parts[0], d: parts[1] || '' })),
      };
    }
    if (name === 'diagram') {
      // Breadboard DSL:
      //   @place id | x | y | w | title | sub
      //   - affordance name | store=foo | goes=bar | spike=note
      //   @store id | x | y | label | kind
      //   @wire from | to | label
      const places = [], stores = [], wires = [];
      let cur = null;
      innerLines.forEach(raw => {
        const l = raw.trim(); if (!l || l.startsWith('#')) return;
        if (l.startsWith('@place ')) {
          const [id, x, y, w, title, sub] = l.slice(7).split('|').map(s => s.trim());
          cur = { id, x: +x, y: +y, w: +w, title, sub, affordances: [] };
          places.push(cur);
        } else if (l.startsWith('@store ')) {
          const [id, x, y, label, kind] = l.slice(7).split('|').map(s => s.trim());
          stores.push({ id, x: +x, y: +y, label, kind });
        } else if (l.startsWith('@wire ')) {
          const [from, to, label] = l.slice(6).split('|').map(s => s.trim());
          wires.push({ from, to, label });
        } else if (l.startsWith('- ') && cur) {
          const parts = l.slice(2).split('|').map(s => s.trim());
          const aff = { name: parts[0] };
          parts.slice(1).forEach(p => {
            const m = p.match(/^(\w+)\s*=\s*(.+)$/);
            if (m) aff[m[1]] = m[2];
          });
          if (aff.spike) aff.flag = 'spike';
          cur.affordances.push(aff);
        }
      });
      return { kind: 'diagram', places, stores, wires };
    }
    if (name === 'feed') {
      // Recent-notes log: timestamp | text
      const rows = pipeRows(innerLines).map(parts => ({
        ts: parts[0], text: parts[1] || ''
      }));
      return { kind: 'feed', rows };
    }
    if (name === 'persona') {
      // key | value pairs. `job` keys accumulate into a list; everything
      // else is a single string. Unknown keys are preserved on .extra so
      // authors can extend without renderer changes.
      const fields = { jobs: [] };
      pipeRows(innerLines).forEach(parts => {
        const k = (parts[0] || '').toLowerCase();
        const v = parts.slice(1).join(' | ').trim();
        if (!k) return;
        if (k === 'job') fields.jobs.push(v);
        else fields[k] = v;
      });
      return { kind: 'persona', fields };
    }
    if (name === 'question') {
      // key | value pairs for one open research question.
      const fields = {};
      pipeRows(innerLines).forEach(parts => {
        const k = (parts[0] || '').toLowerCase();
        const v = parts.slice(1).join(' | ').trim();
        if (k) fields[k] = v;
      });
      return { kind: 'question', fields };
    }
    // Fallback — preserve unknown blocks as raw paragraphs so authors
    // can introduce new dialect without breaking the renderer.
    return { kind: 'p', text };
  }

  window.ForgeMd = { parseMd };
})();
