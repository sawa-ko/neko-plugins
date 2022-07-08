import type { UserError } from '@sapphire/framework';
import type {
	IMessageSubcommandPayload,
	SubcommandMappingMethod,
	IChatInputSubcommandPayload,
	ChatInputSubcommandDeniedPayload,
	MessageSubcommandDeniedPayload
} from '@sapphire/plugin-subcommands';

import type { SubcommandsAdvancedEvents, PluginSubcommandOptions } from './lib/utils/types';

import './index';

declare module '@sapphire/plugin-subcommands' {
	export interface MessageSubcommandDeniedPayload extends IMessageSubcommandPayload {
		subcommand: SubcommandMappingMethod;
	}

	export interface ChatInputSubcommandDeniedPayload extends IChatInputSubcommandPayload {
		subcommand: SubcommandMappingMethod;
	}
}

declare module 'discord.js' {
	interface ClientEvents {
		[SubcommandsAdvancedEvents.ChatInputSubcommandDenied]: [error: UserError, payload: ChatInputSubcommandDeniedPayload];
		[SubcommandsAdvancedEvents.MessageSubcommandDenied]: [error: UserError, payload: MessageSubcommandDeniedPayload];
	}

	interface ClientOptions {
		subcommandsAdvanced?: PluginSubcommandOptions;
	}
}
