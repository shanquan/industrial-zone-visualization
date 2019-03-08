process.env.VUE_APP_DEV = "http://localhost:1337"

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
        cookieDomainRewrite: "localhost:8080"
      }
    }
  }
}