import { container } from '@sapphire/framework';
import { ScheduledTask, ScheduledTaskEvents, ScheduledTaskOptions } from '@sapphire/plugin-scheduled-tasks';
import { captureException } from '@sentry/node';
import { SentryListener } from '../../lib/structures/SentryListener';

export class PluginSentryListener extends SentryListener<typeof ScheduledTaskEvents.ScheduledTaskError> {
	public constructor(context: SentryListener.Context, options: SentryListener.Options) {
		super(context, {
			...options,
			name: 'PluginSentryScheduledTaskError',
			event: ScheduledTaskEvents.ScheduledTaskError
		});
	}

	public run(error: unknown, task: ScheduledTask<never, ScheduledTaskOptions>, _payload: unknown) {
		if (!Reflect.has(container, 'tasks')) return;
		return captureException(error, { level: 'error', tags: { event: this.name }, extra: { task } });
	}
}
