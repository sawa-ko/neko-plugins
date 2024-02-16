import { Events } from '@sapphire/framework';
import { captureException } from '@sentry/node';
import { SentryListener } from '../lib/structures/SentryListener';

export class PluginSentryListener extends SentryListener<typeof Events.Error> {
	public constructor(context: SentryListener.Context, options: SentryListener.Options) {
		super(context, { ...options, name: 'PluginSentryError', event: Events.Error });
	}

	public run(error: unknown) {
		captureException(error, { level: 'error', tags: { event: this.name } });
	}
}
