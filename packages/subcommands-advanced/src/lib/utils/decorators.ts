import { createClassDecorator, createProxy } from '@sapphire/decorators';
import type { Command, container, Piece } from '@sapphire/framework';

import type { SlashCommandSubcommandBuilder } from '@discordjs/builders';

import { analizeSubcommandGroupParsed, analizeSubCommandParsed } from './functions';

export const RegisterSubCommand = (
	parentCommandName: string,
	subcommand:
		| SlashCommandSubcommandBuilder
		| ((subcommandGroup: SlashCommandSubcommandBuilder, Container: typeof container) => SlashCommandSubcommandBuilder)
) => {
	return createClassDecorator((target: typeof Piece) =>
		createProxy(target, {
			construct: (ctor, [context, baseOptions]: [Piece.Context, Piece.Options]) => {
				const ctr = new ctor(context, baseOptions) as unknown as Command;
				return analizeSubCommandParsed(ctr, parentCommandName, subcommand);
			}
		})
	);
};

export const RegisterSubCommandGroup = (
	parentCommandName: string,
	groupName: string,
	subcommand:
		| SlashCommandSubcommandBuilder
		| ((subcommandGroup: SlashCommandSubcommandBuilder, Container: typeof container) => SlashCommandSubcommandBuilder)
) => {
	return createClassDecorator((target: typeof Piece) =>
		createProxy(target, {
			construct: (ctor, [context, baseOptions]: [Piece.Context, Piece.Options]) => {
				const ctr = new ctor(context, baseOptions) as unknown as Command;
				return analizeSubcommandGroupParsed(ctr, parentCommandName, groupName, subcommand);
			}
		})
	);
};
