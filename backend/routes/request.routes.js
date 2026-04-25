const express = require('express');
const router = express.Router();
const requestController = require('../controllers/request.controller');
const { clerkAuth } = require('../middleware/auth.middleware');

router.post('/', clerkAuth, requestController.createBooking);
router.get('/my-bookings', clerkAuth, requestController.getMyBookings);
router.get('/my-ride-requests', clerkAuth, requestController.getRequestsForMyRides);
router.get('/ride/:rideId', clerkAuth, requestController.getBookingsByRide);
router.patch('/:id/status', clerkAuth, requestController.updateBookingStatus);

module.exports = router;
