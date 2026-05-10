// forge-config.js — framework wiring (not idea content).
//
// Phases, the canonical pipeline, and lateral (framework-level) agents.
// Used by every artefact that needs to know "where am I in the
// framework" — agent reference, dashboard, breadboard. Idea-specific
// content lives in the .md sources under output/[idea]/.
//
// data.js retired 2026-05-09. The data-driven artefacts (BriefPage,
// AgentReferencePage, etc.) were superseded by .md-rendered equivalents.

window.FORGE_CONFIG = (function () {
  const PHASES = {
    discovery:  { id: 'discovery',  label: 'Discovery'  },
    refinement: { id: 'refinement', label: 'Refinement' },
    build:      { id: 'build',      label: 'Build'      },
    marketing:  { id: 'marketing',  label: 'Marketing'  },
    framework:  { id: 'framework',  label: 'Framework'  },
  };

  const PIPELINE = [
    { id: '00-intake',           n: '00', name: 'The Scout',         file: 'product-team/00-intake.md',           phase: 'discovery' },
    { id: '01-pm-agent',         n: '01', name: 'The Interrogator',  file: 'product-team/01-pm-agent.md',         phase: 'discovery' },
    { id: '02-design-agent',     n: '02', name: 'The Narrator',      file: 'product-team/02-design-agent.md',     phase: 'discovery' },
    { id: '03-devils-advocate',  n: '03', name: 'The Sceptic',       file: 'product-team/03-devils-advocate.md',  phase: 'discovery' },
    { id: '04-tech-feasibility', n: '04', name: 'The Pragmatist',    file: 'product-team/04-tech-feasibility.md', phase: 'discovery' },
    { id: '05-user-researcher',  n: '05', name: 'The Advocate',      file: 'product-team/05-user-researcher.md',  phase: 'discovery' },
    { id: '06-synthesis',        n: '06', name: 'Synthesis',         file: 'product-team/06-synthesis.md',        phase: 'discovery' },
    { id: 'breadboard',          n: '··', name: 'The Tracer',        file: 'product-team/breadboard.md',          phase: 'discovery' },
    { id: '07-refinement',       n: '07', name: 'Refinement',        file: 'product-team/07-refinement.md',       phase: 'refinement' },
    { id: 'ux-agent',            n: '··', name: 'The Blueprint',     file: 'product-team/ux-agent.md',            phase: 'build' },
    { id: 'delivery-manager',    n: '··', name: 'The Conductor',     file: 'build-team/delivery-manager.md',      phase: 'build' },
    { id: 'engineer',            n: '··', name: 'Engineer',          file: 'build-team/engineer.md',              phase: 'build' },
    { id: 'reviewer',            n: '··', name: 'Reviewer',          file: 'build-team/reviewer.md',              phase: 'build' },
    { id: 'qa',                  n: '··', name: 'QA',                file: 'build-team/qa.md',                    phase: 'build' },
    { id: '08-burst-review',     n: '08', name: 'Burst Review',      file: 'product-team/08-burst-review.md',     phase: 'build' },
    { id: 'monetisation',        n: '··', name: 'The Merchant',      file: 'marketing-team/monetisation-agent.md', phase: 'marketing' },
    { id: 'gtm',                 n: '··', name: 'The Campaigner',    file: 'marketing-team/gtm-agent.md',         phase: 'marketing' },
  ];

  const LATERAL = [
    { id: 'observer',       name: 'The Observer',      mode: 'Always on',  note: 'Fires after every handoff. Critiques process, not outputs.',        file: 'product-team/observer.md'        },
    { id: 'researcher',     name: 'The Researcher',    mode: 'On demand',  note: 'Invoked by any agent to fill factual gaps mid-conversation.',       file: 'product-team/research-agent.md'  },
    { id: 'arbiter',        name: 'The Arbiter',       mode: 'Triggered',  note: 'Fires on product criticism before any action is taken.',            file: 'build-team/feedback-triage.md'   },
    { id: 'cartographer',   name: 'The Cartographer',  mode: 'Autonomous', note: 'Codebase documentation brief. Autonomous + 1 question.',            file: 'build-team/cartographer.md'      },
    { id: 'model-reviewer', name: 'The Calibrator',    mode: 'Autonomous', note: 'Domain-agnostic model architecture and calibration review.',        file: 'product-team/model-reviewer.md'  },
    { id: 'architect',      name: 'Architect',         mode: 'Consulted',  note: 'Foundational technical decisions. Consulted, never assigned tasks.', file: 'build-team/architect.md'        },
  ];

  const PROJECTS = [
    {
      id: 'forge-knowledge-browser',
      name: 'forge-knowledge-browser',
      phase: 'discovery',
      artefacts: [
        { id: 'fkb-running-brief', n: 'rb', name: 'Running brief',    file: 'output/forge-knowledge-browser/running-brief.md',     phase: 'discovery' },
        { id: 'fkb-01',           n: '01', name: 'Problem framing',  file: 'output/forge-knowledge-browser/01-problem-framing.md', phase: 'discovery' },
        { id: 'fkb-02',           n: '02', name: 'UX framing',       file: 'output/forge-knowledge-browser/02-design-agent.md',    phase: 'discovery' },
        { id: 'fkb-03',           n: '03', name: 'Tech feasibility',  file: 'output/forge-knowledge-browser/03-tech-feasibility.md', phase: 'discovery' },
        { id: 'fkb-04',           n: '04', name: 'Assumption log',    file: 'output/forge-knowledge-browser/04-sceptic.md',           phase: 'discovery' },
        { id: 'fkb-brief',        n: 'br', name: 'Brief',             file: 'output/forge-knowledge-browser/brief.md',                 phase: 'discovery' },
        { id: 'fkb-assumptions',  n: 'al', name: 'Assumptions',       file: 'output/forge-knowledge-browser/assumption-log.md',        phase: 'discovery' },
        { id: 'fkb-ost',          n: 'od', name: 'OST decisions',     file: 'output/forge-knowledge-browser/ost-decisions.md',         phase: 'discovery' },
        { id: 'fkb-breadboard',   n: 'bb', name: 'Breadboard',        file: 'output/forge-knowledge-browser/breadboard.md',            phase: 'discovery' },
        { id: 'fkb-kickoff',      n: 'bk', name: 'Build kickoff',     file: 'output/forge-knowledge-browser/build-kickoff.md',          phase: 'refinement' },
      ],
    },
    {
      id: 'wc-sim-market',
      name: 'wc-sim-market',
      phase: 'build',
      artefacts: [
        { id: 'wcsim-brief',         n: 'br', name: 'Brief',              file: 'output/wc-sim-market/brief.md',             phase: 'discovery' },
        { id: 'wcsim-running-brief', n: 'rb', name: 'Running brief',      file: 'output/wc-sim-market/running-brief.md',     phase: 'build'     },
        { id: 'wcsim-personas',      n: 'pe', name: 'Personas',           file: 'output/wc-sim-market/personas.md',          phase: 'discovery' },
        { id: 'wcsim-research-plan', n: 'rp', name: 'Research plan',      file: 'output/wc-sim-market/research-plan.md',    phase: 'discovery' },
        { id: 'wcsim-handoff',       n: 'hf', name: 'Handoff',            file: 'output/wc-sim-market/handoff.md',           phase: 'build'     },
        { id: 'wcsim-kickoff',       n: 'bk', name: 'Build kickoff',      file: 'output/wc-sim-market/build-kickoff.md',    phase: 'refinement'},
        { id: 'wcsim-01',            n: '01', name: 'Problem framing',    file: 'output/wc-sim-market/01-problem-framing.md', phase: 'discovery'},
        { id: 'wcsim-02',            n: '02', name: 'Monetisation',       file: 'output/wc-sim-market/02-monetisation.md',   phase: 'discovery' },
        { id: 'wcsim-03',            n: '03', name: 'Tech feasibility',   file: 'output/wc-sim-market/03-tech-feasibility.md', phase: 'discovery'},
        { id: 'wcsim-04',            n: '04', name: 'UX framing',         file: 'output/wc-sim-market/04-ux-framing.md',     phase: 'discovery' },
        { id: 'wcsim-05',            n: '05', name: 'GTM',                file: 'output/wc-sim-market/05-gtm.md',            phase: 'discovery' },
        { id: 'wcsim-06',            n: '06', name: 'Model assessment',   file: 'output/wc-sim-market/06-model-assessment.md', phase: 'discovery'},
        { id: 'wcsim-07',            n: '07', name: 'Assumption log',     file: 'output/wc-sim-market/07-assumption-log.md', phase: 'discovery' },
      ],
    },
  ];

  return { PHASES, PIPELINE, LATERAL, PROJECTS };
})();
