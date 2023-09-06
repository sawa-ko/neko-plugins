import 'tslib';
import type { SentryOptions } from './lib/types';

export * from './lib';
export * from './lib/types'
export { captureException } from '@sentry/node';

declare module 'discord.js' {
	export interface ClientOptions {
		sentry?: SentryOptions;
	}
}
