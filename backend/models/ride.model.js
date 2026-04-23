const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  campus: { type: String },
  vehicleType: { type: String },
  vehicleNumber: { type: String },
  seats: { type: Number, required: true, default: 1 },
  riderName: { type: String, required: true },
  riderEmail: { type: String, required: true },
  riderRating: { type: Number, default: 0 },
  date: { type: String },
  departureTime: { type: String },
  contactNumber: { type: String },
  location: { type: String },
  destination: { type: String },
  status: { type: String, enum: ['active', 'Done'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('Ride', rideSchema);
