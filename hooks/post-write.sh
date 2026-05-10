#!/usr/bin/env bash
# hooks/post-write.sh — FLY-59: post-output manifest regeneration
#
# Invoked by the Claude Code PostToolUse hook after every Write tool call.
# Reads tool context from stdin (JSON). If the write targeted output/[project]/,
# regenerates output/manifest.json so the viewer picks up the new artefact.
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

# Only regenerate if the write was to output/[project]/ (one level deep under output/)
if [[ "$file_path" == */output/*/*  ]]; then
  python3 "$FORGE_ROOT/generate-manifest.py" > /dev/null 2>&1 || true
fi
