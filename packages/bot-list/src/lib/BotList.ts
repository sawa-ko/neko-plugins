import { container } from '@sapphire/framework';
import { TypedEmitter } from 'tiny-typed-emitter';
import type { Response } from 'undici';
import { Post } from './Post';

/**
 * The BotList class.
 * @since 1.0.0
 */
export class BotList extends TypedEmitter<BotList.Events> {
	public readonly post = new Post(this);
	public readonly clientId: string;
	public readonly autoPost: BotList.Options['autoPost'];
	public readonly keys: BotList.Keys;
	public readonly debug: boolean;

	public constructor(public readonly options: BotList.Options) {
		super();

		options.shard ??= false;

		this.clientId = options.clientId ?? container.client.user!.id;
		this.autoPost = options.autoPost;
		this.keys = options.keys;
		this.debug = options.debug ?? false;
	}

	/**
	 * Post the data to the sites that have been enabled.
	 * @since 1.0.0
	 */
	public async postStats() {
		const enabledSites = Object.keys(this.keys).filter((k) => !k);

		for (const site of enabledSites) {
			await this.post[site as keyof BotList.Keys]();
		}
	}

	/**
	 * Compute the number of users.
	 * @since 1.2.0
	 */
	public async computeUsers() {
		if (container.client.shard && this.options.shard) {
			const users = await container.client.shard.broadcastEval((c) =>
				c.guilds.cache.filter((g) => g.available).reduce((acc, guild) => acc + (guild.memberCount ?? 0), 0)
			);

			return users.reduce((acc, m) => acc + m, 0);
		}

		return container.client.guilds.cache.reduce((acc, guild) => acc + (guild.memberCount ?? 0), 0);
	}

	/**
	 * Compute the number of guilds.
	 * @since 1.2.0
	 */
	public async computeGuilds() {
		if (container.client.shard && this.options.shard) {
			const guilds = await container.client.shard.broadcastEval((c) => c.guilds.cache.filter((g) => g.available).size);

			return guilds.reduce((acc, g) => acc + g, 0);
		}

		return container.client.guilds.cache.size;
	}
}

export namespace BotList {
	export interface Events {
		postStatsError: (err: unknown) => void;
		postStatsSuccess: (response: Response) => void;
	}

	export interface Options {
		/**
		 * The client ID that should be used.
		 * @since 1.0.0
		 */
		clientId?: string;

		/**
		 * If debug logs are enabled.
		 * @default false
		 * @since 1.0.0
		 */
		debug?: boolean;

		/**
		 * If sharding support is enabled.
		 * @default false
		 * @since 1.2.0
		 */
		shard?: boolean;

		/**
		 * If you enable auto-posting of stats.
		 * It is enabled by default.
		 * @since 1.0.0
		 */
		autoPost?: {
			/**
			 * @default true
			 * @since 1.0.0
			 */
			enabled?: boolean;

			/**
			 * The interval in milliseconds.
			 * @default 3.6e6 // One hour
			 * @since 1.0.0
			 */
			interval?: number;
		};

		/**
		 * This section contains the API keys for each site.
		 * @since 1.0.0
		 */
		keys: Keys;
	}

	export interface Keys {
		/**
		 * @see https://top.gg
		 * @since 1.0.0
		 */
		topGG?: string;

		/**
		 * @see https://discordbotlist.com
		 * @since 1.0.0
		 */
		discordBotList?: string;

		/**
		 * @see https://bots.ondiscord.xyz
		 * @since 1.0.0
		 */
		botsOnDiscord?: string;

		/**
		 * @see https://discords.com
		 * @since 1.0.0
		 */
		discords?: string;

		/**
		 * @see https://botlist.me
		 * @since 1.0.0
		 */
		botListMe?: string;

		/**
		 * @see https://discord.bots.gg
		 * @since 1.0.0
		 */
		discordBotsGG?: string;

		/**
		 * @see https://discordextremelist.xyz
		 * @since 1.0.0
		 */
		discordExtremeList?: string;

		/**
		 * @see https://discordservices.net
		 * @since 1.2.0
		 */
		discordServices?: string;

		/**
		 * @see https://disforge.com
		 * @since 1.2.0
		 */
		disforge?: string;

		/**
		 * @see https://infinitybots.gg
		 * @since 1.2.0
		 */
		infinityBots?: string;

		/**
		 * @see https://voidbots.net
		 * @since 1.2.0
		 */
		voidBots?: string;

		/**
		 * @see https://discordlist.gg
		 * @since 1.3.0
		 */
		discordListGG?: string;
	}
}
