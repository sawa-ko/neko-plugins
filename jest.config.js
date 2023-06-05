module.exports = {
	displayName: 'unit test',
	testEnvironment: 'node',
	testRunner: 'jest-circus/runner',
	testMatch: ['<rootDir>/packages/**/tests/*.test.ts', '<rootDir>/packages/**/tests/*.test.js'],
	transform: {
		"^.+\\.(t|j)sx?$": "@swc/jest",
	},
};
