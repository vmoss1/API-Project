'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Membership extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Membership.belongsTo(models.User , {
        foreignKey: 'userId'
      })
      Membership.belongsTo(models.Group , {
        foreignKey: 'userId'
      })
    }
  }
  Membership.init({
    userId: DataTypes.INTEGER,
    groupId: DataTypes.INTEGER,
    status: {type: DataTypes.ENUM('organizer' , 'co-host' , 'member' , 'pending'), 
  validate: {
    isIn: [['organizer' , 'co-host' , 'member' , 'pending']]
  }}
  }, {
    sequelize,
    modelName: 'Membership',
    defaultScope: {
      attributes: {
        exclude: ['createdAt' , 'updatedAt']
      }
    }
  });
  return Membership;
};