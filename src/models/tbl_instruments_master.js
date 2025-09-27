'use strict';

module.exports = (sequelize, DataTypes) => {
  const tbl_instruments_master = sequelize.define('tbl_instruments_master', {
    tim_id: {
      type: DataTypes.SMALLINT,
      autoIncrement: true,
      primaryKey: true
    },
    tim_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tim_isenable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: "tbl_instruments_master",
    timestamps: false
}, {});
  return tbl_instruments_master;
};