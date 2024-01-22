import { isClass } from '@sapphire/utilities';
import * as API from '../src';
import '../src/register';

describe('Lib classes', () => {
	test('Auth middleware', () => {
		expect(isClass(API.JWTMiddleware)).toBe(true);
	});

	test('Auth access route', () => {
		expect(isClass(API.JWTAccessRoute)).toBe(true);
	});

	test('Auth refresh route', () => {
		expect(isClass(API.JWTRefreshRoute)).toBe(true);
	});

	test('Auth revoke route', () => {
		expect(isClass(API.JWTRevokeRoute)).toBe(true);
	});
});
