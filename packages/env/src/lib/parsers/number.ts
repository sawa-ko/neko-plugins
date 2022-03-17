/**
 * Parse the value of an environment variable to number.
 * @param {string} name Name of the environment variable key.
 * @param {number} defaultValue Default value in case the environment variable does not exist or any other problem.
 * @returns {number} number
 * @since 1.0.0
 */
export const parseEnvNum = (name: string, defaultValue = 0) => {
	const value = process.env[name];
	if (!value) return defaultValue ?? '';

	const check = value.length > 0 && !isNaN(Number(value));
	if (!check) return defaultValue ?? '';

	return Number(value);
};
