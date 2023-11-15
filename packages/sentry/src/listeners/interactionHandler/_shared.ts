import { captureException } from '@sentry/node';

export function sharedInteractionHandlerRun(error: unknown, name: string, handlerName: string) {
	return captureException(error, { level: 'error', tags: { event: name }, extra: { handler: handlerName } });
}
