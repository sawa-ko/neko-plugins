import type { ApiRequest as SapphireApiRequest, LoginData } from '@sapphire/plugin-api';
import type { RESTPostOAuth2AccessTokenResult } from 'discord-api-types/v10';
import type { Awaitable } from 'discord.js';

import type { Algorithm } from 'jsonwebtoken';

/**
 * Configuration of the behavior when signing JWT tokens.
 * @since 3.0.0
 */
export interface ClientOptions {
	/**
	 * @link https://jwt.io/introduction
	 */
	issuer?: string;

	/**
	 * Secret phrase for signing JWT tokens.
	 */
	secret: string;

	/**
	 * Algorithm used to sign JWT tokens.
	 */
	algorithm?: Algorithm;

	/**
	 * Strategies to verify and manage active API sessions in a customized way.
	 */
	sessions?: PersistSessionsStrategies;
}

/**
 * Custom APIRequest interface for inject session property in request object.
 * @since 3.0.0
 */
export interface ApiRequest extends Omit<SapphireApiRequest, 'auth'> {
	/**
	 * Session information of the user authenticated.
	 */
	session?: SessionData | null;
}

/**
 * Information about the user's active session.
 * @since 3.0.0
 */
export interface SessionData {
	/**
	 * User's internal access token (Client).
	 */
	access_token: string;

	/**
	 * The user's internal refresh rate (Client).
	 */
	refresh_token: string;

	/**
	 * User information in Discord (OAuth2).
	 */
	data: SessionUserData;
}

/**
 * User information in Discord.
 * @since 3.0.0
 */
export interface SessionUserData {
	/**
	 * User data according to the Scopes chosen in the OAuth.
	 */
	user: LoginData;

	/**
	 * User's OAuth access token information in Discord.
	 */
	auth: RESTPostOAuth2AccessTokenResult;
}

/**
 * Payload that is sent to the strategy to create persistent sessions.
 */
export interface PersistSessionsPayload {
	access_token: string;
	refresh_token: string;
	data: SessionUserData;
}

/**
 * Methods used for persistent session strategies in the API.
 */
export interface PersistSessionsStrategies {
	/**
	 * Method to be used to verify persistent user sessions.
	 * @returns boolean | Promise<boolean>
	 */
	get?: <T>(token: string, type: 'access_token' | 'refresh_token') => Awaitable<{ access_token: string; refresh_token: string } & T>;

	/**
	 * Method to be used to create persistent user sessions.
	 * @returns unknow
	 */
	create?: (payload: PersistSessionsPayload) => Awaitable<unknown>;

	/**
	 * Method to be used to delete persistent user sessions.
	 * @returns unknow
	 */
	delete?: (accessToken: string) => Awaitable<unknown>;
}
