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
      startDate: '2025-5-22 17:00:00',
      endDate: '2025-5-22 20:00:00'
    },
    {
      venueId: 2,
      groupId: 2,
      name: 'Shrimper Safety Briefing',
      description: 'Please come out for an important safety briefing and license handling event',
      type: 'In person',
      capacity: 15,
      price: 40,
      startDate: '2025-3-15 17:00:00',
      endDate: '2025-3-15 19:00:00'
    },
    {
      venueId: 3,
      groupId: 3,
      name: 'Camping Equipment Checklist',
      description: 'If you are unsure of equipment needed, or are in need of some. We will be selling needed equipment',
      type: 'In person',
      capacity: 40,
      price: 50,
      startDate: '2025-6-22 15:00:00',
      endDate: '2025-6-22 20:00:00'
    },
    {
      venueId: 4,
      groupId: 4,
      name: 'Snow Online checkIn',
      description: 'Please join us via Zoom, for a group checkIn and details seminar for the trip',
      type: 'Online',
      capacity: 60,
      price: 100,
      startDate: '2025-10-22 18:00:00',
      endDate: '2025-10-22 20:00:00'
    },
    {
      venueId: 5,
      groupId: 5,
      name: 'Grab your brushes',
      description: 'Park meet and greet, grab your easels and brushes for a small meet and greet prior our main event',
      type: 'In person',
      capacity: 20,
      price: 20,
      startDate: '2025-12-22 15:00:00',
      endDate: '2025-12-22 20:00:00'
    },
    {
      venueId: 6,
      groupId: 6,
      name: 'Trunks and Bikinis swim practice',
      description: 'Our first group meeting for swimming, this is mandatory for safety briefings',
      type: 'In person',
      capacity: 50,
      price: 50,
      startDate: '2027-8-22 10:00:00',
      endDate: '2027-8-22 15:00:00'
    },
    {
      venueId: 7,
      groupId: 7,
      name: 'Camera checkIn',
      description: 'Please come out for a camera checkIn, we are also providing tutorials for beginners',
      type: 'In person',
      capacity: 15,
      price: 25,
      startDate: '2024-7-2 12:00:00',
      endDate: '2024-7-2 14:30:00'
    },
    {
      venueId: 8,
      groupId: 8,
      name: 'Ghouls and the Paranormal',
      description: 'Our first group walking tour, get ready for the HORROR',
      type: 'In person',
      capacity: 10,
      price: 30,
      startDate: '2026-5-18 18:00:00',
      endDate: '2026-5-18 20:00:00'
    },
    {
      venueId: 9,
      groupId: 9,
      name: 'Get ready for the Brews',
      description: 'Please have your ID ready, we plan to stop at 5 breweries',
      type: 'In person',
      capacity: 20,
      price: 65,
      startDate: '2025-9-15 13:00:00',
      endDate: '2025-9-15 17:00:00'
    },
    {
      venueId: 10,
      groupId: 10,
      name: 'Art fans and Segways Unite',
      description: 'Come out and enjoy this wonderful guided tour with your family for inspiration and History',
      type: 'In person',
      capacity: 12,
      price: 150,
      startDate: '2025-10-29 11:00:00',
      endDate: '2025-10-29 13:00:00'
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
    return queryInterface.bulkDelete(options, null , {});
  }
};
