# CI/CD

There are now two supported deployment trigger models:

- GitHub-hosted repos can continue to use the legacy self-hosted Actions runner
- gateway-local Forgejo repos should prefer a repo `post-receive` hook

Both models converge on the same host deploy wrapper:

```bash
/opt/gateway-control-plane/deploy/bin/deploy-app.sh --config /opt/gateway-control-plane/configs/gateway.config.json --app <app-id> --revision <revision>
```

The important detail is unchanged: deployments must use the live gateway config
on the host, not an ephemeral CI checkout, because the host config contains
gateway-specific routes, ports, and secrets.

## Preferred model for Forgejo

For repos hosted on the local Forgejo instance, the preferred trigger is:

1. push to `main`
2. Forgejo runs a repo `post-receive` hook
3. the hook calls `deploy-app.sh` on the gateway host

This fits the current HomeOps environment better than CI runners because:

- Forgejo already lives on the gateway
- gateway-side deploys already need host-local config
- the gateway host does not yet have general SSH pull credentials for Forgejo

Before enabling this model, update the live app `repoUrl` in
`/opt/gateway-control-plane/configs/gateway.config.json` to a local bare-repo
path or `file://` URL on the gateway host so `deploy-app.sh` can clone/fetch
without SSH credentials.

Use [forgejo-auto-deploy.md](./forgejo-auto-deploy.md) for the concrete hook
render/install flow.

## Legacy GitHub runner model

Keep the GitHub runner model only for repos that are still GitHub-hosted.

Install a GitHub Actions self-hosted runner on the gateway and label it:

- `self-hosted`
- `gateway`

Each runner needs Docker, nginx, Node 24, and access to:

- `/opt/gateway-control-plane`
- `/opt/gateway-api`
- `/opt/gateway-chat-platform`
- `/opt/gateway-tools-platform`
- `/srv/apps/*`

This repo still ships `.github/workflows/deploy-on-merge.yml` for that legacy
path. It remains useful during migration or for repos that have not moved to
Forgejo yet.

## Repo responsibilities

Each managed repo owns deploying its own app id:

- `gateway-control-plane` -> `gateway-control-plane`
- `gateway-api` -> `gateway-api`
- `gateway-chat-platform` -> `gateway-chat-platform`
- `gateway-tools-platform` -> `gateway-tools-platform`

The trigger mechanism can vary, but the deploy wrapper stays the same.

## Rollback

Any rollback can be triggered from CI or directly on the gateway host:

```bash
/opt/gateway-control-plane/deploy/bin/rollback-app.sh --config /opt/gateway-control-plane/configs/gateway.config.json --app gateway-chat-platform
```
