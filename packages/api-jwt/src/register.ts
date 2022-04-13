import { Plugin, container, preGenericsInitialization, SapphireClient, postInitialization } from '@sapphire/framework';
import { join } from 'path';

import { ClientAuthJWT } from './lib/client';
import './index';

/**
 * Plugin that overwrites the authentication strategy of the @sapphire/plugin-api plugin to JWT.
 * @since 1.0.0
 */
export class APIJWTPlugin extends Plugin {
	public static [preGenericsInitialization](this: SapphireClient): void {
		if (this.options.api?.auth?.strategy !== 'jwt') return;
		container.jwt = new ClientAuthJWT(this.options.api.auth);
	}

	public static [postInitialization](this: SapphireClient): void {
		if (this.options.api?.auth?.strategy !== 'jwt') return;

		this.server.routes.registerPath(join(__dirname, 'lib', 'routes'));
		this.server.middlewares.registerPath(join(__dirname, 'lib', 'middlewares'));
	}
}

SapphireClient.plugins.registerPreGenericsInitializationHook(APIJWTPlugin[preGenericsInitialization], 'API_JWT-PreGenericsInitialization');
SapphireClient.plugins.registerPostInitializationHook(APIJWTPlugin[postInitialization], 'API_JWT-PostInitialization');
