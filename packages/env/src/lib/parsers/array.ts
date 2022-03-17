import { parseObjectString } from './object';

/**
 * Parse the value of an environment variable to an array.
 * @param {string} name Name of the environment variable key.
 * @param {boolean} simple Option that allows to parse a string of type "a,b,c" to an array.
 * @param {any[]} defaultValue Default value in case the environment variable does not exist or any other problem.
 * @returns {any[]} Array
 * @since 1.0.0
 */
export const parseEnvArray = <T = []>(name: string, simple?: boolean, defaultValue: any[] = []) => {
	const value = process.env[name];
	if (!value) return defaultValue;
	if (simple) return value.split(',').map((i) => i.trim());

	const data = parseObjectString(value);
	if (!Array.isArray(data)) return defaultValue;

	return data as unknown as T;
};
