import { Events } from '@sapphire/framework';
import { AnalyticsListener } from '../lib/structures';

export class PluginAnalyticsListener extends AnalyticsListener {
	public constructor(context: AnalyticsListener.Context) {
		super(context, { name: 'PluginMessageCreateAnalytics', event: Events.MessageCreate });
	}

	public run(): void {
		this.container.client.analytics!.messageCount++;
	}
}
