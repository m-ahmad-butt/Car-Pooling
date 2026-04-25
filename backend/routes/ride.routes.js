const express = require('express');
const router = express.Router();
const rideController = require('../controllers/ride.controller');
const { upload } = require('../config/s3');
const { clerkAuth } = require('../middleware/auth.middleware');

router.get('/', rideController.getRides);
router.get('/my-ongoing', clerkAuth, rideController.getMyOngoingRide);
router.get('/:id', rideController.getRideById);
router.post('/', clerkAuth, upload.single('image'), rideController.createRide);
router.put('/:id', clerkAuth, rideController.updateRide);
router.delete('/:id', clerkAuth, rideController.deleteRide);

module.exports = router;
