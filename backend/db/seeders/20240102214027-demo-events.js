"use strict";
const { Event } = require("../models");

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
      await Event.bulkCreate(
        [
          {
            venueId: 1,
            groupId: 1,
            name: "Wizards 1st Annual Party",
            description:
              "Come out and celebrate our 1st year as a group together, foods and drinks will be provided.",
            type: "In person",
            capacity: 25,
            price: 15,
            startDate: "2025-5-22 17:00:00",
            endDate: "2025-5-22 20:00:00",
          },
          {
            venueId: 2,
            groupId: 2,
            name: "Quidditch Team Gathering",
            description:
              "All teams are encouraged to come out, for a teams outing and team leader vote, please bring your own brooms.",
            type: "In person",
            capacity: 15,
            price: 40,
            startDate: "2025-3-15 17:00:00",
            endDate: "2025-3-15 19:00:00",
          },
          {
            venueId: 3,
            groupId: 3,
            name: "Capture and Release",
            description:
              "We will be having a gathering to verify the capture list, and all following procedures for this hunt.",
            type: "In person",
            capacity: 40,
            price: 50,
            startDate: "2025-6-22 15:00:00",
            endDate: "2025-6-22 20:00:00",
          },
          {
            venueId: 4,
            groupId: 4,
            name: "Material Gathering",
            description:
              "This is material gathering and showcase for all wand makers of any skill level, charge covers first 2 materials.",
            type: "Online",
            capacity: 60,
            price: 100,
            startDate: "2025-10-22 18:00:00",
            endDate: "2025-10-22 20:00:00",
          },
          {
            venueId: 5,
            groupId: 5,
            name: "Skills Practice",
            description:
              "We need to ensure we are all prepared for any sort of attack that may threaten our school, please bring your own wand.",
            type: "In person",
            capacity: 20,
            price: 20,
            startDate: "2025-12-22 15:00:00",
            endDate: "2025-12-22 20:00:00",
          },
          {
            venueId: 6,
            groupId: 6,
            name: "Potions and Alchemy",
            description:
              "Please come for a demo to learn new potions that have been created by the world leading experts on alchemy.",
            type: "In person",
            capacity: 50,
            price: 50,
            startDate: "2027-8-22 10:00:00",
            endDate: "2027-8-22 15:00:00",
          },
          {
            venueId: 7,
            groupId: 7,
            name: "Seekers Guide",
            description:
              "We are in search of a very rare artifact lost in the Forbidden Forest, please come prepared to defend yourself.",
            type: "In person",
            capacity: 15,
            price: 25,
            startDate: "2024-7-2 12:00:00",
            endDate: "2024-7-2 14:30:00",
          },
          {
            venueId: 8,
            groupId: 8,
            name: "Get ready for the Brews",
            description:
              "Please have your ID ready, we plan to stop at 5 breweries, ensure all magical objects are hidden as this is muggle world.",
            type: "In person",
            capacity: 10,
            price: 30,
            startDate: "2026-5-18 18:00:00",
            endDate: "2026-5-18 20:00:00",
          },
          {
            venueId: 9,
            groupId: 9,
            name: "Stargazing in the Alps",
            description:
              "We will ensure a port key is ready for such an escalated and divine adventure into the Alps stargazing.",
            type: "In person",
            capacity: 20,
            price: 65,
            startDate: "2025-9-15 13:00:00",
            endDate: "2025-9-15 17:00:00",
          },
          {
            venueId: 10,
            groupId: 10,
            name: "Forces Unite",
            description:
              "Come out and meet your local wizards/witches who have given their oath to fight all those who threaten our peace.",
            type: "In person",
            capacity: 12,
            price: 150,
            startDate: "2025-10-29 11:00:00",
            endDate: "2025-10-29 13:00:00",
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
    options.tableName = "Events";
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
