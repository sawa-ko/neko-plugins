import 'tslib';
import { Client } from './lib/structures';
import type { Env } from './lib/types';

export type { InfluxDB, Point, QueryApi, WriteApi, WritePrecisionType } from '@influxdata/influxdb-client';
export { Client, type InfluxOptions };

interface InfluxOptions extends Client.Options {
	loadDefaultListeners?: boolean;
}

declare module 'discord.js' {
	interface ClientOptions {
		analytics?: InfluxOptions;
	}
}

declare module '@sapphire/framework' {
	interface SapphireClient {
		analytics: Client | null;
	}
}

declare global {
	namespace NodeJS {
		interface ProcessEnv extends Env {}
	}
}
