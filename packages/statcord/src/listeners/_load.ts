import { container } from '@sapphire/pieces';
import { PluginListener as PluginChatInputCommandAccepted } from './PluginChatInputCommandAccepted';
import { PluginListener as PluginMessageCommandAccepted } from './PluginMessageCommandAccepted';

export function loadListeners() {
	const store = 'listeners' as const;
	void container.stores.loadPiece({ name: 'PluginStatcordChatInputCommandAccepted', piece: PluginChatInputCommandAccepted, store });
	void container.stores.loadPiece({ name: 'PluginStatcordMessageCommandAccepted', piece: PluginMessageCommandAccepted, store });
}
