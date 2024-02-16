import { container } from '@sapphire/pieces';
import { PluginAnalyticsListener as PluginAnalyticsSync } from './PluginAnalyticsSync';
import { PluginAnalyticsListener as PluginMessageCreate } from './PluginMessageCreate';
import { PluginAnalyticsListener as PluginChatInputCommandSuccess } from './commandSuccess/PluginChatInputCommandSuccess';
import { PluginAnalyticsListener as PluginCommandAutocompleteInteractionSuccess } from './commandSuccess/PluginCommandAutocompleteInteractionSuccess';
import { PluginAnalyticsListener as PluginContextMenuCommandSuccess } from './commandSuccess/PluginContextMenuCommandSuccess';
import { PluginAnalyticsListener as PluginMessageCommandSuccess } from './commandSuccess/PluginMessageCommandSuccess';
import { PluginAnalyticsListener as PluginGuildCreate } from './guild/PluginGuildCreate';
import { PluginAnalyticsListener as PluginGuildDelete } from './guild/PluginGuildDelete';

export function loadListeners() {
	const store = 'listeners' as const;
	void container.stores.loadPiece({ name: 'PluginAnalyticsSync', piece: PluginAnalyticsSync, store });
	void container.stores.loadPiece({ name: 'PluginAnalyticsChatInputCommandSuccess', piece: PluginChatInputCommandSuccess, store });
	void container.stores.loadPiece({
		name: 'PluginAnalyticsCommandAutocompleteInteractionSuccess',
		piece: PluginCommandAutocompleteInteractionSuccess,
		store
	});
	void container.stores.loadPiece({ name: 'PluginAnalyticsContextMenuCommandSuccess', piece: PluginContextMenuCommandSuccess, store });
	void container.stores.loadPiece({ name: 'PluginAnalyticsMessageCommandSuccess', piece: PluginMessageCommandSuccess, store });
	void container.stores.loadPiece({ name: 'PluginAnalyticsGuildDelete', piece: PluginGuildDelete, store });
	void container.stores.loadPiece({ name: 'PluginAnalyticsGuildCreate', piece: PluginGuildCreate, store });
	void container.stores.loadPiece({ name: 'PluginAnalyticsMessageCreate', piece: PluginMessageCreate, store });
}
