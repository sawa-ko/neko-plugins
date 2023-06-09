<div align="center">

![Neko Plugins Logo](https://raw.githubusercontent.com/kaname-png/neko-plugins/main/assets/logo.png)

# @kaname-png/plugin-influxdb

**Plugin for
   [`@sapphire/framework`](https://github.com/sapphiredev/framework) to publish stats to an
   [`InfluxDB`](https://www.influxdata.com) instance.**

[![GitHub](https://img.shields.io/github/license/kaname-png/neko-plugins)](https://github.com/kaname-png/neko-plugins/blob/main/LICENSE.md)
[![codecov](https://codecov.io/gh/sawa-ko/neko-plugins/branch/main/graph/badge.svg?token=7B0AVB4YG6)](https://codecov.io/gh/kaname-png/neko-plugins)
[![npm (scoped)](https://img.shields.io/npm/v/@kaname-png/plugin-influxdb?color=crimson&logo=npm)](https://www.npmjs.com/package/@kaname-png/plugin-influxdb)
[![npm](https://img.shields.io/npm/dt/@kaname-png/plugin-influxdb?color=crimson&logo=npm)](https://www.npmjs.com/package/@kaname-png/plugin-influxdb)

</div>

## Description

This plugin lets you send your bot's statistics to InfluxDB 

More information about InfluxDB can be found on its [website](https://www.influxdata.com).

## Features

- Fully ready for TypeScript!
- Includes ESM ready entrypoint
- Easy to use

## Installation

`@kaname-png/plugin-influxDB` depends on the following packages. Be sure to install these along with this package!

- [`@sapphire/framework`](https://www.npmjs.com/package/@sapphire/framework)
- [`@influxdata/influxdb-client`](https://www.npmjs.com/package/@influxdata/influxdb-client)
- [`discord.js`](https://www.npmjs.com/package/discord.js)

You can use the following command to install this package, or replace `npm install` with your package manager of choice.

```sh
npm install @influxdata/influxdb-client  @sapphire/framework discord.js
```

---

## Usage

If your register the plugin:

```typescript
import '@kaname-png/plugin-influxdb/register'

const client = new SapphireClient({
	/* your bot options */
	analytics: {
		loadDefaultListeners: true, // (Optional) Load the default events .
		// option to passed influxdb deps
	}
});

async function main() {
	await client.login();
}

void main();
````

OR

The first step, is to import the Client from the package:

```typescript
import { Client } from '@kaname-png/plugin-influxdb';
```

You can choose between defining the options explicitly, in the following manner:

```typescript
const client = new Client({ url: 'https://example.org', token: 'my-secret-token' });
```

Or defining the options via environment variables, they are:

**Client**:
- `INFLUX_OPTIONS_STRING`: A connection string, overrides all the options below.
- `INFLUX_URL`: `ConnectionOptions.url`, the base URL to be used.
- `INFLUX_PROXY_URL`: `ConnectionOptions.proxyUrl`, the full HTTP web proxy URL including schema.
- `INFLUX_TIMEOUT`: `ConnectionOptions.timeout`, the socket timeout, defaults to 10 seconds. If defined, this will be parsed and validated to a number.
- `INFLUX_TOKEN`: `ConnectionOptions.token`, the authentication token.

**API**:
- `INFLUX_ORG`: `Client.Options.org`, the organization to use for the query and write APIs.
- `INFLUX_WRITE_BUCKET`: `Client.Options.writeBucket`, the bucket to write to in the write API.
- `INFLUX_WRITE_PRECISION`: `Client.Options.writePrecision`, the write precision to use in the write API.

> **Note**: If `Client.Options.org` is unset, none of the APIs will be created.
> **Note**: If `Client.Options.writeBucket` is unset, the Write API will not be created.

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
