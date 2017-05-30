const fs = require('fs');

const srcDir = __dirname;
const rootDir = `${srcDir}/../`;
const backendDir = `${srcDir}/backend/`;

// taken from http://jlongster.com/Backend-Apps-with-Webpack--Part-I
const nodeModules = {};
fs.readdirSync('node_modules')
  .filter((x) => { return ['.bin'].indexOf(x) === -1; })
  .forEach((mod) => { nodeModules[mod] = `commonjs ${mod}`; });

let entry;
let output;
if (process.env.NODE_ENV === 'production') {
  entry = `${srcDir}/lib.js`;
  output = {
    path: `${rootDir}/dist/`,
    publicPath: '/',
    filename: 'starboard.js',
    library: 'starboard',
    libraryTarget: 'umd',
    umdNamedDefine: true
  };
} else {
  entry = `${backendDir}/dev-server-runner.js`;
  output = {
    path: `${rootDir}/.tmp/backend/`,
    publicPath: '/',
    filename: 'bundled-server-runner.js'
  };
}

module.exports = {
  target: 'node',
  entry: entry,
  output: output,
  node: {
    __dirname: false,
    __filename: false,
  },

  module: {
    loaders: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel',
        query: {
          presets: ['stage-0', 'es2015']
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

  externals: nodeModules
};
