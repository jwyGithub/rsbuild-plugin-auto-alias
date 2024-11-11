import { eslint } from '@jiangweiye/eslint-config';

export default eslint({
    typescript: true,
    rules: {
        'style/indent-binary-ops': 'off',
        'ts/no-unused-expressions': 'off',
        'style/eol-last': 'off'
    },
    ignores: ['dist', 'node_modules', 'playground']
});
