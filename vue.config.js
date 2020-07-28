const webpack = require('webpack')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  assetsDir: 'static',
  chainWebpack: config => {
    config.resolve.alias
      .set('public', path.resolve(__dirname, 'public'))
      .set('assets', path.resolve(__dirname, 'src/assets'))
      .set('widget', path.resolve(__dirname, 'src/components/widget'))
      .set('app', path.resolve(__dirname, 'src/main.ts'))
      .set('myAxios', path.resolve(__dirname, 'src/service/myAxios.ts'))
      .set('api', path.resolve(__dirname, 'src/service/api.ts'))
      .set('service', path.resolve(__dirname, 'src/service/index.ts'))
      .set('mock', path.resolve(__dirname, 'src/service/mockData.ts'))
      .set('common', path.resolve(__dirname, 'src/assets/scripts/common.ts'))
      .set('layer', path.resolve(__dirname, 'public/plugins/layer/layer.js'))
      .set('annotation', path.resolve(__dirname, 'public/plugins/annotation/annotation.min.js'))

    config.module
      .rule('eslint')
      .exclude
      .add(path.resolve(__dirname, 'public'))
      .end()

    config.module
      .rule('js')
      .exclude
      .add(path.resolve(__dirname, 'public'))
      .end()
  },
  configureWebpack: {
    output: {
      libraryExport: 'default'
    },
    plugins: process.env.NODE_ENV === 'develop' ? [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.$': 'jquery',
        'window.jQuery': 'jquery'
      })
    ] : [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.$': 'jquery',
        'window.jQuery': 'jquery'
      }),
      new CopyWebpackPlugin([{
        from: path.resolve(__dirname, 'server/*'),
        to: path.resolve(__dirname, 'dist')
      }])
    ],
    module: {
      rules: [
        {
          test: require.resolve('jquery'),
          use: [
            {
              loader: 'expose-loader',
              options: 'jQuery'
            },
            {
              loader: 'expose-loader',
              options: 'jquery'
            },
            {
              loader: 'expose-loader',
              options: '$'
            }
          ]
        }
      ]
    }
  }
}
