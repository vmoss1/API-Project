"use strict";
const { Model, Validator } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // User.belongsToMany(models.Event , {
      //   through: 'Attendance',
      //   foreignKey: 'userId',
      //   otherKey: 'eventId'
      // })
      // User.belongsToMany(models.Group , {
      //   through: 'Membership' , 
      //   foreignKey: 'userId',
      //   otherKey: 'groupId'
      // })
      User.hasMany(models.Attendance , {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        hooks: true
      })
      User.hasMany(models.Membership , {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        hooks: true
      })
      User.hasMany(models.Group , {
        foreignKey: 'organizerId',
        as: 'Organizer',
        onDelete: 'CASCADE',
        hooks: true
      })
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [4, 30],
          isNotEmail(val) {
            if (Validator.isEmail(val)) {
              throw new Error("Cannot be an email");
            }
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 256],
          isEmail: true,
        },
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60],
        },
      },
      firstName: {
        type: DataTypes.STRING,
        // allowNull: false,
        validate: {
          isAlpha: true,
        },
      },
      lastName: {
        type: DataTypes.STRING,
        // allowNull: false,
        validate: {
          isAlpha: true,
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      defaultScope: {
        attributes: {
          exclude: ["hashedPassword", "email", "createdAt", "updatedAt"],
        }, // default query when searching for Users, the hashedPassword, updatedAt, and, depending on your application, email and createdAt fields should not be returned
      }, // protects sensitive information from being leaked
    }
  );
  return User;
};

//! backend login flow -
//  API login route will be hit with a request body holding a valid credential
// API login handler will look for a User with the input credential
// hashedPassword for that found User will be compared with the input password
// if match - API login route should send back a JWT in an HTTP-only cookie and a response body.
// The JWT and the body will hold the user's id, username, and email.

//! backend sign-up flow
// API signup route will be hit with a request body holding a username, email, and password
// API signup handler will create a User with the username, an email, and a hashedPassword created from the input password
// If successful API signup route should send back a JWT in an HTTP-only cookie and a response body.

//! backend logout flow
// API logout route will be hit with request
// API logout handler will remove the JWT cookie set by the login or signup API routes
