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


    await otpRepository.deleteByEmail(email);


    const otp = generateOTP();
    

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const otpDoc = await otpRepository.create({
      email,
      otp,
      purpose,
      expiresAt
    });



    res.status(201).json({ 
      message: 'OTP created successfully',
      otp: otp,
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


    if (new Date() > otpDoc.expiresAt) {
      await otpRepository.deleteById(otpDoc._id);
      return res.status(400).json({ message: 'OTP has expired' });
    }


    await otpRepository.markAsVerified(otpDoc._id);


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


    await otpRepository.deleteByEmail(email);


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
      otp: otp,
      expiresAt
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOTP, verifyOTP, resendOTP };
