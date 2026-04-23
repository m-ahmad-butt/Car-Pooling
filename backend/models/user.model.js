const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  campus: { type: String },
  contactNo: { type: String },
  rollNo: { type: String },
  image: { type: String },
  stats: {
    rides: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    rating: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
