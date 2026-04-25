const requestRepository = require('../repositories/request.repository');
const userRepository = require('../repositories/user.repository');

const createBooking = async (req, res, next) => {
  try {
    const requestData = req.body;
    const request = await requestRepository.create(requestData);
    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
};

const getBookingsByRide = async (req, res, next) => {
  try {
    const { rideId } = req.params;
    const requests = await requestRepository.findByRideId(rideId);
    res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
};

const getMyBookings = async (req, res, next) => {
  try {
    const { userId } = req.auth;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Get user email from database using Clerk userId
    const user = await userRepository.findByClerkId(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const requests = await requestRepository.findByRequesterEmail(user.email);
    res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
};

const getRequestsForMyRides = async (req, res, next) => {
  try {
    const { userId } = req.auth;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Get user email from database using Clerk userId
    const user = await userRepository.findByClerkId(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const requests = await requestRepository.findByRiderEmail(user.email);
    res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
};

const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const request = await requestRepository.updateStatus(id, status);
    res.status(200).json(request);
  } catch (error) {
    next(error);
  }
};

module.exports = { createBooking, getBookingsByRide, getMyBookings, getRequestsForMyRides, updateBookingStatus };
