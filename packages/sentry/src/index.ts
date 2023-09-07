import 'tslib';
import { SentryOptions } from './lib/types';

export { captureException } from '@sentry/node';
export * from './lib';
export * from './lib/types';

declare module 'discord.js' {
	export interface ClientOptions {
		sentry?: SentryOptions;
	}
}
