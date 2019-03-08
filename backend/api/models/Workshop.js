/**
 * Workshop.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {
      type: 'string',
      required: true
    },
    room: {
      type: 'string'
    },
    area:{
      type: 'number'
    },
    floor: {
      model: 'floor',
      required: true
    },
    shape: {
      type: 'json'
    },
    facdept: {
      type: 'string'
    },
    division:{
      type: 'string'
    },
    corporate:{
      type: 'string'
    }
  },

};

