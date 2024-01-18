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

    // Membership group 1
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
      userId: 4,
      groupId: 1,
      status: 'member'
     },
     {
      userId: 5,
      groupId: 1,
      status: 'member'
     },

// Membership group 2
     {
      userId: 2,
      groupId: 2,
      status: 'organizer'
     },
     {
      userId: 7,
      groupId: 2,
      status: 'member'
     },
     {
      userId: 8,
      groupId: 2,
      status: 'member'
     },
     {
      userId: 9,
      groupId: 2,
      status: 'member'
     },
     {
      userId: 10,
      groupId: 2,
      status: 'pending'
     },
   
// Membership group 3
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
     {
      userId: 4,
      groupId: 3,
      status: 'member'
     },
     {
      userId: 5,
      groupId: 3,
      status: 'pending'
     },

// Membership group 4
     {
      userId: 4,
      groupId: 4,
      status: 'organizer'
     },
     {
      userId: 2,
      groupId: 4,
      status: 'member'
     },
     {
      userId: 6,
      groupId: 4,
      status: 'member'
     },
     {
      userId: 7,
      groupId: 4,
      status: 'member'
     },
     {
      userId: 8,
      groupId: 4,
      status: 'pending'
     },

     // Membership group 5
     {
      userId: 5,
      groupId: 5,
      status: 'organizer'
     },
     {
      userId: 6,
      groupId: 5,
      status: 'member'
     },
     {
      userId: 7,
      groupId: 5,
      status: 'member'
     },
     {
      userId: 8,
      groupId: 5,
      status: 'member'
     },
     {
      userId: 9,
      groupId: 5,
      status: 'pending'
     },
     // Membership group 6
     {
      userId: 6,
      groupId: 6,
      status: 'organizer'
     },
     {
      userId: 1,
      groupId: 6,
      status: 'member'
     },
     {
      userId: 2,
      groupId: 6,
      status: 'member'
     },
     {
      userId: 4,
      groupId: 6,
      status: 'member'
     },
     {
      userId: 5,
      groupId: 6,
      status: 'pending'
     },
     // Membership group 7
     {
      userId: 7,
      groupId: 7,
      status: 'organizer'
     },
     {
      userId: 4,
      groupId: 7,
      status: 'member'
     },
     {
      userId: 5,
      groupId: 7,
      status: 'member'
     },
     {
      userId: 6,
      groupId: 7,
      status: 'member'
     },
     {
      userId: 9,
      groupId: 7,
      status: 'pending'
     },
     // Membership group 8
     {
      userId: 8,
      groupId: 8,
      status: 'organizer'
     },
     {
      userId: 1,
      groupId: 8,
      status: 'member'
     },
     {
      userId: 6,
      groupId: 8,
      status: 'member'
     },
     {
      userId: 7,
      groupId: 8,
      status: 'member'
     },
     {
      userId: 10,
      groupId: 8,
      status: 'pending'
     },
     // Membership group 9
     {
      userId: 9,
      groupId: 9,
      status: 'organizer'
     },
     {
      userId: 1,
      groupId: 9,
      status: 'member'
     },
     {
      userId: 2,
      groupId: 9,
      status: 'member'
     },
     {
      userId: 10,
      groupId: 9,
      status: 'member'
     },
     {
      userId: 5,
      groupId: 9,
      status: 'pending'
     },
     // Membership group 10
     {
      userId: 10,
      groupId: 10,
      status: 'organizer'
     },
     {
      userId: 5,
      groupId: 10,
      status: 'member'
     },
     {
      userId: 6,
      groupId: 10,
      status: 'member'
     },
     {
      userId: 7,
      groupId: 10,
      status: 'member'
     },
     {
      userId: 8,
      groupId: 10,
      status: 'pending'
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
    return queryInterface.bulkDelete(options,  null , {})
  }
};
