import { WritePrecisionType } from '@influxdata/influxdb-client';

export * from './AnalyticsSchema';

export const AnalyticsSync = Symbol('InfluxDB:AnalyticsSync');

export interface Env {
	// Influx Options
	INFLUX_OPTIONS_STRING?: string;
	INFLUX_URL?: string;
	INFLUX_HEADERS?: string;
	INFLUX_PROXY_URL?: string;
	INFLUX_TIMEOUT?: `${number}`;
	INFLUX_TOKEN?: string;

	// API
	INFLUX_ORG?: string;
	INFLUX_WRITE_BUCKET?: string;
	INFLUX_WRITE_PRECISION?: WritePrecisionType;
}
