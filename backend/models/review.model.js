const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  rideId: { type: String },
  targetEmail: { type: String, required: true },
  user: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
