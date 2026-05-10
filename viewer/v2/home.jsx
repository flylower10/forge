// viewer/v2/home.jsx — Project home screen
// Adapted from Claude Design v2/home.jsx.
// Accepts projects[] + loading + manifestTime from parent (no FORGE_V2 dependency).
// Exports: window.HomeScreen
//
// States:
//   loading=true               → HomeIndexLoading (skeleton)
//   loading=false, empty       → HomeIndexEmpty
//   loading=false, 1 project   → HomeIndexSingle (with recent activity)
//   loading=false, 2+ projects → HomeIndex (sortable, filterable)

(function () {
  const { useState, useMemo } = React;

  function fmtRel(iso) {
    if (!iso) return '';
    const t = new Date(iso).getTime();
    const now = Date.now();
    const min = Math.round((now - t) / 60000);
    if (min < 1)  return 'just now';
    if (min < 60) return `${min}m ago`;
    const hr = Math.round(min / 60);
    if (hr < 24) return `${hr}h ago`;
    const d = Math.round(hr / 24);
    return `${d}d ago`;
  }

  function lastArtefact(p) { return p.artefacts[p.artefacts.length - 1]; }

  // ── Phase legend + filter ─────────────────────────────────────────────────
  function PhaseLegend({ projects, filter, setFilter, manifestTime }) {
    const phases = ['discovery', 'refinement', 'build', 'marketing'];
    const counts = phases.reduce((m, p) => {
      m[p] = projects.filter(x => x.phase === p).length;
      return m;
    }, {});
    return (
      <div className="fg-home__legend">
        {phases.filter(p => counts[p] > 0).map(p => {
          const active = filter === p;
          return (
            <button
              key={p}
              className="fg-home__legend-item fg-home__legend-item--btn"
              data-phase={p}
              data-active={active ? 'true' : null}
              onClick={() => setFilter && setFilter(active ? null : p)}
            >
              {p}<span className="fg-home__legend-count">· {counts[p]}</span>
            </button>
          );
        })}
        {filter && (
          <button className="fg-home__clear" onClick={() => setFilter(null)}>clear filter</button>
        )}
        <span className="fg-home__count">
          {projects.length} {projects.length === 1 ? 'project' : 'projects'} · manifest {manifestTime}
        </span>
      </div>
    );
  }

  // ── Shared page chrome ────────────────────────────────────────────────────
  function HomeFrame({ children, projects, filter, setFilter, manifestTime = '—', showPoll = true }) {
    return (
      <div className="fg-home">
        <div className="fg-home__top">
          <div className="fg-home__brand">
            forge
            <span className="fg-home__brand-mark">v0.4 · local</span>
          </div>
          <nav className="fg-home__nav">
            {showPoll && <span className="fg-home__poll">live · poll 30s</span>}
            <a href="agents.html">Agents</a>
          </nav>
        </div>
        <PhaseLegend
          projects={projects}
          filter={filter}
          setFilter={setFilter}
          manifestTime={manifestTime}
        />
        {children}
      </div>
    );
  }

  // ── Populated state (2+ projects) ─────────────────────────────────────────
  function HomeIndex({ projects, manifestTime }) {
    const [filter, setFilter] = useState(null);
    const [sort, setSort] = useState('recent');

    const sorted = useMemo(() => {
      const filt = filter ? projects.filter(p => p.phase === filter) : projects.slice();
      const cmp = {
        recent: (a, b) => {
          const la = lastArtefact(a), lb = lastArtefact(b);
          const ta = la?.modified ? new Date(la.modified).getTime() : 0;
          const tb = lb?.modified ? new Date(lb.modified).getTime() : 0;
          return tb - ta;
        },
        name:      (a, b) => a.name.localeCompare(b.name),
        artefacts: (a, b) => b.artefacts.length - a.artefacts.length,
      }[sort];
      return filt.sort(cmp);
    }, [projects, filter, sort]);

    return (
      <HomeFrame projects={projects} filter={filter} setFilter={setFilter} manifestTime={manifestTime}>
        <div className="fg-home__h">
          <div>
            <span className="fg-home__h-eyebrow">Projects</span>
            <span className="fg-home__h-title">
              {filter ? `${filter} · ${sorted.length}` : `Active · ${sorted.length}`}
            </span>
          </div>
          <div className="fg-home__sort">
            <span className="fg-home__sort-label">Sort</span>
            {['recent', 'name', 'artefacts'].map(k => (
              <button
                key={k}
                className="fg-home__sort-btn"
                data-active={sort === k ? 'true' : null}
                onClick={() => setSort(k)}
              >{k}</button>
            ))}
          </div>
        </div>
        <div className="fg-index-list">
          {sorted.map((p, i) => {
            const last = lastArtefact(p);
            return (
              <a key={p.id} className="fg-index-row" data-phase={p.phase}
                 href={`project.html?id=${p.id}`}>
                <span className="fg-index-row__num">{String(i + 1).padStart(2, '0')}</span>
                <div className="fg-index-row__main">
                  <div className="fg-index-row__name">{p.name}</div>
                  {p.oneline && <div className="fg-index-row__one">{p.oneline}</div>}
                  <div className="fg-index-row__meta">
                    <span className="fg-index-row__phase">{p.phase}</span>
                    <span className="fg-index-row__sep">/</span>
                    <span>{p.artefacts.length} artefacts</span>
                  </div>
                </div>
                {last && (
                  <div className="fg-index-row__last">
                    <span className="fg-index-row__last-eyebrow">last</span>
                    <span className="fg-index-row__last-name">{last.name}</span>
                    {last.modified && (
                      <span className="fg-index-row__last-when">{fmtRel(last.modified)}</span>
                    )}
                  </div>
                )}
                <span className="fg-index-row__arrow" aria-hidden="true">→</span>
              </a>
            );
          })}
          {sorted.length === 0 && (
            <div className="fg-index-empty">
              No projects in <strong>{filter}</strong>.
              <button className="fg-home__sort-btn"
                      onClick={() => setFilter(null)}
                      style={{ marginLeft: 12 }}>show all</button>
            </div>
          )}
        </div>
      </HomeFrame>
    );
  }

  // ── Single project state ──────────────────────────────────────────────────
  function HomeIndexSingle({ projects, manifestTime }) {
    const p = projects[0];
    const last = lastArtefact(p);
    return (
      <HomeFrame projects={projects} manifestTime={manifestTime}>
        <div className="fg-home__h">
          <span className="fg-home__h-eyebrow">Project</span>
          <span className="fg-home__h-title">Active · 1</span>
        </div>
        <div className="fg-index-list fg-index-list--single">
          <a className="fg-index-row" data-phase={p.phase} href={`project.html?id=${p.id}`}>
            <span className="fg-index-row__num">01</span>
            <div className="fg-index-row__main">
              <div className="fg-index-row__name fg-index-row__name--xl">{p.name}</div>
              {p.oneline && <div className="fg-index-row__one">{p.oneline}</div>}
              <div className="fg-index-row__meta">
                <span className="fg-index-row__phase">{p.phase}</span>
                <span className="fg-index-row__sep">/</span>
                <span>{p.artefacts.length} artefacts</span>
              </div>
            </div>
            {last && (
              <div className="fg-index-row__last">
                <span className="fg-index-row__last-eyebrow">last</span>
                <span className="fg-index-row__last-name">{last.name}</span>
                {last.modified && (
                  <span className="fg-index-row__last-when">{fmtRel(last.modified)}</span>
                )}
              </div>
            )}
            <span className="fg-index-row__arrow" aria-hidden="true">→</span>
          </a>
          <div className="fg-index-recent">
            <div className="fg-index-recent__h">Recent activity</div>
            <ul className="fg-index-recent__list">
              {p.artefacts.slice(-6).reverse().map(a => (
                <li key={a.id} className="fg-index-recent__row" data-phase={a.phase}>
                  <span className="fg-index-recent__n">{a.n}</span>
                  <span className="fg-index-recent__name">{a.name}</span>
                  <span className="fg-index-recent__type">{a.type}</span>
                  {a.modified && (
                    <span className="fg-index-recent__when">{fmtRel(a.modified)}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </HomeFrame>
    );
  }

  // ── Empty state ───────────────────────────────────────────────────────────
  function HomeIndexEmpty() {
    return (
      <HomeFrame projects={[]} manifestTime="—" showPoll={false}>
        <div className="fg-index-emptystate">
          <div className="fg-index-emptystate__hash">∅</div>
          <h2 className="fg-index-emptystate__h">No projects found.</h2>
          <p className="fg-index-emptystate__p">
            Run <code>./forge serve</code> from the forge directory to generate the manifest.
          </p>
          <pre className="fg-index-emptystate__cmd">$ ./forge serve
→ scanning output/
→ wrote output/manifest.json
→ http://localhost:8080</pre>
        </div>
      </HomeFrame>
    );
  }

  // ── Loading skeleton ──────────────────────────────────────────────────────
  function HomeIndexLoading() {
    const rows = [
      { num: '01', w: 240, w2: 360 },
      { num: '02', w: 180, w2: 300 },
      { num: '03', w: 200, w2: 420 },
      { num: '04', w: 160, w2: 280 },
    ];
    return (
      <div className="fg-home">
        <div className="fg-home__top">
          <div className="fg-home__brand">
            forge
            <span className="fg-home__brand-mark">v0.4 · local</span>
          </div>
          <nav className="fg-home__nav">
            <span className="fg-home__poll">loading…</span>
          </nav>
        </div>
        <div className="fg-home__legend">
          <span className="fg-skel" style={{ width: 80, height: 14 }} />
          <span className="fg-skel" style={{ width: 80, height: 14 }} />
          <span className="fg-skel" style={{ width: 80, height: 14 }} />
          <span className="fg-home__count" style={{ color: 'var(--fg-ink-faint)' }}>
            loading manifest…
          </span>
        </div>
        <div className="fg-home__h">
          <span className="fg-home__h-eyebrow">Projects</span>
        </div>
        <div className="fg-index-list">
          {rows.map((r, i) => (
            <div key={i} className="fg-index-row fg-index-row--skel">
              <span className="fg-index-row__num">{r.num}</span>
              <div className="fg-index-row__main">
                <span className="fg-skel fg-skel--xl" style={{ width: r.w }} />
                <span className="fg-skel" style={{ width: r.w2, height: 12, marginTop: 10 }} />
                <span className="fg-skel" style={{ width: 200, height: 10, marginTop: 10 }} />
              </div>
              <div className="fg-index-row__last">
                <span className="fg-skel" style={{ width: 80, height: 11 }} />
                <span className="fg-skel" style={{ width: 60, height: 11, marginTop: 6 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Root export — picks the right variant ─────────────────────────────────
  function HomeScreen({ projects, loading, manifestTime }) {
    if (loading) return <HomeIndexLoading />;
    if (!projects || projects.length === 0) return <HomeIndexEmpty />;
    if (projects.length === 1) return <HomeIndexSingle projects={projects} manifestTime={manifestTime} />;
    return <HomeIndex projects={projects} manifestTime={manifestTime} />;
  }

  window.HomeScreen = HomeScreen;
})();
