

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
  }
  
}
