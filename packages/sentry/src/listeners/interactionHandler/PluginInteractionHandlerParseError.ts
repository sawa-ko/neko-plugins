import { Events, type InteractionHandlerParseError } from '@sapphire/framework';
import { SentryListener } from '../../lib/structures/SentryListener';
import { sharedInteractionHandlerRun } from './_shared';

export class PluginSentryListener extends SentryListener<typeof Events.InteractionHandlerParseError> {
	public constructor(context: SentryListener.Context, options: SentryListener.Options) {
		super(context, { ...options, name: 'PluginSentryInteractionHandlerParseError', event: Events.InteractionHandlerParseError });
	}

	public run(error: unknown, context: InteractionHandlerParseError) {
		return sharedInteractionHandlerRun(error, this.name, context.handler.name);
	}
}
