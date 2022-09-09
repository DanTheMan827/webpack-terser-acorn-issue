const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const internalPath = path.resolve(path.join(__dirname, 'node_modules', '.cache', 'dist-temp'));

jsEntries = {
  main: './src/index.js',
}

module.exports = (env, argv) => {
  return {
    mode: argv.mode || "development",
    entry: { ...jsEntries },
    devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.(?:pug|jade)$/,
          use: [
            'pug-loader'
          ]
        },
      ]
    },
    optimization: {
      minimize: argv.mode == "production",
      minimizer: argv.mode != "production" ? [] : [
        new TerserPlugin()
      ]
    },
    externals: {
      window: "window",
      document: "document",
      location: "location"
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/templates/index.pug',
        minify: false
      }),
    ],
    output: {
      path: internalPath,
      filename: '[contenthash].js',
      sourceMapFilename: '[contenthash].map'
    }
  }
};
