const registerRouter = require('./backend/router')
const bodyParser = require('body-parser')
module.exports = {
  css: {
    loaderOptions: {
      sass: {
        // 全局引入变量和 mixin
        data: `
          @import "@/assets/scss/mixin.scss";
        `
      }
    }
  },
  // 提供before一个函数，app就是express的一个实例，就可以调用app来搭建后端路由等等
  devServer: {
    before(app) {
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(bodyParser.json());
      registerRouter(app)
    }
  },
  configureWebpack: (config) => {
    if (process.env.npm_config_report) {
      const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
      config.plugins.push(new BundleAnalyzerPlugin())
    }
  },
  productionSourceMap: false,
  publicPath: process.env.NODE_ENV === 'production' ? '/music/' : '/'

}
