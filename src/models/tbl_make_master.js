'use strict';

module.exports = (sequelize, DataTypes) => {
  const tbl_make_master = sequelize.define('tbl_make_master', {
    tm_id: {
      type: DataTypes.SMALLINT,
      autoIncrement: true,
      primaryKey: true
    },
    tm_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tm_isenable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: "tbl_make_master",
    timestamps: false
}, {});
  return tbl_make_master;
};