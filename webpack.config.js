const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const internalPath = path.resolve(path.join(__dirname, 'node_modules', '.cache', 'dist-temp'));


const babelLoader = {
  loader: "babel-loader",
  options: {
    presets: [
      '@babel/typescript',
      '@babel/preset-env'
    ],
    plugins: ['@babel/plugin-transform-runtime', '@babel/proposal-class-properties', '@babel/proposal-object-rest-spread'],
    cacheDirectory: true
  }
};

jsEntries = {
  main: './src/index.js',
}

styleEntries = {
  style: './stylesheets/main.scss'
}

module.exports = (env, argv) => {
  return {
    mode: argv.mode || "development",
    entry: { ...jsEntries },
    devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.(?:js|ts)x?$/,
          use: [
            babelLoader
          ],
          exclude: /(node_modules|bower_components)/
        },
        {
          test: /\.(?:pug|jade)$/,
          use: [
            babelLoader,
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
      new webpack.DefinePlugin((() => {
        const mode = argv.mode || "development"

        return {
          '__DEVELOPMENT__': mode === 'development',
          '__PRODUCTION__': mode === 'production'
        }
      })())
    ],
    resolve: {
      extensions: [
        '.wasm', '.mjs', '.ts', '.tsx', '.js', '.jsx', '.json'
      ]
    },
    output: {
      path: internalPath,
      filename: '[contenthash].js',
      sourceMapFilename: '[contenthash].map'
    }
  }
};
