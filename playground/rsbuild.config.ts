import { defineConfig } from '@rsbuild/core';
import { pluginAutoAlias } from '../src';

export default defineConfig({
    plugins: [pluginAutoAlias({})]
});
