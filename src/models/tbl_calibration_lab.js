'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_calibration_lab = sequelize.define('tbl_calibration_lab', {
    tcl_id: {
      type: DataTypes.SMALLINT,
      autoIncrement: true,
      primaryKey: true
    },
    tcl_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tcl_isenable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: "tbl_calibration_lab",
    timestamps: false
}, {});
  return tbl_calibration_lab;
};