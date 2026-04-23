const notificationRepository = require('../repositories/notification.repository');

const createNotification = async (req, res, next) => {
  try {
    const notificationData = req.body;
    const notification = await notificationRepository.create(notificationData);
    res.status(201).json(notification);
  } catch (error) {
    next(error);
  }
};

const getNotifications = async (req, res, next) => {
  try {
    const { email } = req.params;
    const notifications = await notificationRepository.findByTargetEmail(email);
    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};

const clearNotifications = async (req, res, next) => {
  try {
    const { email } = req.params;
    await notificationRepository.clearByEmail(email);
    res.status(200).json({ message: 'Notifications cleared' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createNotification, getNotifications, clearNotifications };
