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
            url: "https://storage.googleapis.com/pai-images/6474b05f86a3428198dcff681b887613.jpeg",
            preview: true,
          },

          {
            groupId: 2,
            url: "https://www.cnet.com/a/img/resize/c580389b7ffd5e009e4b1cffd0374f059ebf1591/hub/2021/07/14/294567aa-8812-4339-8cb5-da697c4f2a57/wizards-take-flight.jpg?auto=webp&fit=crop&height=675&width=1200",
            preview: true,
          },
          {
            groupId: 3,
            url: "https://ik.imagekit.io/storybird/images/a11a0453-f7a3-4193-a9a4-8f834705b4f6/0_748765421.png",
            preview: true,
          },
          {
            groupId: 4,
            url: "https://cdn.vox-cdn.com/thumbor/GGMQTCAoK1xzChCLE0sQo7Xk9MI=/0x0:3840x2160/1200x800/filters:focal(1905x760:2519x1374)/cdn.vox-cdn.com/uploads/chorus_image/image/71948005/Wand_Screenshot.0.jpg",
            preview: true,
          },
          {
            groupId: 5,
            url: "https://arthur.io/img/art/jpg/0001734524da0e7a1/owen-davey/dumbledores-army/large/owen-davey--dumbledores-army.jpg",
            preview: true,
          },
          {
            groupId: 6,
            url: "https://images.ctfassets.net/usf1vwtuqyxm/4VcPqGNA3SMkW6sk6UookA/0635f76dc4ebd019b0f4764c980d0ea4/B1C8M2.jpg?fm=jpg&q=70&w=2560",
            preview: true,
          },
          {
            groupId: 7,
            url: "https://www.pcgamesn.com/wp-content/sites/pcgamesn/2023/02/hogwarts-legacy-ghosts-of-our-love-candles.jpg",
            preview: true,
          },
          {
            groupId: 8,
            url: "https://storage.googleapis.com/pai-images/7104536129924fd29260adb4ffa8fb82.jpeg",
            preview: true,
          },
          {
            groupId: 9,
            url: "https://i.pinimg.com/originals/e5/d0/24/e5d0242e90e52f38849d2b55207e8784.jpg",
            preview: true,
          },
          {
            groupId: 10,
            url: "https://images.ctfassets.net/usf1vwtuqyxm/6LWiIIfCx2eQkSU8yQeq88/bd866f01c30702ceafbd72151cdfdc82/Patronus_PM_B3C21M3HarrysPatronusChargingDownDementorsAcrossTheLake.Moment.jpg?w=1200&fit=fill&f=top",
            preview: true,
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
