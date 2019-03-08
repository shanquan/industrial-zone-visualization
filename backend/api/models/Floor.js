/**
 * Floor.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    index: {
      type: 'number',
      required: true
    },
    bgimg: {
      type: 'string'
    },
    building: {
      model: 'building',
      required: true
    },
    workshops: {
      collection: 'workshop',
      via: 'floor'
    }
  },

};

