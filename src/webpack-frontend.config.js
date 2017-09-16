/* eslint-disable no-var, vars-on-top */
const fs = require('fs-extra');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

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
  entry: `${frontendDir}/index.jsx`,

  output: {
    path: path,
    publicPath: '/',
    filename: 'bundle.js'
  },

  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        use: [
          {
            loader: 'babel-loader',
            query: {
              presets: ['stage-0', 'es2015', 'react']
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: `file-loader?name=[path][name].[ext]&context=${frontendDir}`
          }
        ]
      },
      {
        test: /\.jpe?g$|\.gif$|\.svg$|\.woff$|\.ttf$/,
        use: [
          {
            loader: `file-loader?name=[path][name]-[hash:6].[ext]&context=${frontendDir}`
          }
        ]
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: `file-loader?name=favicons/[name].[ext]&context=${frontendDir}`
          }
        ]
      },
      {
        test: /\.s?css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      frontendDir,
      srcDir,
      rootDir,
      'node_modules'
    ]
  },

  devServer: {
    proxy: {
      '/socket.io/**': {
        target: 'http://localhost:8081',
        secure: false
      },
      '/attachments/**': {
        target: 'http://localhost:8081',
        secure: false
      },
      '/login/': {
        target: 'http://localhost:8081',
        secure: false
      }
    }
  },

  stats: { children: false },
  plugins: (env === 'production' || env === 'test') ? [
    new ExtractTextPlugin({ filename: 'application.css' }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    })
  ] : [
    new ExtractTextPlugin({ filename: 'application.css' })
  ],
};
