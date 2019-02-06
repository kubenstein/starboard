/* eslint-disable no-var, vars-on-top */
const fs = require('fs-extra');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const env = process.env.NODE_ENV;
const srcDir = __dirname;
const rootDir = `${srcDir}/../`;
const frontendDir = `${srcDir}/frontend/`;

var path;
if (env === 'production') {
  path = `${rootDir}/dist/frontend`;
  fs.removeSync(path);
} else if (env === 'test') {
  path = `${rootDir}/.tmp/specs/src/frontend`;
  fs.removeSync(path);
}


module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: `${frontendDir}/index.jsx`,

  output: {
    path: path,
    publicPath: '/',
    filename: 'starboard-web-client.bundle.js',
  },

  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: `file-loader?name=[path][name].[ext]&context=${frontendDir}`,
          },
        ],
      },
      {
        test: /\.png$|\.jpe?g$|\.gif$|\.svg$|\.woff$|\.ttf$/,
        use: [
          {
            loader: `file-loader?name=images/[name].[ext]&context=${frontendDir}`,
          },
        ],
      },
      {
        test: /\.s?css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      frontendDir,
      srcDir,
      rootDir,
      'node_modules',
    ],
  },

  devServer: {
    disableHostCheck: true,
    proxy: {
      '/socket.io/**': {
        target: 'http://localhost:8081',
        secure: false,
      },
      '/attachments/**': {
        target: 'http://localhost:8081',
        secure: false,
      },
      '/login/': {
        target: 'http://localhost:8081',
        secure: false,
      },
    },
  },

  stats: { children: false },
  optimization: {
    minimizer: (env === 'production' || env === 'test') ? [
      new UglifyJsPlugin(),
    ] : [],
  },
  plugins: (env === 'production' || env === 'test') ? [
    new MiniCssExtractPlugin({ filename: 'starboard-web-client.bundle.css' }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
  ] : [
    new MiniCssExtractPlugin({ filename: 'starboard-web-client.bundle.css' }),
  ],
};
