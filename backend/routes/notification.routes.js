const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');

router.post('/', notificationController.createNotification);
router.get('/:email', notificationController.getNotifications);
router.delete('/:email', notificationController.clearNotifications);

module.exports = router;
