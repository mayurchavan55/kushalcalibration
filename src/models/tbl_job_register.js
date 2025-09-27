'use strict';

module.exports = (sequelize, DataTypes) => {
  const tbl_job_register = sequelize.define('tbl_job_register', {
    tjr_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    tjr_fk_tcm_id: DataTypes.INTEGER,
    tjr_fk_tim_id: DataTypes.INTEGER,
    tjr_fk_tm_id: DataTypes.INTEGER,
    tjr_fk_tmm_id: DataTypes.INTEGER,
    tjr_range: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    tjr_resolution: DataTypes.STRING(50),
    tjr_srno: DataTypes.STRING(50),
    tjr_customer_id: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    tjr_modelno: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    tjr_grande: DataTypes.STRING(50),
    tjr_customer_challan_no: DataTypes.STRING(50),
    tjr_lab_ref_no: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    tjr_labid: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    tjr_certificate_no: DataTypes.STRING(50),
    tjr_ulr_no: DataTypes.STRING(50),
    tjr_reciept_date: { type: DataTypes.DATE , allowNull: true},
    tjr_calibration_date: { type: DataTypes.DATE, allowNull: true },
    tjr_next_calibration_date: { type: DataTypes.DATE, allowNull: true },
    tjr_certificate_date: { type: DataTypes.DATE, allowNull: true },
    tjr_remark: DataTypes.TEXT,
    tjr_additional_details: DataTypes.TEXT,
    tjr_location: DataTypes.STRING(50),
    tjr_status: DataTypes.STRING,
    tjr_frequency_month: DataTypes.INTEGER,
    tjr_fk_tcl_id: DataTypes.INTEGER,
    tjr_isenable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    tjr_createdby: DataTypes.INTEGER,
    tjr_createdat: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    tjr_updatedby: DataTypes.INTEGER,
    tjr_updatedat: DataTypes.DATE
  }, {
    tableName: "tbl_job_register",
    timestamps: false
  }, {});
  tbl_job_register.associate = function (models) {
    tbl_job_register.belongsTo(models.tbl_customer_master, { foreignKey: 'tjr_fk_tcm_id' });
    tbl_job_register.belongsTo(models.tbl_instruments_master, { foreignKey: 'tjr_fk_tim_id' });
    tbl_job_register.belongsTo(models.tbl_make_master, { foreignKey: 'tjr_fk_tm_id' });
    tbl_job_register.belongsTo(models.tbl_material_master, { foreignKey: 'tjr_fk_tmm_id' });
  };
  return tbl_job_register;
};
