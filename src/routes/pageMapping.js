const express = require('express')
const router = new express.Router();
const bodyParser = require('body-parser')
// const db = require('../models/auth')
var csrf = require('csurf');
// const handler=require('../middlewares/errorHandler');
const pageMapping = require("../controllers/pageMapping")

//var csrfProtection = csrf({cookie:true});
var csrfProtection = csrf();
const authenticateToken = require('../middleware/verifytoken');

router.get("/", pageMapping.getLoginPage);
router.get("/404", pageMapping.get404Page);
router.get("/500", pageMapping.get500Page);
router.get("/customermangement",authenticateToken, pageMapping.getDataTablePage);
router.get("/instrumentsmaster",authenticateToken, pageMapping.getinstrumentsPage);
router.get("/materialmaster",authenticateToken, pageMapping.getmaterialPage);
router.get("/makemaster",authenticateToken, pageMapping.getmakePage);
router.get("/jobregister",authenticateToken, pageMapping.getjobregisterPage);
router.get("/forgot-password", pageMapping.getForgotPasswordPage);
router.get("/reset-password", pageMapping.getResetPasswordPage);
router.get("/signup", pageMapping.getSignupPage);
router.get("/dashboard",authenticateToken, pageMapping.getDashboardPage);
router.get("/companymaster",authenticateToken, pageMapping.getcompanymasterPage);
router.get("/calibrationlab",authenticateToken, pageMapping.getcalibrationlabPage);

module.exports = router