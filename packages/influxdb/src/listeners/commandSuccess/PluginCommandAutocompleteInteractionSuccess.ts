import { type AutocompleteInteractionPayload, Events } from '@sapphire/framework';
import { AnalyticsListener } from '../../lib/structures/AnalyticsListener';
import { CommandRunTypes } from '../../lib/types';
import { sharedCommandSuccessRun } from './_shared';

export class PluginAnalyticsListener extends AnalyticsListener {
	public constructor(context: AnalyticsListener.Context) {
		super(context, { name: 'PluginAnalyticsCommandAutocompleteInteractionSuccess', event: Events.CommandAutocompleteInteractionSuccess });
	}

	public run(payload: AutocompleteInteractionPayload) {
		sharedCommandSuccessRun(this, payload.command.name, CommandRunTypes.CommandAutocomplete, payload.command.category);
	}
}
