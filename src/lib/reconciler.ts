import type {
  GatewayConfig,
  RemoteWorkloadConfig,
  ScheduledContainerJobBuildConfig,
  WorkerNodeConfig
} from './config.ts';
import {
  getRemoteWorkloadSourceDir
} from './remote-workloads.ts';

export interface SshCaptureResult {
  code: number;
  stdout: string;
  stderr: string;
}

export type SshCaptureFn = (node: WorkerNodeConfig, command: string, timeoutMs?: number) => Promise<SshCaptureResult>;

export interface ReconcilerDeployHandle {
  jobId: string;
}

export type ReconcilerDeployFn = (workloadId: string, revision?: string) => ReconcilerDeployHandle;

export interface ReconcilerWorkloadStatus {
  workloadId: string;
  nodeId: string;
  enabled: boolean;
  hasBuildSpec: boolean;
  lastCheckedAt: string | null;
  remoteRevision: string | null;
  localRevision: string | null;
  drift: boolean;
  lastError: string | null;
  lastDeployTriggeredAt: string | null;
  lastDeployJobId: string | null;
  lastDeployReason: string | null;
  skippedReason: string | null;
}

export interface ReconcilerStatus {
  enabled: boolean;
  intervalSeconds: number;
  autoDeploy: boolean;
  minRedeployIntervalSeconds: number;
  startedAt: string | null;
  lastRunAt: string | null;
  lastRunDurationMs: number | null;
  lastRunError: string | null;
  workloads: ReconcilerWorkloadStatus[];
}

export interface ReconcilerOptions {
  getConfig: () => Promise<GatewayConfig> | GatewayConfig;
  sshExec: SshCaptureFn;
  deployFn: ReconcilerDeployFn;
  log?: (msg: string) => void;
  enabled?: boolean;
  intervalSeconds?: number;
  autoDeploy?: boolean;
  minRedeployIntervalSeconds?: number;
}

function getReconcilerBuildSpec(workload: RemoteWorkloadConfig): ScheduledContainerJobBuildConfig | null {
  if (workload.kind === 'container-service' && workload.service?.build) {
    return workload.service.build;
  }
  return null;
}

