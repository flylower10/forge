// Pipeline dashboard — cross-idea state. Tests whether the system grammar
// works without a right rail and with a 2-col shell.
// Dashboard data is inlined here as a working fixture. When the
// framework starts collecting real cross-idea state, this object
// becomes a live read from output/_pipeline/state.json — the renderer
// does not change.
(function () {
  const { PHASES, PIPELINE } = window.FORGE_CONFIG;
  const DASHBOARD = {
    title: 'Pipeline dashboard',
    file: 'output/pipeline-dashboard.html',
    summary: 'Cross-idea state. Updated automatically after every agent handoff.',
    counts: { active: 4, blocked: 1, idle: 2, shipped: 7 },
    ideas: [
      { id:'fieldnotes', name:'Fieldnotes',
        tagline:'Real-time capture + theme synthesis for in-person UX research.',
        phase:'discovery', current:'06 · Synthesis',
        progress:0.42, lastEdit:'14m ago',
        next:'Synthesis hands off to The Tracer', state:'active', flags:['PM REVIEW'] },
      { id:'beacon', name:'Beacon',
        tagline:'Mobile-first incident response for distributed engineering teams.',
        phase:'refinement', current:'07 · Refinement Ceremony',
        progress:0.61, lastEdit:'2h ago',
        next:'Acceptance criteria review with human', state:'active', flags:[] },
      { id:'compost', name:'Compost',
        tagline:'Inbox triage that actually finishes — autonomous archival under a personal rule book.',
        phase:'build', current:'·· Engineer',
        progress:0.78, lastEdit:'4h ago',
        next:'Burst Review — handoff due', state:'active', flags:[] },
      { id:'lighthouse', name:'Lighthouse',
        tagline:'Calibration tooling for forecast-driven product decisions.',
        phase:'build', current:'·· QA',
        progress:0.91, lastEdit:'1d ago',
        next:'Awaiting QA on epic LIG-12', state:'blocked', flags:['BLOCKED'] },
      { id:'kiln', name:'Kiln',
        tagline:'Long-form writing companion for non-fiction authors.',
        phase:'discovery', current:'03 · Devil\u2019s Advocate',
        progress:0.19, lastEdit:'3d ago',
        next:'Sceptic challenge unread by human', state:'idle', flags:['IDLE 3d'] },
      { id:'brace', name:'Brace',
        tagline:'Posture and load-tracking for desk-bound knowledge workers.',
        phase:'discovery', current:'01 · The Interrogator',
        progress:0.08, lastEdit:'6d ago',
        next:'PM gate not yet attempted', state:'idle', flags:['IDLE 6d'] },
    ],
    recent: [
      { ts:'14m', idea:'fieldnotes', agent:'06 · Synthesis',           event:'wrote brief.md, personas.md, research-plan.md' },
      { ts:'2h',  idea:'beacon',     agent:'07 · Refinement Ceremony', event:'opened gate · 14 acceptance criteria pending' },
      { ts:'4h',  idea:'compost',    agent:'·· Reviewer',              event:'PR #42 returned — 2 comments' },
      { ts:'1d',  idea:'lighthouse', agent:'·· QA',                    event:'flagged LIG-12 as BLOCKED — fixture missing' },
      { ts:'1d',  idea:'fieldnotes', agent:'The Researcher',           event:'returned 4 sources on diarisation latency' },
      { ts:'2d',  idea:'compost',    agent:'·· Engineer',              event:'closed CMP-31 · CMP-32 · CMP-33' },
    ],
  };

  const VIEWS = [
    { id:'all',      name:'All ideas',      count: DASHBOARD.ideas.length, active:true },
    { id:'active',   name:'Active',         count: DASHBOARD.counts.active },
    { id:'blocked',  name:'Blocked',        count: DASHBOARD.counts.blocked, alert:true },
    { id:'idle',     name:'Idle > 3 days',  count: DASHBOARD.counts.idle },
    { id:'shipped',  name:'Shipped',        count: DASHBOARD.counts.shipped, mute:true },
  ];

  const SCOPES = [
    { id:'discovery',  name:'Discovery',  count: 3 },
    { id:'refinement', name:'Refinement', count: 1 },
    { id:'build',      name:'Build',      count: 2 },
    { id:'marketing',  name:'Marketing',  count: 0 },
  ];

  function ViewRail() {
    return (
      <aside className="fg-dir">
        <div className="fg-dir__head">
          <div className="fg-dir__brand">
            <span className="fg-dir__mark">◆</span> Forge
            <span className="fg-dir__ver">v0.4</span>
          </div>
          <input className="fg-dir__search" placeholder="Filter ideas…" readOnly />
        </div>

        <div className="fg-dir__group">
          <div className="fg-dir__group-head">
            <span className="fg-dir__group-label">views</span>
          </div>
          {VIEWS.map(v => (
            <div key={v.id}
                 className={`fg-dir__item${v.active ? ' fg-dir__item--active' : ''}`}>
              <span className="fg-dir__n" style={{
                color: v.alert ? 'oklch(0.55 0.16 28)' :
                       v.mute  ? 'var(--fg-ink-faint)' : undefined
              }}>{String(v.count).padStart(2,'·')}</span>
              <div style={{flex:1, minWidth:0}}>
                <div className="fg-dir__name">{v.name}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="fg-dir__group">
          <div className="fg-dir__group-head">
            <span className="fg-dir__group-label">by phase</span>
          </div>
          {SCOPES.map(s => (
            <div key={s.id} data-phase={s.id} className="fg-dir__item">
              <span className="fg-dir__n">{String(s.count).padStart(2,'·')}</span>
              <div style={{flex:1, minWidth:0}}>
                <div className="fg-dir__name">{s.name}</div>
                <div className="fg-dir__sub" style={{
                  color:'var(--fg-ink-tone)',
                  fontFamily:'var(--fg-sans)',
                  textTransform:'lowercase'
                }}>active phase</div>
              </div>
            </div>
          ))}
        </div>

        <div className="fg-dir__group">
          <div className="fg-dir__group-head">
            <span className="fg-dir__group-label">framework</span>
          </div>
          {[
            { name:'Pipeline overview', sub:'all 16 agents' },
            { name:'Decision log',      sub:'/docs/decisions.md' },
            { name:'Burst review',      sub:'last: 4h ago' },
            { name:'Observer',          sub:'5 process notes' },
          ].map(f => (
            <div key={f.name} className="fg-dir__item">
              <span className="fg-dir__n">··</span>
              <div style={{flex:1, minWidth:0}}>
                <div className="fg-dir__name">{f.name}</div>
                <div className="fg-dir__sub">{f.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </aside>
    );
  }

  function Header() {
    return (
      <div className="fg-header">
        <div className="fg-header__crumbs">
          <span className="fg-header__path">{DASHBOARD.file}</span>
          <span className="fg-header__sep">·</span>
          <span className="fg-pill fg-pill--neutral">cross-idea state</span>
          <span className="fg-header__sep">·</span>
          <span className="fg-header__mode">auto-updated · 14m ago</span>
          <div className="fg-header__btns">
            <button className="fg-header__btn">Refresh</button>
            <button className="fg-header__btn">Export ↗</button>
          </div>
        </div>
        <div className="fg-header__title-row">
          <h1 className="fg-header__h1" style={{marginLeft:0}}>{DASHBOARD.title}</h1>
          <span className="fg-header__role">{DASHBOARD.summary}</span>
        </div>
      </div>
    );
  }

  function Counters() {
    return (
      <div className="fg-counters">
        <div className="fg-counter">
          <div className="fg-counter__k">Active</div>
          <div className="fg-counter__v">{DASHBOARD.counts.active}</div>
        </div>
        <div className="fg-counter fg-counter--alert">
          <div className="fg-counter__k">Blocked</div>
          <div className="fg-counter__v">{DASHBOARD.counts.blocked}</div>
        </div>
        <div className="fg-counter">
          <div className="fg-counter__k">Idle &gt; 3 days</div>
          <div className="fg-counter__v">{DASHBOARD.counts.idle}</div>
        </div>
        <div className="fg-counter fg-counter--mute">
          <div className="fg-counter__k">Shipped</div>
          <div className="fg-counter__v">{DASHBOARD.counts.shipped}</div>
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

  function flagEl(tag) {
    const t = tag.toLowerCase();
    let cls = '';
    if (t.includes('blocked')) cls = 'fg-flag--blocked';
    else if (t.includes('idle')) cls = 'fg-flag--idle';
    else if (t.includes('tech')) cls = 'fg-flag--tech';
    else if (t.includes('research')) cls = 'fg-flag--research';
    return <span className={`fg-flag ${cls}`}>{tag}</span>;
  }

  function IdeaCard({ idea }) {
    return (
      <article className="fg-idea" data-state={idea.state} data-phase={idea.phase}>
        <div className="fg-idea__head">
          <span className="fg-idea__name">{idea.name}</span>
          <span className="fg-idea__id">/{idea.id}</span>
          <div className="fg-idea__flags">
            {idea.flags.map((f, i) => <React.Fragment key={i}>{flagEl(f)}</React.Fragment>)}
          </div>
        </div>
        <div className="fg-idea__tag">{idea.tagline}</div>
        <div className="fg-idea__row">
          <span className="fg-idea__phase">{PHASES[idea.phase].label}</span>
          <span className="fg-idea__current">· {idea.current}</span>
          <span className="fg-idea__when">{idea.lastEdit}</span>
        </div>
        <div className="fg-progress">
          <div className="fg-progress__bar" style={{width: `${idea.progress * 100}%`}} />
        </div>
        <div className="fg-idea__next">
          <span className="fg-idea__next-label">Next</span>
          <span>{idea.next}</span>
        </div>
      </article>
    );
  }

  function Ideas() {
    return (
      <Card title="Ideas" eyebrow={`${DASHBOARD.ideas.length} tracked`}
            meta="sorted by phase progress">
        <div className="fg-ideas">
          {DASHBOARD.ideas.map(i => <IdeaCard key={i.id} idea={i} />)}
        </div>
      </Card>
    );
  }

  function Activity() {
    return (
      <Card title="Recent activity" eyebrow="agent handoffs"
            meta={`${DASHBOARD.recent.length} events · last 48h`}>
        <div className="fg-feed">
          <div className="fg-feed__row" style={{
            color:'var(--fg-ink-soft)',
            fontFamily:'var(--fg-mono)',
            fontSize:10.5,
            letterSpacing:'0.08em',
            textTransform:'uppercase',
            paddingBottom:8
          }}>
            <span>Ago</span>
            <span>Idea</span>
            <span>Agent</span>
            <span>Event</span>
          </div>
          {DASHBOARD.recent.map((r, i) => (
            <div key={i} className="fg-feed__row">
              <span className="fg-feed__ts">{r.ts}</span>
              <span className="fg-feed__idea">{r.idea}</span>
              <span className="fg-feed__agent">{r.agent}</span>
              <span className="fg-feed__event">{r.event}</span>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  function PipelineOverview() {
    // Show all 16 agents with current-position dots per active idea.
    const positionsByAgent = {};
    DASHBOARD.ideas.forEach(idea => {
      // crude match: idea.current contains agent number
      const m = idea.current.match(/(\d{2}|··)/);
      if (m) {
        const key = m[0];
        positionsByAgent[key] = positionsByAgent[key] || [];
        positionsByAgent[key].push(idea);
      }
    });

    return (
      <Card title="Pipeline overview" eyebrow="who is where"
            meta={`${PIPELINE.length} agents · 4 phases`}>
        <div className="fg-tape">
          {PIPELINE.map((p, i) => {
            const prev = i > 0 ? PIPELINE[i-1] : null;
            const phaseChange = prev && prev.phase !== p.phase;
            const here = positionsByAgent[p.n] || [];
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
                     className={`fg-tape__node${here.length ? ' fg-tape__node--current' : ''}`}>
                  <div className="fg-tape__n">{p.n}</div>
                  <div className="fg-tape__name">{p.name}</div>
                  {here.length > 0 && (
                    <div className="fg-tape__here" style={{display:'flex', gap:4, flexWrap:'wrap'}}>
                      {here.map(h => (
                        <span key={h.id} style={{
                          fontSize: 9, padding:'1px 5px', borderRadius:99,
                          background:'var(--fg-tint)', color:'var(--fg-ink-tone)',
                          letterSpacing:0
                        }}>{h.name.toLowerCase()}</span>
                      ))}
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </Card>
    );
  }

  function DashboardPage() {
    return (
      <div className="fg-root" data-phase="framework" style={{minHeight:'100%'}}>
        <div className="fg-shell" data-shell="2col">
          <ViewRail />
          <main className="fg-main">
            <Header />
            <Counters />
            <div style={{height: 16}} />
            <Ideas />
            <PipelineOverview />
            <Activity />
          </main>
        </div>
      </div>
    );
  }

  window.DashboardPage = DashboardPage;
})();
