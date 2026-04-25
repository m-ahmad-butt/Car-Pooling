const rideRepository = require('../repositories/ride.repository');
const userRepository = require('../repositories/user.repository');
const { uploadToS3, deleteFromS3 } = require('../config/s3');

const createRide = async (req, res, next) => {
  try {
    const rideData = req.body;
    
    if (req.file) {
      const imageUrl = await uploadToS3(req.file, 'rides');
      rideData.image = imageUrl;
    }
    
    const ride = await rideRepository.create(rideData);
    
    res.status(201).json(ride);
  } catch (error) {
    next(error);
  }
};

const getRides = async (req, res, next) => {
  try {
    const { destination, seats, date, location, campus, search } = req.query;
    const filters = {};
    
    if (search) {
      filters.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { destination: { $regex: search, $options: 'i' } },
        { riderName: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (destination && !search) {
      filters.destination = { $regex: destination, $options: 'i' };
    }
    if (location && !search) {
      filters.location = { $regex: location, $options: 'i' };
    }
    if (campus) {
      filters.campus = { $regex: campus, $options: 'i' };
    }
    if (seats) {
      filters.seats = { $gte: parseInt(seats) };
    }
    if (date) {
      filters.date = date;
    }
    
    const rides = await rideRepository.findAll(filters);
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
    
    if (ride && ride.image) {
      await deleteFromS3(ride.image);
    }
    
    await rideRepository.delete(id);
    res.status(200).json({ message: 'Ride deleted' });
  } catch (error) {
    next(error);
  }
};

const getRideById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ride = await rideRepository.findById(id);
    
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    
    res.status(200).json(ride);
  } catch (error) {
    next(error);
  }
};

const getMyOngoingRide = async (req, res, next) => {
  try {
    const { userId } = req.auth;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const user = await userRepository.findByClerkId(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    

    const ongoingRides = await rideRepository.findAll({ status: 'ongoing' });
    
    const userOngoingRide = ongoingRides.find(ride => 
      ride.riderEmail === user.email || 
      (ride.approvedMembers && ride.approvedMembers.some(m => m.email === user.email))
    );
    
    if (!userOngoingRide) {
      return res.status(200).json(null);
    }
    
    res.status(200).json(userOngoingRide);
  } catch (error) {
    next(error);
  }
};

module.exports = { createRide, getRides, getRideById, updateRide, deleteRide, getMyOngoingRide };
