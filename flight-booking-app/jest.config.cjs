module.exports = {
  testEnvironment: 'jsdom', // Simulate a browser environment
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest', // Use Babel for transpiling
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Extend Jest with custom setup
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock CSS imports
  },
  preset: 'ts-jest',
};