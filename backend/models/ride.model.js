const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  campus: { type: String },
  vehicleType: { type: String },
  vehicleNumber: { type: String },
  seats: { type: Number, required: true, default: 1 },
  availableSeats: { type: Number },
  approvedMembers: [{ 
    email: String, 
    name: String, 
    seats: Number,
    avatar: String
  }],
  riderName: { type: String, required: true },
  riderEmail: { type: String, required: true },
  riderAvatar: { type: String },
  riderRating: { type: Number, default: 0 },
  date: { type: String },
  departureTime: { type: String },
  contactNumber: { type: String },
  location: { type: String },
  destination: { type: String },
  image: { type: String },
  status: { type: String, enum: ['active', 'ongoing', 'completed', 'Done'], default: 'active' },
  pendingReviews: [{
    reviewerEmail: String,
    reviewerName: String,
    targetEmail: String,
    targetName: String
  }]
}, { timestamps: true });

// Initialize availableSeats to match seats when creating
rideSchema.pre('save', function(next) {
  if (this.isNew && this.availableSeats === undefined) {
    this.availableSeats = this.seats;
  }
  next();
});

module.exports = mongoose.model('Ride', rideSchema);
