import { SubcommandPluginEvents, type MessageSubcommandErrorPayload } from '@sapphire/plugin-subcommands';
import { SentryListener } from '../../lib/structures/SentryListener';
import { sharedCommandErrorRun } from '../../listeners/commandError/_shared';

export class PluginSentryListener extends SentryListener<typeof SubcommandPluginEvents.MessageSubcommandError> {
	public constructor(context: SentryListener.Context, options: SentryListener.Options) {
		super(context, {
			...options,
			name: 'PluginSentryChatInputSubcommandError',
			event: SubcommandPluginEvents.MessageSubcommandError
		});
	}

	public run(error: unknown, payload: MessageSubcommandErrorPayload) {
		return sharedCommandErrorRun(error, this.name, `${payload.command.name}-${payload.matchedSubcommandMapping.name}`);
	}
}
