const express = require('express');
const router = express.Router();
const requestController = require('../controllers/request.controller');

router.post('/', requestController.createRequest);
router.get('/ride/:rideId', requestController.getRequestsByRide);
router.patch('/:id/status', requestController.updateRequestStatus);

module.exports = router;
