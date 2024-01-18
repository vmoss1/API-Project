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
      private: false,
      city: 'Austin',
      state: 'TX',
     },
     {
      organizerId: 4,
      name: 'Skiing in the Mountains',
      about: 'Spend a week, in the Wyoming landscape, adorned with blankets of snow, offered a picturesque backdrop for our skiing escapade',
      type: 'In person',
      private: false,
      city: 'Jackson Hole',
      state: 'WY',
     },
     {
      organizerId: 5,
      name: 'Painting in the Forest',
      about: 'Delicately blend pigments on a canvas, the scents of pine and damp earth filled the air, transporting you deeper into a state of creative immersion',
      type: 'In person',
      private: false,
      city: 'Sequoia National Forest',
      state: 'CA',
     },
     {
      organizerId: 6,
      name: 'Swimming in the Mississippi River',
      about: 'Dive into an exhilarating and historic challenge as swimmers from across the globe gather to conquer the mighty Mississippi River.',
      type: 'In person',
      private: true,
      city: 'St. Louis',
      state: 'MI',
     },
     {
      organizerId: 7,
      name: 'Photography on the Bridge',
      about: 'Step into the heart of artistic expression and join us for a captivating photography event on the Brooklyn Bridge',
      type: 'In person',
      private: false,
      city: 'Brooklyn',
      state: 'NY',
     },
     {
      organizerId: 8,
      name: 'Historic Walking Ghost Tour',
      about: 'Explore the haunted history of Spring, Texas with an eerie and entertaining guided ghost tour',
      type: 'In person',
      private: true,
      city: 'Spring',
      state: 'TX',
     },
     {
      organizerId: 9,
      name: 'Craft Beer Tasting Tour',
      about: 'Embark on a guided tour for renowned craft breweries. Sample a variety of unique, handcrafted beers',
      type: 'In person',
      private: false,
      city: 'Portland',
      state: 'OR',
     },
     {
      organizerId: 10,
      name: 'Art Deco District Segway Tour',
      about: 'Glide through the vibrant streets, through the Art Deco District on a guided Segway tour',
      type: 'In person',
      private: true,
      city: 'Miami',
      state: 'FL',
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
    return queryInterface.bulkDelete(options, null , {});
  }
};
