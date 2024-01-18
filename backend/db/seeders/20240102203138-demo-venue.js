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
    {
      groupId: 4,
      address: '3395 Cody Ln',
      city: 'Jackson Hole',
      state: 'WY',
      lat: -10,
      lng: 20
    } , 
    {
      groupId: 5,
      address: '1849 Lazy Lane',
      city: 'Fresno',
      state: 'CA',
      lat: 10,
      lng: 25
    } , 
    {
      groupId: 6,
      address: '12 River Road',
      city: 'St. Louis',
      state: 'MI',
      lat: -80,
      lng: 80
    } , 
    {
      groupId: 7,
      address: '6490 Bridge Boulevard',
      city: 'Brooklyn',
      state: 'NY',
      lat: -1,
      lng: 1
    } , 
    {
      groupId: 8,
      address: '6666 Old Town Road',
      city: 'Spring',
      state: 'TX',
      lat: 60,
      lng: -60
    } , 
    {
      groupId: 9,
      address: '898 Free Franklin Lane',
      city: 'Portland',
      state: 'OR',
      lat: 89,
      lng: -89
    } , 
    {
      groupId: 10,
      address: '1 Art District Lane',
      city: 'Miami',
      state: 'FL',
      lat: 14,
      lng: -60
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
