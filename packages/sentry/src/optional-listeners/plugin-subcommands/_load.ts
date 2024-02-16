import { container } from '@sapphire/framework';
import { PluginSentryListener as PluginChatInputSubcommandError } from './PluginChatInputSubcommandError';
import { PluginSentryListener as PluginMessageSubcommandError } from './PluginMessageSubcommandError';

export function loadPluginSubcommandsListeners() {
	const store = 'listeners' as const;
	void container.stores.loadPiece({ name: 'PluginSentryChatInputSubcommandError', piece: PluginChatInputSubcommandError, store });
	void container.stores.loadPiece({ name: 'PluginSentryMessageSubcommandError', piece: PluginMessageSubcommandError, store });
}
