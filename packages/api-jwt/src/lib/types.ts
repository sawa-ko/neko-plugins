import type { ApiRequest as SapphireApiRequest, LoginData } from '@sapphire/plugin-api';
import type { RESTPostOAuth2AccessTokenResult } from 'discord-api-types/v10';

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
	user: SessionUserData;
}

/**
 * User information in Discord.
 * @since 3.0.0
 */
export interface SessionUserData {
	/**
	 * User data according to the Scopes chosen in the OAuth.
	 */
	data: LoginData;

	/**
	 * User's OAuth access token information in Discord.
	 */
	auth: RESTPostOAuth2AccessTokenResult;
}
