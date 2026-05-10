#!/usr/bin/env python3
"""
generate-manifest.py — scan output/, read ---json frontmatter, write output/manifest.json

Rules:
  - Every subdirectory of output/ is treated as a potential project.
  - .md files with missing or malformed frontmatter: print warning, skip.
  - .md files with type "agent": skip (agent references live in the agent viewer).
  - Directories with zero valid artefacts after filtering: skip.
  - Artefacts ordered by filename (numeric prefix enforces pipeline order).
  - Projects ordered by most recently modified artefact, descending.
"""

import json
import os
import re
import sys
from datetime import datetime, timezone

FORGE_ROOT = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(FORGE_ROOT, 'output')
MANIFEST_PATH = os.path.join(OUTPUT_DIR, 'manifest.json')


def read_frontmatter(filepath):
    """Return parsed ---json frontmatter dict, or None if missing/malformed."""
    try:
        with open(filepath, encoding='utf-8') as f:
            content = f.read()
    except OSError as e:
        print(f'  WARNING: cannot read {filepath}: {e}')
        return None

    m = re.match(r'^---json\s*\n(.*?)\n---\s*\n', content, re.DOTALL)
    if not m:
        return None

    try:
        return json.loads(m.group(1))
    except json.JSONDecodeError as e:
        print(f'  WARNING: malformed frontmatter in {os.path.basename(filepath)}: {e}')
        return None


def scan_project(project_dir, project_name):
    """
    Scan a project directory for .md artefacts.
    Returns (project_dict, last_modified_timestamp) or (None, 0) if no valid artefacts.
    """
    PHASE_ORDER = ['discovery', 'refinement', 'build', 'marketing']
    artefacts = []
    last_modified = 0

    try:
        filenames = sorted(f for f in os.listdir(project_dir) if f.endswith('.md'))
    except OSError as e:
        print(f'  WARNING: cannot list {project_dir}: {e}')
        return None, 0

    for filename in filenames:
        filepath = os.path.join(project_dir, filename)
        fm = read_frontmatter(filepath)

        if fm is None:
            print(f'  WARNING: skipping {filename} — missing or malformed frontmatter')
            continue

        # Skip agent reference files — they live in the agent viewer, not projects
        if fm.get('type') == 'agent':
            continue

        stem = filename[:-3]  # strip .md

        phase = fm.get('phase', 'discovery')

        try:
            mtime = os.path.getmtime(filepath)
            if mtime > last_modified:
                last_modified = mtime
            modified_iso = datetime.fromtimestamp(mtime, tz=timezone.utc).isoformat()
        except OSError:
            modified_iso = None

        artefact = {
            'id':       fm.get('id', stem),
            'n':        fm.get('n', stem[:2] if len(stem) >= 2 else stem),
            'name':     fm.get('title', fm.get('name', stem)),
            'file':     f'output/{project_name}/{filename}',
            'phase':    phase,
            'type':     fm.get('type', ''),
        }
        if modified_iso:
            artefact['modified'] = modified_iso

        # Collect tagline candidates for the project oneline (brief > running-brief > others)
        tagline = fm.get('tagline', '')
        artefact['_tagline'] = tagline  # temporary; stripped before output
        artefact['_type'] = fm.get('type', '')

        artefacts.append(artefact)

    if not artefacts:
        return None, 0

    # Project oneline: prefer tagline from brief, then running-brief, then first found.
    TYPE_PREF = {'brief': 0, 'running-brief': 1}
    tagline_candidates = [(TYPE_PREF.get(a['_type'], 99), a['_tagline']) for a in artefacts if a['_tagline']]
    oneline = min(tagline_candidates, key=lambda x: x[0])[1] if tagline_candidates else ''

    # Strip internal-only fields before output
    for a in artefacts:
        del a['_tagline']
        del a['_type']

    # Project phase: most advanced phase seen across all artefacts.
    # A build-kickoff or build-phase running-brief signals the project's current position,
    # regardless of write order (discovery artefacts may have been written late in the session).
    all_phases = [a['phase'] for a in artefacts if a['phase'] in PHASE_ORDER]
    project_phase = max(all_phases, key=lambda p: PHASE_ORDER.index(p), default='discovery')

    project = {
        'id':        project_name,
        'name':      project_name,
        'phase':     project_phase,
        'oneline':   oneline,
        'artefacts': artefacts,
    }

    return project, last_modified


def main():
    if not os.path.isdir(OUTPUT_DIR):
        print(f'ERROR: output/ directory not found at {OUTPUT_DIR}')
        sys.exit(1)

    project_entries = []

    for entry in sorted(os.listdir(OUTPUT_DIR)):
        project_dir = os.path.join(OUTPUT_DIR, entry)
        if not os.path.isdir(project_dir):
            continue  # skip files directly in output/

        print(f'Scanning {entry}/')
        project, last_modified = scan_project(project_dir, entry)

        if project is None:
            print(f'  Skipped — no valid artefacts')
            continue

        print(f'  {len(project["artefacts"])} artefact(s) → phase: {project["phase"]}')
        project_entries.append((last_modified, project))

    # Sort by most recently modified artefact, newest first
    project_entries.sort(key=lambda x: x[0], reverse=True)
    projects = [p for _, p in project_entries]

    manifest = {
        'generated': datetime.now(timezone.utc).isoformat(),
        'projects':  projects,
    }

    with open(MANIFEST_PATH, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2)
        f.write('\n')

    total = sum(len(p['artefacts']) for p in projects)
    print(f'\n✓ {MANIFEST_PATH}')
    print(f'  {len(projects)} project(s), {total} artefact(s)')


if __name__ == '__main__':
    main()
