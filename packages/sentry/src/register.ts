import { container, Plugin, postInitialization, postLogin, SapphireClient } from '@sapphire/framework';
import { join } from 'path';
import { initializeSentry } from './lib';

export class SentryPlugin extends Plugin {
	public static [postInitialization](this: SapphireClient): void {
		if (!this.options.sentry) return;
		const { loadSentryErrorListeners = true } = this.options.sentry;
		if (!loadSentryErrorListeners) return;
		this.stores.get('listeners').registerPath(join(__dirname, 'listeners'));
	}

	public static [postLogin](this: SapphireClient): void {
		if (this.options.sentry?.options?.enabled === false) return;

		container.logger.info('[Sentry-Plugin]: Enabled. Initialization of Sentry...');
		return initializeSentry(this.options.sentry);
	}
}

SapphireClient.plugins.registerPostInitializationHook(SentryPlugin[postInitialization], 'Sentry-PostInitialization');
SapphireClient.plugins.registerPostLoginHook(SentryPlugin[postLogin], 'Sentry-PostLogin');
