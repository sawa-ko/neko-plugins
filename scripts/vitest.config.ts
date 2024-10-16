import type { ESBuildOptions } from 'vite';
import { configDefaults, defineConfig, type ViteUserConfig } from 'vitest/config';

export const createVitestConfig = (options: ViteUserConfig = {}) =>
	defineConfig({
		...options,
		test: {
			...options?.test,
			globals: true,
			coverage: {
				...options.test?.coverage,
				provider: 'v8',
				enabled: true,
				reporter: ['text', 'lcov', 'clover'],
				exclude: [...(configDefaults.coverage.exclude ?? []), ...(options.test?.coverage?.exclude ?? [])]
			}
		},
		esbuild: {
			...options?.esbuild,
			target: (options?.esbuild as ESBuildOptions | undefined)?.target ?? 'es2020'
		}
	});
