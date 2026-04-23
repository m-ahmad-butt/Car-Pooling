const Notification = require('../models/notification.model');

class NotificationRepository {
  async create(notificationData) {
    const notification = new Notification(notificationData);
    return notification.save();
  }

  async findByTargetEmail(email) {
    return Notification.find({ 
      $or: [{ targetEmail: email }, { targetEmail: 'all' }] 
    }).sort({ createdAt: -1 });
  }

  async delete(id) {
    return Notification.findByIdAndDelete(id);
  }

  async clearByEmail(email) {
    return Notification.deleteMany({ targetEmail: email });
  }
}

module.exports = new NotificationRepository();
