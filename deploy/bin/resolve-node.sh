#!/usr/bin/env bash
set -euo pipefail

supports_strip_types() {
  local candidate="$1"
  "$candidate" --experimental-strip-types -e "" >/dev/null 2>&1
}

if [[ -n "${NODE_BIN:-}" && -x "${NODE_BIN:-}" ]] && supports_strip_types "${NODE_BIN}"; then
  printf '%s\n' "${NODE_BIN}"
  exit 0
fi

declare -a candidates=()

if command -v node >/dev/null 2>&1; then
  candidates+=("$(command -v node)")
fi

for candidate in \
  /usr/local/lib/nodejs/*/bin/node \
  "${HOME}/.nvm/versions/node"/*/bin/node
do
  [[ -x "$candidate" ]] || continue
  candidates+=("$candidate")
done

for candidate in "${candidates[@]}"; do
  if supports_strip_types "$candidate"; then
    printf '%s\n' "$candidate"
    exit 0
  fi
done

echo "Unable to find a Node.js runtime that supports --experimental-strip-types." >&2
echo "Set NODE_BIN to a Node 24+ binary path before running this command." >&2
exit 1
