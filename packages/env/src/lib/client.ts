import { config, type DotenvCraOptions } from 'dotenv-cra';
import { parseEnvBool, parseEnvNum, parseEnvString, parseEnvBigInt, parseEnvObject, parseEnvInteger, parseEnvArray } from './parsers';
import type { EnvKeys } from '../index';

/**
 * Client to obtain the values of environment variables parsed with the desired data type.
 * @since 1.0.0
 */
export class EnvClient {
	public constructor(private readonly options: DotenvCraOptions) {
		if (process.env.NODE_ENV) config(this.options);
	}

	/**
	 * Get a boolean value from an environment variable.
	 * @param {EnvKeys} key Name of the environment variable key.
	 * @param {boolean} defaultValue Default value in case the environment variable does not exist or any other problem.
	 * @returns {boolean} boolean
	 * @since 1.0.0
	 */
	public boolean(key: keyof EnvKeys, defaultValue?: boolean): boolean {
		return parseEnvBool(key, defaultValue);
	}

	/**
	 * Get a number value from an environment variable.
	 * @param {EnvKeys} key Name of the environment variable key.
	 * @param {number} defaultValue Default value in case the environment variable does not exist or any other problem.
	 * @returns {number} number
	 * @since 1.0.0
	 */
	public number(key: keyof EnvKeys, defaultValue?: number): number {
		return parseEnvNum(key, defaultValue);
	}

	/**
	 * Get a string value from an environment variable.
	 * @param {EnvKeys} key Name of the environment variable key.
	 * @param {string} defaultValue Default value in case the environment variable does not exist or any other problem.
	 * @returns {string} string
	 * @since 1.0.0
	 */
	public string(key: keyof EnvKeys, defaultValue?: string): string {
		return parseEnvString(key, defaultValue);
	}

	/**
	 * Get a bigint value from an environment variable.
	 * @param {EnvKeys} key Name of the environment variable key.
	 * @param {bigint} defaultValue Default value in case the environment variable does not exist or any other problem.
	 * @returns {bigint} bigint
	 * @since 1.0.0
	 */
	public bigInt(key: keyof EnvKeys, defaultValue?: bigint): bigint {
		return parseEnvBigInt(key, defaultValue);
	}

	/**
	 * Get a object value from an environment variable.
	 * @param {EnvKeys} key Name of the environment variable key.
	 * @param {Record<string | number, unknown>} defaultValue Default value in case the environment variable does not exist or any other problem.
	 * @returns {Record<string | number, unknown>} object
	 * @since 1.0.0
	 */
	public object<T = Record<string | number, unknown>>(
		key: keyof EnvKeys,
		defaultValue?: Record<string | number, unknown>
	): T | Record<string | number, unknown> {
		return parseEnvObject<T>(key, defaultValue);
	}

	/**
	 * Get a integer value from an environment variable.
	 * @param {EnvKeys} key Name of the environment variable key.
	 * @param {number} defaultValue Default value in case the environment variable does not exist or any other problem.
	 * @returns {number} integer
	 * @since 1.0.0
	 */
	public integer(key: keyof EnvKeys, defaultValue?: number): number {
		return parseEnvInteger(key, defaultValue);
	}

	/**
	 * Get a array value from an environment variable.
	 * @param {EnvKeys} key Name of the environment variable key.
	 * @param {any[]} defaultValue Default value in case the environment variable does not exist or any other problem.
	 * @returns {any[]} array
	 * @since 1.0.0
	 */
	public array(key: keyof EnvKeys, simple?: boolean, defaultValue?: any[]): any[] {
		return parseEnvArray(key, simple, defaultValue);
	}

	/**
	 * Get the value of an environment variable without parsing its value.
	 * @param {EnvKeys} key Name of the environment variable key.
	 * @param {unknown} defaultValue Default value in case the environment variable does not exist or any other problem.
	 * @returns {unknown} unknown
	 * @since 1.0.0
	 */
	public raw<T>(key: keyof EnvKeys, defaultValue: T): T {
		const value = process.env[key];
		if (!value) return defaultValue;

		return value as unknown as T;
	}

	/**
	 * Validate if an environment variable exists.
	 * @param {EnvKeys} key Name of the environment variable key.
	 * @returns {boolean} boolean
	 * @since 1.0.0
	 */
	public exist(key: keyof EnvKeys): boolean {
		const value = process.env[key];
		return value !== null && value !== undefined;
	}

	/**
	 * Validate if an environment variable exists and is defined with a value.
	 * @param {EnvKeys} key Name of the environment variable key.
	 * @returns {boolean} boolean
	 * @since 1.0.0
	 */
	public defined(key: keyof EnvKeys): boolean {
		const value = process.env[key];
		return value !== null && value !== undefined && value.length > 0;
	}
}
