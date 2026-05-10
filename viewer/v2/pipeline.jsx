// viewer/v2/pipeline.jsx — PipelineMap
// Adapted from Claude Design v2/pipeline.jsx.
// Accepts data as prop — no window.FORGE_V2 dependency.
// AGENT_PHASE derived at render time from FORGE_CONFIG.PIPELINE.
// Exports: window.PipelineMap

(function () {

  function getAgentPhase(name) {
    // Derive from FORGE_CONFIG.PIPELINE on first access; cache on window
    if (!window._ForgeAgentPhase) {
      const map = { 'The Scout': 'discovery' };
      const pipeline = (window.FORGE_CONFIG && window.FORGE_CONFIG.PIPELINE) || [];
      pipeline.forEach(a => { if (a.name) map[a.name] = a.phase || 'discovery'; });
      window._ForgeAgentPhase = map;
    }
    return window._ForgeAgentPhase[name] || 'discovery';
  }

  function Chip({ name, state, role }) {
    const phase = getAgentPhase(name);
    return (
      <span className="fg-pchip" data-phase={phase} data-state={state || 'upcoming'}>
        <span className="fg-pchip__name">{name}</span>
        {role && state !== 'complete' && (
          <>
            <span className="fg-pchip__role-sep">·</span>
            <span className="fg-pchip__role">{role}</span>
          </>
        )}
      </span>
    );
  }

  function Wave({ wave, roleLookup }) {
    const phase = getAgentPhase(wave.agents[0]) || 'framework';
    const isParallel = wave.kind === 'parallel';
    return (
      <div className="fg-wave" data-phase={phase}>
        <div className="fg-wave__label">
          <span className="fg-wave__n">Wave {wave.n}</span>
          <span className="fg-wave__title">·</span>
          <span className="fg-wave__kind" data-kind={wave.kind}>{wave.kind}</span>
        </div>
        <div className="fg-wave__row" data-kind={wave.kind}>
          {wave.agents.map((name, i) => (
            <React.Fragment key={i}>
              {i > 0 && isParallel && <span className="fg-wave__plus">+</span>}
              <Chip name={name} state={wave.state} role={roleLookup[name]} />
            </React.Fragment>
          ))}
          {wave.note && <div className="fg-wave__note">{wave.note}</div>}
        </div>
      </div>
    );
  }

  function PipelineMap({ data }) {
    if (!data) return null;

    const roleLookup = (data.selected || []).reduce((m, a) => {
      m[a.name] = a.role; return m;
    }, {});

    const hasTrailing = data.trailing && data.trailing.length > 0;
    const hasSkipped = data.skipped && data.skipped.length > 0;

    return (
      <div className="fg-pipemap">
        <div className="fg-pipemap__head">
          <span className="fg-pipemap__title">{data.project}</span>
          {data.typeLines && data.typeLines.length > 0 && (
            <span className="fg-pipemap__type">{data.typeLines.join(' ')}</span>
          )}
          {data.estimate && (
            <span className="fg-pipemap__estimate">est · {data.estimate}</span>
          )}
        </div>

        <div className="fg-pipemap__body">
          {(data.waves || []).map(w => (
            <Wave key={w.n} wave={w} roleLookup={roleLookup} />
          ))}
        </div>

        {hasTrailing && (
          <div className="fg-pipemap__then">
            <span className="fg-pipemap__then-label">Then</span>
            <span className="fg-pipemap__then-chain">
              {data.trailing.map((name, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span className="fg-pipemap__then-arrow">→</span>}
                  <span className="fg-pipemap__then-name">{name}</span>
                </React.Fragment>
              ))}
            </span>
          </div>
        )}

        {hasSkipped && (
          <div className="fg-pipemap__skipped">
            <div className="fg-pipemap__skipped-h">Skipped</div>
            <div className="fg-pipemap__skipped-list">
              {data.skipped.map((s, i) => (
                <div key={i} className="fg-pipemap__skipped-row">
                  <span className="fg-pipemap__skipped-name">{s.name}</span>
                  <span>{s.reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  window.PipelineMap = PipelineMap;
})();
