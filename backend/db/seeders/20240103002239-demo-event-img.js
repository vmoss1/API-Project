"use strict";

const { Eventimage } = require("../models");

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
      await Eventimage.bulkCreate(
        [
          {
            eventId: 1,
            url: "../../../images/kayaking-party.jpeg",
            preview: true,
          },
          {
            eventId: 2,
            url: "../../../images/safety.jpeg",
            preview: true,
          },
          {
            eventId: 3,
            url: "../../../images/camping-store.jpeg",
            preview: true,
          },
          {
            eventId: 4,
            url: "GrpMountainsImg.jpeg",
            preview: false,
          },
          {
            eventId: 5,
            url: "GrpPaintingImg.jpeg",
            preview: true,
          },
          {
            eventId: 6,
            url: "GrpSwimmingImg",
            preview: false,
          },
          {
            eventId: 7,
            url: "GrpBridgeImg.jpeg",
            preview: true,
          },
          {
            eventId: 8,
            url: "GrpGhostImg.jpeg",
            preview: false,
          },
          {
            eventId: 9,
            url: "GrpBeerImg.jpeg",
            preview: true,
          },
          {
            eventId: 10,
            url: "GrpArtImg.jpeg",
            preview: true,
          },
        ],
        { validate: true }
      );
    } catch (err) {
      console.error(err);
      throw new Error("Check Validators");
    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Eventimages";
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
