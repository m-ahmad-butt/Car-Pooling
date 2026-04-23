const User = require('../models/user.model');

class UserRepository {
  async findByClerkId(clerkId) {
    return User.findOne({ clerkId });
  }

  async findByEmail(email) {
    return User.findOne({ email });
  }

  async create(userData) {
    const user = new User(userData);
    return user.save();
  }

  async updateByClerkId(clerkId, updateData) {
    return User.findOneAndUpdate({ clerkId }, updateData, { new: true });
  }

  async updateStats(email, updateData) {
    return User.findOneAndUpdate({ email }, { $set: { stats: updateData } }, { new: true });
  }
}

module.exports = new UserRepository();
