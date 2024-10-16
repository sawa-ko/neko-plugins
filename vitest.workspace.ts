import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
	'./vitest.config.mts',
	'./packages/api-jwt/vitest.config.mts',
	'./packages/env/vitest.config.mts',
	'./packages/statcord/vitest.config.mts'
]);
