import type { AuthData, ServerOptionsAuth } from '@sapphire/plugin-api';
import { isThenable } from '@sapphire/utilities';
import {
	RESTGetAPICurrentUserConnectionsResult,
	RESTGetAPICurrentUserGuildsResult,
	RESTGetAPICurrentUserResult,
	RouteBases,
	Routes
} from 'discord-api-types/v9';
import type { Awaitable, Snowflake } from 'discord.js';
import type { JWTService, JWT_CONFIG } from 'jwt-service';
import fetch from 'node-fetch';
import initJWTService from 'jwt-service';

/**
 * This is a rewrite of the Auth service of the @sapphire/plugin-api plugin.
 * @since 1.0.0
 */
export class ClientAuthJWT {
	/**
	 * The client's application id, this can be retrieved in Discord Developer Portal at https://discord.com/developers/applications.
	 * @since 1.0.0
	 */
	public id: Snowflake;

	/**
	 * The scopes defined at https://discord.com/developers/docs/topics/oauth2#shared-resources-oauth2-scopes.
	 * @since 1.0.0
	 */
	public scopes: readonly string[];

	/**
	 * The redirect uri.
	 * @since 1.0.0
	 */
	public redirect: string | undefined;

	/**
	 * The transformers used for {@link ClientAuthJWT.fetchData}.
	 * @since 1.4.0
	 */
	public transformers: LoginDataTransformer[];

	public jwtOptions: Omit<JWT_CONFIG<'PLUGIN_API_JWT_SECRET'>, 'secretEnvName'>;

	public domainOverwrite: string | null = null;

	public jwt!: JWTService<Record<string, unknown>>;

	#secret: string;

	public constructor(options: ServerOptionsAuth) {
		this.id = options.id as Snowflake;
		this.scopes = options.scopes ?? ['identify'];
		this.redirect = options.redirect;
		this.#secret = options.secret;
		this.transformers = options.transformers ?? [];
		this.domainOverwrite = options.domainOverwrite ?? null;
		this.jwtOptions = options.jwt ?? {
			duration: '2d',
			tolerance: '2h',
			algorithms: ['HS256']
		};

		void this.init();
	}

	/**
	 * The client secret, this can be retrieved in Discord Developer Portal at https://discord.com/developers/applications.
	 * @since 1.0.0
	 */
	public get secret() {
		return this.#secret;
	}

	/**
	 * Encrypts an object with HS256 to use as a token.
	 * @since 1.0.0
	 * @param payload An object to encrypt
	 */
	public async encrypt(payload: Record<string | 'id', string>): Promise<string> {
		const jwt = await this.jwt.sign({ data: payload });
		return jwt.token;
	}

	/**
	 * Decrypts an object with HS256 to use as a token.
	 * @since 1.0.0
	 * @param token An data to decrypt
	 */
	public async decrypt(token: string): Promise<AuthData | null> {
		const payload = (await this.jwt.verify(token).catch(() => null)) as unknown as { data: AuthData } | null;
		return payload?.data ?? null;
	}

	/**
	 * Retrieves the data for a specific user.
	 * @since 1.4.0
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
		for (const transformer of this.transformers) {
			const result = transformer(data);
			if (isThenable(result)) data = await result;
			else data = result as LoginData;
		}

		return data;
	}

	private async fetchInformation<T>(scope: string, token: string, url: string): Promise<T | null | undefined> {
		if (!this.scopes.includes(scope)) return undefined;

		const result = await fetch(url, {
			headers: {
				authorization: `Bearer ${token}`
			}
		});

		return result.ok ? ((await result.json()) as T) : null;
	}

	private async init() {
		this.jwt = await initJWTService({
			ENV: { PLUGIN_API_JWT_SECRET: this.#secret },
			JWT: { ...this.jwtOptions, secretEnvName: 'PLUGIN_API_JWT_SECRET' }
		});
	}
}

/**
 * The login data sent when fetching data from a user.
 * @since 1.4.0
 */
export interface LoginData {
	/**
	 * The user data, defined when the `'identify'` scope is defined.
	 * @since 1.4.0
	 */
	user?: RESTGetAPICurrentUserResult | null;

	/**
	 * The guilds data, defined when the `'guilds'` scope is defined.
	 * @since 1.4.0
	 */
	guilds?: RESTGetAPICurrentUserGuildsResult | null;

	/**
	 * The connections data, defined when the `'connections'` scope is defined.
	 * @since 1.4.0
	 */
	connections?: RESTGetAPICurrentUserConnectionsResult | null;
}

/**
 * A login data transformer.
 * @since 1.4.0
 */
export interface LoginDataTransformer<T extends LoginData = LoginData> {
	/**
	 * Transforms the object by mutating its properties or adding new ones.
	 * @since 1.4.0
	 */
	(data: LoginData): Awaitable<T>;
}
