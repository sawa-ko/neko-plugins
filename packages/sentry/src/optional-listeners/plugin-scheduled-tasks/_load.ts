import { container } from '@sapphire/framework';
import { PluginSentryListener as PluginScheduledTaskError } from './PluginScheduledTaskError';

export function loadPluginScheduledTasksListeners() {
	const store = 'listeners' as const;
	void container.stores.loadPiece({ name: 'PluginSentryScheduledTaskError', piece: PluginScheduledTaskError, store });
}
