import { AnalyticsListener } from '../lib/structures/AnalyticsListener';
import { Actions, CommandRunTypes, CommandTypes, Points, Tags } from '../lib/types';
import { Point } from '@influxdata/influxdb-client';
import { ApplyOptions } from '@sapphire/decorators';
import {
	type AutocompleteInteractionPayload,
	type ChatInputCommandSuccessPayload,
	type ContextMenuCommandSuccessPayload,
	Events,
	type MessageCommandSuccessPayload
} from '@sapphire/framework';

@ApplyOptions<AnalyticsListener.Options>({ event: Events.MessageCommandSuccess })
export class MessageCommandEvent extends AnalyticsListener {
	public run(payload: MessageCommandSuccessPayload) {
		sharedRun.bind(this)(payload.command.name, CommandRunTypes.Message, payload.command.category);
	}
}

@ApplyOptions<AnalyticsListener.Options>({ event: Events.ChatInputCommandSuccess })
export class ChatInputCommandEvent extends AnalyticsListener {
	public run(payload: ChatInputCommandSuccessPayload) {
		sharedRun.bind(this)(payload.command.name, CommandRunTypes.ChatInput, payload.command.category);
	}
}

@ApplyOptions<AnalyticsListener.Options>({ event: Events.ContextMenuCommandSuccess })
export class UserAnalyticsEvent extends AnalyticsListener {
	public run(payload: ContextMenuCommandSuccessPayload) {
		sharedRun.bind(this)(payload.command.name, CommandRunTypes.ContextMenu, payload.command.category);
	}
}

@ApplyOptions<AnalyticsListener.Options>({ event: Events.CommandAutocompleteInteractionSuccess })
export class CommandAutocompleteEvent extends AnalyticsListener {
	public run(payload: AutocompleteInteractionPayload) {
		sharedRun.bind(this)(payload.command.name, CommandRunTypes.CommandAutocomplete, payload.command.category);
	}
}

function sharedRun(this: AnalyticsListener, commandName: string, runType: CommandRunTypes, category: string | null): void {
	const command = new Point(Points.Commands)
		.tag(Tags.Action, Actions.Addition)
		.tag(CommandTypes.RunType, runType)
		.intField(commandName.replace(/^time$/, 'case-time'), 1);

	if (category) command.tag(CommandTypes.Category, category);

	return this.writePoint(command);
}