function shellQuote(value: string): string {
  return `'${value.replaceAll(`'`, `'"'"'`)}'`;
}

function parseLsRemoteSha(stdout: string): string | null {
  const firstLine = stdout.trim().split(/\r?\n/)[0]?.trim();
  if (!firstLine) return null;
  const sha = firstLine.split(/\s+/)[0];
  return /^[0-9a-f]{40}$/i.test(sha) ? sha : null;
}

function isFullSha(value: string): boolean {
  return /^[0-9a-f]{40}$/i.test(value);
}

export interface ReconcileWorkloadResult {
  workloadId: string;
  status: ReconcilerWorkloadStatus;
  triggeredDeploy: boolean;
}

export async function reconcileWorkload(
  config: GatewayConfig,
  workload: RemoteWorkloadConfig,
  options: {
    sshExec: SshCaptureFn;
    deployFn: ReconcilerDeployFn;
    autoDeploy: boolean;
    minRedeployIntervalSeconds: number;
    previous: ReconcilerWorkloadStatus | null;
    log?: (msg: string) => void;
    now?: () => Date;
  }
): Promise<ReconcileWorkloadResult> {
  const now = options.now ?? (() => new Date());
  const nowIso = now().toISOString();
  const node = config.workerNodes.find((candidate) => candidate.id === workload.nodeId);
  const previous = options.previous;

  const base: ReconcilerWorkloadStatus = {
    workloadId: workload.id,
    nodeId: workload.nodeId,
    enabled: workload.enabled,
    hasBuildSpec: false,
    lastCheckedAt: previous?.lastCheckedAt ?? null,
    remoteRevision: previous?.remoteRevision ?? null,
    localRevision: previous?.localRevision ?? null,
    drift: previous?.drift ?? false,
    lastError: previous?.lastError ?? null,
    lastDeployTriggeredAt: previous?.lastDeployTriggeredAt ?? null,
    lastDeployJobId: previous?.lastDeployJobId ?? null,
    lastDeployReason: previous?.lastDeployReason ?? null,
    skippedReason: null
  };

  if (!node) {
    return {
      workloadId: workload.id,
      status: { ...base, skippedReason: 'unknown nodeId' },
      triggeredDeploy: false
    };
  }
  if (!workload.enabled) {
    return {
      workloadId: workload.id,
      status: { ...base, skippedReason: 'workload disabled' },
      triggeredDeploy: false
    };
  }
  if (!node.enabled) {
    return {
      workloadId: workload.id,
      status: { ...base, skippedReason: 'node disabled' },
      triggeredDeploy: false
    };
  }
  const build = getReconcilerBuildSpec(workload);
  if (!build) {
    return {
      workloadId: workload.id,
      status: { ...base, skippedReason: 'no build spec' },
      triggeredDeploy: false
    };
  }

  base.hasBuildSpec = true;
  const sourceDir = getRemoteWorkloadSourceDir(node, workload);
  const revision = build.defaultRevision;
  const repoUrl = build.repoUrl;

  // Resolve remote revision: prefer ls-remote against the revision spec; if it's a pinned full SHA, use it directly.
  let remoteSha: string | null = null;
  if (isFullSha(revision)) {
    remoteSha = revision.toLowerCase();
  } else {
    const lsRemoteCmd = `git ls-remote ${shellQuote(repoUrl)} ${shellQuote(revision)} ${shellQuote('refs/heads/' + revision)} ${shellQuote('refs/tags/' + revision)}`;
    const res = await options.sshExec(node, lsRemoteCmd, 30_000);
    if (res.code !== 0) {
      return {
        workloadId: workload.id,
        status: {
          ...base,
          lastCheckedAt: nowIso,
          lastError: `git ls-remote failed (${res.code}): ${(res.stderr || res.stdout).trim().slice(0, 500)}`
        },
        triggeredDeploy: false
      };
    }
    remoteSha = parseLsRemoteSha(res.stdout);
    if (!remoteSha) {
      return {
        workloadId: workload.id,
        status: {
          ...base,
          lastCheckedAt: nowIso,
          lastError: `git ls-remote returned no SHA for ${revision}`
        },
        triggeredDeploy: false
      };
    }
  }

  // Resolve local revision.
  const localCmd = `if [ -d ${shellQuote(sourceDir + '/.git')} ]; then git -C ${shellQuote(sourceDir)} rev-parse HEAD; else printf '__MISSING__'; fi`;
  const localRes = await options.sshExec(node, localCmd, 20_000);
  if (localRes.code !== 0) {
    return {
      workloadId: workload.id,
      status: {
        ...base,
        lastCheckedAt: nowIso,
        remoteRevision: remoteSha,
        lastError: `local rev-parse failed (${localRes.code}): ${(localRes.stderr || localRes.stdout).trim().slice(0, 500)}`
      },
      triggeredDeploy: false
    };
  }
  const localOutput = localRes.stdout.trim();
  const localMissing = localOutput === '__MISSING__' || localOutput === '';
  const localSha = localMissing ? null : localOutput;

  const drift = localMissing || (localSha?.toLowerCase() !== remoteSha.toLowerCase());

  let triggeredDeploy = false;
  let lastDeployTriggeredAt = previous?.lastDeployTriggeredAt ?? null;
  let lastDeployJobId = previous?.lastDeployJobId ?? null;
  let lastDeployReason = previous?.lastDeployReason ?? null;

  if (drift && options.autoDeploy) {
    // Throttle: don't redeploy more often than minRedeployIntervalSeconds.
    const sinceLast = previous?.lastDeployTriggeredAt
      ? (now().getTime() - new Date(previous.lastDeployTriggeredAt).getTime()) / 1000
      : Number.POSITIVE_INFINITY;
    if (sinceLast >= options.minRedeployIntervalSeconds) {
      const reason = localMissing
        ? 'source missing on node'
        : `local ${localSha?.slice(0, 7)} behind remote ${remoteSha.slice(0, 7)}`;
      try {
        const handle = options.deployFn(workload.id, revision);
        triggeredDeploy = true;
        lastDeployTriggeredAt = nowIso;
        lastDeployJobId = handle.jobId;
        lastDeployReason = reason;
        options.log?.(`reconciler: triggered redeploy of ${workload.id} on ${node.id} (${reason}) jobId=${handle.jobId}`);
      } catch (error) {
        return {
          workloadId: workload.id,
          status: {
            ...base,
            lastCheckedAt: nowIso,
            remoteRevision: remoteSha,
            localRevision: localSha,
            drift: true,
            lastError: `failed to enqueue redeploy: ${error instanceof Error ? error.message : String(error)}`
          },
          triggeredDeploy: false
        };
      }
    }
  }

  return {
    workloadId: workload.id,
    status: {
      ...base,
      lastCheckedAt: nowIso,
      remoteRevision: remoteSha,
      localRevision: localSha,
      drift,
      lastError: null,
      lastDeployTriggeredAt,
      lastDeployJobId,
      lastDeployReason
    },
    triggeredDeploy
  };
}

export class ServiceReconciler {
  private readonly options: ReconcilerOptions;
  private readonly statuses: Map<string, ReconcilerWorkloadStatus> = new Map();
  private timer: NodeJS.Timeout | null = null;
  private running = false;
  private startedAt: string | null = null;
  private lastRunAt: string | null = null;
  private lastRunDurationMs: number | null = null;
  private lastRunError: string | null = null;

  constructor(options: ReconcilerOptions) {
    this.options = options;
  }

  start(): void {
    if (this.timer || !this.isEnabled()) return;
    this.startedAt = new Date().toISOString();
    const intervalMs = this.intervalSeconds() * 1000;
    // Kick off after a short warm-up delay, then run periodically.
    this.timer = setInterval(() => {
      void this.runOnce();
    }, intervalMs);
    if (this.timer.unref) this.timer.unref();
    setTimeout(() => {
      void this.runOnce();
    }, 30_000).unref?.();
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  isEnabled(): boolean {
    return this.options.enabled !== false;
  }

  intervalSeconds(): number {
    return this.options.intervalSeconds && this.options.intervalSeconds > 0 ? this.options.intervalSeconds : 900;
  }

  async runOnce(): Promise<void> {
    if (this.running) return;
    this.running = true;
    const t0 = Date.now();
    try {
      const config = await this.options.getConfig();
      const candidates = config.remoteWorkloads.filter((w) => w.kind === 'container-service');
      const seen = new Set<string>();
      for (const workload of candidates) {
        seen.add(workload.id);
        const previous = this.statuses.get(workload.id) ?? null;
        try {
          const result = await reconcileWorkload(config, workload, {
            sshExec: this.options.sshExec,
            deployFn: this.options.deployFn,
            autoDeploy: this.options.autoDeploy !== false,
            minRedeployIntervalSeconds: this.options.minRedeployIntervalSeconds && this.options.minRedeployIntervalSeconds > 0
              ? this.options.minRedeployIntervalSeconds
              : 300,
            previous,
            log: this.options.log
          });
          this.statuses.set(workload.id, result.status);
        } catch (error) {
          const msg = error instanceof Error ? error.message : String(error);
          this.options.log?.(`reconciler: error reconciling ${workload.id}: ${msg}`);
          const prev = previous ?? {
            workloadId: workload.id,
            nodeId: workload.nodeId,
            enabled: workload.enabled,
            hasBuildSpec: false,
            lastCheckedAt: null,
            remoteRevision: null,
            localRevision: null,
            drift: false,
            lastError: null,
            lastDeployTriggeredAt: null,
            lastDeployJobId: null,
            lastDeployReason: null,
            skippedReason: null
          };
          this.statuses.set(workload.id, { ...prev, lastError: msg, lastCheckedAt: new Date().toISOString() });
        }
      }
      // Drop entries for workloads no longer present.
      for (const id of [...this.statuses.keys()]) {
        if (!seen.has(id)) this.statuses.delete(id);
      }
      this.lastRunAt = new Date().toISOString();
      this.lastRunDurationMs = Date.now() - t0;
      this.lastRunError = null;
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.lastRunError = msg;
      this.lastRunAt = new Date().toISOString();
      this.lastRunDurationMs = Date.now() - t0;
      this.options.log?.(`reconciler: run failed: ${msg}`);
    } finally {
      this.running = false;
    }
  }

  getStatus(): ReconcilerStatus {
    return {
      enabled: this.isEnabled(),
      intervalSeconds: this.intervalSeconds(),
      autoDeploy: this.options.autoDeploy !== false,
      minRedeployIntervalSeconds: this.options.minRedeployIntervalSeconds && this.options.minRedeployIntervalSeconds > 0
        ? this.options.minRedeployIntervalSeconds
        : 300,
      startedAt: this.startedAt,
      lastRunAt: this.lastRunAt,
      lastRunDurationMs: this.lastRunDurationMs,
      lastRunError: this.lastRunError,
      workloads: [...this.statuses.values()].sort((a, b) => a.workloadId.localeCompare(b.workloadId))
    };
  }
}
