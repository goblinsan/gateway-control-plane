#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  process-forgejo-deploy-queue.sh \
    --queue-dir <host-path> \
    --control-plane-root <path> \
    --config <gateway-config-path> \
    [--log-path <host-path>] \
    [--archive-dir <host-path>] \
    [--failed-dir <host-path>]

Processes queued Forgejo deploy request JSON files and runs the live host-side
blue/green deploy wrapper for each request.
EOF
}

queue_dir=''
control_plane_root='/opt/gateway-control-plane'
config_path=''
log_path=''
archive_dir=''
failed_dir=''

while [[ $# -gt 0 ]]; do
  case "$1" in
    --queue-dir)
      queue_dir="${2:-}"
      shift 2
      ;;
    --control-plane-root)
      control_plane_root="${2:-}"
      shift 2
      ;;
    --config)
      config_path="${2:-}"
      shift 2
      ;;
    --log-path)
      log_path="${2:-}"
      shift 2
      ;;
    --archive-dir)
      archive_dir="${2:-}"
      shift 2
      ;;
    --failed-dir)
      failed_dir="${2:-}"
      shift 2
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

if [[ -z "$queue_dir" || -z "$config_path" ]]; then
  echo "--queue-dir and --config are required" >&2
  usage >&2
  exit 1
fi

if [[ -z "$log_path" ]]; then
  log_path="${queue_dir%/}/forgejo-deploy-queue.log"
fi

if [[ -z "$archive_dir" ]]; then
  archive_dir="${queue_dir%/}/processed"
fi

if [[ -z "$failed_dir" ]]; then
  failed_dir="${queue_dir%/}/failed"
fi

mkdir -p "$queue_dir" "$archive_dir" "$failed_dir" "$(dirname "$log_path")"

lock_file="${queue_dir%/}/.process.lock"
exec 9>"$lock_file"
if ! flock -n 9; then
  exit 0
fi

append_log() {
  printf '%s %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$1" >>"$log_path"
}

mapfile -t queue_files < <(find "$queue_dir" -maxdepth 1 -type f -name '*.json' | sort)

for queue_file in "${queue_files[@]}"; do
  processing_file="${queue_file}.processing"
  if ! mv "$queue_file" "$processing_file"; then
    continue
  fi

  if ! mapfile -t parsed < <(python3 - "$processing_file" <<'PY'
import json
import sys

path = sys.argv[1]
with open(path, 'r', encoding='utf-8') as fh:
    payload = json.load(fh)
app_id = payload.get('appId', '')
revision = payload.get('revision', '')
if not app_id or not revision:
    raise SystemExit(1)
print(app_id)
print(revision)
PY
  ); then
    append_log "invalid request file ${processing_file}"
    mv "$processing_file" "${failed_dir%/}/$(basename "$processing_file").invalid"
    continue
  fi

  app_id="${parsed[0]}"
  revision="${parsed[1]}"
  append_log "deploy start app=${app_id} revision=${revision}"

  if "$control_plane_root/deploy/bin/deploy-app.sh" --config "$config_path" --app "$app_id" --revision "$revision" >>"$log_path" 2>&1; then
    append_log "deploy success app=${app_id} revision=${revision}"
    mv "$processing_file" "${archive_dir%/}/$(basename "$processing_file" .processing).done.json"
  else
    append_log "deploy failed app=${app_id} revision=${revision}"
    mv "$processing_file" "${failed_dir%/}/$(basename "$processing_file" .processing).failed.json"
  fi
done
