/**
 * **Events**
 *
 * Names of events that will be called when a subcommand does not comply with the preconditions established in the command options.
 * These events are specific to the plugin.
 *
 * @since 1.0.0
 */
export const AdvancedSubcommandsEvents = {
	ChatInputSubcommandDenied: 'chatInputSubcommandDenied' as const,
	MessageSubcommandDenied: 'messageSubcommandDenied' as const
};

import type { UserError } from '@sapphire/framework';
import type {
	ChatInputSubcommandDeniedPayload,
	IChatInputSubcommandPayload,
	IMessageSubcommandPayload,
	MessageSubcommandDeniedPayload,
	SubcommandMappingMethod
} from '@sapphire/plugin-subcommands';

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
		[AdvancedSubcommandsEvents.ChatInputSubcommandDenied]: [error: UserError, payload: ChatInputSubcommandDeniedPayload];
		[AdvancedSubcommandsEvents.MessageSubcommandDenied]: [error: UserError, payload: MessageSubcommandDeniedPayload];
	}
}

export { subCommandsRegistry, subCommandsGroupRegistry } from './lib/utils/functions';
export * from './lib/structures/command';
export * from './lib/utils/const';
export * from './lib/utils/types';
export * from './lib/utils/decorators';
