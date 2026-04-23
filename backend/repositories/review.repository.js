const Review = require('../models/review.model');

class ReviewRepository {
  async create(reviewData) {
    const review = new Review(reviewData);
    return review.save();
  }

  async findByTargetEmail(email) {
    return Review.find({ targetEmail: email }).sort({ createdAt: -1 });
  }
}

module.exports = new ReviewRepository();
