import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiUserCheck } from 'react-icons/fi';
import { authService } from '../services/index';
import { useAuth } from '../hooks/useAuth';
import RentoraLogo from '../components/RentoraLogo';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.register(
        formData.name,
        formData.email,
        formData.password,
        formData.role
      );

      // Use the token and user data from registration response
      login(response.data.user, response.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-blue-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 text-center flex justify-center"
          >
            <RentoraLogo size={50} showText={true} />
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 text-center"
          >
            <p className="text-blue-200 text-lg font-semibold">Create your account</p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-500/20 border border-red-500 rounded-lg p-3 mb-4 text-red-200"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div whileHover={{ scale: 1.02 }} className="relative">
              <FiUser className="absolute left-4 top-3.5 text-blue-300" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-white/10 border border-white/20 rounded-lg pl-11 pr-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:border-blue-400 transition"
              />
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="relative">
              <FiMail className="absolute left-4 top-3.5 text-blue-300" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-white/10 border border-white/20 rounded-lg pl-11 pr-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:border-blue-400 transition"
              />
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="relative">
              <FiLock className="absolute left-4 top-3.5 text-blue-300" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-white/10 border border-white/20 rounded-lg pl-11 pr-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:border-blue-400 transition"
              />
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="relative">
              <FiUserCheck className="absolute left-4 top-3.5 text-blue-300" />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:border-blue-400 transition appearance-none"
              >
                <option value="customer" className="text-black">Customer</option>
                <option value="vendor" className="text-black">Vendor</option>
              </select>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </motion.button>
          </form>

          <p className="text-center mt-6 text-gray-300">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
