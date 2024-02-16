import { Events, type ContextMenuCommandSuccessPayload } from '@sapphire/framework';
import { AnalyticsListener } from '../../lib/structures/AnalyticsListener';
import { CommandRunTypes } from '../../lib/types';
import { sharedCommandSuccessRun } from './_shared';

export class PluginAnalyticsListener extends AnalyticsListener {
	public constructor(context: AnalyticsListener.Context) {
		super(context, { name: 'PluginAnalyticsContextMenuCommandSuccess', event: Events.ContextMenuCommandSuccess });
	}

	public run(payload: ContextMenuCommandSuccessPayload) {
		sharedCommandSuccessRun(this, payload.command.name, CommandRunTypes.ContextMenu, payload.command.category);
	}
}
