import { join } from 'path';
import { EnvClient } from '../src/lib/client';

describe('Test values without default value', () => {
	const client = new EnvClient({ path: join(__dirname, 'utils', '.env'), env: 'production' });

	// @ts-expect-error yet, augment stuff
	test('Array', () => expect(client.array('ARRAY')).toStrictEqual([1, 2, 3, 4]));

	// @ts-expect-error yet, augment stuff
	test('Array simple', () => expect(client.array('ARRAY_SIMPLE', true)).toStrictEqual(['1', '2', '3', '4']));

	// @ts-expect-error yet, augment stuff
	test('BigInt', () => expect(client.bigInt('BIGINT')).toBe(9007199254740991n));

	// @ts-expect-error yet, augment stuff
	test('Boolean', () => expect(client.boolean('BOOLEAN')).toBe(true));

	// @ts-expect-error yet, augment stuff
	test('Integer', () => expect(client.integer('INTEGER')).toBe(1));

	// @ts-expect-error yet, augment stuff
	test('Number', () => expect(client.number('NUMBER')).toBe(1));

	// @ts-expect-error yet, augment stuff
	test('Object', () => expect(client.object('OBJECT')).toStrictEqual({ a: 1, b: 2 }));

	// @ts-expect-error yet, augment stuff
	test('String', () => expect(client.string('STRING')).toBe('test'));
});

describe('Test values with default value', () => {
	const client = new EnvClient({ path: join(__dirname, 'utils', '.env.local'), env: 'production' });

	// @ts-expect-error yet, augment stuff
	test('Array', () => expect(client.array('U', false, [])).toStrictEqual([]));

	// @ts-expect-error yet, augment stuff
	test('Array simple', () => expect(client.array('W', true, [1])).toStrictEqual([1]));

	// @ts-expect-error yet, augment stuff
	test('BigInt', () => expect(client.bigInt('U', 1n)).toBe(1n));

	// @ts-expect-error yet, augment stuff
	test('Boolean', () => expect(client.boolean('O', false)).toBe(false));

	// @ts-expect-error yet, augment stuff
	test('Integer', () => expect(client.integer('W', 2)).toBe(2));

	// @ts-expect-error yet, augment stuff
	test('Number', () => expect(client.number('O', 2)).toBe(2));

	// @ts-expect-error yet, augment stuff
	test('Object', () => expect(client.object('7', { a: 1 })).toStrictEqual({ a: 1 }));

	// @ts-expect-error yet, augment stuff
	test('String', () => expect(client.string('7', 'uwu')).toBe('uwu'));
});
