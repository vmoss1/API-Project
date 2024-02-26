"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Event.belongsToMany(models.User, {
      //   through: 'Attendance',
      //   foreignKey: 'eventId',
      //   otherKey: 'userId'
      // })
      Event.belongsTo(models.Venue, {
        foreignKey: "venueId",
      });
      Event.belongsTo(models.Group, {
        foreignKey: "groupId",
      });
      Event.hasMany(models.Attendance, {
        foreignKey: "eventId",
        onDelete: "CASCADE",
        hooks: true,
      });
      Event.hasMany(models.Eventimage, {
        foreignKey: "eventId",
        onDelete: "CASCADE",
        hooks: true,
      });
    }
  }
  Event.init(
    {
      venueId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Venue",
        },
      },
      groupId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Group",
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          nameLength(val) {
            if (val.length < 5) {
              throw new Error("Name must be at least 5 characters");
            }
          },
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          checkNull(val) {
            if (!val) {
              throw new Error("Description is required");
            }
          },
        },
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          checkType(val) {
            const validTypes = new Set(["Online", "In person"]);
            if (!validTypes.has(val)) {
              throw new Error("Type must be 'Online' or 'In person'");
            }
          },
        },
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          checkInteger(val) {
            if (typeof val !== "number" || val < 1) {
              throw new Error("Capacity must be an integer");
            }
          },
        },
      },
      price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
          isFloat: true,
          checkPrice(val) {
            if (val < 0 || typeof val !== "number") {
              throw new Error("Price is invalid");
            }
          },
        },
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          checkDate(val) {
            if (new Date(val).getTime() < new Date().getTime()) {
              throw new Error("Start date must be in the future");
            }
          },
        },
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          checkDate(val) {
            if (val < this.startDate) {
              throw new Error("End date is less than start date");
            }
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Event",
      defaultScope: {
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
      scopes: {
        ex: {
          attributes: {
            exclude: ["description", "capacity", "price"],
          },
        },
      },
    }
  );
  return Event;
};
