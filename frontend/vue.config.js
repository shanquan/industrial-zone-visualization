process.env.VUE_APP_DEV = "http://localhost:1337" //"http://10.6.49.71:1337" "http://10.6.78.90/addressManage"

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
        cookieDomainRewrite: "10.6.48.80:8080"
      }
    }
  }
}