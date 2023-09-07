import type { NodeOptions } from '@sentry/node';

export interface SentryOptions {
	/**
	 * The name of the application.
	 * @since 1.0.0
	 * @default package.json#name
	 */
	appName?: string;
	/**
	 * The version of the application.
	 * @since 1.0.0
	 * @default package.json#version
	 */
	appVersion?: string;
	/**
	 * If Plugin-sentry to load error event listeners from various pre-included parts that log all errors encountered in sentry.
	 * @since 1.0.0
	 * @default true
	 */
	loadSentryErrorListeners?: boolean;
	/**
	 * The options to pass to the sentry client.
	 * @since 1.0.0
	 * @default {}
	 * @see https://docs.sentry.io/platforms/node/configuration/options/
	 */
	options?: Omit<NodeOptions, 'dsn'>;
	/**
	 * The root directory to use for rewriting frames.
	 * @since 1.0.0
	 * @default process.cwd()
	 */
	root?: string | URL;
}
