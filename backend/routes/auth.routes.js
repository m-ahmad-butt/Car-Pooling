const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { clerkAuth } = require('../middleware/auth.middleware');

router.post('/sync', authController.syncUser);
router.get('/profile/:email', clerkAuth, authController.getProfile);

module.exports = router;
