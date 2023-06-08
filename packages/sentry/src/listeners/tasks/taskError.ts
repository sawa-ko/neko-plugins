import { container, Listener } from '@sapphire/framework';
import { ScheduledTaskEvents } from '@sapphire/plugin-scheduled-tasks';
import { captureException } from '@sentry/node';
import { SentryListener } from '../../lib/structures/listener';

export class SharedListener extends SentryListener<typeof ScheduledTaskEvents.ScheduledTaskError> {
	public constructor(context: Listener.Context, options: SentryListener.Options) {
		super(context, {
			...options,
			event: ScheduledTaskEvents.ScheduledTaskError
		});
	}

	public run(error: unknown, task: string, _payload: unknown) {
		if (!Reflect.has(container, 'tasks')) return;
		return captureException(error, { level: 'error', tags: { event: this.name }, extra: { task } });
	}
}
