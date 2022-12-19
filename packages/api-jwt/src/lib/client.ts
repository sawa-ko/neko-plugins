import { container, Result } from '@sapphire/framework';
import { isNullish } from '@sapphire/utilities';

import { stringify } from 'querystring';
import { OAuth2Routes, RESTPostOAuth2AccessTokenResult } from 'discord-api-types/v10';
import jwt, { type Algorithm } from 'jsonwebtoken';
import fetch from 'node-fetch';

import type { ClientOptions, PersistSessionsStrategies, SessionUserData } from './types';

/**
 * JWT token manager client in the API.
 * @since 3.0.0
 */
export class Client {
	private issuer?: string;
	private secret: string;
	private algorithm: Algorithm;
	private sessionsStrategies?: PersistSessionsStrategies;

	public constructor(options: ClientOptions) {
		this.issuer = options.issuer;
		this.sessionsStrategies = options.sessions;

		// If no algorithm is specified, the HS512 algorithm will be used.
		this.algorithm = options.algorithm ?? 'HS512';

		// Set secret key if secret key is not set in options.
		this.secret = container.client.server?.auth?.secret ?? 'NEKO-PLUGINS';
	}

	public async encrypt(payload: SessionUserData) {
		const options: jwt.SignOptions = { algorithm: this.algorithm, expiresIn: '4d' };
		if (this.issuer) options.issuer = this.issuer;

		const accessToken = jwt.sign(payload, this.secret, options);
		const refresToken = jwt.sign(payload.auth, this.secret, {
			...options,
			expiresIn: '7d'
		});

		if (this.sessionsStrategies?.create) {
			await this.sessionsStrategies.create({ access_token: accessToken, refresh_token: refresToken, data: payload });
		}

		return { access_token: accessToken, refresh_token: refresToken, expires_in: Date.now() + 345600000, token_type: 'Bearer' };
	}

	public async decrypt<T = unknown>(token: string, type: 'access_token' | 'refresh_token') {
		const data = Result.from<Pick<jwt.JwtPayload, 'iat' | 'exp' | 'iss'> & T>(() => jwt.verify(token, this.secret) as any);
		if (data.isErr()) return null;

		if (this.sessionsStrategies?.get) {
			const session = await this.sessionsStrategies.get(token, type);
			if (!session) return null;

			return { data: data.unwrapOr(null), access_token: session.access_token, refresh_token: session.refresh_token };
		}

		return { data: data.unwrapOr(null), [type]: token };
	}

	public async signOut(accessToken: string) {
		if (this.sessionsStrategies?.delete) {
			await this.sessionsStrategies.delete(accessToken);
		}

		return true;
	}

	public async auth(code: string, grantType: 'code' | 'refresh', redirectUri?: string) {
		const authData = await this.authOrRefresh(code, grantType, redirectUri);
		if (isNullish(authData)) return null;

		const userData = await container.server.auth?.fetchData(authData.access_token);
		if (isNullish(userData)) return null;

		return { auth: authData, user: userData };
	}

	private async authOrRefresh(tokenOrCode: string, grantType: 'code' | 'refresh', redirectUri?: string) {
		const { id, secret } = container.server.auth!;

		const data: any = {
			client_id: id,
			client_secret: secret
		};

		if (grantType === 'code') {
			data.code = tokenOrCode;
			data.grant_type = 'authorization_code';
			data.redirect_uri = container.server.auth?.redirect ?? redirectUri;
		}

		if (grantType === 'refresh') {
			data.refresh_token = tokenOrCode;
			data.grant_type = 'refresh_token';
		}

		const result = await fetch(OAuth2Routes.tokenURL, {
			method: 'POST',
			body: stringify(data),
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
