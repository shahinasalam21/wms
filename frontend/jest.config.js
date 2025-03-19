export default {
    testEnvironment: "jsdom",
    transform: {
      "^.+\\.jsx?$": "babel-jest"
    },
    moduleNameMapper: {
      "\\.(css|less|scss|sass)$": "identity-obj-proxy",
      "^react-router-dom$": "<rootDir>/node_modules/react-router-dom"
    },
    setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"]
  };
  