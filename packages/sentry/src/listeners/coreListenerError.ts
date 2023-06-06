import { Events, Listener, type ListenerErrorPayload } from '@sapphire/framework';
import { sharedListenerOptions } from '../lib';
import { captureException } from '@sentry/node';
import { SentryListener } from '../lib/structures/listener';

export class SharedListener extends SentryListener<typeof Events.ListenerError> {
	public constructor(context: Listener.Context, options: SentryListener.Options) {
		super(context, { ...sharedListenerOptions(options), event: Events.ListenerError });
	}

	public run(error: unknown, context: ListenerErrorPayload) {
		return captureException(error, { tags: { name: context.piece.name } });
	}
}
