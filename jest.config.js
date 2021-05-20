module.exports = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '.(ts|tsx|js)': 'ts-jest',
  },
  testRegex: '(/test/.*|\\.(test|spec))\\.(ts|tsx|js)$',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  testPathIgnorePatterns: ['/es/', '/example/', '/lib/', '/node_modules/(?!@agentlab)'],

  //preset: 'ts-jest/presets/default-esm',
  //transform: {},
  //extensionsToTreatAsEsm: ['.ts'],
  globals: {
    'ts-jest': {
      //useESM: true,
      tsconfig: 'tsconfig-jest.json',
    },
  },
};
