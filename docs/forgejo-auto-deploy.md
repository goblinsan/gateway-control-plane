# Forgejo Auto-Deploy

This repo still includes the legacy GitHub Actions workflow used before the
local Forgejo migration. For gateway-local Forgejo repos, the preferred deploy
path is now:

1. push to `main` in Forgejo
2. Forgejo runs a repo `post-receive` hook inside the Forgejo container
3. the hook writes a deploy request JSON file into the shared Forgejo data bind mount
4. a host-side systemd watcher processes that queue as `jimmothy`
5. the watcher calls `/opt/gateway-control-plane/deploy/bin/deploy-app.sh`

That extra queue hop matters on this host because Forgejo hooks do not run on
the gateway host namespace. They run inside the `homeops-git-forge-forgejo-1`
container, which cannot safely call the host deploy wrapper directly.

## Required repoUrl change

Before turning on Forgejo auto-deploy, update the live app entry in
`/opt/gateway-control-plane/configs/gateway.config.json` so `apps[].repoUrl`
points at a local bare repository path or `file://` URL on the gateway host.

That avoids needing SSH credentials for gateway-side `git clone` and
`git fetch` during deployment.

Example shape:

```json
{
  "id": "gateway-control-plane",
  "repoUrl": "/srv/data/forgejo/git/repositories/<owner>/gateway-control-plane.git"
}
```

Use the real local bare-repo path for your Forgejo installation.

## Render the hook

Use the helper in `deploy/bin/` to render a repo-local `post-receive` hook.

For `gateway-control-plane`:

```bash
deploy/bin/render-forgejo-post-receive-hook.sh \
  --app gateway-control-plane \
  > /tmp/gateway-control-plane-post-receive.sh
```

Install the rendered script into the Forgejo bare repo:

```bash
install -m 0755 /tmp/gateway-control-plane-post-receive.sh \
  /srv/data/forgejo/git/repositories/<owner>/gateway-control-plane.git/hooks/post-receive.d/gateway-control-plane-autodeploy
```

The default queue target is:

```text
/data/forgejo/deploy-queue/managed-apps
```

Inside the gateway host, that same directory appears as:

```text
/srv/data/forgejo/deploy-queue/managed-apps
```

## Install the host-side queue processor

Use the host-side processor script from this repo:

```bash
deploy/bin/process-forgejo-deploy-queue.sh \
  --queue-dir /srv/data/forgejo/deploy-queue/managed-apps \
  --control-plane-root /opt/gateway-control-plane \
  --config /opt/gateway-control-plane/configs/gateway.config.json
```

Recommended systemd units:

`/etc/systemd/system/forgejo-managed-app-deploy-queue.service`

```ini
[Unit]
Description=Process queued Forgejo managed-app deploy requests

[Service]
Type=oneshot
User=jimmothy
WorkingDirectory=/opt/gateway-control-plane
ExecStart=/opt/gateway-control-plane/deploy/bin/process-forgejo-deploy-queue.sh --queue-dir /srv/data/forgejo/deploy-queue/managed-apps --control-plane-root /opt/gateway-control-plane --config /opt/gateway-control-plane/configs/gateway.config.json
```

`/etc/systemd/system/forgejo-managed-app-deploy-queue.path`

```ini
[Unit]
Description=Watch Forgejo managed-app deploy queue

[Path]
PathExistsGlob=/srv/data/forgejo/deploy-queue/managed-apps/*.json
Unit=forgejo-managed-app-deploy-queue.service

[Install]
WantedBy=multi-user.target
```

Then enable it:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now forgejo-managed-app-deploy-queue.path
```

## Hook behavior

The rendered hook:

- ignores non-`main` refs by default
- ignores branch deletes
- writes one JSON request per push target revision
- logs to `/data/forgejo/deploy-queue/logs/<app>-forgejo-autodeploy.log`

The host-side processor:

- serializes queue processing with `flock`
- archives successful requests under `processed/`
- moves failed requests under `failed/`
- logs deploy output and status to `forgejo-deploy-queue.log`

## When to keep GitHub Actions

Keep the legacy GitHub workflow only when the repo is still GitHub-hosted or
when the runner model is still the source of truth for that repo.

For gateway-local Forgejo repos, the queue-backed hook path is preferred because
it deploys from the local source of truth and does not depend on external CI
control.
