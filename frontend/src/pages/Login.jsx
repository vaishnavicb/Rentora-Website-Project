import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock } from 'react-icons/fi';
import { authService } from '../services/index';
import { useAuth } from '../hooks/useAuth';
import RentoraLogo from '../components/RentoraLogo';

export const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
      const response = await authService.login(formData.email, formData.password);
      login(response.data.user, response.data.token);
      if (response.data.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-blue-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="mb-8 text-center flex justify-center"
          >
            <RentoraLogo size={50} showText={true} />
          </motion.div>
          <motion.div
            initial={{ y: -10 }}
            animate={{ y: 0 }}
            className="mb-8 text-center"
          >
            <p className="text-blue-200 text-lg font-semibold">Welcome Back</p>
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

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </motion.button>
          </form>

          <p className="text-center mt-4 text-sm text-blue-200">
            Admin users: login with your admin credentials and you will be redirected to the admin dashboard.
          </p>

          <p className="text-center mt-6 text-gray-300">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold">
              Register
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
