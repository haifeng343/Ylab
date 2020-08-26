'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'YLab' // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following method:
// port = 9527 npm run dev OR npm run dev --port = 9527
// const port = process.env.port || process.env.npm_config_port || 9527 // dev port
// All configuration item explanations can be find in https://cli.vuejs.org/config/

module.exports = {
  pages: {
    standard: {
      entry: 'src/pages/standard/main.js',
      template: 'public/standard.html',
      filename: 'standard.html',
      chunks: ['chunk-libs', 'chunk-commons', 'chunk-elementUI', 'runtime', 'standard']
    },
    enterprise: {
      entry: 'src/pages/enterprise/main.js',
      template: 'public/enterprise.html',
      filename: 'enterprise.html',
      chunks: ['chunk-libs', 'chunk-commons', 'chunk-elementUI', 'runtime', 'enterprise']
    },
    lab: {
      entry: 'src/pages/lab/main.js',
      template: 'public/lab.html',
      filename: 'lab.html',
      chunks: ['chunk-libs', 'chunk-commons', 'chunk-elementUI', 'runtime', 'lab']
    }
  },
  publicPath:process.env.NODE_ENV =='development'?process.env.BASE_URL:'./',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: 5550,
    open: true,
    publicPath: '',
    overlay: {
      warnings: false,
      errors: true
    },
    proxy:{
      '/admin':{
        // target:'http://test.web.yibeirui.com/admin',
         target:'http://www.yibeirui.com/admin',
        changeOrigin:true
      }
    }
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack: (config) => {
    config.plugins.delete('preload-standard')
    config.plugins.delete('preload-enterprise')
    config.plugins.delete('preload-lab')
    config.plugins.delete('prefetch-standard')
    config.plugins.delete('prefetch-enterprise')
    config.plugins.delete('prefetch-lab')

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config
      // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('cheap-source-map')
      )

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
            // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 4, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
