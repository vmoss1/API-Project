"use strict";

const { User } = require("../models");
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
    await User.bulkCreate(
      [
        {
          email: "demo@user.io",
          firstName: "Jodie",
          lastName: "Comer",
          username: "Demo-lition",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          email: "user1@user.io",
          username: "FakeUser1",
          firstName: "Tammy",
          lastName: "Red",
          hashedPassword: bcrypt.hashSync("password1"),
        },
        {
          email: "user2@user.io",
          firstName: "Emily",
          lastName: "Blunt",
          username: "FakeUser2",
          hashedPassword: bcrypt.hashSync("password2"),
        },
        {
          email: "user3@user.io",
          firstName: "Pauline",
          lastName: "Lilly",
          username: "FakeUser3",
          hashedPassword: bcrypt.hashSync("password3"),
        },
        {
          email: "user4@user.io",
          firstName: "Jennifer",
          lastName: "Lawrence",
          username: "FakeUser4",
          hashedPassword: bcrypt.hashSync("password4"),
        },
        {
          email: "user5@user.io",
          firstName: "Ryan",
          lastName: "Reynolds",
          username: "FakeUser5",
          hashedPassword: bcrypt.hashSync("password5"),
        },
        {
          email: "user6@user.io",
          firstName: "Dua",
          lastName: "Lipa",
          username: "FakeUser6",
          hashedPassword: bcrypt.hashSync("password6"),
        },
        {
          email: "user7@user.io",
          firstName: "Rosemund",
          lastName: "Pike",
          username: "FakeUser7",
          hashedPassword: bcrypt.hashSync("password7"),
        },
        {
          email: "user8@user.io",
          firstName: "Oksana",
          lastName: "Villanelle",
          username: "FakeUser8",
          hashedPassword: bcrypt.hashSync("password8"),
        },
        {
          email: "user9@user.io",
          firstName: "Eve",
          lastName: "Pillastry",
          username: "FakeUser9",
          hashedPassword: bcrypt.hashSync("password9"),
        },
        {
          email: "user10@user.io",
          firstName: "Hailee",
          lastName: "Steinfeld",
          username: "FakeUser10",
          hashedPassword: bcrypt.hashSync("password10"),
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Users"; // keying into users table
    const Op = Sequelize.Op;
    //  The second argument (null) represents the deletion condition
    // (no specific condition, meaning delete all rows),
    // and the third argument ({}) may include additional options.
    return queryInterface.bulkDelete(options, null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
