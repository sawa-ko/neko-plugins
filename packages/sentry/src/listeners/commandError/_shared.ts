import { captureException } from '@sentry/node';

export function sharedCommandErrorRun(error: unknown, name: string, commandName: string) {
	return captureException(error, { level: 'error', tags: { event: name }, extra: { command: commandName } });
}
