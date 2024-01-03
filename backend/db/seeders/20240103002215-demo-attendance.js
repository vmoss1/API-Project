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
    {
      eventId:  1,
      userId:1,
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
      eventId:  2,
      userId: 2,
      status:  'attending',
    },
    {
      eventId:  2,
      userId: 1,
      status:  'attending',
    },
    {
      eventId:  2,
      userId: 3,
      status:  'waitlist',
    },
  


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
    return queryInterface.bulkDelete(options , { 
      eventId: {
        [Op.in]: ['1' , '2' , '3']
      }
      
    })
  }
};
