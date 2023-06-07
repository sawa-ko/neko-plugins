import 'tslib';
import { Client } from './lib/structures';

export type { InfluxDB, Point, QueryApi, WriteApi, WritePrecisionType } from '@influxdata/influxdb-client';
export { Client, type InfluxOptions };

interface InfluxOptions extends Client.Options {
	loadDefaultListeners?: boolean;
}

declare module 'discord.js' {
	interface ClientOptions {
		analytics: InfluxOptions;
	}
}
