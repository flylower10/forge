#!/usr/bin/env bash
# hooks/post-write.sh — post-output manifest regeneration + viewer open
#
# Invoked by the Claude Code PostToolUse hook after every Write tool call.
# Reads tool context from stdin (JSON). If the write targeted output/[project]/,
# regenerates output/manifest.json and opens the project in the viewer.
#
# Fails silently — never blocks the session.

set -euo pipefail

FORGE_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# Read the tool input JSON from stdin
input=$(cat 2>/dev/null || true)

# Extract file_path from the JSON payload
file_path=$(printf '%s' "$input" \
  | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('tool_input',{}).get('file_path',''))" \
  2>/dev/null || true)

# Only act if the write was to output/[project]/ (one level deep under output/)
if [[ "$file_path" == */output/*/* ]]; then
  # Regenerate manifest
  python3 "$FORGE_ROOT/generate-manifest.py" > /dev/null 2>&1 || true

  # Derive project id from path: extract the directory immediately after output/
  project_id=$(printf '%s' "$file_path" \
    | python3 -c "import sys,re; m=re.search(r'/output/([^/]+)/', sys.stdin.read()); print(m.group(1) if m else '')" \
    2>/dev/null || true)

  # Open viewer if we got a project id and the server is running
  if [[ -n "$project_id" ]]; then
    open "http://localhost:8080/viewer/project.html?id=${project_id}" > /dev/null 2>&1 || true
  fi
fi
