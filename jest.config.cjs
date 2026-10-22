const { createDefaultPreset } = require('ts-jest');

module.exports = {
  ...createDefaultPreset(),
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.test.ts'],
  clearMocks: true,
};