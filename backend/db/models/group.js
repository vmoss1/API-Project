'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Group.hasMany(models.Venue , {
        foreignKey: 'groupId',
        onDelete: 'CASCADE',
        hooks: true
      })
      Group.hasMany(models.Groupimage , {
        foreignKey: 'groupId',
        onDelete: 'CASCADE',
        hooks: true
      })
      Group.hasMany(models.Membership , {
        foreignKey: 'groupId',
        onDelete: 'CASCADE',
        hooks: true
      })
      Group.hasMany(models.Event , {
        foreignKey: 'groupId' ,
        onDelete: 'CASCADE',
        hooks: true
      })
      Group.belongsTo(models.User , {
        foreignKey: 'organizerId',
        as: 'Organizer'
      })
    }
  }
  Group.init({
    organizerId: {type: DataTypes.INTEGER, allowNull: false},
    name: {type: DataTypes.STRING(60) , allowNull: false, 
    validate: {
      // isAlpha: true,
      notEmpty: true,
      countLengthOfName(val){
        if (val.length > 60){
          throw new Error('Name must be 60 characters or less')
        }
      }
    }},
    about: {type: DataTypes.STRING , allowNull: false , validate: {
      // isAlpha: true,
      notEmpty: true,
      countLength(val){
        if (val.length < 50){
          throw new Error('About must be 50 characters or more')
        }
      }
    }},
    type: {type: DataTypes.STRING , allowNull: false, 
    validate: {
      checkType(val){
        const validTypes = new Set(['Online' , 'In person'])
        if (!validTypes.has(val)){
          throw new Error("Type must be 'Online' or 'In person'")
        }
      }
    }},
    private: {type: DataTypes.BOOLEAN, allowNull: false , validate: {
      checkBoolean(val){
        if (val !== true && val !== false){
          throw new Error('Private must be a boolean')
        }
      }
    }},
    city: {type: DataTypes.STRING , allowNull: false , validate: {
     checkNull(val){
      if (!val){
        throw new Error('City is required')
      }
     }
    }},
    state: {type: DataTypes.STRING , allowNull: false , validate: {
      checkNull(val){
        if (!val){
          throw new Error('State is required')
        }
      }
    }},

  }, {
    sequelize,
    modelName: 'Group',
    defaultScope: {
      attributes: {
        exclude: ['createdAt' , 'updatedAt']
      }
    }
  });
  return Group;
};