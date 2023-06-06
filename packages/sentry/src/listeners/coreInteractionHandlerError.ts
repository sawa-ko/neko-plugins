import { Events, type InteractionHandlerError, type InteractionHandlerParseError, Listener } from '@sapphire/framework';
import { captureException } from '@sentry/node';
import { SentryListener } from '../lib/structures/listener';

export class InteractionHandlerErrorListener extends SentryListener<typeof Events.InteractionHandlerError> {
	public constructor(context: Listener.Context, options: SentryListener.Options) {
		super(context, { ...options, event: Events.InteractionHandlerError });
	}

	public run(error: unknown, context: InteractionHandlerError) {
		return sharedRun(error, this.name, context.handler.name);
	}
}

export class InteractionHandlerParseErrorListener extends SentryListener<typeof Events.InteractionHandlerParseError> {
	public constructor(context: Listener.Context, options: SentryListener.Options) {
		super(context, { ...options, event: Events.InteractionHandlerParseError });
	}

	public run(error: unknown, context: InteractionHandlerParseError) {
		return sharedRun(error, this.name, context.handler.name);
	}
}

function sharedRun(error: unknown, name: string, handlerName: string) {
	return captureException(error, { level: 'error', tags: { event: name }, extra: { handler: handlerName } });
}
