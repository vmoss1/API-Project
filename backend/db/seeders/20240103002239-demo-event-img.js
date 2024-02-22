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
            url: "https://goodgiftguide.co/wp-content/uploads/2023/10/swishmatt_A_simplified_illustrated_cartoon_showing_the_wizardin_5c9c5141-c9ec-48ff-9da8-0012bc1dac55-950x500.png",
            preview: true,
          },
          {
            eventId: 2,
            url: "https://www.wargamer.com/wp-content/sites/wargamer/2021/12/dnd-strixhaven-curriculum-of-chaos-character-creation-hands-in-middle.jpg",
            preview: true,
          },
          {
            eventId: 3,
            url: "https://i.pinimg.com/564x/f3/4d/2e/f34d2e8638c5349edb5edce749e13899.jpg",
            preview: true,
          },
          {
            eventId: 4,
            url: "https://nerdyliciousgirl.files.wordpress.com/2017/09/dementor_blog-jpg.jpeg",
            preview: true,
          },
          {
            eventId: 5,
            url: "https://r2.erweima.ai/imgcompressed/compressed_7dd0d63efdcfe1d597260ab2d9add692.webp",
            preview: true,
          },
          {
            eventId: 6,
            url: "https://img.freepik.com/premium-photo/painting-wizard-holding-glowing-ball-epic-fantasy-art_379823-11100.jpg",
            preview: true,
          },
          {
            eventId: 7,
            url: "https://img.freepik.com/premium-photo/wizard-carrying-magical-spear-approaches-hanging-bridge-mountains_1043470-27697.jpg",
            preview: true,
          },
          {
            eventId: 8,
            url: "https://images.ctfassets.net/usf1vwtuqyxm/6aFng4yY5UEUE2mAKk6SwC/6d9039a962629a0e2a3ad250311596f1/HarryPotter_PM_B3C20M2_HarryAndSiriusSurroundedByDementorsByTheLake_Moments.jpg",
            preview: true,
          },
          {
            eventId: 9,
            url: "https://img.nerdburglars.net/wp-content/uploads/2023/07/nerdburglars_dumbledore_drinking_a_beer_63363ac2-690b-4507-9e62-e3cbbf94e681.jpg",
            preview: true,
          },
          {
            eventId: 10,
            url: "https://gameluster.com/wp-content/uploads/2023/02/Flying-a-Broom.jpg",
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
