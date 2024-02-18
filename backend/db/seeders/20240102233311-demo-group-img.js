"use strict";

const { Groupimage } = require("../models");

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
      await Groupimage.bulkCreate(
        [
          {
            groupId: 1,
            url: "../../../images/kayaking.png",
            preview: false,
          },

          {
            groupId: 2,
            url: "../../../images/shrimp.jpeg",
            preview: true,
          },
          {
            groupId: 3,
            url: "../../../images/camping.jpeg",
            preview: true,
          },
          {
            groupId: 4,
            url: "mountainsNoPreviewImg.jpg",
            preview: false,
          },
          {
            groupId: 5,
            url: "paintingImg.jpeg",
            preview: true,
          },
          {
            groupId: 6,
            url: "swimmingImg.jpeg",
            preview: false,
          },
          {
            groupId: 7,
            url: "bridgeImg.jpeg",
            preview: true,
          },
          {
            groupId: 8,
            url: "ghostImg.jpeg",
            preview: false,
          },
          {
            groupId: 9,
            url: "beersImg.jpeg",
            preview: true,
          },
          {
            groupId: 10,
            url: "art.jpeg",
            preview: false,
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
    options.tableName = "Groupimages";
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
