import { Tags } from '../types';
import type { Point } from '@influxdata/influxdb-client';
import { container, Listener, type ListenerOptions, type PieceContext, Result } from '@sapphire/framework';
import { isNullOrUndefined } from '../utils';

export abstract class AnalyticsListener extends Listener {
	public tags: [Tags, string][] = [];

	public constructor(context: PieceContext, options?: AnalyticsListener.Options) {
		super(context, { ...options, enabled: !isNullOrUndefined(container.analytics?.writeApi) });
	}

	public override onLoad() {
		this.initTags();
		return super.onLoad();
	}

	public writePoint(point: Point) {
		return this.writePoints([point]);
	}

	public writePoints(points: Point[]): void {
		points = points.map((point) => this.injectTags(point));
		const result = Result.from(this.container.analytics?.writeApi?.writePoints(points));
		return result.match({
			ok: () => void 0,
			err: (error: Error) => {
				this.container.client.logger.debug(`[InfluxDB] Failed to write point: [${error.message}]`);
				return void 0;
			}
		});
	}

	protected injectTags(point: Point) {
		for (const tag of this.tags) {
			point.tag(tag[0], tag[1]);
		}
		return point;
	}

	protected initTags() {
		const clientID = process.env.CLIENT_ID ?? this.container.client?.id;
		const eventName = typeof this.event === 'string' ? this.event : this.event.toString();
		if (isNullOrUndefined(clientID)) return;
		this.tags.push([Tags.Client, clientID], [Tags.OriginEvent, eventName]);
	}
}

export namespace AnalyticsListener {
	export type Options = Omit<ListenerOptions, 'enabled'>;
}
