import { ApiRequest, ApiResponse, methods, Route, MimeTypes } from '@sapphire/plugin-api';
import { isNullish } from '@sapphire/utilities';

/**
 * Refresh internal and External (Discord) access token.
 * @since 3.0.0
 */
export class PluginRoute extends Route {
	public constructor(context: Route.Context, options: Route.Options) {
		super(context, { ...options, route: 'authorize/refresh', acceptedContentMimeTypes: [MimeTypes.ApplicationJson] });

		const { server } = this.container;
		this.enabled = server.auth !== null;
	}

	public async [methods.POST](request: ApiRequest, response: ApiResponse) {
		const { refresh_token } = request.body as { refresh_token: string };
		if (isNullish(refresh_token)) return response.badRequest('The refresh_token is required.');

		const tokenData = this.container.jwt.decrypt(refresh_token);
		if (isNullish(tokenData)) return response.error('Could not get the user information in the token.');

		const refreshData = await this.container.jwt.auth(tokenData.user.auth.refresh_token, 'refresh');
		if (isNullish(refreshData)) return response.error('There was a problem refreshing data in Discord.');

		return this.container.jwt.encrypt(refreshData);
	}
}
