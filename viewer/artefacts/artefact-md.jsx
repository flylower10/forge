// Artefact reference · generic renderer for any within-idea .md artefact
//
// Replaces brief-md.jsx and serves personas / research-plan / handoff
// from the same component grammar. The .md source is canonical; this
// file is the presentation layer.
//
// Frontmatter contract (every artefact under output/[idea]/ obeys it):
//
//   {
//     type:       string       — artefact kind, used for the header chip
//     file:       string       — repo-relative path, shown in the crumbs
//     title:      string       — H1
//     tagline:    string       — one-line summary under the H1
//     phase:      'discovery' | 'refinement' | 'build' | 'marketing' | 'framework'
//     status:     string       — short status line in crumbs
//     lastEdit:   string       — human-readable timestamp + author
//     stats:      [{ k, v, phase? }]   — header strip
//     trail:      [{ n, name, state }] — pipeline trail in the rail
//     rail:       { title, icon, badge, intro, items: [{ n, rule }] }
//     neighbours: { prev, next }       — pager
//   }
//
// Sections: standard markdown ## headings. Block dispatch is in <Block/>.
// Per-section eyebrow/meta is keyed by exact section title in the
// SECTION_META map below — anything not listed renders without an
// eyebrow.

(function () {
  const { parseMd } = window.ForgeMd;

  function Stat({ k, v, phase }) {
    return (
      <div className="fg-stat">
        <div className="fg-stat__k">{k}</div>
        <div className={`fg-stat__v${phase ? ' fg-stat__v--phase' : ''}`}>{v}</div>
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

  // ─── Persona card ────────────────────────────────────────────
  // One persona = one card-within-card. Pull-quote up top, archetype +
  // context as the head, jobs as a numbered step list, evidence + priority
  // as captions in mono.
  function PersonaCard({ fields }) {
    const { name, archetype, context, quote, jobs = [], evidence, priority } = fields;
    return (
      <div className="fg-persona">
        <div className="fg-persona__head">
          <div className="fg-persona__name-row">
            <h3 className="fg-persona__name">{name}</h3>
            {priority && <span className="fg-persona__priority">{priority}</span>}
          </div>
          {archetype && <div className="fg-persona__archetype">{archetype}</div>}
          {context && <p className="fg-persona__context">{context}</p>}
        </div>
        {quote && (
          <blockquote className="fg-persona__quote">
            <span className="fg-persona__quote-mark">“</span>
            {quote}
          </blockquote>
        )}
        {jobs.length > 0 && (
          <div className="fg-persona__jobs">
            <div className="fg-persona__jobs-h">Jobs hired for</div>
            <ol className="fg-persona__jobs-list">
              {jobs.map((j, i) => (
                <li key={i} className="fg-persona__job">
                  <span className="fg-persona__job-n">{i + 1}</span>
                  <span className="fg-persona__job-text">{j}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
        {evidence && (
          <div className="fg-persona__evidence">
            <span className="fg-persona__evidence-k">Evidence</span>
            <span className="fg-persona__evidence-v">{evidence}</span>
          </div>
        )}
      </div>
    );
  }

  // ─── Question card ───────────────────────────────────────────
  // One open research question. Priority pill + question text up top,
  // then a four-row strip of method / sample / validates / by.
  function QuestionCard({ fields }) {
    const { priority, text, why, method, sample, validates, by } = fields;
    const PRIORITY_TONE = { P0: 'risk', P1: 'assumed', P2: 'known' };
    return (
      <div className="fg-question">
        <div className="fg-question__head">
          {priority && (
            <span className={`fg-kind fg-kind--${PRIORITY_TONE[priority] || 'assumed'}`}>{priority}</span>
          )}
          <h3 className="fg-question__text">{text}</h3>
        </div>
        {why && <p className="fg-question__why">{why}</p>}
        <div className="fg-question__grid">
          {method    && <div className="fg-question__cell"><div className="fg-question__k">Method</div><div className="fg-question__v">{method}</div></div>}
          {sample    && <div className="fg-question__cell"><div className="fg-question__k">Sample</div><div className="fg-question__v">{sample}</div></div>}
          {validates && <div className="fg-question__cell"><div className="fg-question__k">Validates if</div><div className="fg-question__v">{validates}</div></div>}
          {by        && <div className="fg-question__cell"><div className="fg-question__k">By</div><div className="fg-question__v">{by}</div></div>}
        </div>
      </div>
    );
  }

  // ─── Breadboard diagram ───────────────────────────────
  // Renders the {places, stores, wires} structure parsed by
  // forge-md's :::diagram DSL. Pre-code system map — places, the
  // affordances inside them, the stores they read/write, and the
  // wires that connect them.
  function Diagram({ places, stores, wires }) {
    const W = 1240, H = 580;
    const placeMap = Object.fromEntries(places.map(p => [p.id, p]));
    const placeHeight = (p) => 64 + p.affordances.length * 26;
    const anchorRight = (p) => ({ x: p.x + p.w, y: p.y + placeHeight(p)/2 });
    const anchorLeft  = (p) => ({ x: p.x,        y: p.y + placeHeight(p)/2 });
    return (
      <div style={{
        background: '#fbfbfa',
        backgroundImage: 'radial-gradient(circle, #e8e8e6 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        margin: 'calc(-1 * var(--fg-9, 24px))',
        marginTop: 'calc(-1 * var(--fg-9, 24px))',
        marginBottom: 'calc(-1 * var(--fg-9, 24px))',
        borderTop: '1px solid var(--fg-line-soft)',
        borderBottom: '1px solid var(--fg-line-soft)',
      }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%', display:'block'}}
             xmlns="http://www.w3.org/2000/svg" fontFamily="var(--fg-sans)">
          <defs>
            <marker id="bb-arrow" viewBox="0 0 10 10" refX="9" refY="5"
                    markerWidth="8" markerHeight="8" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="#7a7a7a" />
            </marker>
          </defs>
          {wires.map((w, i) => {
            const fp = placeMap[w.from], tp = placeMap[w.to];
            if (!fp || !tp) return null;
            const a = anchorRight(fp), b = anchorLeft(tp);
            const midX = (a.x + b.x) / 2;
            const path = `M ${a.x},${a.y} C ${midX},${a.y} ${midX},${b.y} ${b.x},${b.y}`;
            return (
              <g key={i}>
                <path d={path} fill="none" stroke="#9a9a9a" strokeWidth="1.5"
                      markerEnd="url(#bb-arrow)" />
                <text x={midX} y={(a.y + b.y) / 2 - 6}
                      textAnchor="middle" fontSize="10.5"
                      fontFamily="var(--fg-mono)" fill="#7a7a7a"
                      style={{paintOrder:'stroke', stroke:'#fbfbfa', strokeWidth:4}}>
                  {w.label}
                </text>
              </g>
            );
          })}
          {places.flatMap((p) =>
            p.affordances.filter(a => a.store).map((a, ai) => {
              const store = stores.find(s => s.id === a.store);
              if (!store) return null;
              const ax = p.x + p.w / 2;
              const ay = p.y + placeHeight(p);
              return (
                <path key={`${p.id}-${a.store}-${ai}`}
                      d={`M ${ax},${ay} L ${store.x},${store.y - 14}`}
                      stroke="#cacaca" strokeWidth="1" strokeDasharray="3 3"
                      fill="none" />
              );
            })
          )}
          {places.map((p) => {
            const ph = placeHeight(p);
            return (
              <g key={p.id}>
                <rect x={p.x} y={p.y} width={p.w} height={ph}
                      rx="6" ry="6" fill="#ffffff"
                      stroke="oklch(0.75 0.10 232)" strokeWidth="1.5" />
                <text x={p.x + 14} y={p.y + 22}
                      fontSize="13" fontWeight="600" fill="#0a0a0a">{p.title}</text>
                <text x={p.x + 14} y={p.y + 38}
                      fontSize="10.5" fontFamily="var(--fg-mono)"
                      fill="#9a9a9a" letterSpacing="0.04em">
                  {(p.sub || '').toUpperCase()}
                </text>
                <line x1={p.x} y1={p.y + 50} x2={p.x + p.w} y2={p.y + 50}
                      stroke="#ececea" strokeWidth="1" />
                {p.affordances.map((a, ai) => {
                  const ay = p.y + 70 + ai * 26;
                  const isSpike = a.flag === 'spike';
                  return (
                    <g key={ai}>
                      <circle cx={p.x + 18} cy={ay - 4} r="3"
                              fill={isSpike ? 'oklch(0.55 0.16 38)' : '#bababa'} />
                      <text x={p.x + 30} y={ay}
                            fontSize="12" fill={isSpike ? '#7a4a2a' : '#3a3a3a'}>
                        {a.name}
                      </text>
                      {isSpike && (
                        <text x={p.x + p.w - 14} y={ay} textAnchor="end"
                              fontSize="9.5" fontFamily="var(--fg-mono)"
                              fill="oklch(0.55 0.16 38)" fontWeight="600"
                              letterSpacing="0.06em">⚠ SPIKE</text>
                      )}
                    </g>
                  );
                })}
              </g>
            );
          })}
          {stores.map((s) => {
            const w = 130, h = 38;
            return (
              <g key={s.id} transform={`translate(${s.x - w/2}, ${s.y})`}>
                <ellipse cx={w/2} cy={4} rx={w/2} ry={5}
                         fill="#f0eee9" stroke="#cacaca" strokeWidth="1" />
                <rect x={0} y={4} width={w} height={h - 8}
                      fill="#f0eee9" stroke="#cacaca" strokeWidth="1" />
                <ellipse cx={w/2} cy={h - 4} rx={w/2} ry={5}
                         fill="#f0eee9" stroke="#cacaca" strokeWidth="1" />
                <text x={w/2} y={h/2 + 4} textAnchor="middle"
                      fontSize="11" fontFamily="var(--fg-mono)"
                      fill="#3a3a3a">{s.label}</text>
                <text x={w/2} y={h + 14} textAnchor="middle"
                      fontSize="9.5" fontFamily="var(--fg-mono)"
                      fill="#9a9a9a" letterSpacing="0.06em">
                  {(s.kind || '').toUpperCase()}
                </text>
              </g>
            );
          })}
        </svg>
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
      case 'jts':
        return (
          <div className="fg-jts">
            <div className="fg-jts__label">Jobs Story</div>
            <div className="fg-jts__body">{block.text}</div>
          </div>
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
      case 'feature':
        return (
          <div className="fg-feature">
            <div className="fg-feature__metric">{block.cells[0]}</div>
            <div className="fg-feature__target">{block.cells[1]}</div>
            {block.cells[2] && <div className="fg-feature__note">{block.cells[2]}</div>}
          </div>
        );
      case 'feed':
        return (
          <div className="fg-feed fg-feed--inline">
            {block.rows.map((r, i) => (
              <div key={i} className="fg-feed__row">
                <span className="fg-feed__ts">{r.ts}</span>
                <span className="fg-feed__text">{r.text}</span>
              </div>
            ))}
          </div>
        );
      case 'persona':
        return <PersonaCard fields={block.fields} />;
      case 'question':
        return <QuestionCard fields={block.fields} />;
      case 'diagram':
        return <Diagram places={block.places} stores={block.stores} wires={block.wires} />;
      default:
        return null;
    }
  }

  // ─── Per-artefact section eyebrows ──────────────────────────
  // Keyed by frontmatter type → { sectionTitle: { eyebrow, meta } }.
  // Anything not listed renders bare.
  const SECTION_META = {
    brief: {
      'The user':              { eyebrow: 'one specific person · not a demographic' },
      'The problem':           { eyebrow: 'what they struggle with · why current solutions fail' },
      'Job-to-be-done':        { eyebrow: 'primary · jobs-story format' },
      'Sub-jobs':              { eyebrow: 'supporting jobs · scope of v1' },
      'Evidence':              { eyebrow: 'what is known · what is assumed', meta: 'audit trail' },
      'Why now':               { eyebrow: 'what changed' },
      'The opportunity':       { eyebrow: 'what changes if this works' },
      'North-star metric':     { eyebrow: 'one signal · one number' },
    },
    personas: {
      'Overview':              { eyebrow: 'priority order · v1 design target' },
      'Personas':              { eyebrow: 'each traces to evidence', meta: 'cards · drag to reorder priority' },
      'Anti-personas':         { eyebrow: 'rejected with reasons' },
      'Notes from synthesis':  { eyebrow: 'merge log from upstream artefacts' },
    },
    'research-plan': {
      'Approach':              { eyebrow: 'two-week structured cycle' },
      'Open questions':        { eyebrow: 'numbered · priority-coded', meta: '5 open' },
      'Out of scope':          { eyebrow: 'not researching this cycle' },
      'Decision log':          { eyebrow: 'cycle-level decisions only' },
    },
    handoff: {
      'State of the world':    { eyebrow: 'where things are right now' },
      'What changed in this burst': { eyebrow: 'time-ordered ledger', meta: 'newest at top' },
      'Decisions taken':       { eyebrow: 'logged in decisions.md' },
      'Carry-forward':         { eyebrow: 'do not start work until resolved', meta: '3 items' },
      'Next agent · entry point': { eyebrow: 'where the next session lands' },
      'Notes for the human':   { eyebrow: 'situational awareness only' },
    },
    breadboard: {
      'System map':            { eyebrow: 'places · affordances · stores · wires', meta: 'pre-code' },
      'Spikes inline':         { eyebrow: 'unknowns to resolve before sequencing' },
      'Method':                { eyebrow: 'shape up · ryan singer' },
    },
  };

  function Rail({ rail, fm }) {
    if (!rail) return null;
    return (
      <aside className="fg-rail">
        <div className="fg-rail__head">
          {rail.icon && <span className="fg-rail__icon">{rail.icon}</span>}
          <span>{rail.title}</span>
          {rail.badge && <span className="fg-rail__badge">{rail.badge}</span>}
        </div>
        <div className="fg-rail__body">
          {rail.intro && <div className="fg-rail__intro">{rail.intro}</div>}
          {rail.items && rail.items.length > 0 && (
            <ol className="fg-rail__list">
              {rail.items.map((it, i) => (
                <li key={i} className="fg-rail__item">
                  <div className="fg-rail__top">
                    <span className="fg-rail__n">{it.n}</span>
                    <span className="fg-rail__rule">{it.rule}</span>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
        <div className="fg-rail__sect">
          <div className="fg-rail__sect-h">Source</div>
          <div className="fg-rail__sect-b" style={{fontFamily:'var(--fg-mono)', fontSize:11.5}}>
            {fm.file}<br/>
            <span style={{color:'var(--fg-ink-soft)'}}>parsed at runtime · {fm.lastEdit}</span>
          </div>
        </div>
        {fm.trail && (
          <div className="fg-rail__sect">
            <div className="fg-rail__sect-h">Discovery trail</div>
            <div style={{display:'flex', flexDirection:'column', gap:4, marginTop:6}}>
              {fm.trail.map((t, i) => (
                <div key={i} style={{
                  fontSize:11.5,
                  fontFamily:'var(--fg-mono)',
                  color: t.state === 'current' ? 'var(--fg-ink-tone)'
                       : t.state === 'next'    ? 'var(--fg-accent)'
                       : 'var(--fg-ink-soft)',
                  fontWeight: t.state === 'current' ? 600 : 400,
                }}>
                  {t.state === 'current' ? '►' : t.state === 'next' ? '○' : '✓'}
                  &nbsp;{t.n} · {t.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>
    );
  }

  // The badge in the header slot adapts to artefact type. We use a tiny
  // glyph rather than a number because these artefacts don't have
  // pipeline positions of their own.
  const TYPE_GLYPH = {
    brief:           { glyph: 'md', tone: 'soft' },
    personas:        { glyph: '⌨',  tone: 'soft' },
    'research-plan': { glyph: '?',  tone: 'soft' },
    handoff:         { glyph: '→',  tone: 'soft' },
    breadboard:      { glyph: '▢',  tone: 'soft' },
  };

  function Header({ fm }) {
    const tg = TYPE_GLYPH[fm.type] || { glyph: 'md', tone: 'soft' };
    return (
      <div className="fg-header">
        <div className="fg-header__crumbs">
          <span className="fg-header__path">{fm.file}</span>
          <span className="fg-header__sep">·</span>
          <span className="fg-pill">{fm.phase ? fm.phase[0].toUpperCase()+fm.phase.slice(1) : ''}</span>
          <span className="fg-header__sep">·</span>
          <span className="fg-header__mode">{fm.status}</span>
          <div className="fg-header__btns">
            <button className="fg-header__btn">Edit source</button>
            <button className="fg-header__btn">View .md ↗</button>
          </div>
        </div>
        <div className="fg-header__title-row">
          <span className="fg-header__n" style={{background:'#f0f0ee', color:'var(--fg-ink-3)'}}>
            {tg.glyph}
          </span>
          <h1 className="fg-header__h1">{fm.title}</h1>
          <span className="fg-header__role">{fm.type} · single source of truth</span>
        </div>
        <p className="fg-header__summary">{fm.tagline}</p>
        <div className="fg-header__stats" style={{'--fg-stat-cols': fm.stats.length}}>
          {fm.stats.map((s, i) => <Stat key={i} {...s} />)}
        </div>
      </div>
    );
  }

  function ArtefactMdPage({ src, embedded }) {
    const [tree, setTree] = React.useState(null);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
      if (!src) { setError('no src given'); return; }
      // Allow inline markdown (rare — useful for tests). String paths fetch.
      if (typeof src === 'string' && !src.endsWith('.md')) {
        setTree(parseMd(src)); return;
      }
      fetch(src).then(r => r.text()).then(text => {
        setTree(parseMd(text));
      }).catch(e => setError(e.message));
    }, [src]);

    if (error) {
      return (
        <div className="fg-root" data-phase="discovery" style={{padding:40}}>
          <div className="fg-card" style={{padding:20}}>
            <div style={{color:'var(--fg-ink)', fontWeight:600}}>Could not load {src}</div>
            <div style={{fontFamily:'var(--fg-mono)', fontSize:12, color:'var(--fg-ink-soft)', marginTop:8}}>
              {error}
            </div>
          </div>
        </div>
      );
    }
    if (!tree) {
      return (
        <div className="fg-root" data-phase="discovery" style={{padding:40}}>
          <div className="fg-card" style={{padding:20, color:'var(--fg-ink-soft)', fontFamily:'var(--fg-mono)', fontSize:12}}>
            parsing markdown source…
          </div>
        </div>
      );
    }

    const { frontmatter: fm, sections } = tree;
    const meta = SECTION_META[fm.type] || {};

    const inner = (
      <>
        <main className="fg-main">
          <Header fm={fm} />
          {sections.map((s, i) => {
            const m = meta[s.title] || {};
            return (
              <Card key={i} title={s.title} eyebrow={m.eyebrow} meta={m.meta}>
                <div className="fg-stack">
                  {s.blocks.map((b, j) => <Block key={j} block={b} />)}
                </div>
              </Card>
            );
          })}
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
        <Rail rail={fm.rail} fm={fm} />
      </>
    );

    if (embedded) return inner;

    return (
      <div className="fg-root" data-phase={fm.phase} style={{minHeight:'100%'}}>
        <div className="fg-shell" data-shell="2col-rail">
          {inner}
        </div>
      </div>
    );
  }

  window.ArtefactMdPage = ArtefactMdPage;
})();
