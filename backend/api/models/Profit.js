/**
 * Profit.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    workshop: {
      model: 'workshop',
      required: true
    },
    month:{
      type: 'string',
      required: true
    },
    profit:{
      type: 'number',
      required: true
    }

  },

};

