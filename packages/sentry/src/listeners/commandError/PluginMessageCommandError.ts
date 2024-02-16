import { Events, type MessageCommandErrorPayload } from '@sapphire/framework';
import { SentryListener } from '../../lib/structures/SentryListener';
import { sharedCommandErrorRun } from './_shared';

export class PluginSentryListener extends SentryListener<typeof Events.MessageCommandError> {
	public constructor(context: SentryListener.Context, options: SentryListener.Options) {
		super(context, { ...options, name: 'PluginSentryMessageCommandError', event: Events.MessageCommandError });
	}

	public run(error: unknown, payload: MessageCommandErrorPayload) {
		return sharedCommandErrorRun(error, this.name, payload.command.name);
	}
}
