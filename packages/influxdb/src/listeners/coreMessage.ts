import { AnalyticsListener } from '../lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import { Events } from '@sapphire/framework';

@ApplyOptions<AnalyticsListener.Options>({ event: Events.MessageCreate })
export class UserAnalyticsEvent extends AnalyticsListener {
	public run(): void {
		this.container.client.analytics!.messageCount++;
	}
}
