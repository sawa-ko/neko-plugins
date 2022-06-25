<div align="center">

![Neko Plugins Logo](https://raw.githubusercontent.com/kaname-png/neko-plugins/main/assets/logo.png)

# @kaname-png/plugin-subcommands-advanced

**Plugin for <a href="https://github.com/sapphiredev/framework">@sapphire/framework</a> to be able to create subcommands based on command classes.**

[![GitHub](https://img.shields.io/github/license/kaname-png/neko-plugins)](https://github.com/kaname-png/neko-plugins/blob/main/LICENSE.md)
[![codecov](https://codecov.io/gh/kaname-png/neko-plugins/branch/main/graph/badge.svg?token=7B0AVB4YG6)](https://codecov.io/gh/kaname-png/neko-plugins)
[![npm (scoped)](https://img.shields.io/npm/v/@kaname-png/plugin-subcommands-advanced?color=crimson&logo=npm)](https://www.npmjs.com/package/@kaname-png/plugin-subcommands-advanced)
[![npm](https://img.shields.io/npm/dt/@kaname-png/plugin-subcommands-advanced?color=crimson&logo=npm)](https://www.npmjs.com/package/@kaname-png/plugin-subcommands-advanced)

</div>

## Description

This plugin allows you to manage the subcommands of a parent command based on the classes of the commands in a simple way.

Currently the problem with the original subcommand plugin is that you have to put all the methods of the subcommands in the same class of the parent command, which can be a problem if the parent command has many subcommands or subcommand groups.

This plugin allows you to modularize the subcommands of a parent command into several command classes and also allows you to use different preconditions on each subcommand.

<div align="center">

| Support for message commands coming soon |
| ---------------------------------------- |

</div>

## Features

-   Fully ready for TypeScript!
-   Includes ESM ready entrypoint
-   Easy to use
-   Support for preconditions.
-   Based on command class.
-   Everything included in the original subcommand plugin.

## Installation

`@kaname-png/plugin-subcommands-advanced` depends on the following packages. Be sure to install these along with this package!

-   [`@sapphire/framework@next`](https://www.npmjs.com/package/@sapphire/framework) (Temporarily)
-   [`@sapphire/plugin-subcommands@pr-271`](https://github.com/sapphiredev/plugins/pull/271) (Temporarily)

You can use the following command to install this package, or replace `npm install` with your package manager of choice.

```sh
npm install @sapphire/framework@next @sapphire/plugin-subcommands@pr-271 @kaname-png/plugin-subcommands-advanced
```

---

## Usage

For a good user experience (UX), it is necessary to follow the following file structure. The directory order is not required, but is recommended.

```typescript
commands
└── utils
    ├── parent.js // Parent command of the subcommand and subcommand groups.

    ├── ping.js // Subcommand of the parent command.

    └── poll // Subcommand group name.
        └── create.js // Subcommand of the poll subcommand group.
```

## Parent Command

The parent command is important because it is where the subcommands and subcommand group will be registered and is necessary for `@sapphire/framework` to know what to do with the subcommands.

### TypeScript

```typescript
import { Subcommand } from '@kaname-png/plugin-subcommands-advanced';
import { ApplicationCommandRegistry } from '@sapphire/framework';

export class ParentCommand extends Subcommand {
 	public constructor(context: Command.Context, options: Command.Options) {
 		super(context, {
 			...options,
 			name: 'utils',
			preconditions: [] // The preconditions set here affect all subcommands.
 		});
 	}

 	public override registerApplicationCommands(interaction: ApplicationCommandRegistry) {
 		registry.registerChatInputCommand(
			(ctx) => {
				// If you want to link commands in groups of subcommands you first need to register them in the builder context of the parent command.
				ctx.addSubcommandGroup((sc) =>
					sc
						.setName('poll')
						.setDescription('Make awesome polls!')
				);

				// It is necessary to call this hook and pass the builder context to register the subcommands stored in the subcommand registry in the subcommand groups of the parent command.
				this.hooks.groups(this, ctx);

				// It is necessary to call this hook and pass the builder context to register the subcommands stored in the subcommand register in the parent command.
				this.hooks.subcommands(this, ctx);

 				// Calling both hooks is only necessary if required, it is not mandatory.
				return ctx
					.setName(this.name)
					.setDescription('Parent command of utils subcommands)
			}
		);
 	}
}
```

### JavaScript

```javascript
import { Subcommand } from '@kaname-png/plugin-subcommands-advanced';

export class ParentCommand extends Subcommand {
 	constructor(context, options) {
 		super(context, {
 			...options,
 			name: 'utils',
			preconditions: [] // The preconditions set here affect all subcommands.
 		});
 	}

 	registerApplicationCommands(interaction) {
 		registry.registerChatInputCommand(
			(ctx) => {
				// If you want to link commands in groups of subcommands you first need to register them in the builder context of the parent command.
				ctx.addSubcommandGroup((sc) =>
					sc
						.setName('poll')
						.setDescription('Make awesome polls!')
				);

				// It is necessary to call this hook and pass the builder context to register the subcommands stored in the subcommand registry in the subcommand groups of the parent command.
				this.hooks.groups(this, ctx);

				// It is necessary to call this hook and pass the builder context to register the subcommands stored in the subcommand register in the parent command.
				this.hooks.subcommands(this, ctx);

 				// Calling both hooks is only necessary if required, it is not mandatory.
				return ctx
					.setName(this.name)
					.setDescription('Parent command of utils subcommands)
			}
		);
 	}
 }
```

## Register the command as a subcommand in the parent command

To register commands as subcommands of the parent command it is necessary to use the `registerSubCommand` option of the command options.

### With Typescript

```typescript
import { Command } from '@kaname-png/plugin-subcommands-advanced';
import type { Message } from 'discord.js';

export class PingCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			preconditions: [], // The preconditions set here affect only the subcommand where it was established.
			registerSubCommand: {
				parentCommandName: 'utils', // Name of the parent command (parent.js).
				slashSubcommand: (builder) => builder.setName('ping').setDescription('Hi!') // Builder that will be embedded in the parent command registry to register the slash subcommand.
			}
		});
	}

	// It is only necessary if the `slashSubcommand` option of the `registerSubCommand` command options is used.
	public override chatInputRun(interaction: Command.ChatInputInteraction) {
		return interaction.reply('uwu');
	}

	// Optional if you want the subcommand to work for slash commands and message commands.
	public override messageRun(message: Message) {
		return message.reply('uwu');
	}
}
```

### With JavaScript

```javascript
import { Command } from '@kaname-png/plugin-subcommands-advanced';

export class PingCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			preconditions: [], // The preconditions set here affect only the subcommand where it was established.
			registerSubCommand: {
				parentCommandName: 'utils', // Name of the parent command (parent.js).
				slashSubcommand: (builder) => builder.setName('ping').setDescription('Hi!') // Builder that will be embedded in the parent command registry to register the slash subcommand.
			}
		});
	}

	// It is only necessary if the `slashSubcommand` option of the `registerSubCommand` command options is used.
	chatInputRun(interaction) {
		return interaction.reply('uwu');
	}

	// Optional if you want the subcommand to work for slash commands and message commands.
	messageRun(message) {
		return message.reply('uwu');
	}
}
```

## Register a command as a subcommand of a group of subcommands of the parent command

To register commands as group subcommands it is important to first register the groups to be used in the main command.

### With Typescript

```typescript
import { Command } from '@kaname-png/plugin-subcommands-advanced';

export class PollCreateCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			preconditions: [], // The preconditions set here affect only the subcommand where it was established.
			registerSubcommmandInGroup: {
				parentCommandName: 'utils', // Name of the parent command (parent.js).
				groupName: 'poll', // Name of the group that was registered in the builder context of the parent command.
				slashSubcommand: (builder) => builder.setName('create').setDescription('Create a poll!') // Builder that will be embedded in the parent command registry to register the slash subcommand.
			}
		});
	}

	// It is only necessary if the `slashSubcommand` option of the `registerSubcommmandInGroup` command options is used.
	public override chatInputRun(interaction: Command.ChatInputInteraction) {
		return interaction.reply('uwu');
	}

	// Optional if you want the subcommand to work for slash commands and message commands.
	public override messageRun(message: Message) {
		return message.reply('uwu');
	}
}
```

### With JavaScript

```javascript
import { Command } from '@kaname-png/plugin-subcommands-advanced';

export class PollCreateCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			preconditions: [], // The preconditions set here affect only the subcommand where it was established.
			registerSubcommmandInGroup: {
				parentCommandName: 'utils', // Name of the parent command (parent.js).
				groupName: 'poll', // Name of the group that was registered in the builder context of the parent command.
				slashSubcommand: (builder) => builder.setName('create').setDescription('Create a poll!') // Builder that will be embedded in the parent command registry to register the slash subcommand.
			}
		});
	}

	// It is only necessary if the `slashSubcommand` option of the `registerSubcommmandInGroup` command options is used.
	chatInputRun(interaction) {
		return interaction.reply('uwu');
	}

	// Optional if you want the subcommand to work for slash commands and message commands.
	messageRun(message) {
		return message.reply('uwu');
	}
}
```

## Decorators

The plugin also includes subcommands so that TypeScript users can easily register subcommands.

### Subcommands

```typescript
import { RegisterSubCommand } from '@kaname-png/plugin-subcommands-advanced';
import { Command } from '@kaname-png/plugin-subcommands-advanced';

@RegisterSubCommand('utils', (builder) => builder.setName('ping').setDescription('Hi!'))
export class PingCommand extends Command {
	// It is only necessary if the `slashSubcommand` option of the `registerSubCommand` command options is used.
	public override chatInputRun(interaction: Command.ChatInputInteraction) {
		return interaction.reply('uwu');
	}

	// Optional if you want the subcommand to work for slash commands and message commands.
	public override messageRun(message: Message) {
		return message.reply('uwu');
	}
}
```

### Subcommands group

```typescript
import { RegisterSubCommandGroup } from '@kaname-png/plugin-subcommands-advanced';
import { Command } from '@kaname-png/plugin-subcommands-advanced';

@RegisterSubCommandGroup('utils', 'poll', (builder) => builder.setName('create').setDescription('Create a poll'))
export class PingCommand extends Command {
	// It is only necessary if the `slashSubcommand` option of the `registerSubcommmandInGroup` command options is used.
	public override chatInputRun(interaction: Command.ChatInputInteraction) {
		return interaction.reply('uwu');
	}

	// Optional if you want the subcommand to work for slash commands and message commands.
	public override messageRun(message: Message) {
		return message.reply('uwu');
	}
}
```

That's it, the plugin will take care of configuring everything so that when the subcommand of the parent command is called, the linked command is executed.

## Note

This plugin is not official from `@sapphire/framework`, so if you need additional help ping me in discord with my tag `@kaname-png` on the [@sapphire/framework discord server](https://discord.gg/sapphiredev).

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://kaname.netlify.app"><img src="https://avatars.githubusercontent.com/u/56084970?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Kaname</b></sub></a><br /><a href="https://github.com/kaname-png/neko-plugins/commits?author=kaname-png" title="Code">💻</a> <a href="https://github.com/kaname-png/neko-plugins/issues?q=author%3Akaname-png" title="Bug reports">🐛</a> <a href="https://github.com/kaname-png/neko-plugins/commits?author=kaname-png" title="Documentation">📖</a> <a href="#infra-kaname-png" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-kaname-png" title="Maintenance">🚧</a> <a href="https://github.com/kaname-png/neko-plugins/pulls?q=is%3Apr+reviewed-by%3Akaname-png" title="Reviewed Pull Requests">👀</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification.
Contributions of any kind welcome!
