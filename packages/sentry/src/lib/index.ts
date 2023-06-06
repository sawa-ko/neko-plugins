import type { Listener } from '@sapphire/framework';
import { RewriteFrames } from '@sentry/integrations';
import { init, Integrations, setContext } from '@sentry/node';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { SentryOptions } from './types';

let initialized = false;

export function isSentryInitialized() {
	return initialized;
}

export function sharedListenerOptions(options: Listener.Options) {
	return { ...options, enabled: isSentryInitialized() };
}

export function initializeSentry(options: SentryOptions = {}) {
	if (!process.env.SENTRY_DSN) return;

	const extractedIntegrations = options.options?.integrations ?? [];
	const root = options.root ? (typeof options.root === 'string' ? options.root : fileURLToPath(options.root)) : process.cwd();
	try {
		init({
			dsn: process.env.SENTRY_DSN,
			...options,
			integrations: (integrations) => [
				new Integrations.Console(),
				new Integrations.FunctionToString(),
				new Integrations.LinkedErrors(),
				new Integrations.Modules(),
				new Integrations.Modules(),
				new Integrations.OnUncaughtException(),
				new Integrations.OnUnhandledRejection(),
				new RewriteFrames({ root }),
				...(typeof extractedIntegrations === 'function' ? extractedIntegrations(integrations) : extractedIntegrations)
			]
		});
	} catch (error) {
		return;
	}

	const context = getAppContext(options);
	if (context) setContext('app', context);

	initialized = true;
}

function getAppContext(options: SentryOptions) {
	const { appName, appVersion } = options;

	if (appName && appVersion) return { appName, appVersion };

	try {
		const path = resolve('package.json');
		const { name, version } = JSON.parse(readFileSync(path, 'utf8')) as { name: string; version: string };
		return { appName: name, appVersion: version };
	} catch {
		return null;
	}
}
