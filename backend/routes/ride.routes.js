const express = require('express');
const router = express.Router();
const rideController = require('../controllers/ride.controller');

router.post('/', rideController.createRide);
router.get('/', rideController.getRides);
router.put('/:id', rideController.updateRide);
router.delete('/:id', rideController.deleteRide);

module.exports = router;
