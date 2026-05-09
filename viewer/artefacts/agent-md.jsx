// Agent reference · rendered from output/agents/[id].md
//
// Generic, .md-driven renderer. Same shell as the data-driven agent
// references, but content shape comes from the markdown source.
// Frontmatter drives header / pipeline tape / right-rail constraints
// and pager. Sections drive cards. Custom blocks (io / arc / steps /
// jts / ledger / feature) get bespoke layouts; prose and lists fall
// back to the standard primitives.

(function () {
  const { parseMd } = window.ForgeMd;
  const { PIPELINE, LATERAL, PHASES } = window.FORGE_CONFIG;

  function DirRail({ activeId }) {
    const groups = [
      { id:'product-team', label:'product-team', range:[0,9] },
      { id:'build-team',   label:'build-team',   range:[9,14] },
      { id:'marketing',    label:'marketing-team', range:[14,16] },
    ];
    return (
      <aside className="fg-dir">
        <div className="fg-dir__head">
          <div className="fg-dir__brand">
            <span className="fg-dir__mark">◆</span> Forge
            <span className="fg-dir__ver">v0.4</span>
          </div>
          <input className="fg-dir__search" placeholder="Filter agents…" readOnly />
        </div>
        {groups.map(g => (
          <div key={g.id} className="fg-dir__group">
            <div className="fg-dir__group-head">
              <span className="fg-dir__group-label">{g.label}</span>
              <span className="fg-dir__group-count">{g.range[1]-g.range[0]}</span>
            </div>
            {PIPELINE.slice(g.range[0], g.range[1]).map(p => (
              <div key={p.id} data-phase={p.phase}
                   className={`fg-dir__item${p.id === activeId ? ' fg-dir__item--active' : ''}`}>
                <span className="fg-dir__n">{p.n}</span>
                <div style={{flex:1, minWidth:0}}>
                  <div className="fg-dir__name">{p.name}</div>
                  <div className="fg-dir__sub">{p.file.split('/').pop()}</div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </aside>
    );
  }

  function Stat({k, v, phase}) {
    return (
      <div className="fg-stat">
        <div className="fg-stat__k">{k}</div>
        <div className={`fg-stat__v${phase ? ' fg-stat__v--phase' : ''}`}>{v}</div>
      </div>
    );
  }

  function Header({ fm }) {
    return (
      <div className="fg-header">
        <div className="fg-header__crumbs">
          <span className="fg-header__path">{fm.file}</span>
          <span className="fg-header__sep">·</span>
          <span className="fg-pill">{PHASES[fm.phase].label}</span>
          <span className="fg-header__sep">·</span>
          <span className="fg-header__mode">{fm.mode}</span>
          <div className="fg-header__btns">
            <button className="fg-header__btn">Edit source</button>
            <button className="fg-header__btn">View .md ↗</button>
          </div>
        </div>
        <div className="fg-header__title-row">
          <span className="fg-header__n"
                style={fm.n ? {} : {background:'#f0f0ee', color:'var(--fg-ink-3)'}}>
            {fm.n || fm.glyph || '··'}
          </span>
          <h1 className="fg-header__h1">{fm.name}</h1>
          <span className="fg-header__role">{fm.role}</span>
        </div>
        <p className="fg-header__summary">{fm.summary}</p>
        <div className="fg-header__stats" style={{'--fg-stat-cols': 5}}>
          <Stat k="Mode"  v={fm.mode} />
          <Stat k="Gate"  v={fm.gate || 'None'} />
          <Stat k="Phase" v={PHASES[fm.phase].label} phase />
          <Stat k="Team"  v={fm.team} />
          <Stat k="Alias" v={fm.alias || '—'} />
        </div>
      </div>
    );
  }

  function Card({ title, eyebrow, meta, children }) {
    return (
      <section className="fg-card">
        <div className="fg-card__head">
          <h2 className="fg-card__title">{title}</h2>
          {eyebrow && <span className="fg-card__eyebrow">{eyebrow}</span>}
          {meta && <span className="fg-card__meta">{meta}</span>}
        </div>
        <div className="fg-card__body">{children}</div>
      </section>
    );
  }

  function Pipeline({ fm }) {
    return (
      <Card title="Pipeline position" eyebrow={`${fm.n} of ${PIPELINE.length}`}>
        <div className="fg-tape">
          {PIPELINE.map((p, i) => {
            const prev = i > 0 ? PIPELINE[i-1] : null;
            const phaseChange = prev && prev.phase !== p.phase;
            const current = p.id === fm.id;
            return (
              <React.Fragment key={p.id}>
                {phaseChange && (
                  <div className="fg-tape__divider" data-phase={p.phase}>
                    <span className="fg-tape__phase" style={{color:'var(--fg-ink-tone)'}}>
                      › {PHASES[p.phase].label}
                    </span>
                  </div>
                )}
                <div data-phase={p.phase}
                     className={`fg-tape__node${current ? ' fg-tape__node--current' : ''}`}>
                  <div className="fg-tape__n">{p.n}</div>
                  <div className="fg-tape__name">{p.name}</div>
                  {current && <div className="fg-tape__here">► CURRENT</div>}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </Card>
    );
  }

  // Block renderers ─────────────────────────────────────────────────
  function IOCol({ block }) {
    const isReads = block.direction === 'reads';
    return (
      <div className={`fg-io__col fg-io__col--${block.direction}`}>
        <div className="fg-io__col-head">
          <span className="fg-io__arrow">{isReads ? '↘' : '↗'}</span>
          {isReads ? 'Reads' : 'Produces'}
          <span className="fg-io__count">{block.rows.length}</span>
          <span className="fg-io__sub">{isReads ? 'before acting' : 'on handoff'}</span>
        </div>
        <div className="fg-io__list">
          {block.rows.map((r, i) => (
            <div key={i} className="fg-io__row">
              <span className={`fg-kind fg-kind--${r.kind}`}>{r.kind}</span>
              <span className="fg-io__path">{r.path}</span>
              <span className="fg-io__note">{r.note}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function Block({ block }) {
    switch (block.kind) {
      case 'p':
        return <p className="fg-card__p">{block.text}</p>;
      case 'list':
        return (
          <ul className="fg-stack fg-stack--gap-s" style={{listStyle:'none', padding:0, margin:0}}>
            {block.items.map((it, i) => (
              <li key={i} className="fg-step">
                <span className="fg-step__n" style={{background:'var(--fg-ink-soft)'}}>·</span>
                <div style={{fontSize:13.5, color:'var(--fg-ink-1)', lineHeight:1.55}}>{it}</div>
              </li>
            ))}
          </ul>
        );
      case 'arc':
        return (
          <div className="fg-arc">
            {block.rows.map((r, i) => (
              <div key={i} className="fg-arc__item">
                <div className="fg-arc__top">
                  <span className="fg-arc__n">{r.n}</span>
                  <span className="fg-arc__title">{r.title}</span>
                </div>
                {r.when && <div className="fg-arc__when">{r.when}</div>}
                <div className="fg-arc__body">{r.body}</div>
              </div>
            ))}
          </div>
        );
      case 'steps':
        return (
          <ol className="fg-steps">
            {block.rows.map((r, i) => (
              <li key={i} className="fg-step">
                <span className="fg-step__n">{r.n}</span>
                <div style={{fontSize:13.5, color:'var(--fg-ink-1)', lineHeight:1.5}}>{r.text}</div>
              </li>
            ))}
          </ol>
        );
      case 'ledger':
        return (
          <div className="fg-ledger">
            {block.rows.map((r, i) => (
              <div key={i} className="fg-ledger__row" data-state={r.state}>
                <span className={`fg-kind fg-kind--${r.state}`}>{r.state}</span>
                <div>
                  <div style={{fontSize:13, color:'var(--fg-ink-1)', lineHeight:1.55}}>{r.text}</div>
                  {r.label && (
                    <div style={{fontSize:11.5, color:'var(--fg-ink-soft)',
                                 fontFamily:'var(--fg-mono)', marginTop:3}}>
                      {r.label}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
      case 'schema':
        return (
          <div className="fg-schema">
            {block.rows.map((r, i) => (
              <div key={i} className="fg-schema__row">
                <div className="fg-schema__h">
                  <span className="fg-schema__hash">md</span>{r.h}
                </div>
                <div className="fg-schema__d">{r.d}</div>
              </div>
            ))}
          </div>
        );
      case 'table':
        return (
          <table className="fg-table fg-table--bordered">
            <thead>
              <tr>
                <th style={{width:140}}>{block.head.tag}</th>
                <th>{block.head.d}</th>
              </tr>
            </thead>
            <tbody>
              {block.rows.map((r, i) => (
                <tr key={i}>
                  <td>
                    <span className="fg-kind fg-kind--decision">{r.tag}</span>
                  </td>
                  <td>{r.d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'feed':
        return (
          <div className="fg-feed">
            {block.rows.map((n, i) => (
              <div key={i} className="fg-feed__row">
                <span className="fg-feed__ts">{n.ts}</span>
                <span className="fg-feed__text">{n.text}</span>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  }

  // Some sections deserve a paired-column layout (IO). Detect when a
  // section's blocks are exactly two `io` blocks and render side-by-side.
  function renderSection(s) {
    const ios = s.blocks.filter(b => b.kind === 'io');
    if (ios.length === 2 && s.blocks.length === 2) {
      return (
        <Card title={s.title} eyebrow="contract">
          <div className="fg-io">
            {ios.map((b, i) => <IOCol key={i} block={b} />)}
          </div>
        </Card>
      );
    }
    return (
      <Card title={s.title}>
        <div className="fg-stack">
          {s.blocks.map((b, j) => <Block key={j} block={b} />)}
        </div>
      </Card>
    );
  }

  function Constraints({ fm }) {
    const rail = fm.rail || { title: 'Hard constraints', items: fm.constraints || [],
                              intro: 'Behavioural invariants. The agent holds these regardless of human pressure or social cost. Violating any one breaks the contract the framework depends on.' };
    return (
      <aside className="fg-rail">
        <div className="fg-rail__head">
          <span className="fg-rail__icon">⊕</span>
          <span>{rail.title}</span>
          <span className="fg-rail__badge">{rail.items.length} rules</span>
        </div>
        <div className="fg-rail__body">
          {rail.intro && <div className="fg-rail__intro">{rail.intro}</div>}
          <ol className="fg-rail__list">
            {rail.items.map((c, i) => (
              <li key={i} className="fg-rail__item">
                <div className="fg-rail__top">
                  <span className="fg-rail__n">{String(i+1).padStart(2,'0')}</span>
                  <span className="fg-rail__rule">{c}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="fg-rail__sect">
          <div className="fg-rail__sect-h">Source</div>
          <div className="fg-rail__sect-b" style={{fontFamily:'var(--fg-mono)', fontSize:11.5}}>
            {fm.file}<br/>
            <span style={{color:'var(--fg-ink-soft)'}}>parsed at runtime</span>
          </div>
        </div>
        {fm.neighbours && (
          <div className="fg-rail__sect">
            <div className="fg-rail__sect-h">Neighbours</div>
            <div className="fg-rail__sect-b" style={{marginBottom:4}}>
              ← <strong>{fm.neighbours.prev.n}</strong> · {fm.neighbours.prev.name}
            </div>
            <div className="fg-rail__sect-b">
              <strong>{fm.neighbours.next.n}</strong> · {fm.neighbours.next.name} →
            </div>
          </div>
        )}
      </aside>
    );
  }

  function AgentMdPage({ src }) {
    const [tree, setTree] = React.useState(null);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
      const path = src || 'output/agents/01-pm-agent.md';
      fetch(path).then(r => r.text()).then(text => setTree(parseMd(text)))
                 .catch(e => setError(e.message));
    }, [src]);

    if (error) return <div style={{padding:40, fontFamily:'var(--fg-mono)', color:'var(--fg-ink-soft)'}}>{error}</div>;
    if (!tree) return <div style={{padding:40, fontFamily:'var(--fg-mono)', color:'var(--fg-ink-soft)'}}>parsing…</div>;

    const { frontmatter: fm, sections } = tree;

    return (
      <div className="fg-root" data-phase={fm.phase} style={{minHeight:'100%'}}>
        <div className="fg-shell" data-shell="3col">
          <DirRail activeId={fm.id} />
          <main className="fg-main">
            <Header fm={fm} />
            {fm.n && <Pipeline fm={fm} />}
            {sections.map((s, i) => (
              <React.Fragment key={i}>{renderSection(s)}</React.Fragment>
            ))}
            {fm.neighbours && (
              <div className="fg-pager">
                <a className="fg-pager__a">
                  <span className="fg-pager__label">Previous</span>
                  <span className="fg-pager__name">← {fm.neighbours.prev.n} · {fm.neighbours.prev.name}</span>
                </a>
                <a className="fg-pager__a fg-pager__a--right">
                  <span className="fg-pager__label">Next</span>
                  <span className="fg-pager__name">{fm.neighbours.next.n} · {fm.neighbours.next.name} →</span>
                </a>
              </div>
            )}
          </main>
          <Constraints fm={fm} />
        </div>
      </div>
    );
  }

  window.AgentMdPage = AgentMdPage;
})();
