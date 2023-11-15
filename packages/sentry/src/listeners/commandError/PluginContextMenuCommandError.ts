import { Events, type ContextMenuCommandErrorPayload } from '@sapphire/framework';
import { SentryListener } from '../../lib/structures/SentryListener';
import { sharedCommandErrorRun } from './_shared';

export class PluginSentryListener extends SentryListener<typeof Events.ContextMenuCommandError> {
	public constructor(context: SentryListener.Context, options: SentryListener.Options) {
		super(context, { ...options, name: 'PluginSentryContextMenuCommandError', event: Events.ContextMenuCommandError });
	}

	public run(error: unknown, payload: ContextMenuCommandErrorPayload) {
		return sharedCommandErrorRun(error, this.name, payload.command.name);
	}
}
