import { Plugin, container, preGenericsInitialization, SapphireClient, postInitialization } from '@sapphire/framework';
import { join } from 'path';

import { Client } from './lib/client';
import './index';

export class APIJWTPlugin extends Plugin {
	public static [preGenericsInitialization](this: SapphireClient): void {
		if (!this.options.api?.auth?.jwt?.secret) return;
		container.jwt = new Client(this.options.api.auth.jwt);
	}

	public static [postInitialization](this: SapphireClient): void {
		if (!this.server) return;
		if (!this.options.api?.auth?.jwt?.secret) return;

		this.server.middlewares.registerPath(join(__dirname, 'lib', 'middlewares'));
		this.server.routes.registerPath(join(__dirname, 'lib', 'routes'));
	}
}

SapphireClient.plugins.registerPreGenericsInitializationHook(APIJWTPlugin[preGenericsInitialization], 'API_JWT-PreGenericsInitialization');
SapphireClient.plugins.registerPostInitializationHook(APIJWTPlugin[postInitialization], 'API_JWT-PostInitialization');
