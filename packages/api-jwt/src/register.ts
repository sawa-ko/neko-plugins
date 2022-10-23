import { Plugin, container, SapphireClient, postInitialization, preLogin } from '@sapphire/framework';
import { join } from 'path';

import { Client } from './lib/client';
import './index';

export class APIJWTPlugin extends Plugin {
	public static [postInitialization](this: SapphireClient): void {
		if (!this.server) return;
		if (!this.options.api?.auth?.jwt?.secret) return;

		this.server.middlewares.registerPath(join(__dirname, 'lib', 'middlewares'));
		this.server.routes.registerPath(join(__dirname, 'lib', 'routes'));
	}

	public static [preLogin](this: SapphireClient): void {
		if (!this.options.api?.auth?.jwt?.secret) return;
		container.jwt = new Client(this.options.api.auth.jwt);
	}
}

SapphireClient.plugins.registerPostInitializationHook(APIJWTPlugin[postInitialization], 'API_JWT-PostInitialization');
SapphireClient.plugins.registerPreGenericsInitializationHook(APIJWTPlugin[preLogin], 'API_JWT-preLogin');
