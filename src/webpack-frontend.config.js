const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const srcDir = __dirname;
const rootDir = `${srcDir}/../`;
const frontendDir = `${srcDir}/frontend/`;

module.exports = {
  entry: `${frontendDir}/index.jsx`,

  output: {
    path: `${rootDir}/dist/frontend`,
    publicPath: '/',
    filename: 'bundle.js'
  },

  module: {
    loaders: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel',
        query: {
          presets: ['stage-0', 'es2015', 'react']
        }
      },
      {
        test: /\.html$/,
        loader: `file?name=[path][name].[ext]&context=${frontendDir}`
      },
      {
        test: /\.jpe?g$|\.gif$|\.svg$|\.woff$|\.ttf$/,
        loader: `file?name=[path][name]-[hash:6].[ext]&context=${frontendDir}`
      },
      {
        test: /\.png$/,
        loader: `file?name=favicons/[name].[ext]&context=${frontendDir}`
      },
      {
        test: /\.s?css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css!sass')
      }
    ]
  },

  resolve: {
    root: [
      frontendDir,
      srcDir,
      rootDir
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
      }
    }
  },

  stats: { children: false },
  plugins: process.env.NODE_ENV === 'production' ? [
    new ExtractTextPlugin('application.css'),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    })
  ] : [
    new ExtractTextPlugin('application.css'),
  ],
};
