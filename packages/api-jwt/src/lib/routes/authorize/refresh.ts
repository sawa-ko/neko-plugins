import { ApiRequest, ApiResponse, methods, Route } from '@sapphire/plugin-api';
import { isNullish } from '@sapphire/utilities';
import type { RESTPostOAuth2AccessTokenResult } from 'discord-api-types/v10';

/**
 * Refresh internal and External (Discord) access token.
 * @since 3.0.0
 */
export class PluginRoute extends Route {
	public constructor(context: Route.Context, options: Route.Options) {
		super(context, { ...options, route: 'authorize/refresh' });

		const { server } = this.container;
		this.enabled = server.auth !== null;
	}

	public async [methods.POST](request: ApiRequest, response: ApiResponse) {
		const { refresh_token } = request.body as { refresh_token: string };
		if (typeof refresh_token !== 'string') {
			return response.badRequest();
		}

		if (isNullish(refresh_token)) return response.badRequest('The refresh_token is required.');

		const tokenData = await this.container.jwt.decrypt<RESTPostOAuth2AccessTokenResult>(refresh_token, 'refresh_token');
		if (isNullish(tokenData)) return response.error('Could not get the user information in the token.');
		if (isNullish(tokenData.refresh_token)) {
			this.container.logger.warn('The access token cannot be refreshed because the hook for get persistent sessions was not assigned.');

			return response.error('Persistent sessions not active.');
		}

		const refreshData = await this.container.jwt.auth(tokenData.refresh_token, 'refresh');
		if (isNullish(refreshData)) return response.error('There was a problem refreshing data in Discord.');

		return response.status(200).json(await this.container.jwt.encrypt(refreshData));
	}
}
