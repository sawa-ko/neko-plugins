import { Args, Command as SapphireCommand, container } from '@sapphire/framework';
import { Subcommand as SapphirePluginSubcommand } from '@sapphire/plugin-subcommands';

import { RegisterSubcommandsHooks } from '../utils/const';
import { analizeSubcommandGroupParsed, analizeSubCommandParsed, parseSlashSubcommand } from '../utils/functions';

import type { CommandOptions } from '../utils/types';

/**
 * **Command**
 *
 * Command class extended from the original `@sapphire/framework` class that includes the methods to register subcommands based on command class.
 *
 * It is necessary to have a parent command that manages the subcommands configured with the plugin. The name of the parent command must be the same as the one set in the `prentCommandName` option of the command options.
 *
 * When creating the chatInputRun and messageRun methods (both are optional but one of them must always exist) the method will be automatically linked in the subcommand of the parent command.
 *
 * **Register the command as a subcommand in a parent command**
 *
 * To register commands as subcommands of the parent command it is necessary to use the `registerSubCommand` option of the command options.
 *
 * *Parent command*
 *
 * ```typescript
 * import { SubCommand } from '@kaname-png/plugin-subcommands-advanced';
 * import { ApplicationCommandRegistry } from '@sapphire/framework';
 *
 * export class ParentCommand extends SubCommand {
 * 		public constructor(context: Command.Context, options: Command.Options) {
 * 			super(context, {
 * 				...options,
 * 				name: 'utils'
 * 			});
 * 		}
 *
 * 		public override registerApplicationCommands(interaction: ApplicationCommandRegistry) {
 * 			registry.registerChatInputCommand(
 *				(ctx) => {
 *					// It is necessary to call this hook and pass the builder context to register the subcommands stored in the subcommand register in the parent command.
 *					this.hooks.subcommands(this, ctx);
 *
 *					return ctx
 *						.setName(this.name)
 *						.setDescription('Parent command of utils subcommands)
 *				}
 *			);
 * 		}
 * }
 * ```
 *
 * *With Typescript*
 * ```typescript
 * import { SubCommand } from '@kaname-png/plugin-subcommands-advanced'
 *
 * export class UtilsCommand extends SubCommand {
 * 		public constructor(context: Command.Context, options: Command.Options) {
 * 			super(context, {
 * 				...options,
 * 				registerSubCommand: {
 * 					parentCommandName: 'utils', // Name of the parent command (parent.js).
 * 					subcommand: (builder) => builder.setName('ping').setDescription('Hi!') // Builder that will be embedded in the registry of the parent command.
 * 				}
 * 			});
 * 		}
 *
 * 		public override chatInputRun(interaction: Command.ChatInputInteraction) {
 * 			return interaction.reply('uwu');
 * 		}
 * }
 * ```
 *
 * *With JavaScript*
 *
 * ```javascript
 * import { Command } from '@kaname-png/plugin-subcommands-advanced'
 *
 * export class UtilsCommand extends Command {
 * 		constructor(context, options) {
 * 			super(context, {
 * 				...options,
 * 				registerSubCommand: {
 * 					parentCommandName: 'utils', // Name of the parent command (parent.js).
 * 					subcommand: (builder) => builder.setName('ping').setDescription('Hi!') // Builder that will be embedded in the registry of the parent command.
 * 				}
 * 			});
 * 		}
 *
 * 		chatInputRun(interaction) {
 * 			return interaction.reply('uwu');
 * 		}
 * }
 * ```
 *
 * **Register a command as a subcommand of a group of subcommands of the parent command**
 *
 * To register commands as group subcommands it is important to first register the groups to be used in the main command.
 *
 * *Parent command*
 *
 * ```typescript
 * import { SubCommand } from '@kaname-png/plugin-subcommands-advanced';
 * import { ApplicationCommandRegistry } from '@sapphire/framework';
 *
 * export class ParentCommand extends SubCommand {
 * 		public constructor(context: Command.Context, options: Command.Options) {
 * 			super(context, {
 * 				...options,
 * 				name: 'utils'
 * 			});
 * 		}
 *
 * 		public override registerApplicationCommands(interaction: ApplicationCommandRegistry) {
 * 			registry.registerChatInputCommand(
 *				(ctx) => {
 *					// First it is necessary to register the subcommand groups in the context of the constructor.
 *					ctx.addSubcommandGroup((sc) =>
 *						sc
 *							.setName('poll')
 *							.setDescription('Make awesome polls!')
 *					);
 *
 *					// It is necessary to call this hook and pass the constructor context to register the subcommands stored in the subcommand registry in the subcommand groups of the parent command.
 *					this.hooks.groups(this, ctx);
 *
 *					return ctx
 *						.setName(this.name)
 *						.setDescription('Parent command of utils subcommands)
 *				}
 *			);
 * 		}
 * }
 * ```
 *
 * *With Typescript*
 *
 * ```typescript
 * import { Command } from '@kaname-png/plugin-subcommands-advanced'
 *
 * export class PollCreateCommand extends Command {
 * 		public constructor(context: Command.Context, options: Command.Options) {
 * 			super(context, {
 * 				...options,
 * 				registerSubCommand: {
 * 					parentCommandName: 'utils', // Name of the parent command (parent.js).
 * 					groupName: 'poll', // Name of the group that was registered in the builder context of the parent command.
 * 					subcommand: (builder) => builder.setName('create').setDescription('Create a poll') // Builder that will be embedded in the registry of the parent command.
 * 				}
 * 			});
 * 		}
 *
 * 		public override chatInputRun(interaction: Command.ChatInputInteraction) {
 * 			return interaction.reply('uwu');
 * 		}
 * }
 * ```
 *
 * *With JavaScript*
 *
 * ```javascript
 * import { Command } from '@kaname-png/plugin-subcommands-advanced'
 *
 * export class PollCreateCommand extends Command {
 * 		constructor(context, options) {
 * 			super(context, {
 * 				...options,
 * 				registerSubCommand: {
 * 					parentCommandName: 'utils', // Name of the parent command (parent.js).
 * 					groupName: 'poll', // Name of the group that was registered in the builder context of the parent command.
 * 					subcommand: (builder) => builder.setName('create').setDescription('Create a poll') // Builder that will be embedded in the registry of the parent command.
 * 				}
 * 			});
 * 		}
 *
 * 		chatInputRun(interaction) {
 * 			return interaction.reply('uwu');
 * 		}
 * }
 * ```
 *
 * That's it, the plugin will take care of configuring everything so that when the subcommand of the parent command is called, the linked command is executed.
 *
 * @since 1.0.0
 */
