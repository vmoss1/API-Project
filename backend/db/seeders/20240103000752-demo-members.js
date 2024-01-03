'use strict';

const { Membership } = require('../models')

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
   try { await Membership.bulkCreate([
     {
      userId: 1,
      groupId: 1,
      status: 'organizer'
     },
     {
      userId: 2,
      groupId: 1,
      status: 'member'
     },
     {
      userId: 3,
      groupId: 1,
      status: 'pending'
     },



     {
      userId: 2,
      groupId: 2,
      status: 'organizer'
     },
     {
      userId: 1,
      groupId: 2,
      status: 'member'
     },
     {
      userId: 3,
      groupId: 2,
      status: 'pending'
     },
   



     {
      userId: 3,
      groupId: 3,
      status: 'organizer'
     },
     {
      userId: 1,
      groupId: 3,
      status: 'member'
     },
   
     {
      userId: 2,
      groupId: 3,
      status: 'member'
     },

   ] ,  {validate: true
  })
   } catch (err) {
    console.error(err)
    throw new Error('Check Validators')
   }
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "Memberships"; 
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: {
        [Op.in]: ['1' , '2' , '3' , '4']
      }
    })
  }
};
