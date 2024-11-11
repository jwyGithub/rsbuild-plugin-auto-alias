# rsbuild-plugin-auto-alias

automatically generate alias based on path

<p align="center">
  <img src="https://img.shields.io/npm/v/rsbuild-plugin-auto-alias" alt='version'>
  <img src="https://img.shields.io/npm/dm/rsbuild-plugin-auto-alias" alt='download'>
  <img src="https://img.shields.io/github/issues/jwyGithub/rsbuild-plugin-auto-alias" alt='issues'>
  <img src="https://img.shields.io/github/license/jwyGithub/rsbuild-plugin-auto-alias" alt='license'>
</p>
<br />

## Features

-   Support for custom alias prefixes
-   Supports synchronous mode configuration

## Install

#### pnpm

```sh
pnpm add rsbuild-plugin-auto-alias -D
```

#### yarn

```sh
yarn add rsbuild-plugin-auto-alias -D
```

#### npm

```sh
npm install rsbuild-plugin-auto-alias -D
```

## Use

> rsbuild.config.ts / rsbuild.config.js

```typescript
import { defineConfig } from '@rsbuild/core';
import { pluginAutoAlias } from 'rsbuild-plugin-auto-alias';

export default defineConfig({
    plugins: [pluginAutoAlias({})]
});
```

## Option

```typescript
export interface AutoAlias {
    /**
     * @description the root directory where the alias needs to be generated is src by default
     * @default src
     */
    root?: string;

    /**
     * @description prefix for generating aliases
     * @default @
     */
    prefix?: string;

    /**
     * @description synchronize the mode of json configuration
     * @default all
     */
    mode?: 'sync' | 'off';

    /**
     * @description alias configuration file path
     * @default tsconfig.json
     */
    aliasPath?: string;
}
```

> tsconfig.json / jsconfig.json

```json
{
    "compilerOptions": {
        "baseUrl": "./"
        // ...
    }
}
```

## Example

    |-- src
        |-- plugins
        |-- router
        |-- scss
        |-- store
        |-- utils
        |-- views
        |-- ....

```typescript
import xxx from '@plugins/xxx';
import xxx from '@router/xxx';
import xxx from '@scss/xxx';
import xxx from '@store/xxx';
import xxx from '@utils/xxx';
import xxx from '@views/xxx';
```
