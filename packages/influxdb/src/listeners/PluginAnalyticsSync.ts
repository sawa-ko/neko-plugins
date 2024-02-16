import { Point } from '@influxdata/influxdb-client';
import { AnalyticsListener } from '../lib/structures';
import { Actions, AnalyticsSync, Points, Tags } from '../lib/types';

export class PluginAnalyticsListener extends AnalyticsListener {
	public constructor(context: AnalyticsListener.Context) {
		super(context, { name: 'PluginAnalyticsSync', event: AnalyticsSync });
	}

	public run(guilds: number, users: number) {
		this.writePoints([this.syncGuilds(guilds), this.syncUsers(users), this.syncMessageCount()]);

		return this.container.client.analytics!.writeApi!.flush();
	}

	private syncGuilds(value: number) {
		return (
			new Point(Points.Guilds)
				.tag(Tags.Action, Actions.Sync)
				// TODO: Adjust for traditional sharding
				.intField('value', value)
		);
	}

	private syncUsers(value: number) {
		return new Point(Points.Users).tag(Tags.Action, Actions.Sync).intField('value', value);
	}

	private syncMessageCount() {
		const { analytics } = this.container.client;
		const value = analytics!.messageCount;
		analytics!.messageCount = 0;

		return new Point(Points.MessageCount) //
			.tag(Tags.Action, Actions.Sync)
			.intField('value', value);
	}
}
