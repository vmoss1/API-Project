'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
     Attendance.belongsTo(models.Event , {
      foreignKey: 'userId',
     })
     Attendance.belongsTo(models.User , {
      foreignKey: 'eventId',
     })
    }
  }
  Attendance.init({
    eventId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    status: {type: DataTypes.ENUM('pending' , 'attending' ,'waitlist') , 
    allowNull: false,
    validate: {
      isIn: [['pending' , 'attending' , 'waitlist']]
    }
    }
  }, {
    sequelize,
    modelName: 'Attendance',
  });
  return Attendance;
};