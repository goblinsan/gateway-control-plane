import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { sanitizeGatewayConfigForClient, mergeRedactedConfigWithStoredSecrets, REDACTED_BUILD_COMMANDS_VALUE, REDACTED_SECRET_VALUE } from '../src/lib/admin-config-redaction.ts';
import { loadGatewayConfig, type GatewayConfig } from '../src/lib/config.ts';

const EXAMPLE_CONFIG_PATH = new URL('../configs/gateway.config.example.json', import.meta.url);

async function exampleConfig(): Promise<GatewayConfig> {
  return loadGatewayConfig(fileURLToPath(EXAMPLE_CONFIG_PATH));
}

function upsertEnvSecret(config: GatewayConfig, scope: 'gatewayApi' | 'gatewayChatPlatform', key: string, value: string): void {
  const environment = config.serviceProfiles[scope].environment;
  const existing = environment.find((entry) => entry.key === key);
  if (existing) {
    existing.value = value;
    existing.secret = true;
    return;
  }
  environment.push({ key, value, secret: true });
}

test('sanitizeGatewayConfigForClient redacts secret-bearing fields by default', async () => {
  const config = await exampleConfig();
  config.apps[0].buildCommands = ['echo top-secret'];
  upsertEnvSecret(config, 'gatewayApi', 'GITHUB_TOKEN', 'ghp_secret');
  config.serviceProfiles.gatewayApi.jobRuntime.channels.push({
    id: 'alerts',
    type: 'telegram',
    enabled: true,
    botToken: 'telegram-secret',
    chatId: '123',
  });
  config.serviceProfiles.gatewayApi.kulrsActivity.firebaseApiKey = 'firebase-secret';
  config.serviceProfiles.gatewayApi.kulrsActivity.unsplashAccessKey = 'unsplash-secret';
  config.serviceProfiles.gatewayApi.kulrsActivity.llmApiKey = 'llm-secret';
  config.serviceProfiles.gatewayApi.kulrsActivity.bots.push({
    id: 'bot',
    email: 'bot@example.com',
    password: 'bot-secret',
  });
  upsertEnvSecret(config, 'gatewayChatPlatform', 'MOBILE_SHARED_TOKEN', 'mobile-secret');
  config.monitoring.postgres.password = 'pg-secret';

  const sanitized = sanitizeGatewayConfigForClient(config);

  assert.equal(sanitized.apps[0].buildCommands[0], REDACTED_BUILD_COMMANDS_VALUE);
  assert.equal(
    sanitized.serviceProfiles.gatewayApi.environment.find((entry) => entry.key === 'GITHUB_TOKEN')?.value,
    REDACTED_SECRET_VALUE,
  );
  assert.equal(sanitized.serviceProfiles.gatewayApi.jobRuntime.channels.at(-1)?.botToken, REDACTED_SECRET_VALUE);
  assert.equal(sanitized.serviceProfiles.gatewayApi.kulrsActivity.firebaseApiKey, REDACTED_SECRET_VALUE);
  assert.equal(sanitized.serviceProfiles.gatewayApi.kulrsActivity.unsplashAccessKey, REDACTED_SECRET_VALUE);
  assert.equal(sanitized.serviceProfiles.gatewayApi.kulrsActivity.llmApiKey, REDACTED_SECRET_VALUE);
  assert.equal(sanitized.serviceProfiles.gatewayApi.kulrsActivity.bots.at(-1)?.password, REDACTED_SECRET_VALUE);
  assert.equal(
    sanitized.serviceProfiles.gatewayChatPlatform.environment.find((entry) => entry.key === 'MOBILE_SHARED_TOKEN')?.value,
    REDACTED_SECRET_VALUE,
  );
  assert.equal(sanitized.monitoring.postgres.password, REDACTED_SECRET_VALUE);
});

test('mergeRedactedConfigWithStoredSecrets preserves stored secrets and redacted build commands', async () => {
  const existing = await exampleConfig();
  existing.apps[0].buildCommands = ['echo top-secret'];
  upsertEnvSecret(existing, 'gatewayApi', 'GITHUB_TOKEN', 'ghp_secret');

  const incoming = sanitizeGatewayConfigForClient(existing);
  incoming.gateway.serverNames = ['example.test'];

  const merged = mergeRedactedConfigWithStoredSecrets(incoming, existing);

  assert.deepEqual(merged.gateway.serverNames, ['example.test']);
  assert.deepEqual(merged.apps[0].buildCommands, ['echo top-secret']);
  assert.equal(
    merged.serviceProfiles.gatewayApi.environment.find((entry) => entry.key === 'GITHUB_TOKEN')?.value,
    'ghp_secret',
  );
});
