import { Tags } from '../types';
import type { Point } from '@influxdata/influxdb-client';
import { container, Listener, type PieceContext, Result } from '@sapphire/framework';

export abstract class AnalyticsListener extends Listener {
	public tags: [Tags, string][] = [];

	public constructor(context: PieceContext, options?: AnalyticsListener.Options) {
		super(context, { enabled: Boolean(container.client.analytics?.writeApi), ...options });
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
		const result = Result.from(this.container.client.analytics?.writeApi?.writePoints(points));
		result.inspectErr((err) => this.container.logger.error(err));
	}

	protected injectTags(point: Point) {
		for (const tag of this.tags) {
			point.tag(tag[0], tag[1]);
		}
		return point;
	}

	protected initTags() {
		const clientID = process.env.CLIENT_ID ?? this.container.client.id;
		const eventName = typeof this.event === 'string' ? this.event : this.event.toString();
		if (clientID) this.tags.push([Tags.Client, clientID], [Tags.OriginEvent, eventName]);
	}
}

export namespace AnalyticsListener {
	export type Options = Listener.Options;
}
