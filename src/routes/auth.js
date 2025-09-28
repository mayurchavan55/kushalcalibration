const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth');
var bodyParser = require('body-parser')
const authenticateToken = require('../middleware/verifytoken');

var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.post('/signin.htm', urlencodedParser, auth.signin);
router.get('/logout.htm', auth.signout);
router.post('/loadAllMAkeData.htm', authenticateToken, auth.loadAllMAkeData)
router.delete('/deleteMake/:id', authenticateToken, auth.deleteMake)
router.put('/updateMake/:id', authenticateToken, auth.updateMake)
router.post('/addMake', authenticateToken, auth.addMake)

router.post('/loadAllMaterialData.htm', authenticateToken, auth.loadAllMaterialData)
router.delete('/deleteMaterial/:id', authenticateToken, auth.deleteMaterial)
router.put('/updateMaterial/:id', authenticateToken, auth.updateMaterial)
router.post('/addMaterial', authenticateToken, auth.addMaterial)

router.post('/loadAllInstrumentsData.htm', authenticateToken, auth.loadAllInstrumentsData)
router.delete('/deleteInstruments/:id', authenticateToken, auth.deleteInstruments)
router.put('/updateInstruments/:id', authenticateToken, auth.updateInstruments)
router.post('/addInstruments', authenticateToken, auth.addInstruments)
router.post('/reset-password.htm', urlencodedParser, auth.resetPassWord)
router.post('/update-password.htm', urlencodedParser, auth.updatepassword)
router.post('/Addcustomersmangement', urlencodedParser, auth.customers)
router.put('/updatecustomersMangement/:id', urlencodedParser, auth.updatecustomers)
router.delete('/deletecustomersMangement/:id', authenticateToken, auth.deleteCustomerManagement)
router.get('/getAllInstrumentsMaterialsMakes.htm', urlencodedParser, auth.getAllinstrument_make_material)
router.post('/Addjobregister.htm', urlencodedParser, auth.jobregister)
router.post('/getDashboardData.htm', authenticateToken, auth.getDashboardData)
router.post('/getCustomerDueData.htm', authenticateToken, auth.getCustomerDueData)
router.post('/sendReminder.htm', authenticateToken, auth.sendReminder)
router.get('/getcustomerdata.htm', authenticateToken, auth.getcustomerdata)
router.get('/getjobregister.htm', authenticateToken, auth.getjobregister)
router.put('/updatejobregister/:id', authenticateToken, auth.updatejobregister)
router.post('/getcompanymaster.htm', authenticateToken, auth.getcompanymaster)
router.delete('/deletejobregister/:id', authenticateToken, auth.deletejobregister)
router.get('/updateJobRegistrationData/:id', authenticateToken, auth.updateJobRegistrationData)
router.delete('/deleteCalibrationlab/:id', authenticateToken, auth.deleteCalibrationlab)
router.put('/updateCalibrationlab/:id', authenticateToken, auth.updateCalibrationlab)
router.post('/addCalibrationlab', authenticateToken, auth.addCalibrationlab)
router.get('/loadAllcalbrationlabData', authenticateToken, auth.loadAllcalbrationlabData)
router.get("/jobregisterExcelfileDownload", auth.getjobregisterExcelfileDownloadPage);

module.exports = router;