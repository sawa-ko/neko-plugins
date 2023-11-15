import 'tslib';

import type { Client } from './lib/client';
import type { ClientOptions } from './lib/types';

export { PluginRoute as JWTAccessRoute } from './routes/authorize/access';
export { PluginRoute as JWTRefreshRoute } from './routes/authorize/refresh';
export { PluginRoute as JWTRevokeRoute } from './routes/authorize/revoke';
export { PluginMiddleware as JWTMiddleware } from './middlewares/auth';
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
