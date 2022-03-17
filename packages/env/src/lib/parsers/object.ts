/**
 * Parse the value of an environment variable to object.
 * @param {string} name Name of the environment variable key.
 * @param {object} defaultValue Default value in case the environment variable does not exist or any other problem.
 * @returns {object} object
 * @since 1.0.0
 */
export const parseEnvObject = <T = Record<string | number, unknown>>(name: string, defaultValue: Record<string | number, unknown> = {}) => {
	const value = process.env[name];
	if (!value) return defaultValue;

	return parseObjectString(value) as T;
};

export const parseObjectString = (value: string) => {
	try {
		return JSON.parse(value);
	} catch (error) {
		return null;
	}
};
