module.exports = {
  
  friendlyName: 'upload',
  description: 'Upload background image to directory:zones or floors.',
  files: ['image'],
  inputs: {
    model: {
      description: 'zone or floor',
      type: 'string',
      isIn: ['zone','floor'],
      required: true
    },
    id:{
      description: 'id of the model',
      type: 'number'
    },
    image:{
      example: '===',
      required: true
    }
  },

  exits: {
    error:{
    },
    success:{
    },
    notFound: {
      description: 'Could not find model with that id.',
      responseType: 'notFound'
    }
  },


  fn: async function (inputs,exits) {
    sails.log.info(inputs.model,inputs.id);
    const Model = inputs.model == 'zone' ? Zone : Floor;
    let obj = await Model.findOne({
      id: inputs.id
    });
    if(!obj)
      return exits.notFound();
    inputs.image.upload({
      // dirname: require('path').resolve(sails.config.appPath, `.tmp/public/upload/${inputs.model}s`), // custom folder vs default: myApp/.tmp/uploads/
      maxBytes: 10000000 //max ~10MB
    },function (err, uploadedFiles) {
      sails.log.info(uploadedFiles);
      if (err) return exits.error(err);
      if (uploadedFiles.length === 0) {
        return exits.error('No file was uploaded');
      }
      // let filePath = uploadedFiles[0].fd.substring(uploadedFiles[0].fd.indexOf('upload'));
      // filePath = '/' + filePath.replace(/\\/g, '\/');
      let filePath = '/imgUpload/' + uploadedFiles[0].fd.substr(uploadedFiles[0].fd.indexOf('uploads') + 8, 36);
      Model.update(inputs.id,{
        bgimg: filePath
      }).exec(function (err) {
        if (err) return exits.error(err);
        return exits.success({
          id: inputs.id,
          url: filePath
        });
      });
    });
    // All done.
  }


};
