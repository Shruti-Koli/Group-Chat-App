const express = require('express');
const forgotPasswordController = require('../controllers/forgot-password');

const router = express.Router();

router.post('/forgotpassword',forgotPasswordController.forgotPassword);
router.get('/resetpassword/:id', forgotPasswordController.resetPassword);
router.post('/updatepassword/:resetpasswordid', forgotPasswordController.updatePassword);

module.exports = router;