export class Command<PreParseReturn extends Args = Args> extends SapphireCommand<PreParseReturn, SapphireCommand.Options & CommandOptions> {
	public constructor(context: SapphireCommand.LoaderContext, options: SapphireCommand.Options & CommandOptions) {
		let nameCommand = options.name;

		if (options.registerSubCommand && container.client.options.subcommandsAdvanced?.nameCommandsAutogenerated === true) {
			const slashSubcommandParsed = parseSlashSubcommand(options.registerSubCommand.slashSubcommand);
			nameCommand = `${options.registerSubCommand.parentCommandName}/${slashSubcommandParsed.name}`;
		}

		if (options.registerSubcommmandInGroup && container.client.options.subcommandsAdvanced?.nameCommandsAutogenerated === true) {
			const slashSubcommandParsed = parseSlashSubcommand(options.registerSubcommmandInGroup.slashSubcommand);
			nameCommand = `${options.registerSubcommmandInGroup.parentCommandName}/${options.registerSubcommmandInGroup.groupName}/${slashSubcommandParsed.name}`;
		}

		super(context, { ...options, name: nameCommand });

		if (this.options.registerSubCommand) {
			const { parentCommandName, slashSubcommand } = this.options.registerSubCommand;
			analizeSubCommandParsed(this, parentCommandName, slashSubcommand);
		}

		if (this.options.registerSubcommmandInGroup) {
			const { parentCommandName, groupName, slashSubcommand } = this.options.registerSubcommmandInGroup;
			analizeSubcommandGroupParsed(this, parentCommandName, groupName, slashSubcommand);
		}
	}
}

/**
 * **Parent command**
 *
 * Subcommand class that extends the original subcommand plugin class and incorporates the hooks into the class for ease of use.
 *
 * The parent command is important because it is where the subcommands and subcommand group will be registered and is necessary for `@sapphire/framework` to know what to do with the subcommands.
 *
 * *TypeScript*
 *
 * ```typescript
 * import { Subcommand } from '@kaname-png/plugin-subcommands-advanced';
 * import { ApplicationCommandRegistry } from '@sapphire/framework';
 *
 * export class ParentCommand extends Subcommand {
 * 		public constructor(context: Command.Context, options: Command.Options) {
 * 			super(context, {
 * 				...options,
 * 				name: 'utils'
 * 			});
 * 		}
 *
 * 		public override registerApplicationCommands(interaction: ApplicationCommandRegistry) {
 * 			registry.registerChatInputCommand(
 *				(ctx) => {
 *					// If you want to link commands in groups of subcommands you first need to register them in the builder context of the parent command.
 *					ctx.addSubcommandGroup((sc) =>
 *						sc
 *							.setName('poll')
 *							.setDescription('Make awesome polls!')
 *					);
 *
 *					// It is necessary to call this hook and pass the constructor context to register the subcommands stored in the subcommand registry in the subcommand groups of the parent command.
 *					this.hooks.groups(this, ctx);
 *
 *					// It is necessary to call this hook and pass the builder context to register the subcommands stored in the subcommand register in the parent command.
 *					this.hooks.subcommands(this, ctx);
 *
 * 					// Calling both hooks is only necessary if required, it is not mandatory.
 *					return ctx
 *						.setName(this.name)
 *						.setDescription('Parent command of utils subcommands)
 *				}
 *			);
 * 		}
 * }
 * ```
 *
 * *JavaScript*
 *
 * ```javascript
 * import { Subcommand } from '@kaname-png/plugin-subcommands-advanced';
 *
 * export class ParentCommand extends Subcommand {
 * 		public constructor(context, options) {
 * 			super(context, {
 * 				...options,
 * 				name: 'utils'
 * 			});
 * 		}
 *
 * 		public override registerApplicationCommands(interaction) {
 * 			registry.registerChatInputCommand(
 *				(ctx) => {
 *					// If you want to link commands in groups of subcommands you first need to register them in the builder context of the parent command.
 *					ctx.addSubcommandGroup((sc) =>
 *						sc
 *							.setName('poll')
 *							.setDescription('Make awesome polls!')
 *					);
 *
 *					// It is necessary to call this hook and pass the constructor context to register the subcommands stored in the subcommand registry in the subcommand groups of the parent command.
 *					this.hooks.groups(this, ctx);
 *
 *					// It is necessary to call this hook and pass the builder context to register the subcommands stored in the subcommand register in the parent command.
 *					this.hooks.subcommands(this, ctx);
 *
 * 					// Calling both hooks is only necessary if required, it is not mandatory.
 *					return ctx
 *						.setName(this.name)
 *						.setDescription('Parent command of utils subcommands)
 *				}
 *			);
 * 		}
 * }
 * ```
 *
 * @since 1.0.0
 */
export class Subcommand extends SapphirePluginSubcommand {
	public hooks = RegisterSubcommandsHooks;
}
