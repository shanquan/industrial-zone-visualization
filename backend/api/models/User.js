/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    workid:{
      type: 'number',
      unique: true,
      required: true
    },
    name: {
      type: 'string',
      required: true
    },
    email: {
      type: 'string',
      allowNull: true,
      isEmail: true //see [validations](https://sailsjs.com/documentation/concepts/models-and-orm/validations)
    },
    type: {
      type: 'number',
      isIn: [0, 1, 2], // 0 sysadmin 1 user 2 profitadmin
      defaultsTo: 1
    }
  }

};

