import test from 'node:test';
import assert from 'node:assert/strict';
import type { GatewayConfig, RemoteWorkloadConfig, WorkerNodeConfig } from '../src/lib/config.ts';
import {
  ServiceReconciler,
  reconcileWorkload,
  type SshCaptureResult
} from '../src/lib/reconciler.ts';

function makeNode(overrides: Partial<WorkerNodeConfig> = {}): WorkerNodeConfig {
  return {
    id: 'tags-node',
    enabled: true,
    description: 'test node',
    host: '10.0.0.1',
    sshUser: 'deploy',
    sshPort: 22,
    buildRoot: '/data/docker/builds',
    stackRoot: '/data/docker/stacks',
    volumeRoot: '/data/docker/volumes',
    workerPollIntervalSeconds: 15,
    nodeCommand: 'node',
    dockerCommand: 'docker',
    dockerComposeCommand: 'docker compose',
    ...overrides
  };
}

function makeWorkload(overrides: Partial<RemoteWorkloadConfig> = {}): RemoteWorkloadConfig {
  return {
    id: 'llm-service',
    enabled: true,
    nodeId: 'tags-node',
    description: 'LLM',
    kind: 'container-service',
    service: {
      networkMode: 'host',
      restartPolicy: 'unless-stopped',
      autoStart: true,
      runtimeClass: 'nvidia',
      environment: [],
      volumeMounts: [],
      jsonFiles: [],
      ports: [],
      build: {
        strategy: 'repo-dockerfile',
        repoUrl: 'https://github.com/example/llm-service.git',
        defaultRevision: 'main',
        contextPath: '.'
      }
    },
    ...overrides
  };
}

function makeConfig(nodes: WorkerNodeConfig[], workloads: RemoteWorkloadConfig[]): GatewayConfig {
  return {
    gateway: {} as never,
    apps: [],
    scheduledJobs: [],
    workerNodes: nodes,
    remoteWorkloads: workloads,
    features: [],
    serviceProfiles: {} as never,
    personalAssistant: {} as never
  };
}

function sshOk(stdout = ''): SshCaptureResult {
  return { code: 0, stdout, stderr: '' };
}

test('reconcileWorkload detects no drift when local matches remote', async () => {
  const sha = 'a'.repeat(40);
  const calls: string[] = [];
  const sshExec = async (_node: WorkerNodeConfig, command: string) => {
    calls.push(command);
    if (command.startsWith('git ls-remote')) return sshOk(`${sha}\trefs/heads/main\n`);
    return sshOk(sha);
  };
  const deploys: Array<{ id: string; revision?: string }> = [];
  const config = makeConfig([makeNode()], [makeWorkload()]);

  const result = await reconcileWorkload(config, config.remoteWorkloads[0], {
    sshExec,
    deployFn: (id, revision) => {
      deploys.push({ id, revision });
      return { jobId: 'never' };
    },
    autoDeploy: true,
    minRedeployIntervalSeconds: 300,
    previous: null
  });

  assert.equal(result.status.drift, false);
  assert.equal(result.status.remoteRevision, sha);
  assert.equal(result.status.localRevision, sha);
  assert.equal(result.triggeredDeploy, false);
  assert.equal(deploys.length, 0);
});

test('reconcileWorkload triggers redeploy on drift', async () => {
  const remote = 'b'.repeat(40);
  const local = 'c'.repeat(40);
  const sshExec = async (_node: WorkerNodeConfig, command: string) => {
    if (command.startsWith('git ls-remote')) return sshOk(`${remote}\trefs/heads/main\n`);
    return sshOk(local);
  };
  const deploys: Array<{ id: string; revision?: string }> = [];
  const config = makeConfig([makeNode()], [makeWorkload()]);

  const result = await reconcileWorkload(config, config.remoteWorkloads[0], {
    sshExec,
    deployFn: (id, revision) => {
      deploys.push({ id, revision });
      return { jobId: 'job-1' };
    },
    autoDeploy: true,
    minRedeployIntervalSeconds: 300,
    previous: null
  });

  assert.equal(result.status.drift, true);
  assert.equal(result.triggeredDeploy, true);
  assert.equal(result.status.lastDeployJobId, 'job-1');
  assert.deepEqual(deploys, [{ id: 'llm-service', revision: 'main' }]);
});

test('reconcileWorkload triggers redeploy when source dir missing', async () => {
  const remote = 'd'.repeat(40);
  const sshExec = async (_node: WorkerNodeConfig, command: string) => {
    if (command.startsWith('git ls-remote')) return sshOk(`${remote}\trefs/heads/main\n`);
    return sshOk('__MISSING__');
  };
  const deploys: Array<{ id: string; revision?: string }> = [];
  const config = makeConfig([makeNode()], [makeWorkload()]);

  const result = await reconcileWorkload(config, config.remoteWorkloads[0], {
    sshExec,
    deployFn: (id, revision) => {
      deploys.push({ id, revision });
      return { jobId: 'job-2' };
    },
    autoDeploy: true,
    minRedeployIntervalSeconds: 300,
    previous: null
  });

  assert.equal(result.status.drift, true);
  assert.equal(result.status.localRevision, null);
  assert.equal(result.triggeredDeploy, true);
  assert.equal(result.status.lastDeployReason, 'source missing on node');
  assert.equal(deploys.length, 1);
});

