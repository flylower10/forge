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

  return { PHASES, PIPELINE, LATERAL };
})();
