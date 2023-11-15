import { container } from '@sapphire/framework';
import { ServerEvents } from '@sapphire/plugin-api';
import { captureException } from '@sentry/node';
import { SentryListener } from '../../lib/structures/SentryListener';

export class PluginSentryListener extends SentryListener<typeof ServerEvents.Error> {
	public constructor(context: SentryListener.Context, options: SentryListener.Options) {
		super(context, { ...options, name: 'PluginSentryServerError', emitter: 'server', event: ServerEvents.Error });
	}

	public run(error: unknown) {
		if (!Reflect.has(container, 'server')) return;
		captureException(error, { level: 'error', tags: { event: this.name } });
	}
}
