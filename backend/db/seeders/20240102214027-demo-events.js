'use strict';
const { Event } = require('../models')

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

   try { await Event.bulkCreate([
    {
      venueId: 1,
      groupId: 1,
      name: 'Kayakers Prep and Party',
      description: 'Come meet your future kayaking buddies for drink and snacks',
      type: 'In person',
      capacity: 25,
      price: 15,
      startDate: '2024-5-22 17:00:00',
      endDate: '2024-5-22 20:00:00'
    },
    {
      venueId: 2,
      groupId: 2,
      name: 'Shrimper Safety Briefing',
      description: 'Please come out for an important safety briefing and license handling event',
      type: 'In person',
      capacity: 15,
      price: 40,
      startDate: '2024-3-15 17:00:00',
      endDate: '2024-3-15 19:00:00'
    },
    {
      venueId: 3,
      groupId: 3,
      name: 'Camping Equipment Checklist',
      description: 'If you are unsure of equipment needed, or are in need of some. We will be selling needed equipment',
      type: 'In person',
      capacity: 40,
      price: 50,
      startDate: '2024-6-22 15:00:00',
      endDate: '2024-6-22 20:00:00'
    },
   ] , {
    validate: true
   })
  } catch (err) {
    console.error(err)
    throw new Error('Check validators')
  }
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "Events"; 
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      venueId: {
        [Op.in]: ['1' , '2' , '3' ]
      }
    })
  }
};
