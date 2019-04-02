process.env.VUE_APP_DEV = "http://10.6.78.90/addressManage" //"http://10.6.49.71:1337"

module.exports = {
  // publicPath: '/',
  productionSourceMap: false,
  outputDir: '../backend/.tmp/public',
  devServer: {
    proxy: {
      '/api/*': {
        target: process.env.VUE_APP_DEV,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          "^/api" : ""
        },
        cookieDomainRewrite: "10.6.49.71:8080"
      }
    }
  }
}