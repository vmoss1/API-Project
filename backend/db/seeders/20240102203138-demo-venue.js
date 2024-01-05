'use strict';

const { Venue } = require('../models')

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
   try { await Venue.bulkCreate([
    {
      groupId: 1,
      address: '333 Sabine Street',
      city: 'Houston',
      state: 'TX',
      lat: -29,
      lng: -140
    } , 
    {
      groupId: 2,
      address: '5454 SeaWall Boulevard',
      city: 'Galveston',
      state: 'TX',
      lat: -1,
      lng: 34
    } , 
    {
      groupId: 3,
      address: '2345 Cesar Chavez Street',
      city: 'Austin',
      state: 'TX',
      lat: -5,
      lng: -25
    } , 
   ], {
    validate: true
   })
  } catch (err) {
    console.error(err)
    throw new Error('Check validators')
  }
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "Venues"; 
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
