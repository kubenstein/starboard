/* eslint-disable no-var, vars-on-top */

const fs = require('fs');

const env = process.env.NODE_ENV;
const srcDir = __dirname;
const rootDir = `${srcDir}/../`;
const backendDir = `${srcDir}/backend/`;

// taken from http://jlongster.com/Backend-Apps-with-Webpack--Part-I
const nodeModules = {};
fs.readdirSync('node_modules')
  .filter((x) => { return ['.bin'].indexOf(x) === -1; })
  .forEach((mod) => { nodeModules[mod] = `commonjs ${mod}`; });

var entry;
var output;
if (env === 'production') {
  entry = `${srcDir}/lib.js`;
  output = {
    path: `${rootDir}/dist/`,
    publicPath: '/',
    filename: 'starboard.js',
    library: 'starboard',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  };
} else if (env === 'test') {
  entry = `${srcDir}/lib.js`;
  output = {
    path: `${rootDir}/.tmp/specs/src/`,
    publicPath: '/',
    filename: 'starboard.js',
    library: 'starboard',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  };
} else {
  entry = `${backendDir}/dev-server-runner.js`;
  output = {
    path: `${rootDir}/.tmp/backend/`,
    publicPath: '/',
    filename: 'bundled-server-runner.js',
  };
}

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  target: 'node',
  entry: entry,
  output: output,
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
            },
          },
        ],
      },
    ],
  },

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
