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
  }
};