import { Plugin, container, preGenericsInitialization, SapphireClient, postInitialization } from '@sapphire/framework';

import { EnvClient } from './lib/client';
import './index';

/**
 * Plugin that allows to manage nodejs application environment variables.
 * @since 1.0.0
 */
export class EnvPlugin extends Plugin {
	public static [preGenericsInitialization](this: SapphireClient): void {
		if (!this.options.env?.enabled) return;
		container.env = new EnvClient(this.options.env);
	}

	public static [postInitialization](this: SapphireClient): void {
		if (process.env.NODE_ENV) {
			container.logger.debug(`[Env-Plugin]: The environment variables have been obtained in mode ${process.env.NODE_ENV}.`);
		} else {
			container.logger.error(
				`[Env-Plugin]: The environment variables have not been obtained because the environment variable NODE_ENV has not been set.`
			);
		}
	}
}

SapphireClient.plugins.registerPreGenericsInitializationHook(EnvPlugin[preGenericsInitialization], 'Env-PreGenericsInitialization');
SapphireClient.plugins.registerPostInitializationHook(EnvPlugin[postInitialization], 'Env-PostInitialization');

declare module '@sapphire/pieces' {
	interface Container {
		env: EnvClient;
	}
}
