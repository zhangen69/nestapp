const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'production',
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  entry: './dist/main.js',
  output: {
    path: path.resolve(__dirname, 'webpack-dist'),
    filename: 'server.bundle.js'
  },
  externals: [nodeExternals()],
};