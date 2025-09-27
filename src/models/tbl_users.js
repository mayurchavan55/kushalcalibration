'use strict';

module.exports = (sequelize, DataTypes) => {
  const tbl_users = sequelize.define('tbl_users', {
    tu_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    tu_fk_trm_id: DataTypes.INTEGER,
    tu_username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tu_firstname: DataTypes.STRING,
    tu_lastname: DataTypes.STRING,
    tu_password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tu_isenable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    tu_createdby: DataTypes.INTEGER,
    tu_createdat: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    tu_updatedby: DataTypes.INTEGER,
    tu_updatedat: DataTypes.DATE,
    tu_email: DataTypes.STRING
  }, {
    tableName: "tbl_users",
    timestamps: false
}, {});
  tbl_users.associate = function(models) {
    tbl_users.belongsTo(models.tbl_role_masters, { foreignKey: 'tu_fk_trm_id' });
  };
  return tbl_users;
};