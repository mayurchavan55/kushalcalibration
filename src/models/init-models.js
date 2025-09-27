var DataTypes = require("sequelize").DataTypes;

var User = require("./tbl_users");

function initModels(sequelize) {
 
  var _User = User(sequelize, DataTypes);

  
  return {
    _User
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
