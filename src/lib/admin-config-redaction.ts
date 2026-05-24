import type { GatewayConfig, EnvironmentVariableConfig } from './config.ts';

export const REDACTED_SECRET_VALUE = '__REDACTED_SECRET__';
export const REDACTED_BUILD_COMMANDS_VALUE = '__REDACTED_BUILD_COMMANDS__';

function redactEnvironment(environment: EnvironmentVariableConfig[]): void {
  environment.forEach((entry) => {
    if (entry.secret && entry.value) {
      entry.value = REDACTED_SECRET_VALUE;
    }
  });
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function sanitizeGatewayConfigForClient(
  config: GatewayConfig,
  options: { includeSecrets?: boolean } = {},
): GatewayConfig {
  const sanitized = structuredClone(config);
  if (options.includeSecrets) {
    return sanitized;
  }

  sanitized.apps.forEach((app) => {
    if (app.buildCommands.length > 0) {
      app.buildCommands = [REDACTED_BUILD_COMMANDS_VALUE];
    }
  });

  sanitized.serviceProfiles.gatewayApi.jobRuntime.channels.forEach((channel) => {
    if (channel.botToken) {
      channel.botToken = REDACTED_SECRET_VALUE;
    }
    if (channel.webhookUrl) {
      channel.webhookUrl = REDACTED_SECRET_VALUE;
    }
  });

  redactEnvironment(sanitized.serviceProfiles.gatewayApi.environment);
  redactEnvironment(sanitized.serviceProfiles.gatewayChatPlatform.environment);

  sanitized.remoteWorkloads.forEach((workload) => {
    if (workload.job) {
      redactEnvironment(workload.job.environment);
    }
    if (workload.service) {
      redactEnvironment(workload.service.environment);
    }
  });

  sanitized.serviceProfiles.gatewayApi.kulrsActivity.llmApiKey = sanitized.serviceProfiles.gatewayApi.kulrsActivity.llmApiKey
    ? REDACTED_SECRET_VALUE
    : '';
  sanitized.serviceProfiles.gatewayApi.kulrsActivity.firebaseApiKey = sanitized.serviceProfiles.gatewayApi.kulrsActivity.firebaseApiKey
    ? REDACTED_SECRET_VALUE
    : '';
  sanitized.serviceProfiles.gatewayApi.kulrsActivity.unsplashAccessKey = sanitized.serviceProfiles.gatewayApi.kulrsActivity.unsplashAccessKey
    ? REDACTED_SECRET_VALUE
    : '';
  sanitized.serviceProfiles.gatewayApi.kulrsActivity.bots.forEach((bot) => {
    if (bot.password) {
      bot.password = REDACTED_SECRET_VALUE;
    }
  });

  if (sanitized.personalAssistant.expertApiKey) {
    sanitized.personalAssistant.expertApiKey = REDACTED_SECRET_VALUE;
  }
  if (sanitized.monitoring.postgres.password) {
    sanitized.monitoring.postgres.password = REDACTED_SECRET_VALUE;
  }

  return sanitized;
}

export function mergeRedactedConfigWithStoredSecrets<T>(incoming: T, existing: T): T {
  if (incoming === REDACTED_SECRET_VALUE) {
    return structuredClone(existing);
  }

  if (Array.isArray(incoming)) {
    if (incoming.length === 1 && incoming[0] === REDACTED_BUILD_COMMANDS_VALUE) {
      return structuredClone(existing);
    }
    const existingArray = Array.isArray(existing) ? existing : [];
    return incoming.map((item, index) => mergeRedactedConfigWithStoredSecrets(item, existingArray[index])) as T;
  }

  if (isPlainObject(incoming)) {
    const result: Record<string, unknown> = {};
    const existingObject = isPlainObject(existing) ? existing : {};
    Object.keys(incoming).forEach((key) => {
      result[key] = mergeRedactedConfigWithStoredSecrets(incoming[key], existingObject[key]);
    });
    return result as T;
  }

  return incoming;
}
