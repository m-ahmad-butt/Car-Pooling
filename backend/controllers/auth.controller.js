const userRepository = require('../repositories/user.repository');
const { uploadToS3, deleteFromS3 } = require('../config/s3');

const syncUser = async (req, res, next) => {
  try {
    const { clerkId, email, name, firstName, lastName, campus, contactNo, rollNo } = req.body;
    
    let user = await userRepository.findByClerkId(clerkId);
    
    if (user) {
      user = await userRepository.updateByClerkId(clerkId, {
        email, name, firstName, lastName, campus, contactNo, rollNo
      });
    } else {
      user = await userRepository.create({
        clerkId, email, name, firstName, lastName, campus, contactNo, rollNo
      });
    }
    
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const { email } = req.params;
    const user = await userRepository.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const updateProfileImage = async (req, res, next) => {
  try {
    const { email } = req.params;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const user = await userRepository.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete old image if exists
    if (user.image) {
      await deleteFromS3(user.image);
    }

    // Upload new image
    const imageUrl = await uploadToS3(req.file, 'profiles');
    
    // Update user with new image URL
    const updatedUser = await userRepository.updateByEmail(email, { image: imageUrl });
    
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

module.exports = { syncUser, getProfile, updateProfileImage };
