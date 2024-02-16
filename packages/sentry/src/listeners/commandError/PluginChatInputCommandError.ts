import { Events, type ChatInputCommandErrorPayload } from '@sapphire/framework';
import { SentryListener } from '../../lib/structures/SentryListener';
import { sharedCommandErrorRun } from './_shared';

export class PluginSentryListener extends SentryListener<typeof Events.ChatInputCommandError> {
	public constructor(context: SentryListener.Context, options: SentryListener.Options) {
		super(context, { ...options, name: 'PluginSentryChatInputCommandError', event: Events.ChatInputCommandError });
	}

	public run(error: unknown, payload: ChatInputCommandErrorPayload) {
		return sharedCommandErrorRun(error, this.name, payload.command.name);
	}
}
