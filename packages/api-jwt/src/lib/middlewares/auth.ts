import { Middleware } from '@sapphire/plugin-api';

import type { ApiRequest, SessionUserData } from '../types';

/**
 * This is a rewrite of the @sapphire/plugin-api plugin authentication middleware.
 * @since 4.0.0
 */
export class PluginMiddleware extends Middleware {
	public constructor(context: Middleware.Context) {
		super(context, { position: 80, name: 'JWT/middleware' });

		const { server } = this.container;
		this.enabled = server.auth !== null;
	}

	public run(request: ApiRequest) {
		// If there are no jwt token, set auth as null
		const { authorization } = request.headers;
		if (!authorization) {
			request.session = null;
			return;
		}

		// If jwt token no starts with Bearer set auth as null
		if (!authorization.startsWith('Bearer ')) {
			request.session = null;
			return;
		}

		// if token es invalid set auth as null
		const token = authorization.slice('Bearer '.length);
		const data = this.container.jwt.decrypt<SessionUserData>(token, 'access_token');
		if (!token || !data?.data) {
			request.session = null;
			return;
		}

		// Decrypt the token
		request.session = { data: data.data, access_token: data.access_token, refresh_token: data.refresh_token };
	}
}
