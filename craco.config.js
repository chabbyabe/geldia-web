const path = require("path");

module.exports = {
  webpack: {
    alias: {
      "@base": path.resolve(__dirname, "src/"),
      "@core": path.resolve(__dirname, "src/core"),
      "@data": path.resolve(__dirname, "src/core/data"),
      "@domain": path.resolve(__dirname, "src/core/domain"),
      "@interface": path.resolve(__dirname, "src/core/interface"),
      "@screens": path.resolve(__dirname, "src/core/interface/ui/screens"),
    }
  },
  jest: {
    configure: {
      moduleNameMapper: {
        "^@base/(.*)$": "<rootDir>/src/$1",
        "^@core/(.*)$": "<rootDir>/src/core/$1",
        "^@data/(.*)$": "<rootDir>/src/core/data/$1",
        "^@domain/(.*)$": "<rootDir>/src/core/domain/$1",
        "^@interface/(.*)$": "<rootDir>/src/core/interface/$1",
        "^@screens/(.*)$":
          "<rootDir>/src/core/interface/ui/screens/$1",
      },
    },
  },
};