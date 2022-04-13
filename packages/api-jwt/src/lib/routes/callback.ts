import type { PieceContext } from '@sapphire/pieces';
import { Route, methods, type ApiRequest, type ApiResponse, HttpCodes } from '@sapphire/plugin-api';
import { OAuth2Routes, RESTPostOAuth2AccessTokenResult, RESTPostOAuth2AccessTokenURLEncodedData } from 'discord-api-types/v9';
import fetch from 'node-fetch';
import { stringify } from 'querystring';

/**
 * This is a rewrite of the @sapphire/plugin-api plugin authentication route.
 * @since 1.0.0
 */
export class PluginRoute extends Route {
	private readonly redirectUri: string | undefined;

	public constructor(context: PieceContext) {
		super(context, { route: 'oauth/callback' });

		const { server } = this.container;
		this.enabled = server.auth !== null;
		this.redirectUri = server.auth?.redirect;
	}

	public async [methods.POST](request: ApiRequest, response: ApiResponse) {
		const body = request.body as OAuth2BodyData;
		if (typeof body?.code !== 'string') {
			return response.badRequest();
		}

		const value = await this.fetchAuth(body);
		if (value === null) {
			return response.status(HttpCodes.InternalServerError).json({ error: 'Failed to fetch the token.' });
		}

		const auth = this.container.jwt;
		const data = await auth.fetchData(value.access_token);
		if (!data.user) {
			return response.status(HttpCodes.InternalServerError).json({ error: 'Failed to fetch the user.' });
		}

		const token = await auth.encrypt({
			id: data.user.id,
			refresh: value.refresh_token,
			token: value.access_token
		});

		return response.json({ data, token });
	}

	private async fetchAuth(body: OAuth2BodyData) {
		const { id, secret } = this.container.server.auth!;

		const data: RESTPostOAuth2AccessTokenURLEncodedData = {
			/* eslint-disable @typescript-eslint/naming-convention */
			client_id: id,
			client_secret: secret,
			code: body.code,
			grant_type: 'authorization_code',
			redirect_uri: this.redirectUri ?? body.redirectUri
			/* eslint-enable @typescript-eslint/naming-convention */
		};

		const result = await fetch(OAuth2Routes.tokenURL, {
			method: 'POST',
			body: stringify(data as any),
			headers: {
				'content-type': 'application/x-www-form-urlencoded'
			}
		});

		const json = await result.json();
		if (result.ok) return json as RESTPostOAuth2AccessTokenResult;

		this.container.logger.error(json);
		return null;
	}
}

/**
 * The OAuth2 body data sent to the callback.
 * @since 1.2.0
 */
export interface OAuth2BodyData {
	/**
	 * The code sent by the client.
	 * @since 1.2.0
	 */
	code: string;

	/**
	 * The client's ID.
	 * @since 1.2.0
	 */
	clientId: string;

	/**
	 * The redirect URI.
	 * @since 1.2.0
	 */
	redirectUri: string;
}
