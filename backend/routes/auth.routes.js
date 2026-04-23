const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { clerkAuth } = require('../middleware/auth.middleware');
const { upload } = require('../config/s3');

router.post('/sync', authController.syncUser);
router.get('/profile/:email', clerkAuth, authController.getProfile);
router.put('/profile/:email/image', clerkAuth, upload.single('image'), authController.updateProfileImage);

module.exports = router;
