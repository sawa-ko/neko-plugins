import type { Client } from './lib/client';
import type { ClientOptions } from './lib/types';

export { Client as JWTClient } from './lib/client';
export { PluginRoute as JWTAccessRoute } from './lib/routes/authorize/access';
export { PluginRoute as JWTRefreshRoute } from './lib/routes/authorize/refresh';
export { PluginRoute as JWTRevokeRoute } from './lib/routes/authorize/revoke';
export { PluginMiddleware as JWTMiddleware } from './lib/middlewares/auth';
export * from './lib/types';

declare module '@sapphire/pieces' {
	interface Container {
		jwt: Client;
	}
}

declare module '@sapphire/plugin-api' {
	interface ServerOptionsAuth {
		/**
		 * Options for the authentication system based on JWT.
		 * @since 3.0.0
		 */
		jwt?: ClientOptions;
	}
}
