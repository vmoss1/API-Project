"use strict";

const { Venue } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    try {
      await Venue.bulkCreate(
        [
          {
            groupId: 1,
            address: "333 Sabine Street",
            city: "London",
            state: "EN",
            lat: -29,
            lng: -140,
          },
          {
            groupId: 2,
            address: "5454 SeaWall Boulevard",
            city: "HogsMeade",
            state: "SC",
            lat: -1,
            lng: 34,
          },
          {
            groupId: 3,
            address: "2345 Cesar Chavez Street",
            city: "The Forbidden Forest",
            state: "SC",
            lat: -5,
            lng: -25,
          },
          {
            groupId: 4,
            address: "3 Cody Ln",
            city: "Diagon Alley",
            state: "EN",
            lat: -10,
            lng: 20,
          },
          {
            groupId: 5,
            address: "1849 Lazy Lane",
            city: "Hogwarts Castle",
            state: "SC",
            lat: 10,
            lng: 25,
          },
          {
            groupId: 6,
            address: "12 River Road",
            city: "HogsMeade",
            state: "SC",
            lat: -80,
            lng: 80,
          },
          {
            groupId: 7,
            address: "6490 Bridge Boulevard",
            city: "Forbidden Forest",
            state: "SC",
            lat: -1,
            lng: 1,
          },
          {
            groupId: 8,
            address: "6666 Old Town Road",
            city: "Spring",
            state: "TX",
            lat: 60,
            lng: -60,
          },
          {
            groupId: 9,
            address: "898 Free Franklin Lane",
            city: "The Alps",
            state: "FR",
            lat: 89,
            lng: -89,
          },
          {
            groupId: 10,
            address: "1 Dark District Lane",
            city: "HogsMeade",
            state: "SC",
            lat: 14,
            lng: -60,
          },
        ],
        {
          validate: true,
        }
      );
    } catch (err) {
      console.error(err);
      throw new Error("Check validators");
    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Venues";
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, null, {});
  },
};
