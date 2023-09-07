import { Plugin, postInitialization, postLogin, SapphireClient } from '@sapphire/framework';
import { join } from 'path';

import './index';
import { initializeSentry } from './lib';

export class SentryPlugin extends Plugin {
	public static [postInitialization](this: SapphireClient): void {
		if (this.options.sentry?.loadSentryErrorListeners) {
			this.stores.get('listeners').registerPath(join(__dirname, 'listeners'));
		}
	}

	public static [postLogin](this: SapphireClient): void {
		if (!this.options.sentry?.options?.enabled) return;
		return initializeSentry(this.options.sentry);
	}
}

SapphireClient.plugins.registerPostInitializationHook(SentryPlugin[postInitialization], 'Sentry-PostInitialization');
SapphireClient.plugins.registerPostLoginHook(SentryPlugin[postLogin], 'Sentry-PostLogin');
