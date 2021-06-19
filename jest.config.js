module.exports = {
  verbose: true,
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/cypress/', '/es/', '/example/', '/lib/', '/node_modules/'],
  transformIgnorePatterns: ['node_modules/(?!(lodash-es)/)'],
  preset: 'ts-jest/presets/js-with-ts-esm',
  globals: {
    extensionsToTreatAsEsm: ['.ts', '.js'],
    'ts-jest': {
      useESM: true,
    },
  },
};
