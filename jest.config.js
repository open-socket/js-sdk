export default {
  testEnvironment: 'jsdom', // Use jsdom for testing React components
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest', // Use babel-jest to transform JS/TS files
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'mjs', 'json', 'node'],
};
