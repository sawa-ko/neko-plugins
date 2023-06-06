import {
	type AutocompleteInteractionPayload,
	type ChatInputCommandErrorPayload,
	type ContextMenuCommandErrorPayload,
	Events,
	Listener,
	type MessageCommandErrorPayload
} from '@sapphire/framework';
import { type ChatInputSubcommandErrorPayload, type MessageSubcommandErrorPayload, SubcommandPluginEvents } from '@sapphire/plugin-subcommands';
import * as Sentry from '@sentry/node';
import { SentryListener } from '../lib/structures/listener';

export class MessageCommandErrorListener extends SentryListener<typeof Events.MessageCommandError> {
	public constructor(context: Listener.Context, options: SentryListener.Options) {
		super(context, { ...options, event: Events.MessageCommandError });
	}

	public run(error: unknown, context: MessageCommandErrorPayload) {
		return sharedRun(error, this.name, context.command.name);
	}
}

export class ChatInputCommandErrorListener extends SentryListener<typeof Events.ChatInputCommandError> {
	public constructor(context: Listener.Context, options: SentryListener.Options) {
		super(context, { ...options, event: Events.ChatInputCommandError });
	}

	public run(error: unknown, context: ChatInputCommandErrorPayload) {
		return sharedRun(error, this.name, context.command.name);
	}
}

export class ContextMenuCommandErrorListener extends SentryListener<typeof Events.ContextMenuCommandError> {
	public constructor(context: Listener.Context, options: SentryListener.Options) {
		super(context, { ...options, event: Events.ContextMenuCommandError });
	}

	public run(error: unknown, context: ContextMenuCommandErrorPayload) {
		return sharedRun(error, this.name, context.command.name);
	}
}

export class AutocompleteCommandErrorListener extends SentryListener<typeof Events.CommandAutocompleteInteractionError> {
	public constructor(context: Listener.Context, options: SentryListener.Options) {
		super(context, { ...options, event: Events.CommandAutocompleteInteractionError });
	}

	public run(error: unknown, context: AutocompleteInteractionPayload) {
		return sharedRun(error, this.name, context.command.name);
	}
}

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

export function sharedRun(error: unknown, name: string, commandName: string) {
	return Sentry.captureException(error, { level: 'error', tags: { event: name }, extra: { command: commandName } });
}
