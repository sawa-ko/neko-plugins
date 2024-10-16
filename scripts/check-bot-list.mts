import { bold, green } from 'colorette';
import { fetch, Response } from 'undici';

const method = [
	'GET',
	'POST',
	'PUT',
	'PATCH',
	'DELETE',
	'HEAD',
	'OPTIONS',
	'CONNECT',
	'TRACE',
	'COPY',
	'LOCK',
	'MKCOL',
	'MOVE',
	'PURGE',
	'PROPFIND',
	'PROPPATCH',
	'UNLOCK',
	'REPORT',
	'MKACTIVITY',
	'CHECKOUT',
	'MERGE',
	'M-SEARCH',
	'NOTIFY',
	'SUBSCRIBE',
	'UNSUBSCRIBE',
	'PATCH',
	'SEARCH',
	'CONNECT'
] as const;

type Sites = [string, number?, (typeof method)[number]?][];

const sites: Sites = [
	['https://top.gg', 403],
	['https://top.gg/api', 418 /* I'm a teapot */],
	['https://discordbotlist.com'],
	['https://bots.ondiscord.xyz'],
	['https://discords.com'],
	['https://discords.com/bots/api', 401],
	['https://botlist.me'],
	['https://discord.bots.gg'],
	['https://discord.bots.gg/api/v1', undefined, 'GET'],
	['https://discordextremelist.xyz'],
	['https://api.discordextremelist.xyz/v2/health'],
	['https://discordservices.net'],
	['https://api.discordservices.net'],
	['https://disforge.com'],
	['https://disforge.com/api/home'],
	['https://infinitybots.gg'],
	['https://api.infinitybots.gg'],
	['https://voidbots.net']
];

type Responses = [Promise<Response>, string, number][];

const responses: Responses = sites.map(([url, expectedStatusCode, method]) => {
	expectedStatusCode ??= 200;
	method ??= 'GET';

	return [fetch(url, { method }), url, expectedStatusCode];
});

let hasFailure = false;

for (const [response, url, expectedStatusCode] of responses) {
	const result = await response;
	if (result.status !== expectedStatusCode) {
		hasFailure = true;
		console.error(`${bold(url)} ${bold(green('failed.'))} Expected status code ${expectedStatusCode}, got ${result.status}.`);
		continue;
	}

	console.log(`${bold(url)} ${bold(green('passed.'))}`);
}

if (hasFailure) process.exit(1);
else process.exit(0);
