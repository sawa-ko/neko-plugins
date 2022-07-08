import { Command, container } from '@sapphire/framework';
import type { Subcommand, SubcommandMappingGroup, SubcommandMappingMethod } from '@sapphire/plugin-subcommands';

import { Collection } from 'discord.js';
import { SlashCommandSubcommandBuilder } from '@discordjs/builders';

import type { SubcommandMappingCollection } from './types';

/**
 * **Registry**
 *
 * Subcommands registry.
 *
 * @since 1.0.0
 */
export const subCommandsRegistry: Collection<string, Collection<string, SubcommandMappingCollection>> = new Collection();

/**
 * **Registry**
 *
 * Subcommands group registry.
 *
 * @since 1.0.0
 */
export const subCommandsGroupRegistry: Collection<string, Collection<string, Collection<string, SubcommandMappingCollection>>> = new Collection();

/**
 * **Subcommands compare**
 *
 * Compare two subcommand builders.
 *
 * @param c1 SubcommandBuilder 1
 * @param c2 SubcommandBuilder 2
 * @returns boolean
 * @since 1.0.0
 */
export const isCommandOptionsUpdated = (c1: SlashCommandSubcommandBuilder, c2: SlashCommandSubcommandBuilder) =>
	JSON.stringify(c1.toJSON()) !== JSON.stringify(c2.toJSON());
/**
 * Parse slash subcommand option
 * @param subcommand subcommand json or subcommand builder class.
 * @returns subcommand builder
 *
 * @since 2.0.0
 */
export const parseSlashSubcommand = (
	subcommand:
		| SlashCommandSubcommandBuilder
		| ((subcommandGroup: SlashCommandSubcommandBuilder, Container: typeof container) => SlashCommandSubcommandBuilder)
) => (typeof subcommand === 'function' ? subcommand(new SlashCommandSubcommandBuilder(), container) : subcommand);

/**
 * **Register subcommands in subcommands registry**
 *
 * Method that parses and registers subcommands in parent commands.
 *
 * @param piece Class of the command to be used as a subcommand of the parent command.
 * @param parentCommandName Name of the parent command.
 * @param subcommand Builder of the subcommand to be analyzed in the subcommand register.
 * @returns	Command class
 * @since 1.0.0
 */
export const analizeSubCommandParsed = (
	piece: Command,
	parentCommandName: string,
	subcommand:
		| SlashCommandSubcommandBuilder
		| ((subcommandGroup: SlashCommandSubcommandBuilder, Container: typeof container) => SlashCommandSubcommandBuilder)
) => {
	const subcommandParsed = parseSlashSubcommand(subcommand);
	const subcommandsRegistry = subCommandsRegistry.get(parentCommandName);

	if (!subcommandsRegistry) {
		subCommandsRegistry.set(
			parentCommandName,
			new Collection<string, SubcommandMappingCollection>().set(subcommandParsed.name, {
				slashCommand: subcommandParsed,
				commandPiece: piece
			})
		);

		container.logger.debug(
			`[Subcommands-Plugin]: The parent command "${parentCommandName}" has been registered and the subcommand "${subcommandParsed.name}" has been registered.`
		);

		return piece;
	}

	const command = subcommandsRegistry.get(subcommandParsed.name);
	if (!command) {
		subcommandsRegistry.set(subcommandParsed.name, { slashCommand: subcommandParsed, commandPiece: piece });
		container.logger.debug(
			`[Subcommands-Plugin]: The subcommand "${subcommandParsed.name}" has been registered in the parent command "${parentCommandName}".`
		);

		return piece;
	}

	const commandsCompare = isCommandOptionsUpdated(command.slashCommand, subcommandParsed);
	subcommandsRegistry.delete(subcommandParsed.name);
	subcommandsRegistry.set(subcommandParsed.name, { slashCommand: subcommandParsed, commandPiece: piece });
	container.logger.debug(
		`[Subcommands-Plugin]: The subcommand "${subcommandParsed.name}" has been updated in the parent command ${parentCommandName} ${
			commandsCompare ? 'with new options' : 'without new options'
		}.`
	);

	const parentCommand = container.stores.get('commands').get(parentCommandName) as Subcommand | undefined;
	if (parentCommand) {
		if (!parentCommand?.parsedSubcommandMappings) {
			container.logger.error(
				`[Subcommands-Plugin]: The parent command ${parentCommandName} possibly does not extend the plugin Subcommand class because the "parsedSubcommandMappings" property was not found in the parent command required for the subcommand ${subcommandParsed.name}.`
			);
			return piece;
		}

		if (commandsCompare) void parentCommand.reload();

		const subcommand = parentCommand.parsedSubcommandMappings.find(
			(s) => s.name === subcommandParsed.name && s.type === 'method'
		) as unknown as SubcommandMappingMethod;

		if (subcommand) {
			if (piece.chatInputRun) subcommand.chatInputRun = (i, c) => piece.chatInputRun!(i, c);

			// TODO: Support for message commands coming soon
			// if (piece.messageRun) subcommand.messageRun = (m, a, c) => piece.messageRun!(m, a, c);
		}
	} else {
		container.logger.warn(
			`[Subcommands-Plugin]: Could not get information from the parent command ${parentCommandName} for the subcommand ${subcommandParsed.name}.`
		);
	}

	return piece;
};

