const express = require('express');
const router = express.Router();
const rideController = require('../controllers/ride.controller');
const { upload } = require('../config/s3');
const { clerkAuth } = require('../middleware/auth.middleware');

router.post('/', clerkAuth, upload.single('image'), rideController.createRide);
router.get('/', rideController.getRides);
router.put('/:id', clerkAuth, rideController.updateRide);
router.delete('/:id', clerkAuth, rideController.deleteRide);

module.exports = router;
