import { container, type Listener } from '@sapphire/framework';
import { init, consoleIntegration, setContext, functionToStringIntegration, linkedErrorsIntegration, modulesIntegration, onUncaughtExceptionIntegration, onUnhandledRejectionIntegration, rewriteFramesIntegration } from '@sentry/node';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { SentryOptions } from './types';

let initialized = false;

export function isSentryInitialized() {
	return initialized;
}

export function sharedListenerOptions(options: Listener.Options) {
	return { enabled: isSentryInitialized(), ...options };
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
				consoleIntegration(),
				functionToStringIntegration(),
				linkedErrorsIntegration(),
				modulesIntegration(),
				onUncaughtExceptionIntegration(),
				onUnhandledRejectionIntegration(),
				rewriteFramesIntegration({ root }),
				...(typeof extractedIntegrations === 'function' ? extractedIntegrations(integrations) : extractedIntegrations)
			]
		});
		container.logger.info('[Sentry-Plugin]: Enabled. Initialization of Sentry...');
	} catch (error) {
		throw new Error(`[Sentry-Plugin]: Failed to initialize Sentry: ${error}`);
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
