import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';

const AddReviewForm = ({ onSubmit, isLoading }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert('Please write a comment');
      return;
    }
    onSubmit({ rating, comment });
    setComment('');
    setRating(5);
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit}
      className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6 mb-8"
    >
      <h3 className="text-lg font-bold text-gray-800 mb-4">Share Your Experience</h3>

      {/* Rating Selector */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Rating: {rating} ⭐
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              type="button"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-all"
            >
              <FiStar
                size={32}
                className={
                  star <= (hoveredRating || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }
              />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Comment Input */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Your Review
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts about this product..."
          maxLength={500}
          rows={4}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        <p className="text-xs text-gray-500 mt-1">{comment.length}/500 characters</p>
      </div>

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={isLoading}
        className={`w-full py-2 px-4 rounded-lg font-semibold transition-all ${
          isLoading
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
        }`}
      >
        {isLoading ? 'Posting...' : 'Post Review'}
      </motion.button>
    </motion.form>
  );
};

export default AddReviewForm;
