import React from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiTrash2 } from 'react-icons/fi';

const ReviewCard = ({ review, currentUserId, onDelete }) => {
  const isOwn = review.user?._id === currentUserId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-4 mb-4"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="font-semibold text-gray-800">{review.user?.name || 'Anonymous'}</p>
          <p className="text-xs text-gray-500">
            {new Date(review.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Rating Stars */}
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <FiStar
              key={i}
              size={16}
              className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
            />
          ))}
        </div>
      </div>

      {/* Comment */}
      <p className="text-gray-700 mb-3">{review.comment}</p>

      {/* Delete Button (Own Reviews Only) */}
      {isOwn && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDelete(review._id)}
          className="text-red-600 hover:text-red-700 font-semibold text-sm flex items-center gap-1"
        >
          <FiTrash2 size={14} /> Delete
        </motion.button>
      )}
    </motion.div>
  );
};

export default ReviewCard;
