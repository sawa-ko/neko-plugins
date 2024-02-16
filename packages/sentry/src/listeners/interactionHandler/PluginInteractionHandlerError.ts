import { Events, type InteractionHandlerError } from '@sapphire/framework';
import { SentryListener } from '../../lib/structures/SentryListener';
import { sharedInteractionHandlerRun } from './_shared';

export class PluginSentryListener extends SentryListener<typeof Events.InteractionHandlerError> {
	public constructor(context: SentryListener.Context, options: SentryListener.Options) {
		super(context, { ...options, name: 'PluginSentryInteractionHandlerError', event: Events.InteractionHandlerError });
	}

	public run(error: unknown, context: InteractionHandlerError) {
		return sharedInteractionHandlerRun(error, this.name, context.handler.name);
	}
}
