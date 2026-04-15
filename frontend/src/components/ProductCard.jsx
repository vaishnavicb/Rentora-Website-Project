import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiStar, FiShoppingCart, FiHeart } from 'react-icons/fi';
import { wishlistService } from '../services/index';
import { useAuth } from '../hooks/useAuth';

const ProductCard = ({ product, isWishlisted: initialWishlisted = false }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted);

  useEffect(() => {
    setIsWishlisted(initialWishlisted);
  }, [initialWishlisted]);
  

  const handleAddToWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await wishlistService.addToWishlist(product._id);
      setIsWishlisted(true);
    } catch (err) {
      console.error('Failed to add to wishlist:', err);
    }
  };

  const handleRentClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/product/${product._id}`);
  };

  return (
    <motion.div
      whileHover={{ y: -10 }}
      onClick={() => navigate(`/product/${product._id}`)}
      className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative h-48 bg-slate-100 flex items-center justify-center overflow-hidden">
        <img
          src={product.imageUrl || "/default-product.svg"}
          alt={product.title}
          className="w-full h-full object-contain"
        />
        {product.averageRating > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-3 right-3 bg-yellow-400 text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm font-bold"
          >
            <FiStar size={16} /> {product.averageRating.toFixed(1)}
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
          {product.title}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Details */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
          <div className="bg-blue-50 p-2 rounded">
            <p className="text-gray-600 text-xs">Rental/Day</p>
            <p className="font-bold text-lg text-blue-600">₹{product.rentalPricePerDay}</p>
          </div>
          <div className="bg-purple-50 p-2 rounded">
            <p className="text-gray-600 text-xs">Deposit</p>
            <p className="font-bold text-lg text-purple-600">₹{product.depositAmount}</p>
          </div>
        </div>

        <p className="text-xs text-gray-500 mb-4">
          {product.availableQuantity === 0
            ? "Out of Stock"
            : product.availableQuantity === 1
            ? "1 item left"
            : `${product.availableQuantity} items available`}
        </p>

        {/* Action Buttons */}
        <motion.div className="flex gap-2 mb-3">
          <motion.button
            whileHover={product.availableQuantity > 0 ? { scale: 1.05 } : {}}
            whileTap={product.availableQuantity > 0 ? { scale: 0.95 } : {}}
            onClick={handleRentClick}
            disabled={product.availableQuantity === 0}
            className={`flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition ${
              product.availableQuantity === 0
                ? 'opacity-50 cursor-not-allowed bg-gray-400 hover:bg-gray-400'
                : ''
            }`}
          >
            <FiShoppingCart size={18} /> {product.availableQuantity === 0 ? 'Out of Stock' : 'Rent'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToWishlist}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1 transition border-2 font-bold ${
              isWishlisted
                ? 'bg-pink-100 border-pink-300 text-pink-600'
                : 'bg-pink-50 hover:bg-pink-100 text-pink-600 border-pink-300'
            }`}
          >
            <FiHeart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
          </motion.button>
        </motion.div>

        {/* View Details Link */}
        <Link
          to={`/product/${product._id}`}
          className="block text-center text-blue-600 hover:text-blue-700 font-semibold text-sm hover:underline"
        >
          View Details →
        </Link>
      </div>
    </motion.div>
  );
};

export default ProductCard;
