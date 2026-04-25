const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  targetEmail: { type: String, required: true },
  from: { type: String },
  message: { type: String, required: true },
  type: { type: String, enum: ['request', 'review', 'system', 'ride', 'ride-started', 'approval', 'decline'], default: 'system' },
  read: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
