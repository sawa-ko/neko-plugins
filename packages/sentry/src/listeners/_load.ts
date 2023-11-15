import { container } from '@sapphire/pieces';
import { PluginSentryListener as PluginError } from './PluginError';
import { PluginSentryListener as PluginListenerError } from './PluginListenerError';
import { PluginSentryListener as PluginChatInputCommandError } from './commandError/PluginChatInputCommandError';
import { PluginSentryListener as PluginCommandAutocompleteInteractionError } from './commandError/PluginCommandAutocompleteInteractionError';
import { PluginSentryListener as PluginContextMenuCommandError } from './commandError/PluginContextMenuCommandError';
import { PluginSentryListener as PluginMessageCommandError } from './commandError/PluginMessageCommandError';
import { PluginSentryListener as PluginInteractionHandlerError } from './interactionHandler/PluginInteractionHandlerError';
import { PluginSentryListener as PluginInteractionHandlerParseError } from './interactionHandler/PluginInteractionHandlerParseError';

export function loadListeners() {
	const store = 'listeners' as const;
	void container.stores.loadPiece({ name: 'PluginSentryChatInputCommandError', piece: PluginChatInputCommandError, store });
	void container.stores.loadPiece({
		name: 'PluginSentryCommandAutocompleteInteractionError',
		piece: PluginCommandAutocompleteInteractionError,
		store
	});
	void container.stores.loadPiece({ name: 'PluginSentryContextMenuCommandError', piece: PluginContextMenuCommandError, store });
	void container.stores.loadPiece({ name: 'PluginSentryMessageCommandError', piece: PluginMessageCommandError, store });
	void container.stores.loadPiece({ name: 'PluginSentryInteractionHandlerError', piece: PluginInteractionHandlerError, store });
	void container.stores.loadPiece({ name: 'PluginSentryInteractionHandlerParseError', piece: PluginInteractionHandlerParseError, store });
	void container.stores.loadPiece({ name: 'PluginSentryError', piece: PluginError, store });
	void container.stores.loadPiece({ name: 'PluginSentryListenerError', piece: PluginListenerError, store });
}
