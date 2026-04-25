const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  rideId: { type: String, required: true },
  riderEmail: { type: String, required: true },
  requesterName: { type: String, required: true },
  requesterEmail: { type: String, required: true },
  requesterAvatar: { type: String },
  requesterRating: { type: Number, default: 0 },
  ride: { type: String, required: true },
  rideDate: { type: String },
  seats: { type: Number, default: 1 },
  note: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'declined'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);
