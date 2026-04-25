const reviewRepository = require('../repositories/review.repository');
const userRepository = require('../repositories/user.repository');

const createReview = async (req, res, next) => {
  try {
    const reviewData = req.body;
    const review = await reviewRepository.create(reviewData);

    const userReviews = await reviewRepository.findByTargetEmail(reviewData.targetEmail);
    const avgRating = userReviews.length > 0
      ? Number((userReviews.reduce((acc, curr) => acc + curr.rating, 0) / userReviews.length).toFixed(1))
      : 0;

    const user = await userRepository.findByEmail(reviewData.targetEmail);
    if (user) {
      await userRepository.updateStats(reviewData.targetEmail, {
        rides: user.stats.rides,
        comments: userReviews.length,
        rating: avgRating
      });
    }

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

const getReviewsByUser = async (req, res, next) => {
  try {
    const { email } = req.params;
    const reviews = await reviewRepository.findByTargetEmail(email);
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};

module.exports = { createReview, getReviewsByUser };
