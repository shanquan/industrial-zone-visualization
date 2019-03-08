/**
 * Building.js
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
    zone: {
      model: 'zone',
      required: true
    },
    shape: {
      type: 'json'
    },
    floors: {
      collection: 'floor',
      via: 'building'
    }
  },

};

