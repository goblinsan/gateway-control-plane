#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  render-forgejo-post-receive-hook.sh \
    --app <app-id> \
    --config <gateway-config-path> \
    [--control-plane-root <path>] \
    [--control-plane-repo-path <local-bare-repo-path>] \
    [--target-ref <git-ref>] \
    [--log-path <path>] \
    [--lock-path <path>]

Renders a Forgejo/Gitea post-receive Git hook to stdout.

Recommended use:
  1. Update the live gateway app repoUrl to a local bare-repo path or file:// URL.
  2. Render the hook for the repo.
  3. Install the rendered script in Forgejo repo Settings > Git Hooks > post-receive,
     or via the Forgejo/Gitea Git hook API.

When --control-plane-repo-path is set, the generated hook also refreshes the
host checkout at --control-plane-root to the pushed revision before invoking
deploy-app.sh. That is required when the repo whose hook you are installing is
gateway-control-plane itself.
EOF
}

shell_quote() {
  printf "'%s'" "$(printf '%s' "$1" | sed "s/'/'\\\\''/g")"
}

app_id=''
config_path=''
control_plane_root='/opt/gateway-control-plane'
control_plane_repo_path=''
target_ref='refs/heads/main'
log_path=''
lock_path=''

while [[ $# -gt 0 ]]; do
  case "$1" in
    --app)
      app_id="${2:-}"
      shift 2
      ;;
    --config)
      config_path="${2:-}"
      shift 2
      ;;
    --control-plane-root)
      control_plane_root="${2:-}"
      shift 2
      ;;
    --control-plane-repo-path)
      control_plane_repo_path="${2:-}"
      shift 2
      ;;
    --target-ref)
      target_ref="${2:-}"
      shift 2
      ;;
    --log-path)
      log_path="${2:-}"
      shift 2
      ;;
    --lock-path)
      lock_path="${2:-}"
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

if [[ -z "$app_id" || -z "$config_path" ]]; then
  echo "--app and --config are required" >&2
  usage >&2
  exit 1
fi

if [[ -z "$log_path" ]]; then
  log_path="/var/log/gateway-control-plane/${app_id}-forgejo-deploy.log"
fi

if [[ -z "$lock_path" ]]; then
  lock_path="/tmp/${app_id}-forgejo-deploy.lock"
fi

quoted_app_id="$(shell_quote "$app_id")"
quoted_config_path="$(shell_quote "$config_path")"
quoted_control_plane_root="$(shell_quote "$control_plane_root")"
quoted_control_plane_repo_path="$(shell_quote "$control_plane_repo_path")"
quoted_target_ref="$(shell_quote "$target_ref")"
quoted_log_path="$(shell_quote "$log_path")"
quoted_lock_path="$(shell_quote "$lock_path")"

cat <<EOF
#!/usr/bin/env bash
set -euo pipefail

app_id=${quoted_app_id}
config_path=${quoted_config_path}
control_plane_root=${quoted_control_plane_root}
control_plane_repo_path=${quoted_control_plane_repo_path}
target_ref=${quoted_target_ref}
log_path=${quoted_log_path}
lock_path=${quoted_lock_path}
zero_rev='0000000000000000000000000000000000000000'

mkdir -p "\$(dirname "\$log_path")"

while read -r oldrev newrev refname; do
  [[ "\$refname" == "\$target_ref" ]] || continue
  [[ "\$newrev" != "\$zero_rev" ]] || exit 0

  (
    set -euo pipefail
    export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

    if command -v flock >/dev/null 2>&1; then
      exec 9>"\$lock_path"
      flock -n 9 || {
        echo "[forgejo-deploy] deploy already running for \$app_id; skipping \$newrev"
        exit 0
      }
    fi

    echo "[forgejo-deploy] app=\$app_id ref=\$refname revision=\$newrev"

    if [[ -n "\$control_plane_repo_path" ]]; then
      if [[ ! -d "\$control_plane_root/.git" ]]; then
        rm -rf "\$control_plane_root"
        git clone "\$control_plane_repo_path" "\$control_plane_root"
      fi
      git -C "\$control_plane_root" remote set-url origin "\$control_plane_repo_path"
      git -C "\$control_plane_root" fetch origin --prune --tags
      git -C "\$control_plane_root" checkout --force "\$newrev"
    fi

    "\$control_plane_root/deploy/bin/deploy-app.sh" \\
      --config "\$config_path" \\
      --app "\$app_id" \\
      --revision "\$newrev"

    echo "[forgejo-deploy] deploy finished for \$app_id at \$newrev"
  ) >>"\$log_path" 2>&1 &
done
EOF
