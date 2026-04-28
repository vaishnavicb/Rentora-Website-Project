import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCalendar, FiDollarSign, FiBox, FiStar, FiShoppingCart, FiHeart } from 'react-icons/fi';
import { orderService, wishlistService, reviewService, productService, walletService } from '../services/index';
import { useAuth } from '../hooks/useAuth';
import ReviewCard from '../components/ReviewCard';
import AddReviewForm from '../components/AddReviewForm';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [addingReview, setAddingReview] = useState(false);
  const [product, setProduct] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);

  // Fetch reviews on component mount
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const response = await reviewService.getProductReviews(id);
        setReviews(response.data || []);
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, [id]);

  useEffect(() => {
  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.getProductById(id);
      setProduct(response.data);
    } catch (err) {
      console.error("Failed to fetch product:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchProduct();
}, [id]);

  // Fetch wallet balance when user is logged in
  useEffect(() => {
    const fetchWalletBalance = async () => {
      if (user) {
        try {
          const response = await walletService.getBalance();
          setWalletBalance(response.data.balance);
        } catch (err) {
          console.error("Failed to fetch wallet balance:", err);
        }
      }
    };

    fetchWalletBalance();
  }, [user]);

  useEffect(() => {
    const loadWishlistState = async () => {
      if (!user) {
        setIsWishlisted(false);
        return;
      }

      try {
        const response = await wishlistService.getWishlist();
        const wishlistedIds = (response.data || []).map((item) => item.product?._id).filter(Boolean);
        setIsWishlisted(wishlistedIds.includes(id));
      } catch (err) {
        console.error('Failed to load wishlist state:', err);
      }
    };

    loadWishlistState();
  }, [user, id]);

  // Dummy product - in real app, fetch from API
  // const product = {
  //   _id: id,
  //   title: 'Premium Laptop',
  //   category: 'Electronics',
  //   description: 'High-performance laptop with 16GB RAM, 512GB SSD, perfect for work and entertainment',
  //   rentalPricePerDay: 500,
  //   depositAmount: 5000,
  //   availableQuantity: 3,
  //   averageRating: 4.5,
  //   numReviews: 12,
  //   vendor: { name: 'Tech Store' }
  // };

  const handleRent = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate('/login');
      return;
    }

    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      setError('End date must be after start date');
      return;
    }

    // Calculate total cost
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const rentalAmount = product.rentalPricePerDay * quantity * days;
    const depositAmount = product.depositAmount * quantity;
    const totalCost = rentalAmount + depositAmount;

    // Check wallet balance before API call
    if (walletBalance < totalCost) {
      setError(`Insufficient wallet balance. You have ₹${walletBalance} but need ₹${totalCost}. Please add ₹${totalCost - walletBalance} more to your wallet.`);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await orderService.createOrder(id, startDate, endDate, quantity);
      setSuccess(`Order created! Rental: ₹${response.data.rentalAmount}, Deposit: ₹${response.data.depositAmount}`);
      // Update wallet balance after successful order
      setWalletBalance(prev => prev - totalCost);
      setTimeout(() => {
        navigate('/my-orders');
      }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create order';
      setError(errorMessage);

      // If it's an insufficient balance error from backend, offer to add money
      if (errorMessage.includes('Insufficient wallet balance')) {
        setError(`${errorMessage} <a href="/wallet" class="text-blue-600 hover:text-blue-700 underline">Click here to add money to your wallet</a>.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await wishlistService.addToWishlist(id);
      setIsWishlisted(true);
      setSuccess('Added to wishlist!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add to wishlist');
    }
  };

  const handleAddReview = async ({ rating, comment }) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setAddingReview(true);
    try {
      const response = await reviewService.addReview(id, { rating, comment });
      setReviews([response.data, ...reviews]);
      setSuccess('Review posted! ⭐');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post review');
    } finally {
      setAddingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return;

    try {
      await reviewService.deleteReview(reviewId);
      setReviews(reviews.filter((r) => r._id !== reviewId));
      setSuccess('Review deleted');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete review');
    }
  };

  if (!product) {
  return (
    <div className="text-center py-20 text-xl font-semibold">
      Loading product...
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-8"
        >
          <FiArrowLeft size={20} /> Back
        </motion.button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-lg p-8 min-h-96 flex items-center justify-center overflow-hidden"
          >
            <img
              src={product.imageUrl || "/default-product.svg"}
              alt={product.title}
              className="w-full h-full object-contain rounded-lg"
            />
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Title & Category */}
            <h1 className="text-4xl font-bold text-gray-800 mb-2">{product.title}</h1>
            <p className="text-lg text-gray-600 mb-4">{product.category}</p>

            {/* Rating */}
            {product.averageRating > 0 && (
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      size={20}
                      className={i < Math.round(product.averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <span className="text-gray-600">({product.numReviews} reviews)</span>
              </div>
            )}

            {/* Description */}
            <p className="text-gray-600 mb-8 text-lg">{product.description}</p>

            {/* Pricing Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center"
              >
                <FiDollarSign className="text-blue-600 mx-auto mb-2" size={24} />
                <p className="text-gray-600 text-sm">Rental/Day</p>
                <p className="text-2xl font-bold text-blue-600">₹{product.rentalPricePerDay}</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 text-center"
              >
                <FiBox className="text-purple-600 mx-auto mb-2" size={24} />
                <p className="text-gray-600 text-sm">Deposit</p>
                <p className="text-2xl font-bold text-purple-600">₹{product.depositAmount}</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-center"
              >
                <FiDollarSign className="text-red-600 mx-auto mb-2" size={24} />
                <p className="text-gray-600 text-sm">Late Fee/Day</p>
                <p className="text-2xl font-bold text-red-600">₹{product.lateFeePerDay || 200}</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center"
              >
                <FiBox className="text-green-600 mx-auto mb-2" size={24} />
                <p className="text-gray-600 text-sm">Available</p>
                <p className="text-2xl font-bold text-green-600">
                  {product.availableQuantity === 0
                    ? "Out of Stock"
                    : product.availableQuantity === 1
                    ? "1 left"
                    : product.availableQuantity}
                </p>
              </motion.div>
            </div>

            {/* Vendor Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-8 border border-gray-200">
              <p className="text-sm text-gray-600">Vendor</p>
              <p className="text-lg font-semibold text-gray-800">{product.vendor?.name}</p>
            </div>

            {/* Messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-50 border border-red-300 text-red-700 p-4 rounded-lg mb-4"
                dangerouslySetInnerHTML={{ __html: error }}
              />
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-green-50 border border-green-300 text-green-700 p-4 rounded-lg mb-4"
              >
                ✅ {success}
              </motion.div>
            )}

            {/* Rental Form */}
            <form onSubmit={handleRent} className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📅 Rental Period</h3>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantity
                </label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
                >
                  {[...Array(Math.min(product.availableQuantity, 10))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i + 1 === 1 ? 'item' : 'items'}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  {product.availableQuantity} available
                </p>
              </div>

              {startDate && endDate && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6"
                >
                  <p className="text-sm text-gray-600 mb-2">Estimation:</p>
                  <div className="grid 2 gap-3">
                    <div className="flex justify-between">
                      <span className="font-semibold">Days:</span>
                      <span className="text-blue-600 font-bold">
                        {Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Rental Amount:</span>
                      <span className="text-blue-600 font-bold">
                        ₹{product.rentalPricePerDay * Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) * quantity}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-bold text-lg">Total (with deposit):</span>
                      <span className="text-green-600 font-bold text-lg">
                        ₹{product.depositAmount * quantity + product.rentalPricePerDay * Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) * quantity}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              <motion.button
                whileHover={product.availableQuantity > 0 ? { scale: 1.05 } : {}}
                whileTap={product.availableQuantity > 0 ? { scale: 0.95 } : {}}
                type="submit"
                disabled={loading || !user || product.availableQuantity === 0}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiShoppingCart size={20} />
                {loading
                  ? 'Creating Order...'
                  : product.availableQuantity === 0
                  ? 'Out of Stock'
                  : 'Rent Now'}
              </motion.button>

              {!user && (
                <p className="text-center text-gray-600 mt-4 text-sm">
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="text-blue-600 hover:text-blue-700 font-semibold underline"
                  >
                    Login
                  </button>
                  {' '}to rent this item
                </p>
              )}
            </form>

            {/* Wishlist Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToWishlist}
              className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition border-2 ${
                isWishlisted
                  ? 'bg-pink-100 border-pink-300 text-pink-600'
                  : 'bg-white border-pink-300 text-pink-600 hover:bg-pink-50'
              }`}
            >
              <FiHeart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
              {isWishlisted ? 'Added to Wishlist' : 'Add to Wishlist'}
            </motion.button>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 bg-white rounded-lg shadow-lg p-8"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Reviews & Ratings</h2>
          <p className="text-gray-600 mb-6">
            {reviews.length > 0
              ? `${reviews.length} customer${reviews.length !== 1 ? 's' : ''} reviewed this product`
              : 'No reviews yet. Be the first to review!'}
          </p>

          {/* Add Review Form */}
          {user && (
            <AddReviewForm onSubmit={handleAddReview} isLoading={addingReview} />
          )}

          {!user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-center"
            >
              <p className="text-gray-700">
                <button
                  onClick={() => navigate('/login')}
                  className="text-blue-600 hover:text-blue-700 font-semibold underline"
                >
                  Login
                </button>
                {' '}to write a review
              </p>
            </motion.div>
          )}

          {/* Reviews List */}
          {reviewsLoading ? (
            <div className="text-center py-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="inline-block"
              >
                <FiStar size={32} className="text-yellow-400" />
              </motion.div>
              <p className="text-gray-600 mt-4">Loading reviews...</p>
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard
                  key={review._id}
                  review={review}
                  currentUserId={user?._id}
                  onDelete={handleDeleteReview}
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
            >
              <FiStar size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No reviews yet</p>
              <p className="text-gray-400">Be the first to share your experience!</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
