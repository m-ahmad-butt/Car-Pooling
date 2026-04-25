const OTP = require('../models/otp.model');

class OTPRepository {
  async create(otpData) {
    const otp = new OTP(otpData);
    return otp.save();
  }

  async findByEmail(email) {
    return OTP.findOne({ email, verified: false }).sort({ createdAt: -1 });
  }

  async findByEmailAndOTP(email, otp) {
    return OTP.findOne({ email, otp, verified: false });
  }

  async markAsVerified(id) {
    return OTP.findByIdAndUpdate(id, { verified: true }, { new: true });
  }

  async deleteByEmail(email) {
    return OTP.deleteMany({ email });
  }

  async deleteExpired() {
    const now = new Date();
    return OTP.deleteMany({ expiresAt: { $lt: now } });
  }

  async deleteById(id) {
    return OTP.findByIdAndDelete(id);
  }
}

module.exports = new OTPRepository();
