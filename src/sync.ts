import type { SourceConfig } from '@rsbuild/core';
import type { IJson, IPaths, Mode } from './type';
import { readFileSync, writeFileSync } from 'node:fs';
import path, { parse } from 'node:path';
import { hasFile, removeComments } from './shared';

/**
 * @description 获取json
 * @param jsonPath jsonPath
 * @returns IJson
 */
export function getJson(jsonPath: string): IJson {
    try {
        let jsonText = readFileSync(jsonPath, 'utf-8');
        jsonText = removeComments(jsonText);
        return JSON.parse(jsonText);
    } catch {
        return {
            compilerOptions: {
                paths: {}
            }
        };
    }
}
/**
 * @description 合并json
 * @param target IJson
 * @param source IJson
 * @returns IJson
 */
export function mergeJson(target: IJson, source: IJson): IJson {
    const targetPaths: IPaths = target.compilerOptions?.paths ?? {};
    const sourcePaths: IPaths = source.compilerOptions?.paths ?? {};
    for (const pathKey in targetPaths) {
        if (!Reflect.has(sourcePaths, pathKey)) {
            sourcePaths[pathKey] = targetPaths[pathKey];
        }
    }
    return {
        ...source,
        compilerOptions: {
            ...source.compilerOptions,
            paths: sourcePaths
        }
    };
}

/**
 * @description 移除某个path
 * @param pathKey path key
 * @param source  IJson
 * @returns IJson
 */
export function removePath(pathKey: string, source: IJson): IJson {
    const sourcePaths: IPaths = source.compilerOptions.paths;
    Reflect.deleteProperty(sourcePaths, pathKey);
    return {
        ...source,
        compilerOptions: {
            ...source.compilerOptions,
            paths: sourcePaths
        }
    };
}

/**
 * @description 转换成json path格式
 */
export function convertToJsonPath(root: string, { find, prefix }: { find: string; prefix: string }): { key: string; value: string } {
    const { name } = parse(root);
    const pathKey = `${prefix}${find}/*`;
    const pathValue = path.join(name, find, '*');
    return {
        key: pathKey,
        value: pathValue
    };
}

/**
 * @description 生成json
 * @param alias Alias[]
 * @param root string
 * @param prefix string
 * @returns IJson
 */
export function genJson(alias: SourceConfig['alias'], root: string, prefix: string): IJson {
    if (alias) {
        const paths = Object.keys(alias).reduce((result, item) => {
            const { key, value } = convertToJsonPath(root, { find: item.replace(prefix, ''), prefix });
            result[key] = [value];
            return result;
        }, {});
        return {
            compilerOptions: {
                paths,
                baseUrl: '.'
            }
        };
    }
    return {
        compilerOptions: {
            paths: {},
            baseUrl: '.'
        }
    };
}

export interface ISyncJson {
    aliasPath?: string | null;
    jsJson: string;
    tsJson: string;
    alias: SourceConfig['alias'];
    prefix: string;
    root: string;
    mode: Mode;
}

/**
 * @description 同步json文件
 */
export function syncJson({ aliasPath, jsJson, tsJson, alias, prefix, root, mode }: ISyncJson) {
    // 如果存在自定义的aliasPath文件，且mode为sync，则将alias写入到aliasPath文件中
    if (aliasPath && hasFile(aliasPath) && mode === 'sync') {
        const target = genJson(alias, root, prefix);
        const source = getJson(aliasPath);
        const newJson = mergeJson(target, source);
        hasFile(aliasPath) && writeFileSync(aliasPath, JSON.stringify(newJson, null, 4));
        return;
    }

    if (hasFile(jsJson) && mode === 'sync') {
        const target = genJson(alias, root, prefix);
        const source = getJson(jsJson);
        const newJson = mergeJson(target, source);
        hasFile(jsJson) && writeFileSync(jsJson, JSON.stringify(newJson, null, 4));
    }
    if (hasFile(tsJson) && mode === 'sync') {
        const target = genJson(alias, root, prefix);
        const source = getJson(tsJson);
        const newJson = mergeJson(target, source);
        hasFile(tsJson) && writeFileSync(tsJson, JSON.stringify(newJson, null, 4));
    }
}

export interface IRemoveJson {
    aliasPath?: string | null;
    jsJson: string;
    tsJson: string;
    unlinkDirName: string;
    root: string;
    prefix: string;
    mode: Mode;
}

export function excutor(json: string, path: string) {
    const newJson = removePath(path, getJson(json));
    writeFileSync(json, JSON.stringify(newJson, null, 4));
}

export function removeJson({ aliasPath, jsJson, tsJson, unlinkDirName, prefix, mode }: IRemoveJson) {
    const toRemovePath = `${prefix}${unlinkDirName}/*`;
    aliasPath && hasFile(aliasPath) && mode === 'sync' && excutor(aliasPath, toRemovePath);
    hasFile(jsJson) && mode === 'sync' && excutor(jsJson, toRemovePath);
    hasFile(tsJson) && mode === 'sync' && excutor(tsJson, toRemovePath);
}