test('reconcileWorkload does not deploy when autoDeploy disabled', async () => {
  const remote = 'b'.repeat(40);
  const local = 'c'.repeat(40);
  const sshExec = async (_node: WorkerNodeConfig, command: string) => {
    if (command.startsWith('git ls-remote')) return sshOk(`${remote}\trefs/heads/main\n`);
    return sshOk(local);
  };
  const deploys: string[] = [];
  const config = makeConfig([makeNode()], [makeWorkload()]);

  const result = await reconcileWorkload(config, config.remoteWorkloads[0], {
    sshExec,
    deployFn: (id) => {
      deploys.push(id);
      return { jobId: 'x' };
    },
    autoDeploy: false,
    minRedeployIntervalSeconds: 300,
    previous: null
  });

  assert.equal(result.status.drift, true);
  assert.equal(result.triggeredDeploy, false);
  assert.equal(deploys.length, 0);
});

test('reconcileWorkload throttles repeated redeploys', async () => {
  const remote = 'b'.repeat(40);
  const local = 'c'.repeat(40);
  const sshExec = async (_node: WorkerNodeConfig, command: string) => {
    if (command.startsWith('git ls-remote')) return sshOk(`${remote}\trefs/heads/main\n`);
    return sshOk(local);
  };
  const deploys: string[] = [];
  const config = makeConfig([makeNode()], [makeWorkload()]);

  const recentDeployIso = new Date(Date.now() - 60_000).toISOString();
  const result = await reconcileWorkload(config, config.remoteWorkloads[0], {
    sshExec,
    deployFn: (id) => {
      deploys.push(id);
      return { jobId: 'x' };
    },
    autoDeploy: true,
    minRedeployIntervalSeconds: 300,
    previous: {
      workloadId: 'llm-service',
      nodeId: 'tags-node',
      enabled: true,
      hasBuildSpec: true,
      lastCheckedAt: recentDeployIso,
      remoteRevision: remote,
      localRevision: local,
      drift: true,
      lastError: null,
      lastDeployTriggeredAt: recentDeployIso,
      lastDeployJobId: 'old',
      lastDeployReason: 'prior',
      skippedReason: null
    }
  });

  assert.equal(result.status.drift, true);
  assert.equal(result.triggeredDeploy, false);
  assert.equal(deploys.length, 0);
  assert.equal(result.status.lastDeployJobId, 'old');
});

test('reconcileWorkload captures ssh failure as lastError', async () => {
  const sshExec = async () => ({ code: 128, stdout: '', stderr: 'fatal: repository not found' });
  const config = makeConfig([makeNode()], [makeWorkload()]);

  const result = await reconcileWorkload(config, config.remoteWorkloads[0], {
    sshExec,
    deployFn: () => ({ jobId: 'x' }),
    autoDeploy: true,
    minRedeployIntervalSeconds: 300,
    previous: null
  });

  assert.equal(result.triggeredDeploy, false);
  assert.match(result.status.lastError || '', /git ls-remote failed/);
});

test('reconcileWorkload skips workloads without build spec', async () => {
  const config = makeConfig([makeNode()], [makeWorkload({
    service: {
      networkMode: 'host',
      restartPolicy: 'unless-stopped',
      autoStart: true,
      runtimeClass: 'default',
      environment: [],
      volumeMounts: [],
      jsonFiles: [],
      ports: [],
      image: 'nginx'
    }
  })]);

  const result = await reconcileWorkload(config, config.remoteWorkloads[0], {
    sshExec: async () => sshOk(''),
    deployFn: () => ({ jobId: 'x' }),
    autoDeploy: true,
    minRedeployIntervalSeconds: 300,
    previous: null
  });

  assert.equal(result.status.skippedReason, 'no build spec');
  assert.equal(result.triggeredDeploy, false);
});

test('ServiceReconciler runOnce updates statuses for container-service workloads only', async () => {
  const remote = 'a'.repeat(40);
  const config = makeConfig(
    [makeNode()],
    [
      makeWorkload({ id: 'llm-service' }),
      makeWorkload({ id: 'bedrock-1', kind: 'minecraft-bedrock-server', service: undefined })
    ]
  );

  const reconciler = new ServiceReconciler({
    getConfig: () => config,
    sshExec: async (_node, command) => {
      if (command.startsWith('git ls-remote')) return sshOk(`${remote}\trefs/heads/main\n`);
      return sshOk(remote);
    },
    deployFn: () => ({ jobId: 'never' }),
    autoDeploy: true,
    intervalSeconds: 60,
    minRedeployIntervalSeconds: 60
  });

  await reconciler.runOnce();
  const status = reconciler.getStatus();
  assert.equal(status.workloads.length, 1);
  assert.equal(status.workloads[0].workloadId, 'llm-service');
  assert.equal(status.workloads[0].drift, false);
  assert.ok(status.lastRunAt);
});
