/**
 * Parse the value of an environment variable to bigint.
 * @param {string} name Name of the environment variable key.
 * @param {bigint} defaultValue Default value in case the environment variable does not exist or any other problem.
 * @returns {bigint} bigint
 * @since 1.0.0
 */
export const parseEnvBigInt = (name: string, defaultValue = 0n) => {
	const value = process.env[name];
	if (!value) return defaultValue;

	const check = !isNaN(Number(value)) && BigInt(Number.MAX_SAFE_INTEGER) <= BigInt(value);
	if (!check) return defaultValue;

	return BigInt(value);
};
