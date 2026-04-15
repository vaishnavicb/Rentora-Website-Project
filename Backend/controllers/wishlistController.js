const Wishlist = require("../models/Wishlist");

exports.addToWishlist = async (req, res) => {
  const { productId } = req.body;

  const exists = await Wishlist.findOne({
    user: req.user._id,
    product: productId
  });

  if (exists) {
    return res.status(400).json({ message: "Already in wishlist" });
  }

  const item = await Wishlist.create({
    user: req.user._id,
    product: productId
  });

  res.json(item);
};

exports.getWishlist = async (req, res) => {
  const items = await Wishlist.find({ user: req.user._id })
    .populate("product");

  res.json(items);
};

exports.removeFromWishlist = async (req, res) => {
  const { id } = req.params;

  await Wishlist.findByIdAndDelete(id);

  res.json({ message: "Removed from wishlist" });
};