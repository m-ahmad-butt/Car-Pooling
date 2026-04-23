const Ride = require('../models/ride.model');

class RideRepository {
  async create(rideData) {
    const ride = new Ride(rideData);
    return ride.save();
  }

  async findAll() {
    return Ride.find().sort({ createdAt: -1 });
  }

  async findById(id) {
    return Ride.findById(id);
  }

  async update(id, updateData) {
    return Ride.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id) {
    return Ride.findByIdAndDelete(id);
  }
}

module.exports = new RideRepository();
