# Forgejo Auto-Deploy

This repo still includes the legacy GitHub Actions workflow used before the
local Forgejo migration. For gateway-local Forgejo repos, the preferred deploy
path is now:

1. push to `main` in Forgejo
2. Forgejo runs a repo `post-receive` Git hook
3. the hook calls `/opt/gateway-control-plane/deploy/bin/deploy-app.sh`
4. `deploy-app.sh` rolls the target app through the normal blue/green flow

This matches the current HomeOps constraints better than GitHub-style runners:

- the Forgejo server is already on the gateway host
- `deploy-app.sh` must run against the live host config
- the gateway host does not yet have general SSH pull credentials for Forgejo

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
  "repoUrl": "file:///srv/data/forgejo/git/repositories/<owner>/gateway-control-plane.git"
}
```

Use the real local bare-repo path for your Forgejo installation.

## Render the hook

Use the helper in `deploy/bin/` to render a repo-local `post-receive` hook.

For `gateway-control-plane` itself:

```bash
deploy/bin/render-forgejo-post-receive-hook.sh \
  --app gateway-control-plane \
  --config /opt/gateway-control-plane/configs/gateway.config.json \
  --control-plane-root /opt/gateway-control-plane \
  --control-plane-repo-path /srv/data/forgejo/git/repositories/<owner>/gateway-control-plane.git \
  > /tmp/gateway-control-plane-post-receive.sh
```

The extra `--control-plane-repo-path` flag is important for this repo. It makes
the hook refresh the host checkout at `/opt/gateway-control-plane` to the pushed
revision before it invokes `deploy-app.sh`, so deploy logic changes ship with
the same push.

For a companion managed app such as `gateway-api`, omit
`--control-plane-repo-path`:

```bash
deploy/bin/render-forgejo-post-receive-hook.sh \
  --app gateway-api \
  --config /opt/gateway-control-plane/configs/gateway.config.json \
  --control-plane-root /opt/gateway-control-plane \
  > /tmp/gateway-api-post-receive.sh
```

## Install the hook in Forgejo

Preferred path:

- repo Settings
- Git Hooks
- `post-receive`

Paste the rendered script there.

You can also install it through the Forgejo/Gitea Git hook API by updating the
repository `post-receive` hook content.

Conceptually:

```bash
curl -X PATCH \
  -H "Authorization: token <forgejo-token>" \
  -H "Content-Type: application/json" \
  <forgejo-base-url>/api/v1/repos/<owner>/<repo>/hooks/git/post-receive
```

with a JSON body containing the rendered script in `content`.

## Hook behavior

The rendered hook:

- ignores non-`main` refs by default
- ignores branch deletes
- serializes deploys with `flock` when available
- logs to `/var/log/gateway-control-plane/<app>-forgejo-deploy.log`
- backgrounds the deploy so the git push is not blocked for the full rollout

## When to keep GitHub Actions

Keep the legacy GitHub workflow only when the repo is still GitHub-hosted or
when the runner model is still the source of truth for that repo.

For gateway-local Forgejo repos, the hook-based path is preferred because it
deploys from the local source of truth and does not depend on external CI
control.
