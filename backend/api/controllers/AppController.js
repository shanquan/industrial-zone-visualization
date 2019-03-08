module.exports = {
  serve: (req, res) => {
    const fs = require('fs')
    const app = __dirname + '/../../.tmp/public/index.html'
    fs.createReadStream(app).pipe(res)
  }
}