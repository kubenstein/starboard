const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const rootDir = `${__dirname}/frontend/`;

module.exports = {
  entry: './frontend/index.js',

  output: {
    path: `${__dirname}/build`,
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
        loader: `file?name=[path][name].[ext]&context=${rootDir}`
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$/,
        loader: `file?name=[path][name]-[hash:6].[ext]&context=${rootDir}`
      },
      {
        test: /\.s?css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css!sass')
      }
    ]
  },

  resolve: {
    root: [
      rootDir
    ]
  },

  devServer: {
    proxy: {
      '/api/**': {
        target: 'http://localhost:8081',
        secure: false
      },

      '/socket.io/**': {
        target: 'http://localhost:8081',
        secure: false
      }
    }
  },

  plugins: process.env.NODE_ENV === 'production' ? [
    new ExtractTextPlugin('application.css'),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/
    })
  ] : [
    new ExtractTextPlugin('application.css'),
  ],
};
