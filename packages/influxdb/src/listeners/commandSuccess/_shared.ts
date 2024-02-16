import { Point } from '@influxdata/influxdb-client';
import type { AnalyticsListener } from '../../lib/structures';
import { Actions, CommandTypes, Points, Tags, type CommandRunTypes } from '../../lib/types';

export function sharedCommandSuccessRun(listener: AnalyticsListener, commandName: string, runType: CommandRunTypes, category: string | null): void {
	const command = new Point(Points.Commands)
		.tag(Tags.Action, Actions.Addition)
		.tag(CommandTypes.RunType, runType)
		.intField(commandName.replace(/^time$/, 'case-time'), 1);

	if (category) command.tag(CommandTypes.Category, category);

	return listener.writePoint(command);
}
