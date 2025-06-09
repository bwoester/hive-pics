import config from 'eslint-config-vuetify/index.ts.mjs';

const baseConfig = Array.isArray(config) ? config : [config];

export default [
  ...baseConfig,
  {
    ignores: ['functions/lib/**'],
  },
];
