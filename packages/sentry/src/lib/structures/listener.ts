import { Listener } from '@sapphire/framework';
import { captureException as sentryCaptureException } from '@sentry/node';
import type { ClientEvents } from 'discord.js';
import { isSentryInitialized } from '../index';

export abstract class SentryListener<E extends keyof ClientEvents | symbol = ''> extends Listener<E> {
	public captureException = sentryCaptureException;

	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, { enabled: isSentryInitialized(), ...options });
	}
}
