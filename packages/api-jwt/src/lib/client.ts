import type { AuthData, LoginData } from '@sapphire/plugin-api';
import { isThenable } from '@sapphire/utilities';
import {
	RESTGetAPICurrentUserConnectionsResult,
	RESTGetAPICurrentUserGuildsResult,
	RESTGetAPICurrentUserResult,
	RouteBases,
	Routes
} from 'discord-api-types/v9';
import type { JWTService, JWT_CONFIG } from 'jwt-service';
import fetch from 'node-fetch';
import initJWTService from 'jwt-service';
import { container } from '@sapphire/framework';

/**
 * This is a rewrite of the Auth service of the @sapphire/plugin-api plugin.
 * @since 1.0.0
 */
export class ClientAuthJWT {
	public jwtOptions: Omit<JWT_CONFIG<'PLUGIN_API_JWT_SECRET'>, 'secretEnvName'>;
	public jwt!: JWTService<Record<string, unknown>>;
	#jwtSessions: string[] = [];

	public constructor(options?: Omit<JWT_CONFIG<'PLUGIN_API_JWT_SECRET'>, 'secretEnvName'>) {
		this.jwtOptions = options ?? {
			duration: '15d',
			tolerance: '2h',
			algorithms: ['HS256']
		};

		void this.init();
	}

	/**
	 * Closes the current JWT session delivered to the user at login.
	 * @param token Token that the user is using.
	 * @since 1.2.1
	 */
	public closeSession(token: string) {
		this.#jwtSessions = this.#jwtSessions.filter((t) => t !== token);
	}

	/**
	 * Save the user's token as a session so that when the user logs off the token is invalidated.
	 * @param token Token that the user is using.
	 * @since 1.2.1
	 */
	public saveSession(token: string) {
		this.#jwtSessions.push(token);
	}

	/**
	 * Validate that the user's token still has an active session.
	 * @param token Token that the user is using.
	 * @since 1.2.1
	 */
	public verifySession(token: string) {
		return this.#jwtSessions.some((t) => t === token);
	}

	/**
	 * The client secret, this can be retrieved in Discord Developer Portal at https://discord.com/developers/applications.
	 * @since 1.0.0
	 */
	public get secret() {
		return container.server?.auth?.secret;
	}

	/**
	 * Encrypts an object with [ Your configured algorithms of by default HS256 ] to use as a token.
	 * @since 1.0.0
	 * @param payload An object to encrypt
	 */
	public async encrypt(payload: Omit<AuthData, 'jwt'>): Promise<string> {
		const { token } = await this.jwt.sign({ data: payload });
		this.#jwtSessions.push(token);
		return token;
	}

	/**
	 * Decrypts an object with [ Your configured algorithms or by default HS256 ] to use as a token.
	 * @since 1.0.0
	 * @param token An data to decrypt
	 */
	public async decrypt(token: string): Promise<AuthData | null> {
		const payload = (await this.jwt.verify(token).catch(() => null)) as unknown as TokenPayload | null;
		if (!payload) return null;
		return {
			...payload.data,
			jwt: {
				exp: payload.exp,
				iat: payload.iat,
				nbf: payload.nbf
			}
		};
	}

	/**
	 * Retrieves the data for a specific user.
	 * @since 1.0.0
	 * @param token The access token from the user.
	 */
	public async fetchData(token: string): Promise<LoginData> {
		// Fetch the information:
		const [user, guilds, connections] = await Promise.all([
			this.fetchInformation<RESTGetAPICurrentUserResult>('identify', token, `${RouteBases.api}${Routes.user()}`),
			this.fetchInformation<RESTGetAPICurrentUserGuildsResult>('guilds', token, `${RouteBases.api}${Routes.userGuilds()}`),
			this.fetchInformation<RESTGetAPICurrentUserConnectionsResult>('connections', token, `${RouteBases.api}${Routes.userConnections()}`)
		]);

		// Transform the information:
		let data: LoginData = { user, guilds, connections };
		for (const transformer of container.server?.auth!.transformers) {
			const result = transformer(data);
			if (isThenable(result)) data = await result;
			else data = result as LoginData;
		}

		return data;
	}

	private async fetchInformation<T>(scope: string, token: string, url: string): Promise<T | null | undefined> {
		if (!container.server?.auth!.scopes.includes(scope)) return undefined;

		const result = await fetch(url, {
			headers: {
				authorization: `Bearer ${token}`
			}
		});

		return result.ok ? ((await result.json()) as T) : null;
	}

	private async init() {
		this.jwt = await initJWTService({
			ENV: { PLUGIN_API_JWT_SECRET: container.server?.auth?.secret ?? 'This is not good.' },
			JWT: { ...this.jwtOptions, secretEnvName: 'PLUGIN_API_JWT_SECRET' }
		});
	}
}

/**
 * Token data.
 * @since 1.0.0
 */
export interface TokenPayload {
	/**
	 * User ID and Discord OAuth token data.
	 */
	data: Omit<AuthData, 'jwt_token_metadata'>;

	/**
	 * Identifies the time at which the JWT token was issued.
	 */
	iat: number;

	/**
	 * Identifies the expiration time on or after which the JWT MUST NOT be accepted for processing.
	 */
	exp: number;

	/**
	 * Identifies the time before which the JWT token MUST NOT be accepted for processing.
	 */
	nbf: number;
}
