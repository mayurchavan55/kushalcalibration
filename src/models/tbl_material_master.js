'use strict';

module.exports = (sequelize, DataTypes) => {
  const tbl_material_master = sequelize.define('tbl_material_master', {
    tmm_id: {
      type: DataTypes.SMALLINT,
      autoIncrement: true,
      primaryKey: true
    },
    tmm_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tmm_isenable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: "tbl_material_master",
    timestamps: false
}, {});
  return tbl_material_master;
};