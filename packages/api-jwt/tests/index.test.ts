import { isClass } from '@sapphire/utilities';
import { AuthMiddleware, AuthClient, AuthRoute } from '../src';
import '../src/register';

describe('Lib classes', () => {
	test('Auth client', () => {
		expect(isClass(AuthClient)).toBe(true);
	});

	test('Auth middleware', () => {
		expect(isClass(AuthMiddleware)).toBe(true);
	});

	test('Auth route', () => {
		expect(isClass(AuthRoute)).toBe(true);
	});
});
