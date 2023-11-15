import { Events, type ChatInputCommandSuccessPayload } from '@sapphire/framework';
import { AnalyticsListener } from '../../lib/structures/AnalyticsListener';
import { CommandRunTypes } from '../../lib/types';
import { sharedCommandSuccessRun } from './_shared';

export class PluginAnalyticsListener extends AnalyticsListener {
	public constructor(context: AnalyticsListener.Context) {
		super(context, { name: 'PluginAnalyticsChatInputCommandSuccess', event: Events.ChatInputCommandSuccess });
	}

	public run(payload: ChatInputCommandSuccessPayload) {
		sharedCommandSuccessRun(this, payload.command.name, CommandRunTypes.ChatInput, payload.command.category);
	}
}
