import { Events, type AutocompleteInteractionPayload } from '@sapphire/framework';
import { SentryListener } from '../../lib/structures/SentryListener';
import { sharedCommandErrorRun } from './_shared';

export class PluginSentryListener extends SentryListener<typeof Events.CommandAutocompleteInteractionError> {
	public constructor(context: SentryListener.Context, options: SentryListener.Options) {
		super(context, { ...options, name: 'PluginSentryCommandAutocompleteInteractionError', event: Events.CommandAutocompleteInteractionError });
	}

	public run(error: unknown, payload: AutocompleteInteractionPayload) {
		return sharedCommandErrorRun(error, this.name, payload.command.name);
	}
}
