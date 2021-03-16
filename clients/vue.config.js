process.env.VUE_APP_VERSION = require('./package.json').version

module.exports = {
  outputDir: 'dists',
  pluginOptions: {
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false
    }
  },
  devServer: {
    port: 8010
  },
  transpileDependencies: [
    'quasar'
  ]
}
