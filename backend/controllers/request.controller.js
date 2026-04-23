const requestRepository = require('../repositories/request.repository');

const createRequest = async (req, res, next) => {
  try {
    const requestData = req.body;
    const request = await requestRepository.create(requestData);
    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
};

const getRequestsByRide = async (req, res, next) => {
  try {
    const { rideId } = req.params;
    const requests = await requestRepository.findByRideId(rideId);
    res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
};

const updateRequestStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const request = await requestRepository.updateStatus(id, status);
    res.status(200).json(request);
  } catch (error) {
    next(error);
  }
};

module.exports = { createRequest, getRequestsByRide, updateRequestStatus };
