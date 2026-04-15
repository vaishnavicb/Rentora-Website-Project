import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCreditCard, FiPlus, FiDollarSign, FiMinus, FiCheck } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

const Wallet = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [addingMoney, setAddingMoney] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch wallet balance
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        setLoading(true);
        const response = await api.get('/wallet');
        setBalance(response.data.balance || 0);
      } catch (err) {
        setError('Failed to load wallet');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWallet();
  }, []);

  const handleAddMoney = async (e) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setAddingMoney(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/wallet/add-money', {
        amount: parseFloat(amount)
      });
      
      setBalance(response.data.newBalance);
      setSuccess(`✅ ₹${amount} added successfully!`);
      setAmount('');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add money');
    } finally {
      setAddingMoney(false);
    }
  };

  const handleWithdrawMoney = async (e) => {
    e.preventDefault();

    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      setError('Please enter a valid amount to withdraw');
      return;
    }

    setWithdrawing(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/wallet/withdraw', {
        amount: parseFloat(withdrawAmount)
      });

      setBalance(response.data.newBalance);
      setSuccess(`✅ ₹${withdrawAmount} withdrawn successfully!`);
      setWithdrawAmount('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to withdraw money');
    } finally {
      setWithdrawing(false);
    }
  };

  const quickAmounts = [500, 1000, 2000, 5000, 10000];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-8"
        >
          <FiArrowLeft size={20} /> Back
        </motion.button>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
            <div className="flex items-center gap-3 mb-4">
              <FiCreditCard size={32} />
              <h1 className="text-3xl font-bold">My Wallet</h1>
            </div>
            <p className="opacity-90">Manage your account balance</p>
          </div>

          {/* Balance Section */}
          <div className="p-8">
            {loading ? (
              <div className="text-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="inline-block"
                >
                  <FiCreditCard size={40} className="text-blue-600" />
                </motion.div>
                <p className="text-gray-600 mt-4">Loading wallet...</p>
              </div>
            ) : (
              <>
                {/* Current Balance */}
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200 p-8 mb-8 text-center"
                >
                  <p className="text-gray-600 font-semibold mb-2">Current Balance</p>
                  <p className="text-5xl font-bold text-blue-600">₹{balance.toLocaleString()}</p>
                </motion.div>

                {/* Messages */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-red-50 border border-red-300 text-red-700 p-4 rounded-lg mb-6"
                  >
                    {error}
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-green-50 border border-green-300 text-green-700 p-4 rounded-lg mb-6 flex items-center gap-2"
                  >
                    <FiCheck size={20} />
                    {success}
                  </motion.div>
                )}

                {/* Add Money Form */}
                <form onSubmit={handleAddMoney} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Add Money to Wallet
                    </label>
                    <div className="relative flex gap-2">
                      <div className="flex-1 relative">
                        <FiDollarSign className="absolute left-4 top-4 text-gray-400" size={20} />
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => {
                            setAmount(e.target.value);
                            setError('');
                          }}
                          placeholder="Enter amount"
                          min="1"
                          step="1"
                          className="w-full border-2 border-gray-300 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:border-blue-500 font-semibold"
                        />
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={addingMoney || !amount}
                        className={`px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition ${
                          addingMoney || !amount
                            ? 'bg-gray-400 text-white cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                        }`}
                      >
                        <FiPlus size={20} />
                        {addingMoney ? 'Adding...' : 'Add'}
                      </motion.button>
                    </div>
                  </div>

                  {/* Quick Amount Buttons */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">Quick Add</p>
                    <div className="grid grid-cols-5 gap-2">
                      {quickAmounts.map((quickAmount) => (
                        <motion.button
                          key={quickAmount}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={() => setAmount(quickAmount.toString())}
                          className={`py-2 px-3 rounded-lg font-semibold transition border-2 ${
                            amount === quickAmount.toString()
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'border-gray-300 text-gray-700 hover:border-blue-500'
                          }`}
                        >
                          ₹{quickAmount / 1000}k
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </form>

                {/* Withdraw Money Form */}
                <form onSubmit={handleWithdrawMoney} className="space-y-6 mt-10">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Withdraw Money from Wallet
                    </label>
                    <div className="relative flex gap-2">
                      <div className="flex-1 relative">
                        <FiMinus className="absolute left-4 top-4 text-gray-400" size={20} />
                        <input
                          type="number"
                          value={withdrawAmount}
                          onChange={(e) => {
                            setWithdrawAmount(e.target.value);
                            setError('');
                          }}
                          placeholder="Enter amount"
                          min="1"
                          step="1"
                          className="w-full border-2 border-gray-300 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:border-blue-500 font-semibold"
                        />
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={withdrawing || !withdrawAmount}
                        className={`px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition ${
                          withdrawing || !withdrawAmount
                            ? 'bg-gray-400 text-white cursor-not-allowed'
                            : 'bg-gradient-to-r from-red-500 to-rose-500 text-white hover:from-red-600 hover:to-rose-600'
                        }`}
                      >
                        <FiMinus size={20} />
                        {withdrawing ? 'Withdrawing...' : 'Withdraw'}
                      </motion.button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">Quick Withdraw</p>
                    <div className="grid grid-cols-5 gap-2">
                      {quickAmounts.map((quickAmount) => (
                        <motion.button
                          key={quickAmount}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={() => setWithdrawAmount(quickAmount.toString())}
                          className={`py-2 px-3 rounded-lg font-semibold transition border-2 ${
                            withdrawAmount === quickAmount.toString()
                              ? 'bg-red-500 text-white border-red-500'
                              : 'border-gray-300 text-gray-700 hover:border-red-500'
                          }`}
                        >
                          ₹{quickAmount / 1000}k
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </form>

                {/* Info Box */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8"
                >
                  <h3 className="font-bold text-gray-800 mb-3">💡 How Wallet Works</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>✅ Add funds to your wallet anytime</li>
                    <li>✅ Use wallet balance to rent items</li>
                    <li>✅ Deposit amount is refunded after item return</li>
                    <li>✅ Rental amount is deducted immediately</li>
                    <li>✅ Unused balance stays in your wallet</li>
                  </ul>
                </motion.div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Wallet;
