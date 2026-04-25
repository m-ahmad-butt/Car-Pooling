const userRepository = require('../repositories/user.repository');
const rideRepository = require('../repositories/ride.repository');
const reviewRepository = require('../repositories/review.repository');
const { uploadToS3, deleteFromS3 } = require('../config/s3');

const syncUser = async (req, res, next) => {
  try {
    const { clerkId, email, name, firstName, lastName, campus, contactNo, rollNo } = req.body;

    let user = await userRepository.findByClerkId(clerkId);


    const updateData = { email, name };
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (campus) updateData.campus = campus;
    if (contactNo) updateData.contactNo = contactNo;
    if (rollNo) updateData.rollNo = rollNo;

    if (user) {
      user = await userRepository.updateByClerkId(clerkId, updateData);
    } else {

      user = await userRepository.create({
        clerkId,
        email,
        name: name || `${firstName} ${lastName}`,
        firstName,
        lastName,
        campus,
        contactNo,
        rollNo
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


    const rides = await rideRepository.findAll({ riderEmail: email });
    const reviews = await reviewRepository.findByTargetEmail(email);
    const avgRating = reviews.length > 0
      ? Number((reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1))
      : 0;


    const userObj = user.toObject();
    userObj.stats = {
      rides: rides.length,
      comments: reviews.length,
      rating: avgRating
    };

    res.status(200).json(userObj);
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

    if (user.image) {
      await deleteFromS3(user.image);
    }

    const imageUrl = await uploadToS3(req.file, 'profiles');
    const updatedUser = await userRepository.updateByEmail(email, { image: imageUrl });

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { email } = req.params;
    const { name, campus } = req.body;

    const user = await userRepository.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (campus !== undefined) updateData.campus = campus;

    const updatedUser = await userRepository.updateByEmail(email, updateData);
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

module.exports = { syncUser, getProfile, updateProfileImage, updateProfile };
