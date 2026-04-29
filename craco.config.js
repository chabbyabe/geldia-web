const path = require("path");

module.exports = {
  webpack: {
    configure: (config) => {
      const stage = process.env.REACT_APP_STAGE || "development";
      const isProd = stage === "production";

      config.resolve.alias = {
        ...config.resolve.alias,
        "@base": path.resolve(__dirname, "src/"),
        "@core": path.resolve(__dirname, "src/core"),
        "@data": path.resolve(__dirname, "src/core/data"),
        "@domain": path.resolve(__dirname, "src/core/domain"),
        "@interface": path.resolve(__dirname, "src/core/interface"),
        "@screens": path.resolve(
          __dirname,
          "src/core/interface/ui/screens"
        ),
      };

      if (!isProd) {
        // faster rebuilds
        config.cache = {
          type: "filesystem",
        };

        // disable expensive source maps
        config.devtool = "eval-cheap-module-source-map";
      }

      if (isProd) {
        // reduce memory usage during build
        config.devtool = false;

        config.optimization.splitChunks = {
          chunks: "all",
          maxSize: 200000,
          cacheGroups: {
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              reuseExistingChunk: true,
            },
          },
        };

        // limit parallelism (prevents OOM)
        if (config.optimization.minimizer) {
          config.optimization.minimizer.forEach((plugin) => {
            if (plugin.constructor?.name === "TerserPlugin") {
              plugin.options.parallel = 2;
            }
          });
        }
      }

      return config;
    },
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