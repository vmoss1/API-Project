'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Venue.hasMany(models.Event  , {
        foreignKey: 'venueId',
        onDelete: 'CASCADE',
        hooks: true
      })
  
      Venue.belongsTo(models.Group , {
        foreignKey: 'groupId',
        as: 'Venue',
        onDelete: "CASCADE"
      })
    }
  }
  Venue.init({
    groupId: {type: DataTypes.INTEGER , allowNull: false},
    address:{type:  DataTypes.STRING , allowNull: false , validate: {
      checkNull(val){
        if (!val){
          throw new Error('Street address is required')
        }
      }
    }},
    city: {type:  DataTypes.STRING , allowNull: false , validate: {
      checkNull(val){
        if (!val){
          throw new Error('City is required')
        }
      }
    }},
    state: {type:  DataTypes.STRING , allowNull: false , validate: {
      checkNull(val){
        if (!val){
          throw new Error('State is required')
        }
      }
    }},
    lat: {type: DataTypes.DECIMAL,
    allowNull: false , validate: {
       min: -90,
       max: 90,
       checkMax(val){
        if (val < -90 && val > 90){
          throw new Error('Latitude must be within -90 and 90')
        }
       }
    }} , 
    lng:{type: DataTypes.DECIMAL,
     allowNull: false , validate: {
     min: -180,
     max: 180,
     checkMax(val){
      if (val < -180 && val > 180){
        throw new Error('Longitude must be within -180 and 180')
      }
     }
     }}
  }, {
    sequelize,
    modelName: 'Venue',
    defaultScope: {
      attributes: {
        exclude: ['createdAt' , 'updatedAt']
      }
    },

  });
  return Venue;
};