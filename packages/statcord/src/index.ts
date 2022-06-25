export * from './lib/statcord';
export * from './lib/types';

import type { StatcordOptions } from './lib/types';

declare module 'discord.js' {
	export interface ClientOptions {
		statcord?: StatcordOptions;
	}
}
