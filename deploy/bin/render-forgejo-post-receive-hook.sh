#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  render-forgejo-post-receive-hook.sh \
    --app <app-id> \
    [--target-ref <git-ref>] \
    [--queue-dir <container-visible-path>] \
    [--log-path <container-visible-path>]

Renders a Forgejo/Gitea post-receive Git hook to stdout.

The rendered hook is container-safe: it does not try to run host deploy
commands directly. Instead it writes a deploy request JSON file into the shared
Forgejo data bind mount. A host-side queue processor can then handle the actual
deploy as the gateway operator user.

Recommended queue dir:
  /data/forgejo/deploy-queue/managed-apps

Recommended host-side processor:
  deploy/bin/process-forgejo-deploy-queue.sh
EOF
}

shell_quote() {
  printf "'%s'" "$(printf '%s' "$1" | sed "s/'/'\\\\''/g")"
}

app_id=''
target_ref='refs/heads/main'
queue_dir='/data/forgejo/deploy-queue/managed-apps'
log_path=''

while [[ $# -gt 0 ]]; do
  case "$1" in
    --app)
      app_id="${2:-}"
      shift 2
      ;;
    --target-ref)
      target_ref="${2:-}"
      shift 2
      ;;
    --queue-dir)
      queue_dir="${2:-}"
      shift 2
      ;;
    --log-path)
      log_path="${2:-}"
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

if [[ -z "$app_id" ]]; then
  echo "--app is required" >&2
  usage >&2
  exit 1
fi

if [[ -z "$log_path" ]]; then
  log_path="/data/forgejo/deploy-queue/logs/${app_id}-forgejo-autodeploy.log"
fi

quoted_app_id="$(shell_quote "$app_id")"
quoted_target_ref="$(shell_quote "$target_ref")"
quoted_queue_dir="$(shell_quote "$queue_dir")"
quoted_log_path="$(shell_quote "$log_path")"

cat <<EOF
#!/usr/bin/env bash
set -euo pipefail

app_id=${quoted_app_id}
target_ref=${quoted_target_ref}
queue_dir=${quoted_queue_dir}
log_path=${quoted_log_path}
zero_rev='0000000000000000000000000000000000000000'

mkdir -p "\$queue_dir" "\$(dirname "\$log_path")"

append_log() {
  { printf '%s\n' "\$1"; } 2>/dev/null >>"\$log_path" || true
}

while read -r oldrev newrev refname; do
  [[ "\$refname" == "\$target_ref" ]] || continue
  [[ "\$newrev" != "\$zero_rev" ]] || continue

  timestamp="\$(date -u +%Y%m%dT%H%M%SZ 2>/dev/null || date)"
  request_file="\$queue_dir/\${timestamp}--\${app_id}--\${newrev}.json"
  tmp_file="\${request_file}.tmp"

  cat >"\$tmp_file" <<JSON
{"appId":"\$app_id","revision":"\$newrev","ref":"\$refname","queuedAt":"\$timestamp","source":"forgejo-post-receive"}
JSON
  mv "\$tmp_file" "\$request_file"
  append_log "\$timestamp queued \${app_id} deploy for \$newrev via \$request_file"
done

exit 0
EOF
