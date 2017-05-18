const webpack = require('webpack');
const fs = require('fs');

const rootDir = __dirname;
const srcDir = `${rootDir}/src/`;
const backendDir = `${srcDir}/backend/`;

// taken from http://jlongster.com/Backend-Apps-with-Webpack--Part-I
const nodeModules = {};
fs.readdirSync('node_modules')
  .filter((x) => {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach((mod) => {
    nodeModules[mod] = `commonjs ${mod}`;
  });


module.exports = {
  entry: `${backendDir}/server.js`,
  target: 'node',

  output: {
    path: (process.env.NODE_ENV === 'production' ?
          `${rootDir}/dist/` :
          `${rootDir}/.tmp/backend/`),
    publicPath: '/',
    filename: 'bundled-server.js'
  },

  module: {
    loaders: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel',
        query: {
          presets: ['stage-0', 'es2015', 'react']
        }
      }
    ]
  },

  resolve: {
    root: [
      backendDir,
      srcDir,
      rootDir
    ]
  },

  externals: nodeModules,
  plugins: [
    new webpack.NormalModuleReplacementPlugin(/\.css|scss$/, 'node-noop'),
  ]
};
