import { container } from '@sapphire/framework';
import { Client } from '../structures';

export function tryNumberParse(value: string | undefined) {
	if (typeof value === 'string') {
		const number = Number(value);
		if (Number.isNaN(number)) throw new TypeError(`Could not parse ${value} to a number`);
		return number;
	}

	return value;
}

export function isNullOrUndefined(value: unknown): value is null | undefined {
	return value === null || value === undefined;
}

export function isInfluxInitialized(): boolean {
	return Reflect.has(container, 'analytics') && container.analytics instanceof Client;
}
