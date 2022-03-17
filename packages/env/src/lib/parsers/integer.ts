/**
 * Parse the value of an environment variable to integer.
 * @param {string} name Name of the environment variable key.
 * @param {number} defaultValue Default value in case the environment variable does not exist or any other problem.
 * @returns {number} integer
 * @since 1.0.0
 */
export const parseEnvInteger = (name: string, defaultValue = 0) => {
	const value = process.env[name];
	if (!value) return defaultValue ?? '';

	const check = Number.isInteger(Number(value));
	if (!check) return defaultValue ?? '';

	return Number(value);
};
