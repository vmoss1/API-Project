'use strict';

const { Attendance } = require('../models')

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
   try { await Attendance.bulkCreate([

    // Attendance Group 1
    {
      eventId:  1,
      userId: 1,
      status:  'attending',
    },
    {
      eventId:  1,
      userId: 2,
      status:  'attending',
    },
    {
      eventId:  1,
      userId: 3,
      status:  'pending',
    },
    {
      eventId:  1,
      userId: 4,
      status:  'waitlist',
    },
    {
      eventId:  1,
      userId: 5,
      status:  'pending',
    },
    // Attendance Group 2
    {
      eventId:  2,
      userId: 2,
      status:  'attending',
    },
    {
      eventId:  2,
      userId: 7,
      status:  'attending',
    },
    {
      eventId:  2,
      userId: 8,
      status:  'attending',
    },
    {
      eventId:  8,
      userId: 4,
      status:  'attending',
    },
    {
      eventId:  2,
      userId: 10,
      status:  'pending',
    },
    {
      eventId:  2,
      userId: 6,
      status:  'waitlist',
    },
  // Attendance Group 3
    {
      eventId:  3,
      userId: 3,
      status:  'attending',
    },
    {
      eventId:  3,
      userId: 1,
      status:  'attending',
    },
 
    {
      eventId:  3,
      userId: 2,
      status:  'attending',
    },
    {
      eventId:  3,
      userId: 4,
      status:  'attending',
    },
    {
      eventId:  3,
      userId: 5,
      status:  'pending',
    },
    // Attendance Group 4
    {
      eventId:  4,
      userId: 4,
      status:  'attending',
    },
    {
      eventId:  4,
      userId: 2,
      status:  'attending',
    },
    {
      eventId:  4,
      userId: 6,
      status:  'attending',
    },
    {
      eventId:  4,
      userId: 7,
      status:  'attending',
    },
    {
      eventId:  4,
      userId: 8,
      status:  'pending',
    },
    // Attendance Group 5
    {
      eventId:  5,
      userId: 5,
      status:  'attending',
    },
    {
      eventId:  5,
      userId: 6,
      status:  'attending',
    },
    {
      eventId:  7,
      userId: 6,
      status:  'attending',
    },
    {
      eventId:  8,
      userId: 7,
      status:  'attending',
    },
    {
      eventId:  9,
      userId: 8,
      status:  'pending',
    },
    // Attendance Group 6
    {
      eventId:  6,
      userId: 6,
      status:  'attending',
    },
    {
      eventId:  6,
      userId: 1,
      status:  'attending',
    },
    {
      eventId:  6,
      userId: 2,
      status:  'attending',
    },
    {
      eventId:  6,
      userId: 4,
      status:  'attending',
    },
    {
      eventId:  6,
      userId: 5,
      status:  'pending',
    },
    // Attendance Group 7
    {
      eventId:  7,
      userId: 7,
      status:  'attending',
    },
    {
      eventId:  7,
      userId: 4,
      status:  'attending',
    },
    {
      eventId:  7,
      userId: 5,
      status:  'attending',
    },
    {
      eventId:  7,
      userId: 6,
      status:  'attending',
    },
    {
      eventId:  7,
      userId: 9,
      status:  'pending',
    },
    // Attendance Group 8
    {
      eventId:  8,
      userId: 8,
      status:  'attending',
    },
    {
      eventId:  8,
      userId: 1,
      status:  'attending',
    },
    {
      eventId:  8,
      userId: 6,
      status:  'attending',
    },
    {
      eventId:  8,
      userId: 7,
      status:  'attending',
    },
    {
      eventId:  8,
      userId: 10,
      status:  'pending',
    },
    // Attendance Group 9
    {
      eventId:  9,
      userId: 9,
      status:  'attending',
    },
    {
      eventId:  9,
      userId: 1,
      status:  'attending',
    },
    {
      eventId:  9,
      userId: 2,
      status:  'attending',
    },
    {
      eventId:  9,
      userId: 10,
      status:  'attending',
    },
    {
      eventId:  9,
      userId: 5,
      status:  'pending',
    },
    // Attendance Group 10
    {
      eventId:  10,
      userId: 10,
      status:  'attending',
    },
    {
      eventId:  10,
      userId: 5,
      status:  'attending',
    },
    {
      eventId:  10,
      userId: 6,
      status:  'attending',
    },
    {
      eventId:  10,
      userId: 7,
      status:  'attending',
    },
    {
      eventId:  10,
      userId: 8,
      status:  'pending',
    },
 
   ] , { validate: true 
  })
   } catch (err) {
    console.error(err)
    throw new Error('Check Validators')
   }
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Attendances'
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
