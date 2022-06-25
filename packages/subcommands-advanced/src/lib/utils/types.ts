import type { container, CommandOptions as SapphireCommandOptions, Command } from '@sapphire/framework';

import type { SlashCommandSubcommandBuilder } from '@discordjs/builders';

/**
 * **Subcommand options**
 *
 * Options to register a command as a subcommand of a parent command.
 *
 * @since 1.0.0
 */
export interface SubcommandOptions {
	registerSubCommand?: {
		parentCommandName: string;
		subcommand:
			| SlashCommandSubcommandBuilder
			| ((subcommandGroup: SlashCommandSubcommandBuilder, Container: typeof container) => SlashCommandSubcommandBuilder);
	};
	registerSubcommmandInGroup?: {
		parentCommandName: string;
		groupName: string;
		subcommand:
			| SlashCommandSubcommandBuilder
			| ((subcommandGroup: SlashCommandSubcommandBuilder, Container: typeof container) => SlashCommandSubcommandBuilder);
	};
}

export type CommandOptions = SubcommandOptions & SapphireCommandOptions;

export interface SubcommandMappingCollection {
	slashCommand: SlashCommandSubcommandBuilder;
	commandPiece: Command;
}
