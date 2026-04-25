const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otp.controller');

router.post('/create', otpController.createOTP);
router.post('/verify', otpController.verifyOTP);
router.post('/resend', otpController.resendOTP);

module.exports = router;
