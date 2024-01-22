<div align="center">

![Neko Plugins Logo](https://raw.githubusercontent.com/kaname-png/neko-plugins/main/assets/logo.png)

# @kaname-png/plugin-env

**Plugin for <a href="https://github.com/sapphiredev/framework">@sapphire/framework</a> to manage environment variables with value parser.**

[![GitHub](https://img.shields.io/github/license/kaname-png/neko-plugins)](https://github.com/kaname-png/neko-plugins/blob/main/LICENSE.md)
[![codecov](https://codecov.io/gh/sawa-ko/neko-plugins/branch/main/graph/badge.svg?token=7B0AVB4YG6)](https://codecov.io/gh/kaname-png/neko-plugins)
[![npm (scoped)](https://img.shields.io/npm/v/@kaname-png/plugin-env?color=crimson&logo=npm)](https://www.npmjs.com/package/@kaname-png/plugin-env)
[![npm](https://img.shields.io/npm/dt/@kaname-png/plugin-env?color=crimson&logo=npm)](https://www.npmjs.com/package/@kaname-png/plugin-env)

</div>

## Description

This plugin allows you to manage your environment variables via .env, .env.development, etc. files in a simple way and with the ease of getting the value converted into the type you need.

The plugin allows you to read the environment variables and parse it to the desired type and get for example, a boolean value from an environment variable.

## Features

-   Fully ready for TypeScript!
-   Includes ESM ready entrypoint
-   Easy to use

## Installation

`@kaname-png/plugin-env` depends on the following packages. Be sure to install these along with this package!

-   [`@sapphire/framework`](https://www.npmjs.com/package/@sapphire/framework)

You can use the following command to install this package, or replace `npm install` with your package manager of choice.

```sh
npm install @kaname-png/plugin-env @sapphire/framework discord.js
```

---

## Usage

It is very important to assign an environment variable manually, this to know what kind of environment variables you need.

For example:

```javascript
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
```

And with NodeJs versions higher than v15 ([Logical Nullish Assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_nullish_assignment)):

```javascript
process.env.NODE_ENV ??= 'development';
```

### JavaScript

In your main or setup file, register the plugin:

```javascript
require('@kaname-png/plugin-env/register');
```

Once the plugin is registered, we will have to decide whether to enable the plugin or not with the `enabled` variable in the client options in the `env` option.

```javascript
require('@kaname-png/plugin-env/register');

async function main() {
	const client = new SapphireClient({
		/* your bot options */
		env: {
			enabled: true // You can decide when to enable the plugin or not.
			/* ...More options available */
		}
	});

	await client.login();
}

void main();
```

### TypeScript

In your main or setup file, register the plugin:

```typescript
import '@kaname-png/plugin-env/register';
```

Once the plugin is registered, we will have to decide whether to enable the plugin or not with the `enabled` variable in the client options in the `env` option.

```typescript
import '@kaname-png/plugin-env/register';

async function main() {
	const client = new SapphireClient({
		/* your bot options */
		env: {
			enabled: true // You can decide when to enable the plugin or not.
			/* ...More options available */
		}
	});

	await client.login();
}

void main();
```

## How to use

### JavaScript

```javascript
// Services
import { container } from '@sapphire/framework';

export class MyAwesomeService {
	get() {
		return container.env.string('MY_AWESOME_ENV');
	}
}

// Commands, Listeners, etc.
import { Command } from '@sapphire/framework';

export class MyAwesomeCommand extends Command {
	messageRun(message) {
		return message.reply(this.container.env.string('MY_AWESOME_ENV'));
	}
}
```

### TypeScript

In TypeScript the variable name typing is safe, this means that you can't just put any environment variable key name, for that we will have to augment the interface that contains all the available environment variable names.

It is recommended to set it to type `never`, although its type has no effect on the result.

```typescript
import '@kaname-png/plugin-env/register';

async function main() {
	const client = new SapphireClient({
		/* your bot options */
		env: {
			enabled: true // You can decide when to enable the plugin or not.
			/* ...More options available */
		}
	});

	await client.login();
}

void main();

// It is recommended to do it for example in the main file that starts the client (main.js for example).
declare module '@kaname-png/plugin-env' {
	interface EnvKeys {
		MY_AWESOME_ENV: never;
	}
}
```

```typescript
// Services
import { container } from '@sapphire/framework';

export class MyAwesomeService {
	public get() {
		return container.env.string('MY_AWESOME_ENV');
	}
}

// Commands, Listeners, etc.
import { Command } from '@sapphire/framework';
import { Message } from '@discord.js';

export class MyAwesomeCommand extends Command {
	public messageRun(message: Message) {
		return message.reply(this.container.env.string('MY_AWESOME_ENV'));
	}
}
```

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
