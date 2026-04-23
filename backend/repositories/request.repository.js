const Request = require('../models/request.model');

class RequestRepository {
  async create(requestData) {
    const request = new Request(requestData);
    return request.save();
  }

  async findByRideId(rideId) {
    return Request.find({ rideId }).sort({ createdAt: -1 });
  }

  async findByRequesterEmail(email) {
    return Request.find({ requesterEmail: email }).sort({ createdAt: -1 });
  }

  async findById(id) {
    return Request.findById(id);
  }

  async updateStatus(id, status) {
    return Request.findByIdAndUpdate(id, { status }, { new: true });
  }
}

module.exports = new RequestRepository();
