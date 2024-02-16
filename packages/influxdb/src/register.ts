import './index';

import { container, Plugin, postInitialization, postLogin, preGenericsInitialization, SapphireClient } from '@sapphire/framework';
import { Client } from './lib/structures';
import { AnalyticsSync } from './lib/types';
import { loadListeners } from './listeners/_load';

/**
 * Plugin that allows to manage nodejs application environment variables.
 * @since 1.0.0
 */
export class EnvPlugin extends Plugin {
	public static [preGenericsInitialization](this: SapphireClient): void {
		this.analytics = this.options.analytics ? new Client(this.options.analytics) : null;
	}

	public static [postInitialization](this: SapphireClient): void {
		if (this.options.analytics?.loadDefaultListeners !== true) return;
		loadListeners();
	}

	public static [postLogin](this: SapphireClient): void {
		if (this.options.analytics?.loadDefaultListeners !== true) return;
		container.logger.info('[InfluxDB-Plugin]: Enabled. Synchronizing stats with InfluxDB');
		container.logger.info('[InfluxDB-Plugin]: Auto-posting of statistics has been enabled');

		const rawGuilds = container.client.guilds.cache.size;
		const rawUsers = container.client.guilds.cache.reduce((acc, val) => acc + (val.memberCount ?? 0), 0);
		setInterval(() => {
			container.client.emit(AnalyticsSync, rawGuilds, rawUsers);
		}, 60_000);
	}
}

SapphireClient.plugins.registerPreGenericsInitializationHook(EnvPlugin[preGenericsInitialization], 'InfluxDB-PreGenericsInitialization');
SapphireClient.plugins.registerPostInitializationHook(EnvPlugin[postInitialization], 'InfluxDB-postInitialization');
SapphireClient.plugins.registerPostLoginHook(EnvPlugin[postLogin], 'InfluxDB-postLogin');
