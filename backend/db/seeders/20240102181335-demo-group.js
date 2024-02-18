"use strict";

const { Group } = require("../models");
const bcrypt = require("bcryptjs");

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
      await Group.bulkCreate(
        [
          {
            organizerId: 1,
            name: "The Wizengamot",
            about:
              "The Wizengamot is the high court of law in the wizarding world, responsible for interpreting magical law.",
            type: "In person",
            private: true,
            city: "London",
            state: "England",
          },
          {
            organizerId: 2,
            name: "Quidditch Association",
            about:
              "The Quidditch Association organizes and oversees the sport of Quidditch, including tournaments and regulations.",
            type: "In person",
            private: true,
            city: "Devon",
            state: "England",
          },
          {
            organizerId: 3,
            name: "Arcane Wardens",
            about:
              "Dedicated to protecting the magical realm, including hunting and capturing magical creatures.",
            type: "In person",
            private: false,
            city: "Diagon Alley",
            state: "England",
          },
          {
            organizerId: 4,
            name: "Wandmakers",
            about:
              "They are known for crafting some of the finest wands in the wizarding world, collecting and gathering precious materials.",
            type: "In person",
            private: false,
            city: "Godric's Hollow",
            state: "England",
          },
          {
            organizerId: 5,
            name: "Dumbledore's Army",
            about:
              "Student organization formed at Hogwarts School of Witchcraft and Wizardry to resist the oppressive regime of any who threaten the peace at Hogwarts.",
            type: "In person",
            private: false,
            city: "Hogwarts Castle",
            state: "Scotland",
          },
          {
            organizerId: 6,
            name: "Alchemists' Consortium",
            about:
              "Seek to unravel the secrets of magical alchemy. They create potent elixirs, forge enchanted metals, and strive to unlock the ultimate formula for immortality.",
            type: "In person",
            private: true,
            city: "HogsMeade",
            state: "Scotland",
          },
          {
            organizerId: 7,
            name: "Veilwalkers Guild",
            about:
              "They seek lost artifacts, uncover hidden realms, and guard against interdimensional threats.",
            type: "In person",
            private: false,
            city: "Diagon Alley",
            state: "London",
          },
          {
            organizerId: 8,
            name: "Muggle Liquor Adventurers",
            about:
              "Explorers of the muggles world, they adventure into normal activities, such as beer drinking, and wine tasting.",
            type: "In person",
            private: true,
            city: "Brooklyn",
            state: "NY",
          },
          {
            organizerId: 9,
            name: "Astral Enclave",
            about:
              "The divine group of star gazing and world watchers, who encompass the best locations to view space phenomenons.",
            type: "In person",
            private: false,
            city: "Unknown",
            state: "Various",
          },
          {
            organizerId: 10,
            name: "Guardians of Eldoria",
            about:
              "Ancient order of wizards and witches sworn to protect from dark forces. They safeguard ancient artifacts, defend magical creatures, and uphold the balance between light and dark magic.",
            type: "In person",
            private: true,
            city: "The Forbidden Forest",
            state: "Scotland",
          },
        ],
        {
          validate: true,
        }
      );
    } catch (error) {
      console.error(error);
      throw new Error("Check validators");
    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Groups"; // keying into groups table
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
