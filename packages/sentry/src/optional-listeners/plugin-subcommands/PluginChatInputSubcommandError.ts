import { SubcommandPluginEvents, type ChatInputSubcommandErrorPayload } from '@sapphire/plugin-subcommands';
import { SentryListener } from '../../lib/structures/SentryListener';
import { sharedCommandErrorRun } from '../../listeners/commandError/_shared';

export class PluginSentryListener extends SentryListener<typeof SubcommandPluginEvents.ChatInputSubcommandError> {
	public constructor(context: SentryListener.Context, options: SentryListener.Options) {
		super(context, {
			...options,
			name: 'PluginSentryChatInputSubcommandError',
			event: SubcommandPluginEvents.ChatInputSubcommandError
		});
	}

	public run(error: unknown, payload: ChatInputSubcommandErrorPayload) {
		return sharedCommandErrorRun(error, this.name, `${payload.command.name}-${payload.matchedSubcommandMapping.name}`);
	}
}
