import './index';

import { Plugin, postInitialization, postLogin, SapphireClient } from '@sapphire/framework';
import { initializeSentry } from './lib';
import { loadListeners } from './listeners/_load';
import { loadPluginApiListeners } from './optional-listeners/plugin-api/_load';
import { loadPluginScheduledTasksListeners } from './optional-listeners/plugin-scheduled-tasks/_load';
import { loadPluginSubcommandsListeners } from './optional-listeners/plugin-subcommands/_load';

export class SentryPlugin extends Plugin {
	public static [postInitialization](this: SapphireClient): void {
		if (!this.options.sentry?.loadSentryErrorListeners) return;

		loadListeners();

		loadPluginApiListeners();
		loadPluginScheduledTasksListeners();
		loadPluginSubcommandsListeners();
	}

	public static [postLogin](this: SapphireClient): void {
		if (!this.options.sentry?.options?.enabled) return;
		return initializeSentry(this.options.sentry);
	}
}

SapphireClient.plugins.registerPostInitializationHook(SentryPlugin[postInitialization], 'Sentry-PostInitialization');
SapphireClient.plugins.registerPostLoginHook(SentryPlugin[postLogin], 'Sentry-PostLogin');
