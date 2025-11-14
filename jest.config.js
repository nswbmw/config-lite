module.exports = {
  // Test environment
  testEnvironment: 'node',

  // Test file patterns
  testMatch: [
    '**/__test__/**/*.test.js'
  ],

  // Coverage settings
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    'index.js'
  ],

  // Verbose output
  verbose: true,

  // Clear mocks between tests
  clearMocks: true,

  // Error handling
  errorOnDeprecated: true
}
