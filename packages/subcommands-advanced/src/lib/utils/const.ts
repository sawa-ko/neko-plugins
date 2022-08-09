import { container, PreconditionContainerArray } from '@sapphire/framework';
import type { Subcommand, SubcommandMapping, SubcommandMappingGroup } from '@sapphire/plugin-subcommands';

import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import type { SlashCommandSubcommandBuilder, SlashCommandBuilder } from '@discordjs/builders';

import { subCommandsRegistry, subCommandsGroupRegistry } from './functions';
import { SubcommandsAdvancedEvents } from '../../index';

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
				`[Subcommands-Plugin]: An attempt was made to obtain the subcommands for the parent command ${piece.name} but none were registered with the decorators.`
			);

			return;
		}

		for (const { slashCommand, commandPiece } of subcommands.values()) {
			context.options.push(slashCommand);

			const subcommand: SubcommandMapping = {
				name: slashCommand.name,
				type: 'method',
				chatInputRun: commandPiece.chatInputRun
					? async (i, c) => {
							const preconditions = new PreconditionContainerArray(commandPiece.options.preconditions);
							const result = await preconditions.chatInputRun(i, piece);
							if (result.isErr())
								return piece.container.client.emit(SubcommandsAdvancedEvents.ChatInputSubcommandDenied, result.err().unwrap(), {
									command: piece,
									interaction: i,
									subcommand: subcommand as any
								});

							return commandPiece.chatInputRun!(i, c);
					  }
					: undefined

				// Support for message commands coming soon
				/* 				messageRun: commandPiece.chatInputRun
					? async (m, a, c) => {
							const preconditions = new PreconditionContainerArray(commandPiece.options.preconditions);
							const result = await preconditions.messageRun(m, piece, c);
							if (!result.success)
								return piece.container.client.emit(AdvancedSubcommandsEvents.MessageSubcommandDenied, result.error, {
									command: piece,
									message: m,
									subcommand: subcommand as any
								});

							return commandPiece.messageRun!(m, a, c);
					  }
					: undefined */
			};

			piece.parsedSubcommandMappings.push(subcommand);
		}
	},
	groups: (piece: Subcommand, context: SlashCommandBuilder) => {
		const subcommandsGroups = subCommandsGroupRegistry.get(piece.name);
		if (!subcommandsGroups) {
			container.logger.error(
				`[Subcommands-Group-Plugin]: An attempt was made to obtain the subcommand groups for the parent command ${piece.name} but none were registered with the decorators.`
			);

			return;
		}

		for (const [name, commands] of subcommandsGroups) {
			for (const { slashCommand, commandPiece } of [...commands.values()]) {
				const groupMapping = piece.parsedSubcommandMappings.find(
					({ name: x, type }) => x === name && type === 'group'
				) as SubcommandMappingGroup;

				const subcommand: SubcommandMapping = {
					name: slashCommand.name,
					type: 'method',
					chatInputRun: commandPiece.chatInputRun
						? async (i, c) => {
								const preconditions = new PreconditionContainerArray(commandPiece.options.preconditions);
								const result = await preconditions.chatInputRun(i, piece);
								if (!result.isErr())
									return piece.container.client.emit(SubcommandsAdvancedEvents.ChatInputSubcommandDenied, result.err().unwrap(), {
										command: piece,
										interaction: i,
										subcommand: subcommand as any
									});

								return commandPiece.chatInputRun!(i, c);
						  }
						: undefined

					// Support for message commands coming soon
					/* 					messageRun: commandPiece.chatInputRun
						? async (m, a, c) => {
								const preconditions = new PreconditionContainerArray(commandPiece.options.preconditions);
								const result = await preconditions.messageRun(m, piece, c);
								if (!result.success)
									return piece.container.client.emit(AdvancedSubcommandsEvents.MessageSubcommandDenied, result.error, {
										command: piece,
										message: m,
										subcommand: subcommand as any
									});

								return commandPiece.messageRun!(m, a, c);
						  }
						: undefined */
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
						...[...commands.values()].map(({ slashCommand }) => slashCommand)
					);
				}
			}
		}
	}
};
