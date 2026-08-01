#!/bin/bash
# Heuristic smoke alarm for Forge Sheet — tier 1 coverage.
# Fires on the Stop hook after every exchange. Scans sheet/state/*.json.
# Stale file (> THRESHOLD seconds): adds an active heuristic alert.
# Fresh file: clears any active heuristic alerts.

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STATE_DIR="${REPO_DIR}/sheet/state"
THRESHOLD=180  # 3 minutes — enough time for one missed exchange without false positives

[ -d "$STATE_DIR" ] || exit 0
command -v jq &>/dev/null || exit 0

NOW=$(date +%s)

for STATE_FILE in "${STATE_DIR}"/*.json; do
  [ -f "$STATE_FILE" ] || continue
  [[ "$STATE_FILE" == *.tmp ]] && continue

  # Only process files with a projectSlug (valid state files)
  jq -e '.projectSlug' "$STATE_FILE" &>/dev/null || continue

  if [[ "$(uname)" == "Darwin" ]]; then
    MTIME=$(stat -f %m "$STATE_FILE" 2>/dev/null)
  else
    MTIME=$(stat -c %Y "$STATE_FILE" 2>/dev/null)
  fi
  [ -z "$MTIME" ] && continue

  AGE=$((NOW - MTIME))
  TMP="${STATE_FILE}.tmp"

  if [ "$AGE" -gt "$THRESHOLD" ]; then
    # Stale — write active alert if none already present
    ACTIVE=$(jq '[.alerts[]? | select(.type == "heuristic" and .state == "active")] | length' "$STATE_FILE" 2>/dev/null)
    if [ "${ACTIVE:-0}" -eq 0 ]; then
      ALERT_ID="alert-heuristic-$(date +%s)"
      FIRED_AT=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
      DETAIL="${AGE} seconds without a state update. The sheet may be falling behind the session."
      jq --arg id    "$ALERT_ID" \
         --arg detail "$DETAIL" \
         --arg fired  "$FIRED_AT" \
         '.alerts += [{
           "id": $id,
           "type": "heuristic",
           "state": "active",
           "detail": $detail,
           "firedAt": $fired,
           "clearedAt": null
         }]' "$STATE_FILE" > "$TMP" && mv "$TMP" "$STATE_FILE"
    fi
  else
    # Fresh — clear any active heuristic alerts
    HAS_ACTIVE=$(jq '[.alerts[]? | select(.type == "heuristic" and .state == "active")] | length' "$STATE_FILE" 2>/dev/null)
    if [ "${HAS_ACTIVE:-0}" -gt 0 ]; then
      CLEARED_AT=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
      jq --arg cleared "$CLEARED_AT" \
         '.alerts |= map(
           if .type == "heuristic" and .state == "active"
           then . + {"state": "cleared", "clearedAt": $cleared}
           else .
           end
         )' "$STATE_FILE" > "$TMP" && mv "$TMP" "$STATE_FILE"
    fi
  fi
done

exit 0
