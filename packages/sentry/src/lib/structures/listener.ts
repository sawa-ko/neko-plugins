import { Listener } from '@sapphire/framework';
import { isSentryInitialized } from '../index';
import { captureException as sentryCaptureException } from '@sentry/node';
import type { ClientEvents } from 'discord.js';
import type { SentryListenerOptions } from '../types';

export abstract class SentryListener<E extends keyof ClientEvents | symbol = ''> extends Listener<E> {
	public captureException = sentryCaptureException;

	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, { ...options, enabled: options.enabled ?? isSentryInitialized() });
	}
}

export namespace SentryListener {
	export type Options = SentryListenerOptions;
}
