const otpRepository = require('../repositories/otp.repository');
const crypto = require('crypto');

const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const createOTP = async (req, res, next) => {
  try {
    const { email, purpose = 'registration' } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Delete any existing OTPs for this email
    await otpRepository.deleteByEmail(email);

    // Generate new OTP
    const otp = generateOTP();
    
    // Set expiration to 10 minutes from now
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const otpDoc = await otpRepository.create({
      email,
      otp,
      purpose,
      expiresAt
    });

    // In production, send OTP via email
    // For now, return it in response (remove in production)
    res.status(201).json({ 
      message: 'OTP created successfully',
      otp: otp, // Remove this in production
      expiresAt
    });
  } catch (error) {
    next(error);
  }
};

const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const otpDoc = await otpRepository.findByEmailAndOTP(email, otp);

    if (!otpDoc) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Check if expired
    if (new Date() > otpDoc.expiresAt) {
      await otpRepository.deleteById(otpDoc._id);
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Mark as verified
    await otpRepository.markAsVerified(otpDoc._id);

    // Delete the OTP after verification
    await otpRepository.deleteById(otpDoc._id);

    res.status(200).json({ 
      message: 'OTP verified successfully',
      verified: true
    });
  } catch (error) {
    next(error);
  }
};

const resendOTP = async (req, res, next) => {
  try {
    const { email, purpose = 'registration' } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Delete existing OTPs
    await otpRepository.deleteByEmail(email);

    // Generate new OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await otpRepository.create({
      email,
      otp,
      purpose,
      expiresAt
    });

    res.status(200).json({ 
      message: 'OTP resent successfully',
      otp: otp, // Remove this in production
      expiresAt
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOTP, verifyOTP, resendOTP };
