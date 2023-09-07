<div align="center">

![Neko Plugins Logo](https://raw.githubusercontent.com/kaname-png/neko-plugins/main/assets/logo.png)

# @kaname-png/plugin-sentry

**Plugin for [`@sapphire/framework`](https://github.com/sapphiredev/framework) to publish errors to [sentry](https://sentry.io).**

[![GitHub](https://img.shields.io/github/license/kaname-png/neko-plugins)](https://github.com/kaname-png/neko-plugins/blob/main/LICENSE.md)
[![codecov](https://codecov.io/gh/sawa-ko/neko-plugins/branch/main/graph/badge.svg?token=7B0AVB4YG6)](https://codecov.io/gh/kaname-png/neko-plugins)
[![npm (scoped)](https://img.shields.io/npm/v/@kaname-png/plugin-sentry?color=crimson&logo=npm)](https://www.npmjs.com/package/@kaname-png/plugin-sentry)
[![npm](https://img.shields.io/npm/dt/@kaname-png/plugin-sentry?color=crimson&logo=npm)](https://www.npmjs.com/package/@kaname-png/plugin-sentry)

</div>

## Description

This plugin allows you to integrate Sentry with Bot. Sentry is a developer-focused error tracking and performance
monitoring platform that helps developers see what really matters, solve faster, and learn more about their
applications.

More information about Sentry can be found on its [website](https://sentry.io).

## Features

- Fully ready for TypeScript!
- Includes ESM ready entrypoint
- Easy to use

## Installation

`@kaname-png/plugin-sentry` depends on the following packages. Be sure to install these along with this package!

- [`@sapphire/framework`](https://www.npmjs.com/package/@sapphire/framework)
- [`@sentry/node`](https://www.npmjs.com/package/@sentry/node)
- [`@sentry/integrations`](https://www.npmjs.com/package/@sentry/integrations)
- [`discord.js`](https://www.npmjs.com/package/discord.js)

You can use the following command to install this package, or replace `npm install` with your package manager of choice.

```sh
npm install @kaname-png/plugin-sentry @sentry/node @sentry/integrations @sapphire/framework discord.js
```
PS: You can view events by default [here](#the-default-listeners).

---

## Usage

### JavaScript

In your main or setup file, register the plugin:

```javascript
require('@kaname-png/plugin-sentry/register');

const client = new SapphireClient({
	/* your bot options */
	sentry: {
		loadSentryErrorListeners: true, // (Optional) Load the default events .
		options: {
			// The options to pass to the sentry client.
		}
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
import '@kaname-png/plugin-sentry/register';

const client = new SapphireClient({
	/* your bot options */
	sentry: {
		options: {
			// The options to pass to the sentry client.
		}
	}
});

async function main() {
	await client.login();
}

void main();
```

Then, you can create new listener by extending the SentryListener class.

### With TypeScript

```typescript
import { SentryListener } from '@kaname-png/plugin-sentry';
import { ApplyOptions } from '@sapphire/decorators';

// Using ApplyOptions decorator makes it easy to configure
@ApplyOptions<SentryListener.Options>({
  event: 'error'
})
// Extend `SentryListener` instead of `Listener`
export class ErrorListener extends SentryListener {
  public async run(error: unknown) {
    return this.captureException(error, {
      // your context options
    })
  }
}
```

### With Javascript

```javascript
import { SentryListener } from '@kaname-png/plugin-sentry';

module.exports = class ErrorListener extends SentryListener {
  constructor(context, options) {
    super(context, {
      ...options,
      event: 'error'
    })
  }

  async run(error) {
    return this.captureException(error, {
      // your context options
    })
  }
}
```

----
### **The default listeners: 
- [`plugin-api`](https://github.com/sapphiredev/plugins/tree/main/packages/api): "error"
- [`plugin-subcommands`](https://github.com/sapphiredev/plugins/tree/main/packages/subcommands): "MessageSubcommandError", "chatInputSubcommandError"
- [`plugin-scheduled-tasks`](https://github.com/sapphiredev/plugins/tree/main/packages/scheduled-tasks): "scheduledTaskError"
- [`framework`](https://github.com/sapphiredev/framework): "messageCommandError", "chatInputCommandError", "contextMenuCommandError", "commandAutocompleteInteractionError", "error", "listenerError" and "interactionHandlerError"
----

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
