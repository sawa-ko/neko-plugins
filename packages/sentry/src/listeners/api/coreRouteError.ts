import { container, Listener } from '@sapphire/framework';
import { ServerEvents } from '@sapphire/plugin-api';
import { captureException } from '@sentry/node';
import { SentryListener } from '../../lib/structures/listener';

export class SharedListener extends SentryListener<typeof ServerEvents.Error> {
	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, { ...options, emitter: 'server', event: ServerEvents.Error });
	}

	public run(error: unknown) {
		if (!Reflect.has(container, 'server')) return;
		captureException(error, { level: 'error', tags: { event: this.name } });
	}
}
