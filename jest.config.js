module.exports = {
  verbose: true,
  preset: 'ts-jest/presets/js-with-ts-esm',
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/cypress/', '/es/', '/example/', '/lib/', '/node_modules/'],
  transformIgnorePatterns: ['node_modules/(?!(lodash-es)/)'],
  collectCoverageFrom: ['./src/**/*.{js,jsx,ts,tsx}'],
  coverageProvider: 'v8',
  globals: {
    extensionsToTreatAsEsm: ['.ts', '.js'],
    'ts-jest': {
      useESM: true,
    },
  },
  // disable jest's attempts to parse styles and static resources
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js',
  },
};
