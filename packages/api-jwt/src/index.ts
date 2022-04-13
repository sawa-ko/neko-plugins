import type { JWT_CONFIG } from 'jwt-service';
import type { ClientAuthJWT, TokenPayload } from './lib/client';

export { PluginMiddleware as AuthMiddleware } from './lib/middlewares/auth';
export { ClientAuthJWT as AuthClient } from './lib/client';
export { PluginRoute as AuthRoute } from './lib/routes/callback';

declare module '@sapphire/plugin-api' {
	interface ServerOptionsAuth {
		/**
		 * Strategy used for the API authentication system.
		 *
		 * jwt = override oauth system to JWT.
		 *
		 * cookie = default oauth system.
		 * @since 1.0.0
		 */
		strategy: 'jwt' | 'cookie';

		/**
		 * Options for the authentication system based on JWT.
		 * @since 1.0.0
		 */
		jwt?: Omit<JWT_CONFIG<'PLUGIN_API_JWT_SECRET'>, 'secretEnvName'>;
	}

	interface AuthData {
		token_metadata: Omit<TokenPayload, 'payload'>;
	}
}

declare module '@sapphire/pieces' {
	interface Container {
		jwt: ClientAuthJWT;
	}
}
