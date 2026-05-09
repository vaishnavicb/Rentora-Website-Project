import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShield, FiLogIn, FiInfo, FiMail, FiLock, FiArrowLeft } from 'react-icons/fi';
import { authService } from '../services/index';
import { useAuth } from '../hooks/useAuth';

export const AdminLogin = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', adminCode: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        const response = await authService.adminRegister(
          formData.name,
          formData.email,
          formData.password,
          formData.adminCode
        );
        login(response.data.user, response.data.token);
        navigate('/admin');
      } else {
        const response = await authService.login(formData.email.trim().toLowerCase(), formData.password);
        const adminUser = response.data.user;

        if (adminUser?.role !== 'admin') {
          setError('This is admin login panel. Please use admin credentials.');
        } else {
          login(adminUser, response.data.token);
          navigate('/admin');
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (mode === 'register'
            ? 'Admin registration failed. Check your admin code and details.'
            : 'Login failed. Please check your admin credentials.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-10">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 p-4 rounded-3xl">
                <FiShield size={32} />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Admin Login Panel</h1>
                <p className="mt-2 text-blue-100 max-w-2xl">
                  This is admin login panel. Only administrators can sign in here.
                </p>
              </div>
            </div>
          </div>

          <div className="p-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <p className="text-sm uppercase tracking-[.25em] text-blue-500 font-semibold">
                  Admin Portal Panel
                </p>
                <h2 className="text-3xl font-bold text-gray-900 mt-2">
                  {mode === 'register' ? 'Admin Registration' : 'Admin Login'}
                </h2>
                <p className="text-gray-600 mt-2 max-w-2xl">
                  {mode === 'register'
                    ? 'Create an admin account using the secure admin registration code.'
                    : 'Use your admin credentials to sign in and access the dashboard.'}
                </p>
              </div>
              <div className="flex gap-3 items-center">
                {mode === 'register' && (
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold transition bg-white text-blue-600 border border-blue-200 hover:bg-blue-50"
                  >
                    <FiArrowLeft size={18} />
                    {/* Back to Login */}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className={`px-5 py-3 rounded-2xl font-semibold transition ${
                    mode === 'register'
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-white text-purple-600 border border-purple-200 hover:bg-purple-50'
                  }`}
                >
                  Register Admin
                </button>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 mb-10">
              <div className="bg-slate-50 rounded-3xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 text-blue-600 mb-4">
                  <FiLogIn size={24} />
                  <h2 className="text-xl font-semibold">{mode === 'register' ? 'Admin Signup' : 'Admin Login'}</h2>
                </div>
                <p className="text-gray-600">
                  {mode === 'register'
                    ? 'Register a new admin account only if you have the admin registration code.'
                    : 'Sign in with your admin email and password to access the dashboard.'}
                </p>
              </div>
              <div className="bg-slate-50 rounded-3xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 text-purple-600 mb-4">
                  <FiInfo size={24} />
                  <h2 className="text-xl font-semibold">Important Information</h2>
                </div>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Only admin users can access the dashboard.</li>
                  <li>Admin registration requires a secret admin code.</li>
                  <li>Regular customer and vendor accounts cannot use this portal.</li>
                </ul>
              </div>
            </div>

            <div className="rounded-3xl border border-blue-100 p-8 bg-blue-50">
              {error && (
                <div className="bg-red-100 border border-red-300 text-red-700 rounded-xl p-4 mb-6">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4">
                  {mode === 'register' && (
                    <div className="relative">
                      <FiMail className="absolute left-4 top-4 text-blue-500" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Full name"
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:border-blue-400 transition"
                      />
                    </div>
                  )}
                  <div className="relative">
                    <FiMail className="absolute left-4 top-4 text-blue-500" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Admin email"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:border-blue-400 transition"
                    />
                  </div>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-4 text-purple-600" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Password"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:border-blue-400 transition"
                    />
                  </div>
                  {mode === 'register' && (
                    <div className="relative">
                      <FiShield className="absolute left-4 top-4 text-indigo-600" />
                      <input
                        type="text"
                        name="adminCode"
                        value={formData.adminCode}
                        onChange={handleChange}
                        required
                        placeholder="Admin registration code"
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:border-blue-400 transition"
                      />
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50"
                >
                  {loading
                    ? mode === 'register'
                      ? 'Creating admin...' 
                      : 'Signing in...'
                    : mode === 'register'
                    ? 'Create Admin Account'
                    : 'Sign in as Admin'}
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
