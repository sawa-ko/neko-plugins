/**
 * Parse the value of an environment variable to boolean.
 * @param {string} name Name of the environment variable key.
 * @param {boolean} defaultValue Default value in case the environment variable does not exist or any other problem.
 * @returns {boolean} boolean
 * @since 1.0.0
 */
export const parseEnvBool = (name: string, defaultValue = false) => {
	const value = process.env[name];
	if (!value) return defaultValue;

	if (value === 'true') return true;
	if (value === 'false') return false;

	return defaultValue;
};
