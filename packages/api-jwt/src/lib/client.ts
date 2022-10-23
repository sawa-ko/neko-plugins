import { container, Result } from '@sapphire/framework';
import { isNullish } from '@sapphire/utilities';

import { stringify } from 'querystring';
import { OAuth2Routes, RESTPostOAuth2AccessTokenResult } from 'discord-api-types/v10';
import jwt, { type Algorithm } from 'jsonwebtoken';
import fetch from 'node-fetch';

import type { ClientOptions, SessionData, SessionUserData } from './types';

/**
 * JWT token manager client in the API.
 * @since 3.0.0
 */
export class Client {
	private issuer: string;
	private secret: string;
	private algorithm: Algorithm;
	private sessions: SessionData[] = [];

	public constructor(options: ClientOptions) {
		// If no algorithm is specified, the HS512 algorithm will be used.
		this.algorithm = options.algorithm ?? 'HS512';

		// If no issuer is specified, the host of the redirect url will be used.
		this.issuer = options.issuer ?? new URL(container.client.server.auth!.redirect!).host;

		// Generate Random secret key if secret key is not set in options.
		this.secret = container.client.server.auth?.secret ?? (Math.random() + 1).toString(36).substring(7);
	}

	public encrypt(payload: SessionUserData) {
		const accessToken = jwt.sign({ payload }, this.secret, { algorithm: this.algorithm, expiresIn: '4d', issuer: this.issuer });
		const refresToken = jwt.sign({ access_token: accessToken, payload }, this.secret, {
			algorithm: this.algorithm,
			expiresIn: '7d',
			issuer: this.issuer
		});

		this.sessions.push({ access_token: accessToken, refresh_token: refresToken, user: payload });
		return { access_token: accessToken, refresh_token: refresToken, expires_in: Date.now() + 345600000, token_type: 'Bearer' };
	}

	public decrypt(token: string) {
		const data = Result.from<jwt.JwtPayload & SessionData>(() => jwt.verify(token, this.secret, { complete: true }) as any);
		if (data.isErr()) return null;

		if (!this.sessions.some((s) => s.access_token === token)) return null;
		return data.unwrapOr(null);
	}

	public signOut(accessToken: string) {
		this.sessions = this.sessions.filter((s) => s.access_token !== accessToken);
	}

	public async auth(token: string, grantType: 'code' | 'refresh', redirectUri?: string) {
		const authData = await this.authOrRefresh(token, grantType, redirectUri);
		if (isNullish(authData)) return null;

		const userData = await container.server.auth?.fetchData(authData.access_token);
		if (isNullish(userData)) return null;

		return { data: userData, auth: authData };
	}

	private async authOrRefresh(tokenOrCode: string, grantType: 'code' | 'refresh', redirectUri?: string) {
		const { id, secret } = container.server.auth!;

		const data: any = {
			client_id: id,
			client_secret: secret,
			redirect_uri: container.server.auth?.redirect ?? redirectUri
		};

		if (grantType === 'code') {
			data.code = tokenOrCode;
			data.grant_type = 'authorization_code';
		}

		if (grantType === 'refresh') {
			data.refresh_token = tokenOrCode;
			data.grant_type = 'refresh_token';
		}

		const result = await fetch(OAuth2Routes.tokenURL, {
			method: 'POST',
			body: stringify(data as any),
			headers: {
				'content-type': 'application/x-www-form-urlencoded'
			}
		});

		const json = await result.json();
		if (result.ok) return json as RESTPostOAuth2AccessTokenResult;

		container.logger.error(json);
		return null;
	}
}
