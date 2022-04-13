import type { JWT_CONFIG } from 'jwt-service';
import type { ClientAuthJWT } from './lib/client';

export { PluginMiddleware as AuthMiddleware } from './lib/middlewares/auth';
export { ClientAuthJWT as AuthClient } from './lib/client';
export { PluginRoute as AuthRoute } from './lib/routes/callback';

declare module '@sapphire/plugin-api' {
	interface ServerOptionsAuth {
		/**
		 * Strategy used for the API authentication system.
		 * @since 1.0.0
		 */
		strategy: 'jwt' | 'cookie';

		/**
		 * Options for the authentication system based on JWT.
		 * @since 1.0.0
		 */
		jwt?: Omit<JWT_CONFIG<'PLUGIN_API_JWT_SECRET'>, 'secretEnvName'>;
	}
}

declare module '@sapphire/pieces' {
	interface Container {
		jwt: ClientAuthJWT;
	}
}
