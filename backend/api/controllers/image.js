module.exports = async function (req, res){

  var SkipperDisk = require('skipper-disk');
  var fileAdapter = SkipperDisk( /* optional opts */ );
  // set the filename to the same file as the user uploaded
  res.set("Content-disposition", "inline; filename='" + req.param('name') + "'");

  let filePath = require('path').resolve(sails.config.appPath, `.tmp/uploads/${req.param('name')}.jpg`);
  // Stream the file down
  fileAdapter.read(filePath)
  .on('error', function (err) {
    return res.serverError(err);
  })
  .pipe(res);
}