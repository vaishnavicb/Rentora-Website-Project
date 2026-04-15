import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiTrash2, FiShoppingCart } from 'react-icons/fi';
import { wishlistService } from '../services/index';
import { useAuth } from '../hooks/useAuth';

export const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchWishlist();
    }
  }, [token]);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const response = await wishlistService.getWishlist();
      setItems(response.data);
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (itemId) => {
    try {
      await wishlistService.removeFromWishlist(itemId);
      fetchWishlist();
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
            <FiHeart size={32} className="text-red-500" /> My Wishlist
          </h1>
          <p className="text-gray-600 mt-2">Save your favorite items for later</p>
        </motion.div>

        {/* Items Grid */}
        {loading ? (
          <div className="flex justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
            />
          </div>
        ) : (
          <>
            {items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 bg-white rounded-lg"
              >
                <FiHeart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-2xl text-gray-600 mb-2">Your wishlist is empty</p>
                <p className="text-gray-500">Add items to your wishlist to save them for later</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {items.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition"
                  >
                    {/* Image */}
                    <div className="h-48 bg-slate-100 flex items-center justify-center overflow-hidden">
                      <img
                        src={item.product?.imageUrl || '/default-product.svg'}
                        alt={item.product?.title || 'Wishlist product'}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-800 mb-2">
                        {item.product?.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {item.product?.description}
                      </p>

                      {/* Pricing */}
                      <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                        <div className="bg-blue-50 p-2 rounded">
                          <p className="text-gray-600 text-xs">Price/Day</p>
                          <p className="font-bold text-blue-600">₹{item.product?.rentalPricePerDay}</p>
                        </div>
                        <div className="bg-purple-50 p-2 rounded">
                          <p className="text-gray-600 text-xs">Deposit</p>
                          <p className="font-bold text-purple-600">₹{item.product?.depositAmount}</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <motion.div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition"
                        >
                          <FiShoppingCart size={16} /> Rent
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleRemoveFromWishlist(item._id)}
                          className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition border border-red-300"
                        >
                          <FiTrash2 size={16} />
                        </motion.button>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
