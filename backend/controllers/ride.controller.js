const rideRepository = require('../repositories/ride.repository');
const userRepository = require('../repositories/user.repository');
const { uploadToS3, deleteFromS3 } = require('../config/s3');

const createRide = async (req, res, next) => {
  try {
    const rideData = req.body;
    
    // Handle image upload if present
    if (req.file) {
      const imageUrl = await uploadToS3(req.file, 'rides');
      rideData.image = imageUrl;
    }
    
    const ride = await rideRepository.create(rideData);
    
    const user = await userRepository.findByEmail(rideData.riderEmail);
    if (user) {
      await userRepository.updateStats(rideData.riderEmail, {
        rides: user.stats.rides + 1,
        comments: user.stats.comments,
        rating: user.stats.rating
      });
    }

    res.status(201).json(ride);
  } catch (error) {
    next(error);
  }
};

const getRides = async (req, res, next) => {
  try {
    const rides = await rideRepository.findAll();
    res.status(200).json(rides);
  } catch (error) {
    next(error);
  }
};

const updateRide = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const ride = await rideRepository.update(id, updateData);
    res.status(200).json(ride);
  } catch (error) {
    next(error);
  }
};

const deleteRide = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ride = await rideRepository.findById(id);
    
    // Delete image from S3 if exists
    if (ride && ride.image) {
      await deleteFromS3(ride.image);
    }
    
    await rideRepository.delete(id);
    res.status(200).json({ message: 'Ride deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createRide, getRides, updateRide, deleteRide };
