'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Eventimage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Eventimage.belongsTo(models.Event , {
        foreignKey: 'eventId'
      })
    }
  }
  Eventimage.init({
    eventId: {type: DataTypes.INTEGER , references: {
      model: "Event"
    }},
    url: {type: DataTypes.STRING , allowNull: false},
    preview: {type: DataTypes.BOOLEAN , 
    allowNull: false},
  
  }, {
    sequelize,
    modelName: 'Eventimage',
    defaultScope: {
      attributes: {
        exclude: ['createdAt' , 'updatedAt']
      }
    }
  });
  return Eventimage;
};