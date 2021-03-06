const webpack = require("webpack");

module.exports = {
  entry: "./src/main.bs.js",
  output: {
    filename: "./build/index.js"
  },
  target: "node",
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production")
    }),
    new webpack.BannerPlugin({
      banner: "#!/usr/bin/env node",
      raw: true
    })
  ]
};
