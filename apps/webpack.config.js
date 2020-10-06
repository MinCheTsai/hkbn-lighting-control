const path = require('path')
const { loadAppsPath } = require('bls-webpack')

const commonConfig = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  target: 'node',
  externals: [
    'aws-sdk'
  ],
  node: {
    __dirname: true,
    __filename: true
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  }
}

module.exports = loadAppsPath(__dirname).map(target => {
  return {
    ...commonConfig,
    entry: path.resolve(target.entryPath),
    output: {
      path: path.resolve(__dirname, target.outputPath),
      filename: target.filename,
      libraryTarget: 'commonjs2'
    }
  }
})
