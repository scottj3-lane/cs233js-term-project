const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// Load environment variables from .env file
require('dotenv').config();

const isProduction = (process.env.NODE_ENV === 'production');
const fileNamePrefix = isProduction ? '[chunkhash].' : '';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: {
    general: './src/general.js',
    cards: './src/cards.js',
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: `${fileNamePrefix}[name].js`,
    clean: true,
  },
  target: 'web',
  devServer: {
    static: "./dist",
    port: 8080,
    open: true,
    hot: true
  },
  devtool: isProduction ? 'inline-source-map' : 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/i,
        use: isProduction
          ? [MiniCssExtractPlugin.loader, 'css-loader']
          : ['style-loader', 'css-loader']
      },
      {
        test: /\.s[ac]ss$/i,
        use: isProduction
          ? [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
          : ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(svg|eot|ttf|woff|woff2)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(png|jpg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./src/index.html"),
      chunks: ["general"],
      inject: "body",
      filename: "index.html",
    }),
    // new CopyPlugin({
    //   patterns: [
    //     {
    //       from: path.resolve(__dirname, "src/assets"),
    //       to: path.resolve(__dirname, "dist/assets"),
    //     },
    //   ],
    // }),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      SERVER_URL: JSON.stringify(process.env.SERVER_URL),
      GMAP_KEY: JSON.stringify(process.env.GMAP_KEY),
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
};

if (isProduction) {
  module.exports.plugins.push(
    new MiniCssExtractPlugin({
      filename: `${fileNamePrefix}[name].css`,
    })
  );
}
