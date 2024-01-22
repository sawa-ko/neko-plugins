import { AnalyticsListener } from '../lib/structures';
import { Actions, Points, Tags } from '../lib/types';
import { Point } from '@influxdata/influxdb-client';
import { ApplyOptions } from '@sapphire/decorators';
import { Events } from '@sapphire/framework';
import type { Guild } from 'discord.js';

@ApplyOptions<AnalyticsListener.Options>({ event: Events.GuildCreate })
export class GuildCreateAnalyticsEvent extends AnalyticsListener {
	public run(guild: Guild) {
		sharedRun(this, guild, Actions.Addition);
	}
}

@ApplyOptions<AnalyticsListener.Options>({ event: Events.GuildDelete })
export class GuildDeleteAnalyticsEvent extends AnalyticsListener {
	public run(guild: Guild) {
		sharedRun(this, guild, Actions.Subtraction);
	}
}

function sharedRun(listener: AnalyticsListener, guild: Guild, action: Actions.Addition | Actions.Subtraction) {
	const guilds = new Point(Points.Guilds)
		.tag(Tags.Shard, guild.shardId.toString())
		.tag(Tags.Action, action)
		.intField('value', guild.client.guilds.cache.size);

	const users = new Point(Points.Users)
		.tag(Tags.Shard, guild.shardId.toString())
		.tag(Tags.Action, action)
		.intField(
			'value',
			guild.client.guilds.cache.reduce((acc, val) => acc + (val.memberCount ?? 0), 0)
		);
	return listener.writePoints([guilds, users]);
}
