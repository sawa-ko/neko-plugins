import './index';

import { Plugin, SapphireClient, container, postInitialization, preLogin } from '@sapphire/framework';
import { Client } from './lib/client';
import { loadMiddlewares } from './middlewares/_load';
import { loadRoutes } from './routes/_load';

export class APIJWTPlugin extends Plugin {
	public static [postInitialization](this: SapphireClient): void {
		if (!this.server) return;
		if (!this.options.api?.auth?.jwt?.secret) return;

		loadMiddlewares();
		loadRoutes();
	}

	public static [preLogin](this: SapphireClient): void {
		if (!this.options.api?.auth?.jwt?.secret) return;
		container.jwt = new Client(this.options.api.auth.jwt);
	}
}

SapphireClient.plugins.registerPostInitializationHook(APIJWTPlugin[postInitialization], 'API_JWT-PostInitialization');
SapphireClient.plugins.registerPreGenericsInitializationHook(APIJWTPlugin[preLogin], 'API_JWT-preLogin');
