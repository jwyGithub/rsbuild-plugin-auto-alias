import type { RsbuildPlugin, SourceConfig } from '@rsbuild/core';
import type { AutoAlias, GetDirs } from './type.js';
import { join } from 'node:path';
import process from 'node:process';
import { getDirs, hasFile } from './shared.js';
import { syncJson } from './sync.js';

const PLUGIN_NAME = 'scope:auto-alias';

/**
 * @description 默认配置
 */
const DEFAULT_CONFIG: Required<AutoAlias> = {
    root: join(process.cwd(), 'src'),
    prefix: '@',
    mode: 'sync',
    aliasPath: null
};

/**
 * @description jsconfig.json路径
 * @param root string
 * @returns  string
 */
const jsconfig = (root: string) => join(root, 'jsconfig.json');

/**
 * @description tsconfig.json路径
 * @param root string
 * @returns  string
 */
const tsconfig = (root: string) => join(root, 'tsconfig.json');

/**
 * @description 生成数组
 * @param dirs GetDirs
 * @param root string
 * @param prefix string
 */
function genAlias(dirs: GetDirs, root: string, prefix: string) {
    return dirs.reduce<SourceConfig['alias']>(
        (result, item) => {
            result![`${prefix}${item.dirName}`] = item.dirPath;
            return result;
        },
        { [prefix]: root }
    );
}

/**
 * @description 合并配置
 * @param baseConfig AutoAlias
 * @returns Required<AutoAlias>
 */
const mergeConfig = (baseConfig: AutoAlias): Required<AutoAlias> => {
    return {
        root: baseConfig.root ?? DEFAULT_CONFIG.root,
        prefix: baseConfig.prefix ?? DEFAULT_CONFIG.prefix,
        mode: baseConfig.mode ?? DEFAULT_CONFIG.mode,
        aliasPath: baseConfig.aliasPath ?? DEFAULT_CONFIG.aliasPath
    };
};

export const pluginAutoAlias = (options: AutoAlias = {}): RsbuildPlugin => ({
    name: PLUGIN_NAME,

    setup(api) {
        const { root, prefix, mode, aliasPath } = mergeConfig(options);

        if (!hasFile(root)) return;
        const dirs = getDirs(root);

        const currentConfig = api.getRsbuildConfig('current');
        const source = currentConfig.source ?? {};
        source.alias = source.alias ?? {};
        const alias = genAlias(dirs, root, prefix);
        source.alias = { ...source.alias, ...alias };

        syncJson({
            aliasPath,
            jsJson: jsconfig(process.cwd()),
            tsJson: tsconfig(process.cwd()),
            alias,
            root,
            prefix,
            mode
        });
    }
});
