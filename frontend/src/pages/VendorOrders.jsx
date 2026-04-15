import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPackage, FiCheckCircle, FiClock } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { orderService, grievanceService } from '../services/index';
import { useAuth } from '../hooks/useAuth';

export const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeStatus, setActiveStatus] = useState('pending');
  const [replyGrievanceId, setReplyGrievanceId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyStatus, setReplyStatus] = useState('in-review');
  const [replySubmitting, setReplySubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== 'vendor') {
      navigate('/');
    } else {
      fetchVendorOrders();
      fetchGrievances();
    }
  }, []);

  const fetchVendorOrders = async () => {
    setLoading(true);
    try {
      const response = await orderService.getVendorOrders();
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
      const response = await grievanceService.getVendorGrievances();
      setGrievances(response.data || []);
    } catch (err) {
      console.error('Failed to fetch grievances:', err);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      fetchVendorOrders();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleReplySubmit = async (grievanceId) => {
    if (!replyText.trim()) {
      return;
    }

    setReplySubmitting(true);
    try {
      await grievanceService.respondToGrievance(grievanceId, {
        response: replyText.trim(),
        status: replyStatus,
      });
      await fetchGrievances();
      await fetchVendorOrders();
      setReplyGrievanceId(null);
      setReplyText('');
      setReplyStatus('in-review');
    } catch (err) {
      console.error('Failed to send reply:', err);
    } finally {
      setReplySubmitting(false);
    }
  };

  const filteredOrders = orders.filter(order => order.status === activeStatus);

  const statuses = ['pending', 'approved', 'in-use', 'returned', 'overdue', 'completed', 'cancelled'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800">Orders for Your Products</h1>
          <p className="text-gray-600 mt-2">Manage rental requests and fulfillments</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <h3 className="font-semibold text-blue-800 mb-2">Order Flow:</h3>
            <p className="text-sm text-blue-700">
              Pending → Approve → In-Use → Mark Overdue (if not returned) → Customer Returns → Complete Order
            </p>
          </div>
        </motion.div>

        {/* Status Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-2 mb-8 overflow-x-auto pb-2"
        >
          {statuses.map((status) => {
            const count = orders.filter(o => o.status === status).length;
            return (
              <motion.button
                key={status}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveStatus(status)}
                className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                  activeStatus === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                }`}
              >
                {status.toUpperCase()} ({count})
              </motion.button>
            );
          })}
        </motion.div>

        {/* Orders Grid */}
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
                <p className="text-2xl text-gray-600">No orders with this status</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid md:grid-cols-2 gap-6"
              >
                {filteredOrders.map((order, index) => {
                  const orderGrievances = grievances.filter(
                    (g) => g.order && (g.order._id || g.order).toString() === order._id.toString()
                  );

                  return (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition"
                    >
                      {/* Customer Info */}
                      <div className="mb-4">
                        <p className="text-sm text-gray-600">Customer</p>
                        <h3 className="text-xl font-bold text-gray-800">
                          {order.customer?.name}
                        </h3>
                        <p className="text-sm text-gray-500">{order.customer?.email}</p>
                      </div>

                      {/* Product Info */}
                      <div className="mb-4 pb-4 border-b border-gray-200">
                        <p className="text-sm text-gray-600 mb-1">Product</p>
                        <p className="font-bold text-gray-800">{order.product?.title}</p>
                        {orderGrievances.length > 0 && (
                          <>
                            <p className="mt-2 text-sm text-orange-700">
                              {orderGrievances.length} issue{orderGrievances.length > 1 ? 's' : ''} reported
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setReplyGrievanceId(orderGrievances[0]._id);
                                  setReplyText(orderGrievances[0].response || '');
                                  setReplyStatus(orderGrievances[0].status || 'in-review');
                                }}
                                className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
                              >
                                Reply to customer
                              </button>
                              <Link
                                to={`/grievances/${orderGrievances[0]._id}`}
                                className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800"
                              >
                                View grievance details
                              </Link>
                            </div>
                            {replyGrievanceId === orderGrievances[0]._id && (
                              <div className="mt-4 rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
                                <label className="block text-sm font-semibold text-slate-900 mb-2">Your reply</label>
                                <textarea
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  rows={4}
                                  className="w-full rounded-2xl border border-slate-300 bg-white p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                  placeholder="Write your response to the customer's issue"
                                />
                                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                  <select
                                    value={replyStatus}
                                    onChange={(e) => setReplyStatus(e.target.value)}
                                    className="rounded-2xl border border-slate-300 p-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                  >
                                    <option value="in-review">In Review</option>
                                    <option value="resolved">Resolved</option>
                                  </select>
                                  <div className="flex gap-2">
                                    <button
                                      type="button"
                                      onClick={() => handleReplySubmit(orderGrievances[0]._id)}
                                      disabled={replySubmitting || !replyText.trim()}
                                      className={`inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold text-white transition ${
                                        replySubmitting || !replyText.trim()
                                          ? 'bg-slate-400 cursor-not-allowed'
                                          : 'bg-blue-600 hover:bg-blue-700'
                                      }`}
                                    >
                                      {replySubmitting ? 'Sending...' : 'Send reply'}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setReplyGrievanceId(null)}
                                      className="inline-flex items-center rounded-2xl border border-slate-300 px-5 py-3 text-slate-700 hover:bg-slate-100"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Rental Dates */}
                      <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                        <FiClock size={18} />
                        {new Date(order.startDate).toLocaleDateString()} to{' '}
                        {new Date(order.endDate).toLocaleDateString()}
                      </div>

                      {/* Pricing */}
                      <div className="grid grid-cols-4 gap-2 mb-6 text-sm">
                        <div className="bg-blue-50 p-3 rounded border border-blue-200">
                          <p className="text-gray-600 text-xs">Rental</p>
                          <p className="font-bold text-blue-600">₹{order.rentalAmount}</p>
                        </div>
                        <div className="bg-purple-50 p-3 rounded border border-purple-200">
                          <p className="text-gray-600 text-xs">Deposit</p>
                          <p className="font-bold text-purple-600">₹{order.depositAmount}</p>
                        </div>
                        <div className="bg-orange-50 p-3 rounded border border-orange-200">
                          <p className="text-gray-600 text-xs">Quantity</p>
                          <p className="font-bold text-orange-600">{order.quantity || 1}</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded border border-green-200">
                          <p className="text-gray-600 text-xs">Days</p>
                          <p className="font-bold text-green-600">{order.totalDays}</p>
                        </div>
                      </div>

                      {/* Status Transitions */}
                      {order.status === 'pending' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleUpdateStatus(order._id, 'approved')}
                          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-2 rounded-lg transition"
                        >
                          Approve Order
                        </motion.button>
                      )}

                      {order.status === 'approved' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleUpdateStatus(order._id, 'in-use')}
                          className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-2 rounded-lg transition"
                        >
                          Mark as In-Use
                        </motion.button>
                      )}

                      {order.status === 'in-use' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleUpdateStatus(order._id, 'overdue')}
                          className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-2 rounded-lg transition"
                        >
                          Mark as Overdue
                        </motion.button>
                      )}

                      {order.status === 'returned' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleUpdateStatus(order._id, 'completed')}
                          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-2 rounded-lg transition flex items-center justify-center gap-2"
                        >
                          <FiCheckCircle size={18} /> Complete Order
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
