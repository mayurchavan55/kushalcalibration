const models = require('../models');
const Sequelize = require('sequelize');
//var ActiveDirectory = require('activedirectory');
const configL = require('../config/config.json');
const { Model } = require('sequelize');
let configladap = configL.configladap;
var dateTime = require("node-datetime");
let dt = dateTime.create();
let formatted = dt.format("Y-m-d H:M:S");
const decodeToken = require('../middleware/decodeToken');


const getLoginPage = ((req, res) => {
  res.render("login", { 'title': 'LOGIN' });
});
const get404Page = ((req, res) => {
  res.render("404", { 'title': 'LOGIN' });
});
const get500Page = ((req, res) => {
  res.render("500", { 'title': 'LOGIN' });
});
const getDataTablePage = ((req, res) => {
  const user = decodeToken(req);
  res.render("customermangement", { 'title': 'LOGIN', 'user': user });
});
const getinstrumentsPage = ((req, res) => {
  const user = decodeToken(req);
  res.render("instrumentsmaster", { 'title': 'LOGIN', 'user': user });
});
const getmaterialPage = ((req, res) => {
  const user = decodeToken(req);
  res.render("materialmaster", { 'title': 'LOGIN', 'user': user });
});
const getmakePage = ((req, res) => {
  const user = decodeToken(req);
  res.render("makemaster", { 'title': 'LOGIN', 'user': user });
});
const getjobregisterPage = ((req, res) => {
  const user = decodeToken(req);
  res.render("jobregister", { 'title': 'LOGIN', 'user': user });
});
const getDashboardPage = ((req, res) => {
  const user = decodeToken(req);
  res.render("dashboard", { 'title': 'LOGIN', 'user': user });
});
const getcompanymasterPage = ((req, res) => {
  const user = decodeToken(req);
  res.render("companymaster", { 'title': 'LOGIN' ,'user': user });
});
const getcalibrationlabPage = ((req, res) => {
  const user = decodeToken(req);
  res.render("calibrationlab", { 'title': 'LOGIN' ,'user': user });
});

const getForgotPasswordPage = ((req, res) => {
  res.render("forgot-password", { 'title': 'LOGIN' });
});
const getResetPasswordPage = async (req, res, next) => {

  const tu_email = req.query.email;
  const user = await models.tbl_users.findOne({
    where: {
      tu_email: models.sequelize.where(
        models.sequelize.fn('LOWER', models.sequelize.col('tu_email')),
        '=',
        models.sequelize.fn('LOWER', tu_email)
      ),
      tu_isenable: true
    }
  });

  if (!user) {
    res.render("404", { 'title': 'LOGIN' });
  }
  res.render("reset-password", { 'title': 'LOGIN','email': tu_email});
};
const getSignupPage = ((req, res) => {
  res.render("signup", { 'title': 'LOGIN' });
});
module.exports = {
  getcalibrationlabPage,
  getcompanymasterPage,
  getmakePage,
  getjobregisterPage,
  getmaterialPage,
  getinstrumentsPage,
  getLoginPage,
  get404Page,
  get500Page,
  getDataTablePage,
  getForgotPasswordPage,
  getResetPasswordPage,
  getSignupPage,
  getDashboardPage
}