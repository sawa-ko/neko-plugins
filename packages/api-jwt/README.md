<div align="center">

![Neko Plugins Logo](https://raw.githubusercontent.com/kaname-png/neko-plugins/main/assets/logo.png)

# @kaname-png/plugin-api-jwt

**Plugin for <a href="https://github.com/sapphiredev/framework">@sapphire/framework</a> to add JSON Web Tokens strategy in [@sapphire/plugin-api](https://www.npmjs.com/package/@sapphire/plugin-api) plugin to JWT.**

[![GitHub](https://img.shields.io/github/license/kaname-png/neko-plugins)](https://github.com/kaname-png/neko-plugins/blob/main/LICENSE.md)
[![codecov](https://codecov.io/gh/sawa-ko/neko-plugins/branch/main/graph/badge.svg?token=7B0AVB4YG6)](https://codecov.io/gh/kaname-png/neko-plugins)
[![npm (scoped)](https://img.shields.io/npm/v/@kaname-png/plugin-api-jwt?color=crimson&logo=npm)](https://www.npmjs.com/package/@kaname-png/plugin-api-jwt)
[![npm](https://img.shields.io/npm/dt/@kaname-png/plugin-api-jwt?color=crimson&logo=npm)](https://www.npmjs.com/package/@kaname-png/plugin-api-jwt)

</div>

## Description

This plugin add the authentication system JSON Web Tokens to [@sapphire/plugin-api](https://www.npmjs.com/package/@sapphire/plugin-api) plugin for [@sapphire/framework](https://www.npmjs.com/package/@sapphire/framework).

This plugin does not change the behavior of the [@sapphire/plugin-api](https://www.npmjs.com/package/@sapphire/plugin-api) plugin, so after installing the plugin you can continue to use the [@sapphire/plugin-api](https://www.npmjs.com/package/@sapphire/plugin-api) plugin as you always have.

## Features

-   Fully ready for TypeScript!
-   Includes ESM ready entrypoint
-   Easy to use

## Installation

`@kaname-png/plugin-api-jwt` depends on the following packages. Be sure to install these along with this package!

-   [`@sapphire/framework`](https://www.npmjs.com/package/@sapphire/framework)
-   [`@sapphire/plugin-api`](https://www.npmjs.com/package/@sapphire/plugin-api)

You can use the following command to install this package, or replace `npm install` with your package manager of choice.

```sh
npm install @kaname-png/plugin-api-jwt @sapphire/framework @sapphire/plugin-api
```

---

## Usage

### JavaScript

In your main or setup file, register the plugin:

```javascript
// Remember to register the API plugin first, then this plugin.
require('@sapphire/plugin-api/register');
require('@kaname-png/plugin-api-jwt/register');
```

Once the plugin is registered, we have to configure some options.

```javascript
async function main() {
	const client = new SapphireClient({
		api: {
			auth: {
				id: 'xxx' /** client oauth id **/,
				secret: 'xxx' /** client oauth secret **/,
				redirect: 'https://kaname.netlify.app/oauth' /** client oauth redirect **/,
				jwt: {
					secret: 'uwu' /** JWT tokens are signed with this secret key. (required) **/,
					issuer: 'kaname.netlify.app' /** See https://jwt.io/introduction  (optional and by default api.auth.redirect) **/,
					algorithm: 'HS256' /**  (optional and by default HS512) **/,
					sessionsHooks: {
						/** Optional hooks for persistent sessions (optional) **/,
						get: (token, type) => {
							// Do something with your database or something else.
							// ...

							return { access_token: '<access_token>', refresh_token: '<refresh_token>' };
						},
						create: (payload) => {
							// Do something with your database or something else.
							// ...
						},
						delete: (accessToken) => {
							// Do something with your database or something else.
							// ...
						}
					}
				}
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
// Remember to register the API plugin first, then this plugin.
import '@sapphire/plugin-api/register';
import '@kaname-png/plugin-api-jwt/register';
```

Once the plugin is registered, we have to configure some options.

```typescript
async function main() {
	const client = new SapphireClient({
		api: {
			auth: {
				id: 'xxx' /** client oauth id **/,
				secret: 'xxx' /** client oauth secret **/,
				redirect: 'https://kaname.netlify.app/oauth' /** client oauth redirect **/,
				jwt: {
					secret: 'uwu' /** JWT tokens are signed with this secret key. (required) **/,
					issuer: 'kaname.netlify.app' /** See https://jwt.io/introduction  (optional and by default api.auth.redirect) **/,
					algorithm: 'HS256' /**  (optional and by default HS512) **/,
					sessionsHooks: {
						/** Optional hooks for persistent sessions (optional) **/,
						get: (token, type) => {
							// Do something with your database or something else.
							// ...

							return { access_token: '<access_token>', refresh_token: '<refresh_token>' };
						},
						create: (payload) => {
							// Do something with your database or something else.
							// ...
						},
						delete: (accessToken) => {
							// Do something with your database or something else.
							// ...
						}
					}
				}
			}
		}
	});

	await client.login();
}

void main();
```

## How to use

Now, when you log in you will get a response like this, where the authentication token is attached.

Remember that the authentication token must be in the `authorization` header with the value: `Bearer [ token here ]`.

```json
{
	"user": {
		"auth": {
			// See https://discord.com/developers/docs/topics/oauth2#authorization-code-grant-access-token-response
		},
		"data": {
			"id": "858367536240394259",
			"username": "kaname-png",
			"avatar": "28f2ec4eec159df460dc9b58f2a80318",
			"discriminator": "1751",
			"public_flags": 0,
			"flags": 0,
			"banner": null,
			"banner_color": null,
			"accent_color": null,
			"verified": true
		}
	},
	"access_token": "eyJhbGciOiJIUzI1NiJ9.XXXXX",
	"refresh_token": "eyJhbGciOiJIUzI1NiJ9.XXXXX"
}
```

You can get the token information on a route, middleware, etc. in the following way:

> Javascript

```javascript
const { methods, Route } = require('@sapphire/plugin-api');

class UserRoute extends Route {
	constructor(context, options) {
		super(context, {
			...options,
			route: 'user/route'
		});
	}

	[methods.GET](request, response) {
		const session = request.session;
		response.json({ session });
	}
}

exports.default = UserRoute;
```

> Typescript

```typescript
import { ApiResponse, methods, Route } from '@sapphire/plugin-api';
import type { ApiRequest } from '@kaname-png/plugin-api-jwt';

export class UserRoute extends Route {
	constructor(context: Route.Context, options: Route.Options) {
		super(context, {
			...options,
			route: 'user/route'
		});
	}

	[methods.GET](request: ApiRequest, response: ApiResponse) {
		const session = request.session;
		response.json({ session });
	}
}
```

It is important to remember that if the authorization token is invalid, then the `_request.auth` variable will be null.

And as mentioned in the description, this plugin does not change the way @sapphire/plugin-api plugin is used, so you can follow the [@sapphire/plugin-api plugin documentation](https://www.sapphirejs.dev/docs/Guide/plugins/API/using-oauth2-backend-route).

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
