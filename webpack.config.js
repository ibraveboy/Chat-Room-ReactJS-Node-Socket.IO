const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const WebpackMd5Hash = require("webpack-md5-hash");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Dotenv = require("dotenv-webpack");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const SRC_DIR = path.join(__dirname, "/client/src");
const DIST_DIR = path.join(__dirname, "/client/dist");

module.exports = {
  entry: { main: `${SRC_DIR}/index.js` },
  output: {
    path: DIST_DIR,
    filename: "[name].[chunkhash].js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            plugins:["babel-plugin-transform-class-properties"]
          }
        }
      },
      {
        test: /\.s?css$/,
        use: [
          "style-loader",
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin("client/dist", {}),
    new MiniCssExtractPlugin({
      filename: "style.[contenthash].css"
    }),
    new HtmlWebpackPlugin({
      inject: false,
      hash: true,
      template: `${SRC_DIR}/index.html`,
      filename: "index.html"
    }),
    new WebpackMd5Hash(),
    new Dotenv(),
    new CopyWebpackPlugin([
      {from:'client/src/css/assets/img',to:'assets/img'} 
    ]),
  ]
};
