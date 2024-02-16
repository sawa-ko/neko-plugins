import { container } from '@sapphire/pieces';
import { PluginMiddleware as PluginAuth } from './auth';

export function loadMiddlewares() {
	const store = 'middlewares' as const;
	void container.stores.loadPiece({ name: 'auth', piece: PluginAuth, store });
}
