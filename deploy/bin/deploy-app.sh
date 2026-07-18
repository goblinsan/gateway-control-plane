#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
NODE_BIN="$("${REPO_ROOT}/deploy/bin/resolve-node.sh")"
"${NODE_BIN}" --experimental-strip-types "${REPO_ROOT}/src/cli.ts" deploy-app "$@"
