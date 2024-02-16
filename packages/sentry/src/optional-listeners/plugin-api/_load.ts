import { container } from '@sapphire/framework';
import { PluginSentryListener as PluginServerError } from './PluginServerError';

export function loadPluginApiListeners() {
	const store = 'listeners' as const;
	void container.stores.loadPiece({ name: 'PluginSentryServerError', piece: PluginServerError, store });
}
