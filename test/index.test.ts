import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';
import { createRsbuild } from '@rsbuild/core';
import { pluginAutoAlias } from '../src';

const __dirname = dirname(fileURLToPath(import.meta.url));

test('should build succeed', async () => {
    const rsbuild = await createRsbuild({
        cwd: __dirname,
        rsbuildConfig: {
            plugins: [
                pluginAutoAlias({
                    root: path.resolve(__dirname, '../playground/src'),
                    aliasPath: path.resolve(__dirname, './tsconfig.alias.json')
                })
            ]
        }
    });

    await rsbuild.build();
    const config = rsbuild.getNormalizedConfig();

    expect(Object.keys(config.source.alias)).toEqual(['@swc/helpers', '@', '@utils', '@views']);
});

test('prefix', async () => {
    const rsbuild = await createRsbuild({
        cwd: __dirname,
        rsbuildConfig: {
            plugins: [
                pluginAutoAlias({
                    root: path.resolve(__dirname, '../playground/src'),
                    aliasPath: path.resolve(__dirname, './tsconfig.alias.json'),
                    prefix: '#'
                })
            ]
        }
    });

    await rsbuild.build();
    const config = rsbuild.getNormalizedConfig();

    expect(Object.keys(config.source.alias)).toEqual(['@swc/helpers', '#', '#utils', '#views']);
});
