const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  // 关闭打包后会默认生成的map文件 
  productionSourceMap: false,
  transpileDependencies: true,
  // 关闭eslint
  lintOnSave: false,
  // 配置代理跨域
  devServer: {
    proxy: {
      "/api": {
        target: "http://gmall-h5-api.atguigu.cn"
      }
    }
  },
  publicPath: './',
})
