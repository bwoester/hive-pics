// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    {
        ignores: ['dist/**', 'node_modules/**'],
    },
    eslint.configs.recommended,
    tseslint.configs.recommendedTypeChecked,
    tseslint.configs.stylisticTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                projectService: {
                    allowDefaultProject: [
                        "eslint.config.js",
                        "tsup.config.ts"
                    ]
                },
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        // disable type-aware linting on JS files
        files: ['**/*.js', '**/*.mjs'],
        extends: [tseslint.configs.disableTypeChecked],
    },
);