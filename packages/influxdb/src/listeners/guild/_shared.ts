import { Point } from '@influxdata/influxdb-client';
import type { Guild } from 'discord.js';
import type { AnalyticsListener } from '../../lib/structures/AnalyticsListener';
import { Points, Tags, type Actions } from '../../lib/types/AnalyticsSchema';

export function sharedGuildRun(listener: AnalyticsListener, guild: Guild, action: Actions.Addition | Actions.Subtraction) {
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
