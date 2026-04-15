import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPackage, FiClock, FiCheckCircle, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { orderService, grievanceService } from '../services/index';

export const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [grievances, setGrievances] = useState([]);
  const [reportingOrderId, setReportingOrderId] = useState(null);
  const [issueMessage, setIssueMessage] = useState('');
  const [submittingIssue, setSubmittingIssue] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  useEffect(() => {
    fetchOrders();
    fetchGrievances();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await orderService.getMyOrders();
      const sortedOrders = (response.data || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sortedOrders);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGrievances = async () => {
    try {
      const response = await grievanceService.getCustomerGrievances();
      setGrievances(response.data || []);
    } catch (err) {
      console.error('Failed to fetch grievances:', err);
    }
  };

  const handleReportIssue = async (orderId) => {
    if (!issueMessage.trim()) {
      return;
    }

    setSubmittingIssue(true);
    try {
      await grievanceService.createGrievance(orderId, issueMessage.trim());
      setIssueMessage('');
      setReportingOrderId(null);
      fetchGrievances();
    } catch (err) {
      console.error('Failed to submit grievance:', err);
    } finally {
      setSubmittingIssue(false);
    }
  };

  const handleReturnProduct = async (orderId) => {
    const returnDate = prompt('Enter return date (YYYY-MM-DD):');
    if (returnDate) {
      try {
        await orderService.returnProduct(orderId, returnDate);
        fetchOrders();
      } catch (err) {
        console.error('Failed to return product:', err);
      }
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await orderService.cancelOrder(orderId);
        fetchOrders();
      } catch (err) {
        console.error('Failed to cancel order:', err);
      }
    }
  };

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeTab);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-blue-100 text-blue-800',
    'in-use': 'bg-purple-100 text-purple-800',
    returned: 'bg-gray-100 text-gray-800',
    overdue: 'bg-red-100 text-red-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Orders</h1>
          <p className="text-gray-600 mb-4">Track and manage your rentals</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">Order Flow:</h3>
            <p className="text-sm text-blue-700">
              Pending → Approved → In-Use → Return Product → Completed
              <br />
              <span className="text-red-600">If not returned on time: In-Use → Overdue</span>
            </p>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-2 mb-8 overflow-x-auto pb-2"
        >
          {['all', 'pending', 'approved', 'in-use', 'returned', 'overdue', 'completed', 'cancelled'].map(
            (tab) => (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </motion.button>
            )
          )}
        </motion.div>

        {/* Orders List */}
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
            {filteredOrders.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 bg-white rounded-lg"
              >
                <FiPackage className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-2xl text-gray-600">No orders found</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {filteredOrders.map((order, index) => {
                    const orderGrievances = grievances.filter(
                      (g) => g.order && (g.order._id || g.order).toString() === order._id.toString()
                    );
                    const hasIssue = orderGrievances.length > 0;
                    return (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition ${
                      order.status === 'overdue' ? 'border-red-300 bg-red-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {order.product?.title}
                        </h3>
                        <p className="text-sm text-gray-600">{order.product?.category}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-bold ${
                            statusColors[order.status] || 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {order.status.toUpperCase()}
                        </span>
                        {order.status === 'overdue' && order.lateFee > 0 && (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                            Late fee charged
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-5 gap-4 mb-6 text-sm">
                      <div className="bg-blue-50 p-3 rounded border border-blue-200">
                        <p className="text-gray-600 text-xs mb-1">Rental</p>
                        <p className="font-bold text-blue-600">₹{order.rentalAmount}</p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded border border-purple-200">
                        <p className="text-gray-600 text-xs mb-1">Deposit</p>
                        <p className="font-bold text-purple-600">₹{order.depositAmount}</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded border border-green-200">
                        <p className="text-gray-600 text-xs mb-1">Duration</p>
                        <p className="font-bold text-green-600">{order.totalDays} days</p>
                      </div>
                      <div className="bg-orange-50 p-3 rounded border border-orange-200">
                        <p className="text-gray-600 text-xs mb-1">Quantity</p>
                        <p className="font-bold text-orange-600">{order.quantity || 1}</p>
                      </div>
                      <div className="bg-red-50 p-3 rounded border border-red-200">
                        <p className="text-gray-600 text-xs mb-1">Late Fee</p>
                        <p className="font-bold text-red-600">₹{order.lateFee || 0}</p>
                      </div>
                    </div>

                    {hasIssue && (
                      <div className="mb-4 text-sm text-orange-700 bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <p className="font-semibold">Issue reported</p>
                        <p>{orderGrievances[0].message}</p>
                        <Link
                          to={`/grievances/${orderGrievances[0]._id}`}
                          className="mt-2 inline-flex text-sm font-semibold text-blue-600 hover:text-blue-800"
                        >
                          View grievance details
                        </Link>
                      </div>
                    )}

                    <div className="flex gap-2 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FiClock size={16} />
                        {new Date(order.startDate).toLocaleDateString()} to{' '}
                        {new Date(order.endDate).toLocaleDateString()}
                      </div>
                    </div>

                    {order.status === 'overdue' && (
                      <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-lg mb-4">
                        <p>⚠️ This order is overdue. Please return the product as soon as possible to avoid additional late fees.</p>
                        {order.lateFee > 0 && (
                          <p className="mt-2 font-semibold">₹{order.lateFee} late fee has been deducted from your deposit.</p>
                        )}
                      </div>
                    )}

                    {order.status !== 'cancelled' && (
                      <div className="mb-4">
                        <button
                          onClick={() => setReportingOrderId(order._id === reportingOrderId ? null : order._id)}
                          className="w-full mb-3 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-semibold py-2 rounded-lg border border-yellow-300 transition"
                        >
                          {hasIssue ? 'Update Issue' : 'Report Issue'}
                        </button>
                        {reportingOrderId === order._id && (
                          <div className="space-y-3">
                            <textarea
                              value={issueMessage}
                              onChange={(e) => setIssueMessage(e.target.value)}
                              rows={4}
                              placeholder="Describe the issue with this rental"
                              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                            />
                            <button
                              onClick={() => handleReportIssue(order._id)}
                              disabled={submittingIssue || !issueMessage.trim()}
                              className={`w-full py-2 rounded-lg font-bold text-white transition ${
                                submittingIssue || !issueMessage.trim()
                                  ? 'bg-gray-400 cursor-not-allowed'
                                  : 'bg-blue-600 hover:bg-blue-700'
                              }`}
                            >
                              {submittingIssue ? 'Submitting...' : 'Submit Issue'}
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    {(order.status === 'in-use' || order.status === 'overdue') && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleReturnProduct(order._id)}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-2 rounded-lg transition"
                      >
                        <FiCheckCircle className="inline mr-2" size={18} /> Return Product
                      </motion.button>
                    )}

                    {order.status === 'pending' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCancelOrder(order._id)}
                        className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2 rounded-lg transition border border-red-300"
                      >
                        <FiX className="inline mr-2" size={18} /> Cancel Order
                      </motion.button>
                    )}
                  </motion.div>
                );
              })}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
