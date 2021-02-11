module.exports = {
  "roots": [
    "<rootDir>/src"
  ],
  "transform": {
    "^.+\\.ts$": "ts-jest"
  },
  "collectCoverage": true,
  "coverageThreshold": {
    "global": {
      "branches": 86.03,
      "functions": 100,
      "lines": 98.35,
      "statements": 98.41
    }
  },
  // We mess with globals (window, document) in the tests so
  // this keeps them from interfering with each other.
  "maxConcurrency": 1
}
