'use strict';

module.exports = (sequelize, DataTypes) => {
  const tbl_role_masters = sequelize.define('tbl_role_masters', {
    trm_id: {
      type: DataTypes.SMALLINT,
      autoIncrement: true,
      primaryKey: true
    },
    trm_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    trm_isenable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: "tbl_role_masters",
    timestamps: false
},{});
  tbl_role_masters.associate = function(models) {
    tbl_role_masters.hasMany(models.tbl_users, { foreignKey: 'tu_fk_trm_id' });
  };
  return tbl_role_masters;
};