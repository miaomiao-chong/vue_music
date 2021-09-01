const registerRouter = require ('./backend/router')

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
      registerRouter(app)
    }
  }
  
}