/**
 * **Register subcommands in subcommands group registry**
 *
 * Method that parses and registers subcommands in parent commands.
 *
 * @param piece Class of the command to be used as a subcommand of the parent command.
 * @param parentCommandName Name of the parent command.
 * @param groupName Name of the subcommand group.
 * @param subcommand Builder of the subcommand to be analyzed in the subcommand register.
 * @returns	Command class
 * @since 1.0.0
 */
export const analizeSubcommandGroupParsed = (
	piece: Command,
	parentCommandName: string,
	groupName: string,
	subcommand:
		| SlashCommandSubcommandBuilder
		| ((subcommandGroup: SlashCommandSubcommandBuilder, Container: typeof container) => SlashCommandSubcommandBuilder)
) => {
	const subcommandParsed = parseSlashSubcommand(subcommand);
	const subcommandsGroup = subCommandsGroupRegistry.get(parentCommandName);

	if (!subcommandsGroup) {
		subCommandsGroupRegistry.set(
			parentCommandName,
			new Collection<string, Collection<string, SubcommandMappingCollection>>().set(
				groupName,
				new Collection<string, SubcommandMappingCollection>().set(subcommandParsed.name, {
					slashCommand: subcommandParsed,
					commandPiece: piece
				})
			)
		);

		container.logger.debug(
			`[Subcommands-Group-Plugin]: The parent command "${parentCommandName}" has been registered and the group "${groupName}" has been created with the registered "${subcommandParsed.name}" command.`
		);

		return piece;
	}

	const group = subcommandsGroup.get(groupName);
	if (!group) {
		subcommandsGroup.set(
			groupName,
			new Collection<string, SubcommandMappingCollection>().set(subcommandParsed.name, {
				slashCommand: subcommandParsed,
				commandPiece: piece
			})
		);
		container.logger.debug(
			`[Subcommands-Group-Plugin]: The group "${groupName}" has been registered with the command ${subcommandParsed.name} registered in the parent command "${parentCommandName}".`
		);

		return piece;
	}

	const commandGroup = group.get(subcommandParsed.name);
	if (!commandGroup) {
		group.set(subcommandParsed.name, { slashCommand: subcommandParsed, commandPiece: piece });
		container.logger.debug(
			`[Subcommands-Group-Plugin]: The command "${subcommandParsed.name}" has been registered in the group "${groupName}" of the parent command "${parentCommandName}".`
		);

		return piece;
	}

	const commandsGroupCompare = isCommandOptionsUpdated(commandGroup.slashCommand, subcommandParsed);
	group.delete(commandGroup.slashCommand.name);
	group.set(subcommandParsed.name, { slashCommand: subcommandParsed, commandPiece: piece });

	container.logger.debug(
		`[Subcommands-Group-Plugin]: The command ${
			subcommandParsed.name
		} has been updated in the group "${groupName}" of the parent command "${parentCommandName}" ${
			commandsGroupCompare ? 'with new options' : 'without new options'
		}.`
	);

	const parentCommand = container.stores.get('commands').get(parentCommandName) as Subcommand | undefined;
	if (parentCommand) {
		if (!parentCommand?.parsedSubcommandMappings) {
			container.logger.error(
				`[Subcommands-Group-Plugin]: The parent command ${parentCommandName} possibly does not extend the plugin Subcommand class because the "parsedSubcommandMappings" property was not found in the parent command required for the subcommand ${subcommandParsed.name} of the subcommand group ${groupName}.`
			);
			return piece;
		}

		if (commandsGroupCompare) void parentCommand.reload();

		const subcommandGroup = parentCommand.parsedSubcommandMappings.find(
			(s) => s.name === groupName && s.type === 'group'
		) as unknown as SubcommandMappingGroup;

		if (subcommandGroup) {
			const subcommand = subcommandGroup.entries.find((s) => s.name === subcommandParsed.name && s.type === 'method');
			if (subcommand) {
				if (piece.chatInputRun) subcommand.chatInputRun = (i, c) => piece.chatInputRun!(i, c);

				// TODO: Support for message commands coming soon
				// if (piece.messageRun) subcommand.messageRun = (m, a, c) => piece.messageRun!(m, a, c);
			}
		}
	} else {
		container.logger.warn(
			`[Subcommands-Group-Plugin]: Could not get information from the parent command ${parentCommandName} for the subcommand ${subcommandParsed.name} of the subcommand group ${groupName}.`
		);
	}

	return piece;
};
