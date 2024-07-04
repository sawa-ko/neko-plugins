import { container, UserError, type ChatInputCommand, type MessageCommand } from '@sapphire/framework';
import type { Subcommand, SubcommandMapping, SubcommandMappingGroup } from '@sapphire/plugin-subcommands';

import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import type { SlashCommandSubcommandBuilder, SlashCommandBuilder } from '@discordjs/builders';

import { subCommandsRegistry, subCommandsGroupRegistry } from './functions';
import { SubcommandsAdvancedEvents } from './types';

/**
 * **Hooks**
 *
 * Methods needed to register commands as subcommands and commands in subcommand groups.
 *
 * @since 1.0.0
 */
export const RegisterSubcommandsHooks = {
	subcommands: (piece: Subcommand, context: SlashCommandBuilder) => {
		const subcommands = subCommandsRegistry.get(piece.name);
		if (!subcommands) {
			container.logger.error(
				`[Subcommands-Plugin]: An attempt was made to obtain the subcommands for the parent command ${piece.name} but no command was registered for it.`
			);

			return;
		}

		for (const { slashCommand, messageSubCommand, commandPiece } of subcommands.values()) {
			if (slashCommand) {
				context.options.push(slashCommand);
			}

			const subcommand: SubcommandMapping = {
				name: slashCommand?.name ?? messageSubCommand ?? '',
				type: 'method',
				chatInputRun: commandPiece.chatInputRun
					? async (i, c) => {
							const result = await piece.preconditions.chatInputRun(i, piece as unknown as ChatInputCommand);
							if (result.isErr()) {
								return piece.container.client.emit(
									SubcommandsAdvancedEvents.ChatInputSubcommandDenied as any,
									result.err().unwrapOr(new UserError({ context, identifier: 'SubcommandDenied', message: 'Unknown error' })),
									{
										command: piece,
										interaction: i,
										subcommand: subcommand as any,
										matchedSubcommandMapping: commandPiece.name,
										context
									}
								);
							}

							return commandPiece.chatInputRun!(i, c);
						}
					: undefined,

				messageRun: commandPiece.messageRun
					? async (m, a, c) => {
							const result = await piece.preconditions.messageRun(m, piece as unknown as MessageCommand);
							if (result.isErr()) {
								return piece.container.client.emit(
									SubcommandsAdvancedEvents.MessageSubcommandDenied as any,
									result.err().unwrapOr(new UserError({ context, identifier: 'SubcommandDenied', message: 'Unknown error' })),
									{
										command: piece,
										message: m,
										subcommand: subcommand as any,
										matchedSubcommandMapping: commandPiece.name,
										context
									}
								);
							}

							return commandPiece.messageRun!(m, a, c);
						}
					: undefined
			};

			piece.parsedSubcommandMappings.push(subcommand);
		}
	},
	groups: (piece: Subcommand, context: SlashCommandBuilder) => {
		const subcommandsGroups = subCommandsGroupRegistry.get(piece.name);
		if (!subcommandsGroups) {
			container.logger.error(
				`[Subcommands-Group-Plugin]: An attempt was made to obtain the subcommand groups for the parent command ${piece.name} but no command was registered for it.`
			);

			return;
		}

		for (const [name, commands] of subcommandsGroups) {
			for (const { slashCommand, messageSubCommand, commandPiece } of [...commands.values()]) {
				const groupMapping = piece.parsedSubcommandMappings.find(
					({ name: x, type }) => x === name && type === 'group'
				) as SubcommandMappingGroup;

				const subcommand: SubcommandMapping = {
					name: slashCommand?.name ?? messageSubCommand ?? '',
					type: 'method',
					chatInputRun: commandPiece.chatInputRun
						? async (i, c) => {
								const result = await piece.preconditions.chatInputRun(i, piece as unknown as ChatInputCommand);
								if (result.isErr()) {
									return piece.container.client.emit(
										SubcommandsAdvancedEvents.ChatInputSubcommandDenied as any,
										result.err().unwrapOr(new UserError({ context, identifier: 'SubcommandDenied', message: 'Unknown error' })),
										{
											command: piece,
											interaction: i,
											subcommand: subcommand as any,
											matchedSubcommandMapping: commandPiece.name,
											context
										}
									);
								}

								return commandPiece.chatInputRun!(i, c);
							}
						: undefined,

					messageRun: commandPiece.messageRun
						? async (m, a, c) => {
								const result = await piece.preconditions.messageRun(m, piece as unknown as MessageCommand);
								if (result.isErr()) {
									return piece.container.client.emit(
										SubcommandsAdvancedEvents.MessageSubcommandDenied as any,
										result.err().unwrapOr(new UserError({ context, identifier: 'SubcommandDenied', message: 'Unknown error' })),
										{
											command: piece,
											message: m,
											subcommand: subcommand as any,
											matchedSubcommandMapping: commandPiece.name,
											context
										}
									);
								}

								return commandPiece.messageRun!(m, a, c);
							}
						: undefined
				};

				if (groupMapping) groupMapping.entries.push(subcommand);
				else {
					piece.parsedSubcommandMappings.push({
						name,
						type: 'group',
						entries: [subcommand]
					});
				}
			}

			for (const option of context.options) {
				const data = option.toJSON();
				if (data.name === name && data.type === ApplicationCommandOptionType.SubcommandGroup) {
					(option as unknown as { options: SlashCommandSubcommandBuilder[] }).options?.push(
						...[...commands.values()].filter(({ slashCommand }) => slashCommand).map(({ slashCommand }) => slashCommand!)
					);
				}
			}
		}
	}
};
