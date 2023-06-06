/** @type {import('jest').Config} */
module.exports = {
	displayName: 'unit test',
	testEnvironment: 'node',
	testRunner: 'jest-circus/runner',
	testMatch: ['<rootDir>/tests/**/*.test.ts'],
	transform: {
		'^.+\\.(t|j)sx?$': '@swc/jest'
	}
};
