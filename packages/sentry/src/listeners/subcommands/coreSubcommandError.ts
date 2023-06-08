import { Listener } from '@sapphire/framework';
import { type ChatInputSubcommandErrorPayload, type MessageSubcommandErrorPayload, SubcommandPluginEvents } from '@sapphire/plugin-subcommands';

import { sharedRun } from '../coreCommandError';

export class MessageSubcommandErrorListener extends Listener<typeof SubcommandPluginEvents.MessageSubcommandError> {
	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			event: SubcommandPluginEvents.MessageSubcommandError
		});
	}

	public run(error: unknown, context: MessageSubcommandErrorPayload) {
		return sharedRun(error, this.name, context.command.name);
	}
}

export class ChatInputSubcommandErrorListener extends Listener<typeof SubcommandPluginEvents.ChatInputSubcommandError> {
	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			event: SubcommandPluginEvents.ChatInputSubcommandError
		});
	}

	public run(error: unknown, context: ChatInputSubcommandErrorPayload) {
		return sharedRun(error, this.name, context.command.name);
	}
}
