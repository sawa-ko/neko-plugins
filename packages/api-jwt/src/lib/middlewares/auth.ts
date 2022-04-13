import { Middleware, ApiRequest } from '@sapphire/plugin-api';

/**
 * This is a rewrite of the @sapphire/plugin-api plugin authentication middleware.
 * @since 1.0.0
 */
export class PluginMiddleware extends Middleware {
	public constructor(context: Middleware.Context) {
		super(context, { position: 40 });

		const { server } = this.container;
		this.enabled = server.auth !== null;
	}

	public async run(request: ApiRequest) {
		// If there are no cookies, set auth as null:
		const { authorization } = request.headers;
		if (!authorization) {
			request.auth = null;
			return;
		}

		if (!authorization.startsWith('Bearer ')) {
			request.auth = null;
			return;
		}

		// Decrypt the token
		request.auth = await this.container.jwt.decrypt(authorization.slice('Bearer '.length));
	}
}
