// viewer/v2/timeline.jsx — HandoffTimeline + Badge
// Adapted from Claude Design v2/timeline.jsx.
// Accepts entries as prop — no window.FORGE_V2 dependency.
// Exports: window.HandoffTimeline, window.Badge, window.badgeInlineMd

(function () {

  const KIND_SLUG = {
    'DECISION':               'DECISION',
    'OPEN QUESTION':          'OPEN_QUESTION',
    'TECH FEASIBILITY':       'TECH_FEASIBILITY',
    'DESIGN REVIEW':          'DESIGN_REVIEW',
    'SPIKE':                  'SPIKE',
    'REFINEMENT AGENDA ITEM': 'REFINEMENT_AGENDA_ITEM',
    'SCOPE GAP':              'SCOPE_GAP',
  };

  function Badge({ kind, n, resolved, children }) {
    const slug = KIND_SLUG[kind] || 'UNKNOWN';
    if (slug === 'UNKNOWN') console.warn('[Badge] Unknown kind:', kind);
    return (
      <span className="fg-badge" data-kind={slug} data-resolved={resolved ? 'true' : null}>
        {kind}{n != null ? <span className="fg-badge__num">&nbsp;{n}</span> : null}
        {children ? <>&nbsp;{children}</> : null}
      </span>
    );
  }

  function inlineMd(text) {
    if (!text) return null;
    const parts = [];
    let i = 0; let key = 0;
    const re = /(\*\*[^*]+\*\*|`[^`]+`)/g;
    let m;
    while ((m = re.exec(text)) !== null) {
      if (m.index > i) parts.push(text.slice(i, m.index));
      const tok = m[0];
      if (tok.startsWith('**')) {
        parts.push(<strong key={key++}>{tok.slice(2, -2)}</strong>);
      } else {
        parts.push(<code key={key++} style={{
          fontFamily: 'var(--fg-mono)', fontSize: '0.92em',
          background: 'var(--fg-bg-soft)', padding: '1px 4px', borderRadius: 3,
          color: 'var(--fg-ink-1)',
        }}>{tok.slice(1, -1)}</code>);
      }
      i = m.index + tok.length;
    }
    if (i < text.length) parts.push(text.slice(i));
    return parts;
  }

  function ListItem({ item }) {
    if (typeof item === 'string') {
      return <li className="fg-timeline-card__list-item"><span>{inlineMd(item)}</span></li>;
    }
    // { tag, body, resolved, n }
    return (
      <li className="fg-timeline-card__list-item">
        <span>
          <Badge kind={item.tag} resolved={item.resolved} n={item.n} />{' '}
          {inlineMd(item.body)}
        </span>
      </li>
    );
  }

  function TimelineEntry({ entry, isCurrent }) {
    return (
      <div className="fg-timeline-entry" data-phase={entry.phase} data-current={isCurrent ? 'true' : null}>
        <span className="fg-timeline-entry__dot" />
        <div className="fg-timeline-card">
          <div className="fg-timeline-card__head">
            <h3 className="fg-timeline-card__name">{entry.agent}</h3>
            {entry.role && <span className="fg-timeline-card__role">{entry.role}</span>}
            {isCurrent && <span className="fg-timeline-card__current">current</span>}
            {entry.date && <span className="fg-timeline-card__date">{entry.date}</span>}
          </div>

          {entry.established && entry.established.length > 0 && (
            <div className="fg-timeline-card__sect">
              <div className="fg-timeline-card__sect-h">Established</div>
              <ul className="fg-timeline-card__list">
                {entry.established.map((it, i) => <ListItem key={i} item={it} />)}
              </ul>
            </div>
          )}

          {entry.concerns && entry.concerns.length > 0 && (
            <div className="fg-timeline-card__sect fg-timeline-card__sect--mute">
              <div className="fg-timeline-card__sect-h">Concerns flagged</div>
              <ul className="fg-timeline-card__list">
                {entry.concerns.map((it, i) => <ListItem key={i} item={it} />)}
              </ul>
            </div>
          )}

          {entry.scopeGap && (
            <div className="fg-timeline-card__sect fg-timeline-card__sect--mute">
              <div className="fg-timeline-card__sect-h">Scope gap</div>
              <ul className="fg-timeline-card__list">
                <ListItem item={entry.scopeGap} />
              </ul>
            </div>
          )}

          {entry.passingForward && (
            <div className="fg-timeline-card__pf">
              <span className="fg-timeline-card__pf-label">
                Passing forward <span className="fg-timeline-card__pf-arrow">→</span>
              </span>
              <span>{inlineMd(entry.passingForward)}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  function HandoffTimeline({ entries }) {
    if (!entries || entries.length === 0) {
      return (
        <div className="fg-timeline" style={{ color: 'var(--fg-ink-soft)', fontFamily: 'var(--fg-mono)', fontSize: 12, padding: '20px 0' }}>
          No handoff entries found.
        </div>
      );
    }
    // Newest-first: top card is the most recent handoff
    const ordered = [...entries].reverse();
    return (
      <div className="fg-timeline">
        {ordered.map((e, i) => (
          <TimelineEntry key={i} entry={e} isCurrent={i === 0} />
        ))}
      </div>
    );
  }

  Object.assign(window, { HandoffTimeline, Badge, badgeInlineMd: inlineMd });
})();
