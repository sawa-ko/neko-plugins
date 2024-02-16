import 'tslib';

export * from './lib/statcord';
export * from './lib/types';

import type { StatcordOptions } from './lib/types';

declare module 'discord.js' {
	export interface ClientOptions {
		/**
		 * @deprecated Statcord and all related discordlabs have been discontinued. This plugin will be discontinued soon.
		 */
		statcord?: StatcordOptions;
	}
}
