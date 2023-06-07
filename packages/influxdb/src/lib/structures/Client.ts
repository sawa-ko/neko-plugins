import { type ClientOptions, InfluxDB, Point, type QueryApi, type WriteApi, type WritePrecisionType } from '@influxdata/influxdb-client';
import { tryNumberParse } from '../utils';

export class Client {
	public readonly influx: InfluxDB;
	public readonly queryApi?: QueryApi;
	public readonly writeApi?: WriteApi;
	public messageCount = 0;

	private readonly injectedTags: [name: string, value: string][] = [];

	public constructor(options: Client.Options);
	public constructor({ org, writeBucket, writePrecision, ...options }: Client.Options = {}) {
		this.influx = new InfluxDB(
			process.env.INFLUX_OPTIONS_STRING ?? {
				...options,
				url: options.url ?? process.env.INFLUX_URL!,
				proxyUrl: options.proxyUrl ?? process.env.INFLUX_PROXY_URL,
				timeout: options.timeout ?? tryNumberParse(process.env.INFLUX_TIMEOUT),
				token: options.token ?? process.env.INFLUX_TOKEN
			}
		);

		const _org = org ?? process.env.INFLUX_ORG;
		if (_org) {
			this.queryApi = this.influx.getQueryApi(_org);

			const _bucket = writeBucket ?? process.env.INFLUX_WRITE_BUCKET;
			if (_bucket) {
				const _precision = writePrecision ?? (process.env.INFLUX_WRITE_PRECISION as WritePrecisionType | undefined);
				this.writeApi = this.influx.getWriteApi(_org, _bucket, _precision);
			}
		}
	}

	/**
	 * Adds a tag that will be injected in all points.
	 * @param name The name of the tag to inject.
	 * @param value The value of the tag to inject.
	 */
	public addInjectTag(name: string, value: string) {
		this.injectedTags.push([name, value]);
	}

	/**
	 * Writes a point into the write buffer.
	 * @param point The point to write.
	 * @returns Whether or not the point was successfully written.
	 */
	public writePoint(point: Point) {
		if (this.writeApi) {
			this.writeApi.writePoint(this.inject(point));
			return true;
		}

		return false;
	}

	/**
	 * Writes multiple points into the write buffer.
	 * @param points The points to write.
	 * @returns Whether or not the points were successfully written.
	 */
	public writePoints(points: readonly Point[]) {
		if (this.writeApi) {
			this.writeApi.writePoints(points.map((point) => this.inject(point)));
			return true;
		}

		return false;
	}

	/**
	 * Flushes the pending writes to the server.
	 * @param withRetryBuffer Whether or not it should flush the scheduled retries
	 * @returns Whether or not the operation was successful.
	 */
	public async flush(withRetryBuffer?: boolean) {
		if (this.writeApi) {
			await this.writeApi.flush(withRetryBuffer);
			return true;
		}

		return false;
	}

	private inject(point: Point) {
		for (const [name, value] of this.injectedTags) {
			point.tag(name, value);
		}

		return point;
	}
}

export namespace Client {
	export interface Options extends Partial<ClientOptions> {
		org?: string;
		writeBucket?: string;
		writePrecision?: WritePrecisionType;
	}
}

declare global {
	namespace NodeJS {
		interface ProcessEnv {
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
	}
}
