'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Groupimage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Groupimage.belongsTo(models.Group , {
        foreignKey: 'groupId'
      })
    }
  }
  Groupimage.init({
    groupId: {type: DataTypes.INTEGER , references: {
      model: 'Group'
    }},
    url: {type: DataTypes.STRING , allowNull: false},
    preview: {type: DataTypes.BOOLEAN , allowNull:false}
  }, {
    sequelize,
    modelName: 'Groupimage',
    defaultScope: {
      attributes: {
        exclude: ['createdAt' , 'updatedAt']
      }
    }
  });
  return Groupimage;
};