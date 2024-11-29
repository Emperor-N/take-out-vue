
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8888,
    proxy:{
      '/api': {
        target: 'http://localhost:8080/admin',
        pathRewrite:{
          '^/api':''
        }
      }
    },
    client: {
      overlay: {
          warnings: false,
          errors: true,
      },
  }
  }
})
