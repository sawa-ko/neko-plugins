<div align="center">

![Neko Plugins Logo](https://raw.githubusercontent.com/kaname-png/neko-plugins/main/assets/logo.png)

# @kaname-png/plugin-statcord

**Plugin for <a href="https://github.com/sapphiredev/framework">@sapphire/framework</a> to post and manage bot stats with <a href="https://statcord.com/">Statcord</a>.**

[![GitHub](https://img.shields.io/github/license/kaname-png/neko-plugins)](https://github.com/kaname-png/neko-plugins/blob/main/LICENSE.md)
[![codecov](https://codecov.io/gh/kaname-png/neko-plugins/branch/main/graph/badge.svg?token=7B0AVB4YG6)](https://codecov.io/gh/kaname-png/neko-plugins)
[![npm (scoped)](https://img.shields.io/npm/v/@kaname-png/plugin-statcord?color=crimson&logo=npm)](https://www.npmjs.com/package/@kaname-png/plugin-statcord)
[![npm](https://img.shields.io/npm/dt/@kaname-png/plugin-statcord?color=crimson&logo=npm)](https://www.npmjs.com/package/@kaname-png/plugin-statcord)

</div>

## Description

This plugin allows the integration of Statcord with the Bot. Statcord is a web page that allows to manage statistics such as, how many commands were executed in a day, new guilds, etc.

More information about Statcord can be found on its [website](https://statcord.com).

## Features

-   Fully ready for TypeScript!
-   Includes ESM ready entrypoint
-   Easy to use

## Installation

`@kaname-png/plugin-statcord` depends on the following packages. Be sure to install these along with this package!

-   [`@sapphire/framework`](https://www.npmjs.com/package/@sapphire/framework)

You can use the following command to install this package, or replace `npm install` with your package manager of choice.

```sh
npm install @kaname-png/plugin-statcord @sapphire/framework discord.js
```

---

## Usage

### JavaScript

In your main or setup file, register the plugin:

```javascript
require('@kaname-png/plugin-statcord/register');
```

It is important to add an API key provided by Statcord.

```javascript
require('@kaname-png/plugin-statcord/register');

const client = new SapphireClient({
	/* your bot options */
	statcord: {
		client_id: 'YOUR_BOT_ID', // (Optional) By default it is the bot id.
		key: 'YOUR_AWESOME_API_KEY', // (Required) Statcord API key.
		autopost: false, // (Optional) Allows automatic posting of statistics.
		baseUrl: 'https://api.statcord.com/v3', // (Optional) Change the base URL of the Statcord API.
		debug: false, // (Optional) Show debug messages.
		sharding: false // (Optional) Activate the sharding mode, it is important to read the notes below.
	}
});

async function main() {
	await client.login();
}

void main();
```

### TypeScript

In your main or setup file, register the plugin:

```typescript
import '@kaname-png/plugin-statcord/register';
```

It is important to add an API key provided by Statcord.

```typescript
import '@kaname-png/plugin-statcord/register';

const client = new SapphireClient({
	/* your bot options */
	statcord: {
		client_id: 'YOUR_BOT_ID', // (Optional) By default it is the bot id.
		key: 'YOUR_AWESOME_API_KEY', // (Required) Statcord API key.
		autopost: false, // (Optional) Allows automatic posting of statistics.
		baseUrl: 'https://api.statcord.com/v3', // (Optional) Change the base URL of the Statcord API.
		debug: false, // (Optional) Show debug messages.
		sharding: false // (Optional) Activate the sharding mode, it is important to read the notes below.
	}
});

async function main() {
	await client.login();
}

void main();
```

If you enable the `autopost` option, that's it, the plugin will collect and publish the statistics for you, you don't have to do anything else!

## Bandwidth usage

To set the bandwidth usage in each statistics post the `setBandwidthUsage()` method is available, the data sent by this method is reset in each statistics post. This is done so that the user can choose the best way to get this data.

### Javascript

```javascript
const { container } = require('@sapphire/framework');

class MyAwesomeServicePostStats {
	public postBandwidth() {
		const bandwidthUsage = getBandwidthUsage(); // Use your method to get this data.
		container.statcord.setBandwidthUsage(bandwidthUsage);
	}
}

export default MyAwesomeServicePostStats;
```

### TypeScript

```typescript
import { container } from '@sapphire/framework';

export class MyAwesomeServicePostStats {
	public postBandwidth() {
		const bandwidthUsage = getBandwidthUsage(); // Use your method to get this data.
		container.statcord.setBandwidthUsage(bandwidthUsage);
	}
}
```

## Posting statistics manually

To be able to post statistics manually, it is necessary to disable the `autopost` option in the statcord options, by default it is disabled.

### Javascript

```javascript
const client = new SapphireClient({
	/* your bot options */
	statcord: {
		key: 'YOUR_AWESOME_API_KEY',
		autopost: false
	}
});

async function main() {
	await client.login();
}

void main();
```

### TypeScript

```typescript
import '@kaname-png/plugin-statcord/register';

const client = new SapphireClient({
	/* your bot options */
	statcord: {
		key: 'YOUR_AWESOME_API_KEY',
		autopost: false
	}
});

async function main() {
	await client.login();
}

void main();
```

In order to be able to post statistics there is the `postStats` method available, by default, the statistics of used commands, popular commands, total guilds and users are managed internally by the plugin.

Remember that you can use these methods and all the Statcord plugin methods globally available anywhere in the Bot.

### Javascript

```javascript
const { container } = require('@sapphire/framework');

class MyAwesomeServicePostStats {
	public postStats() {
		container.statcord.postStats();
	}
}

export default MyAwesomeServicePostStats;
```

### TypeScript

```typescript
import { container } from '@sapphire/framework';

export class MyAwesomeServicePostStats {
	public postStats() {
		container.statcord.postStats();
	}
}
```

## Get statistics

The plugin allows to get the statistics from Statcord, as it also has methods that wrapper with the Statcord API.

1. `clientStats();`: Get current client statistics in Statcord.
2. `bucketStats();`: Check everyone who has voted for the bot today.
3. `userVotesStats();`: Check if someone has voted for the bot today.

## Notes

1. The `postCommand` and `postStats` methods are available globally so that they can be used in other ways according to the user's needs. For example, it is recommended to disable the `autopost` option when using the ShardingManager, as it is possible for Shards to go into Rate Limit in the Statcord API when they all perform the action of posting statistics at the same time and having these methods available allows you to devise a better way to post those statistics.
2. If the `sharding` mode is used together with the `autopost` option it is important that the Shards have at least 1 minute of initialization between them, so that the shards have a difference of `1 minute` and thus be able to send the statistics without entering Rate Limit in the Statcord API.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://kaname.netlify.app"><img src="https://avatars.githubusercontent.com/u/56084970?v=4?s=100" width="100px;" alt="Kaname"/><br /><sub><b>Kaname</b></sub></a><br /><a href="https://github.com/kaname-png/neko-plugins/commits?author=kaname-png" title="Code">💻</a> <a href="https://github.com/kaname-png/neko-plugins/issues?q=author%3Akaname-png" title="Bug reports">🐛</a> <a href="https://github.com/kaname-png/neko-plugins/commits?author=kaname-png" title="Documentation">📖</a> <a href="#infra-kaname-png" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-kaname-png" title="Maintenance">🚧</a> <a href="https://github.com/kaname-png/neko-plugins/pulls?q=is%3Apr+reviewed-by%3Akaname-png" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://nino.fun"><img src="https://avatars.githubusercontent.com/u/90474850?v=4?s=100" width="100px;" alt="Sebazz"/><br /><sub><b>Sebazz</b></sub></a><br /><a href="https://github.com/kaname-png/neko-plugins/issues?q=author%3AuSebazz" title="Bug reports">🐛</a> <a href="https://github.com/kaname-png/neko-plugins/commits?author=uSebazz" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://chikoshidori.github.io"><img src="https://avatars.githubusercontent.com/u/53100578?v=4?s=100" width="100px;" alt="Chiko"/><br /><sub><b>Chiko</b></sub></a><br /><a href="https://github.com/kaname-png/neko-plugins/issues?q=author%3AChikoShidori" title="Bug reports">🐛</a> <a href="https://github.com/kaname-png/neko-plugins/commits?author=ChikoShidori" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification.
Contributions of any kind welcome!
