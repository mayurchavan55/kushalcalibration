'use strict';

module.exports = (sequelize, DataTypes) => {
  const tbl_email_reminder = sequelize.define('tbl_email_reminder', {
    ter_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    ter_fk_tcm_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'tbl_customer_master',
        key: 'tcm_id'
      }
    },
    ter_for_month: {
      type: DataTypes.DATE
    },
    ter_isenable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    ter_createdby: {
      type: DataTypes.INTEGER
    },
    ter_createdat: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    ter_updatedby: {
      type: DataTypes.INTEGER
    },
    ter_updatedat: {
      type: DataTypes.DATE
    }
  }, {
    tableName: "tbl_email_reminder",
    timestamps: false
  });

  tbl_email_reminder.associate = function(models) {
    tbl_email_reminder.belongsTo(models.tbl_customer_master, { foreignKey: 'ter_fk_tcm_id' });
  };

  return tbl_email_reminder;
};
