const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true },
  otp: { type: String, required: true },
  purpose: { type: String, enum: ['registration', 'password-reset'], default: 'registration' },
  verified: { type: Boolean, default: false },
  expiresAt: { type: Date, required: true, index: true }
}, { timestamps: true });

// TTL index - MongoDB will automatically delete documents after expiresAt
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('OTP', otpSchema);
