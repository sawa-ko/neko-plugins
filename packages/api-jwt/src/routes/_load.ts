import { container } from '@sapphire/pieces';
import { PluginRoute as PluginAuthorizeAccess } from './authorize/access';
import { PluginRoute as PluginAuthorizeRefresh } from './authorize/refresh';
import { PluginRoute as PluginAuthorizeRevoke } from './authorize/revoke';

export function loadRoutes() {
	const store = 'routes' as const;
	void container.stores.loadPiece({ name: 'access', piece: PluginAuthorizeAccess, store });
	void container.stores.loadPiece({ name: 'refresh', piece: PluginAuthorizeRefresh, store });
	void container.stores.loadPiece({ name: 'revoke', piece: PluginAuthorizeRevoke, store });
}
