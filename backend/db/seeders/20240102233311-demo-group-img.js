'use strict';

const { Groupimage } = require('../models')

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   try { await Groupimage.bulkCreate([
   {
     groupId: 1,
     url: '../../../images/kayaking.png',
     preview: true
   },
   {
    groupId: 2,
    url: '../../../images/shrimp.jpeg',
    preview: true
  },
  {
    groupId: 3,
    url: '../../../images/camping.jpeg',
    preview: true
  },

   ], {
    validate: true
   })

   } catch (err) {
    console.error(err)
    throw new Error('Check validators')
   }
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "Groupimages"; 
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: {
        [Op.in]: ['../../../images/kayaking.png' , '../../../images/shrimp.jpeg' , '../../../images/camping.jpeg' ]
      }
    })
  }
};
