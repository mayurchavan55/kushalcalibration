'use strict';

module.exports = (sequelize, DataTypes) => {
  const tbl_customer_master = sequelize.define('tbl_customer_master', {
    tcm_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    tcm_contact_person: DataTypes.STRING,
    tcm_email: DataTypes.STRING,
    tcm_company_name: DataTypes.STRING,
    tcm_mobile: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tcm_address: DataTypes.STRING,
    tcm_isenable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    tcm_createdby: DataTypes.INTEGER,
    tcm_createdat: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    tcm_updatedby: DataTypes.INTEGER,
    tcm_updatedat: DataTypes.DATE
  }, {
    tableName: "tbl_customer_master",
    timestamps: false
  }, {});
  tbl_customer_master.associate = function (models) {
    tbl_customer_master.hasMany(models.tbl_job_register, { foreignKey: 'tjr_fk_tcm_id' });
  };
  return tbl_customer_master;
};
