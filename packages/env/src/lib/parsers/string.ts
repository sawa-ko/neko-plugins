/**
 * Parse the value of an environment variable to string.
 * @param {string} name Name of the environment variable key.
 * @param {string} defaultValue Default value in case the environment variable does not exist or any other problem.
 * @returns {string} string
 * @since 1.0.0
 */
export const parseEnvString = (name: string, defaultValue = '') => {
	const value = process.env[name];
	if (!value || value.length === 0) return defaultValue;
	if (defaultValue) return defaultValue;

	return value;
};
