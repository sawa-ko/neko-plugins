import type { DotenvCraOptions } from 'dotenv-cra';

export * from './lib/client';
export * from './lib/parsers';

export interface EnvKeys {}

export interface EnvOptions extends DotenvCraOptions {
	enabled?: boolean;
}

declare module 'discord.js' {
	export interface ClientOptions {
		env?: EnvOptions;
	}
}
