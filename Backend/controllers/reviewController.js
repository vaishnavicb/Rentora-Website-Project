const Review = require("../models/Review");
const Product = require("../models/Product");

exports.addReview = async (req, res) => {
  const { productId, rating, comment } = req.body;

  const alreadyReviewed = await Review.findOne({
    user: req.user._id,
    product: productId
  });

  if (alreadyReviewed) {
    return res.status(400).json({ message: "Already reviewed" });
  }

  const review = await Review.create({
    user: req.user._id,
    product: productId,
    rating,
    comment
  });

  // Recalculate rating
  const reviews = await Review.find({ product: productId });

  const avg =
    reviews.reduce((acc, item) => acc + item.rating, 0) /
    reviews.length;

  await Product.findByIdAndUpdate(productId, {
    averageRating: avg,
    numReviews: reviews.length
  });

  res.json(review);
};

exports.getProductReviews = async (req, res) => {
  const reviews = await Review.find({
    product: req.params.productId
  }).populate("user", "name");

  res.json(reviews);
};

exports.deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  if (review.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  await review.deleteOne();

  res.json({ message: "Review deleted" });
};