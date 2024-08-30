<div align="center">

![Neko Plugins Logo](https://raw.githubusercontent.com/kaname-png/neko-plugins/main/assets/logo.png)

# @kaname-png/plugin-bot-list

**Plugin for <a href="https://github.com/sapphiredev/framework">@sapphire/framework</a> to post stats to several discord bot lists.**

[![GitHub](https://img.shields.io/github/license/kaname-png/neko-plugins)](https://github.com/kaname-png/neko-plugins/blob/main/LICENSE.md)
[![codecov](https://codecov.io/gh/sawa-ko/neko-plugins/branch/main/graph/badge.svg?token=7B0AVB4YG6)](https://codecov.io/gh/kaname-png/neko-plugins)
[![npm (scoped)](https://img.shields.io/npm/v/@kaname-png/plugin-bot-list?color=crimson&logo=npm)](https://www.npmjs.com/package/@kaname-png/plugin-bot-list)
[![npm](https://img.shields.io/npm/dt/@kaname-png/plugin-bot-list?color=crimson&logo=npm)](https://www.npmjs.com/package/@kaname-png/plugin-bot-list)

</div>

## Description

This plugin allows you to post stats to several discord bot lists.

## Features

-   Fully ready for TypeScript!
-   Includes ESM ready entrypoint
-   Easy to use

## Installation

`@kaname-png/plugin-bot-list` depends on the following packages. Be sure to install these along with this package!

-   [`@sapphire/framework`](https://www.npmjs.com/package/@sapphire/framework)

You can use the following command to install this package, or replace `npm install` with your package manager of choice.

```sh
npm install @kaname-png/plugin-bot-listramework @sapphire/plugin-api
```

---

## Usage

### JavaScript

In your main or setup file, register the plugin:

```javascript
require('@sapphire/plugin-bot-list/register');
```

Once the plugin is registered, we have to configure some options.

```javascript
async function main() {
	const client = new SapphireClient({
		botList: {
			clientId: 'YOUR_CLIENT_ID', // Optional; by default it is the bot's id
			debug: false, // (Optional), shows debug messages; by default it is false
			shard: false, // (Optional), enable sharding support; by default it is false
			autoPost: {
				enabled: true, // (Optional); by default it is enabled
				interval: 3_600_000 // (Optional); by default it is set to 1 hour
			},
			keys: {
				topGG: 'YOUR_AWESOME_TOP_GG_API_KEY' // Your top.gg API key (a list will be found below)
			}
		}
	});

	await client.login();
}

void main();
```

### TypeScript

In your main or setup file, register the plugin:

```typescript
import '@sapphire/plugin-bot-list/register';
```

Once the plugin is registered, we have to configure some options.

```typescript
async function main() {
	const client = new SapphireClient({
		botList: {
			clientId: 'YOUR_CLIENT_ID', // Optional; by default it is the bot's id
			debug: false, // (Optional), shows debug messages; by default it is false
			shard: false, // (Optional), enable sharding support; by default it is false
			autoPost: {
				enabled: true, // (Optional); by default it is enabled
				interval: 3_600_000 // (Optional); by default it is set to 1 hour
			},
			keys: {
				topGG: 'YOUR_AWESOME_TOP_GG_API_KEY' // Your top.gg API key (a list will be found below)
			}
		}
	});

	await client.login();
}

void main();
```

## How to use

If you enable the autoPost option, the plugin will automatically publish the data for you; you don't need to do anything else!

If you want to manually post the data, you can use the following method:

```javascript
client.botList.postStats();
```

You can also retrieve the approximate number of users or guilds from this method:

```javascript
client.botList.computeUsers();
client.botList.computeGuilds();
```

## Information

This plugin is a fork of the [@devtomio/plugin-botlist](https://github.com/jzeuzs/sapphire-plugin-botlist) plugin, which was created by [jzeuzs](https://github.com/jzeuzs) which has not been maintained for over a year now and has some issues.

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
