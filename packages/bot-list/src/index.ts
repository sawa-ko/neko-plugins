import { BotList } from './lib/BotList';

export { BotList } from './lib/BotList';
export * from './lib/Post';

declare module 'discord.js' {
	export interface ClientOptions {
		botList?: BotList.Options;
	}
}
