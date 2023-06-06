import { Events, Listener } from '@sapphire/framework';
import { captureException } from '@sentry/node';
import { SentryListener } from '../lib/structures/listener';

export class SharedListener extends SentryListener<typeof Events.Error> {
	public constructor(context: Listener.Context, options: SentryListener.Options) {
		super(context, { ...options, event: Events.Error });
	}

	public run(error: unknown) {
		captureException(error, { level: 'error', tags: { event: this.name } });
	}
}
