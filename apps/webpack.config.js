const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { loadAppsPath } = require('miap-webpack')

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

const appsConfig = {
  'cognito-trigger/custom-message'(target) {
    return {
      plugins: [
        new CopyWebpackPlugin({
          patterns: [
            {
              from: path.resolve(__dirname, 'src/cognito-trigger/custom-message', 'templates'),
              to: path.resolve(__dirname, target.outputPath, 'templates'),
              toType: 'dir'
            }
          ]
        })
      ]
    }
  }
}

module.exports = loadAppsPath(__dirname).map(target => {
  const appConfigResolver = appsConfig[target.appName]
  let appConfig = {}
  if (typeof appConfigResolver === 'function') {
    appConfig = appConfigResolver(target)
  }
  return {
    ...commonConfig,
    ...appConfig,
    entry: path.resolve(target.entryPath),
    output: {
      path: path.resolve(__dirname, target.outputPath),
      filename: target.filename,
      libraryTarget: 'commonjs2'
    }
  }
})
