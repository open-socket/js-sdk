import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';

export default [
  { files: ['**/*.test.{js,mjs,cjs,ts,jsx,tsx}'] },
  {
    languageOptions: {
      parser: tseslint.Parser, // Use TypeScript parser if you have TypeScript files
      globals: {
        ...globals.browser,
        jest: true, // Add Jest globals here
        test: true,
        expect: true,
      },
    },
  },
  {
    languageOptions: {
      parser: tseslint.Parser, // Use TypeScript parser if you have TypeScript files
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: 'detect', // Automatically detect React version
      },
    },
  },
];
