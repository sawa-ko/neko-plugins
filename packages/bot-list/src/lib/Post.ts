import { container } from '@sapphire/framework';
import { fetch } from 'undici';
import type { BotList } from '..';

/**
 * The handler to post stats to sites.
 * @since 1.0.0
 */
export class Post {
	protected readonly shards = container.client.shard?.count ?? 1;

	public constructor(public readonly botList: BotList) {}

	public async topGG() {
		return this.query(
			`https://top.gg/api/bots/${this.botList.clientId}/stats`,
			this.botList.keys.topGG!,
			JSON.stringify({ server_count: await this.botList.computeGuilds(), shard_count: this.shards }),
			'https://top.gg',
			'post'
		);
	}

	public async discordBotList() {
		return this.query(
			`https://discordbotlist.com/api/v1/bots/${this.botList.clientId}/stats`,
			`Bot ${this.botList.keys.discordBotList}`,
			JSON.stringify({ guilds: await this.botList.computeGuilds(), users: await this.botList.computeUsers() }),
			'https://discordbotlist.com',
			'post'
		);
	}

	public async botsOnDiscord() {
		return this.query(
			`https://bots.ondiscord.xyz/bot-api/bots/${this.botList.clientId}/guilds`,
			this.botList.keys.botsOnDiscord!,
			JSON.stringify({ guildCount: await this.botList.computeGuilds() }),
			'https://bots.ondiscord.xyz',
			'post'
		);
	}

	public async discords() {
		return this.query(
			`https://discords.com/bots/api/bot/${this.botList.clientId}`,
			this.botList.keys.discords!,
			JSON.stringify({ server_count: await this.botList.computeGuilds() }),
			'https://discords.com',
			'post'
		);
	}

	public async botListMe() {
		return this.query(
			`https://api.botlist.me/api/v1/bots/${this.botList.clientId}/stats`,
			`Bot ${this.botList.keys.botListMe}`,
			JSON.stringify({ server_count: await this.botList.computeGuilds(), shard_count: this.shards }),
			'https://botlist.me',
			'post'
		);
	}

	public async discordBotsGG() {
		return this.query(
			`https://discord.bots.gg/api/v1/bots/${this.botList.clientId}/stats`,
			this.botList.keys.discordBotsGG!,
			JSON.stringify({ guildCount: await this.botList.computeGuilds(), shardCount: this.shards }),
			'https://discord.bots.gg',
			'post'
		);
	}

	public async discordExtremeList() {
		return this.query(
			`https://api.discordextremelist.xyz/v2/bot/${this.botList.clientId}/stats`,
			this.botList.keys.discordExtremeList!,
			JSON.stringify({ guildCount: await this.botList.computeGuilds(), shardCount: this.shards }),
			'https://discordextremelist.xyz',
			'post'
		);
	}

	public async discordServices() {
		return this.query(
			`https://api.discordservices.net/bot/${this.botList.clientId}/stats`,
			this.botList.keys.discordServices!,
			JSON.stringify({ servers: await this.botList.computeGuilds(), shards: this.shards }),
			'https://discordservices.net',
			'post'
		);
	}

	public async disforge() {
		return this.query(
			`https://disforge.com/api/botstats/${this.botList.clientId}`,
			this.botList.keys.disforge!,
			JSON.stringify({ servers: await this.botList.computeGuilds() }),
			'https://disforge.com',
			'post'
		);
	}

	public async infinityBots() {
		return this.query(
			'https://api.infinitybotlist.com/bots/stats',
			this.botList.keys.infinityBots!,
			JSON.stringify({ servers: await this.botList.computeGuilds(), users: await this.botList.computeUsers(), shards: this.shards }),
			'https://infinitybots.gg',
			'post'
		);
	}

	public async voidBots() {
		return this.query(
			`https://api.voidbots.net/bot/stats/${this.botList.clientId}`,
			this.botList.keys.voidBots!,
			JSON.stringify({ server_count: await this.botList.computeGuilds(), shard_count: this.shards }),
			'https://voidbots.net',
			'post'
		);
	}

	public async discordListGG() {
		return this.query(
			`https://api.discordlist.gg/v0/bots/${this.botList.clientId}/guilds`,
			this.botList.keys.discordListGG!,
			JSON.stringify({ count: await this.botList.computeGuilds() }),
			'https://discordlist.gg',
			'post'
		);
	}

	private async query(url: string, authorizationKey: string, body: string, siteUrl: string, method: 'post' | 'patch') {
		try {
			const response = await fetch(url, {
				method,
				headers: {
					'content-type': 'application/json',
					authorization: authorizationKey
				},
				body
			});

			this.botList.emit('postStatsSuccess', response);

			if (this.botList.options.debug) container.logger.debug(`[BotList-Plugin]: Posting to ${siteUrl} was successful.`);

			if (!response.ok) {
				const error = response.clone();
				let errorMessage = await error.text().catch(() => null);

				try {
					errorMessage = JSON.parse(errorMessage as string);
				} catch {}

				this.botList.emit('postStatsError', errorMessage ?? 'Unknown error.');
			}
		} catch (err) {
			this.botList.emit('postStatsError', err);
		}
	}
}
