import { ApiRequest, ApiResponse, methods, Route, MimeTypes } from '@sapphire/plugin-api';
import { isNullish } from '@sapphire/utilities';

/**
 * Get access and refresh token and return user data according scopes in oauth.
 * @since 3.0.0
 */
export class PluginRoute extends Route {
	public constructor(context: Route.Context, options: Route.Options) {
		super(context, { ...options, route: 'authorize/access', acceptedContentMimeTypes: [MimeTypes.ApplicationJson] });

		const { server } = this.container;
		this.enabled = server.auth !== null;
	}

	public async [methods.POST](request: ApiRequest, response: ApiResponse) {
		const body = request.body as OAuth2BodyData;
		if (isNullish(body.code)) return response.badRequest('The Discord OAuth code is required.');

		const authData = await this.container.jwt.auth(body.code, 'code', body.redirectUri);
		if (isNullish(authData)) return response.error('There was a problem getting user information in Discord.');

		return response.status(200).json(this.container.jwt.encrypt(authData));
	}
}

/**
 * The OAuth2 body data sent to the callback.
 * @since 3.0.0
 */
export interface OAuth2BodyData {
	/**
	 * The code sent by the client.
	 * @since 3.0.0
	 */
	code: string;

	/**
	 * The redirect URI.
	 * @since 3.0.0
	 */
	redirectUri: string;
}
