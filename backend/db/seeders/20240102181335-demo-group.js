'use strict';

const { Group } = require('../models')
const bcrypt = require('bcryptjs')

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
   try { await Group.bulkCreate(
    [
    {
      organizerId: 1,
      name: 'Kayaking on Sunset',
      about: 'Come to relax and kayak down Buffalo Bayou to watch the Houston sunset, kayaks available for rent',
      type: 'In person',
      private: true,
      city: 'Houston',
      state: 'TX',
    },
     {
      organizerId: 2,
      name: 'Shrimping in the Gulf',
      about: 'Bring your friends to experience a once in a lifetime shrimp boating. Fresh food provided, and drinks',
      type: 'In person',
      private: true,
      city: 'Galveston',
      state: 'TX'
     },
     {
      organizerId: 3,
      name: 'Camping in the Hills',
      about: 'Spend a weekend, hiking through the beautiful hill country on horseback. Camping equipment will not be provided',
      type: 'In person',
      private: true,
      city: 'Austin',
      state: 'TX',
     }
   ], {
    validate: true
   })
  } catch (error) {
    console.error(error)
    throw new Error('Check validators')
  }
  
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "Groups"; // keying into groups table
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const Op = Sequelize.Op; 
    return queryInterface.bulkDelete(options, {
      name: {
        [Op.in]: ['Kayaking on Sunset', 'Shrimping in the Gulf', 'Camping in the Hills']
      }
    })
  }
};
