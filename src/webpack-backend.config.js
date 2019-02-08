/* eslint-disable no-var, vars-on-top */

const fs = require('fs');
const NodemonPlugin = require('nodemon-webpack-plugin');

const srcDir = __dirname;
const rootDir = `${srcDir}/../`;
const backendDir = `${srcDir}/backend/`;

// taken from http://jlongster.com/Backend-Apps-with-Webpack--Part-I
const nodeModules = {};

fs.readdirSync('node_modules')
  .filter(x => (['.bin'].indexOf(x) === -1))
  .forEach((mod) => { nodeModules[mod] = `commonjs ${mod}`; });

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  target: 'node',
  entry: `${backendDir}/dev-server-runner.js`,
  output: {
    path: `${rootDir}/.tmp/backend/`,
    publicPath: '/',
    filename: 'bundled-server-runner.js',
  },
  node: {
    __dirname: false,
    __filename: false,
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
              plugins: [
                ['@babel/plugin-proposal-class-properties', { loose: true }],
                '@babel/plugin-proposal-object-rest-spread',
              ],
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new NodemonPlugin({
      verbose: true,
      nodeArgs: ['--inspect', '--debug'],
    }),
  ],

  resolve: {
    modules: [
      backendDir,
      srcDir,
      rootDir,
      'node_modules',
    ],
  },

  externals: nodeModules,
};
