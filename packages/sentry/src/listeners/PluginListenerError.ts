import { Events, type ListenerErrorPayload } from '@sapphire/framework';
import { captureException } from '@sentry/node';
import { SentryListener } from '../lib/structures/SentryListener';

export class PluginSentryListener extends SentryListener<typeof Events.ListenerError> {
	public constructor(context: SentryListener.Context, options: SentryListener.Options) {
		super(context, { ...options, name: 'PluginSentryListenerError', event: Events.ListenerError });
	}

	public run(error: unknown, context: ListenerErrorPayload) {
		return captureException(error, { tags: { name: context.piece.name } });
	}
}
