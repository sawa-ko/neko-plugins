import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
	'./vitest.config.ts',
	'./packages/api-jwt/vitest.config.ts',
	'./packages/env/vitest.config.ts',
	'./packages/statcord/vitest.config.ts'
]);
