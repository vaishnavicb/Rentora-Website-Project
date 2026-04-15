import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPackage, FiCheckCircle, FiTrendingUp, FiUsers, FiDollarSign, FiActivity, FiClock, FiXCircle, FiAlertTriangle } from 'react-icons/fi';
import { adminService } from '../services/index';
import { useAuth } from '../hooks/useAuth';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
    } else {
      fetchStats();
    }
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await adminService.getDashboardStats();
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color, bg }) => (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className={`rounded-3xl shadow-lg p-6 border border-gray-200 ${bg}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-gray-600 text-sm font-semibold">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className={`p-3 rounded-full text-2xl ${color}`}
        >
          <Icon />
        </motion.div>
      </div>
    </motion.div>
  );

  const MiniStatCard = ({ icon: Icon, title, value, color, bg }) => (
    <motion.div
      whileHover={{ y: -2 }}
      className={`self-start rounded-3xl border border-gray-200 ${bg} p-3 shadow-sm`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`flex items-center justify-center w-11 h-11 rounded-2xl ${color} bg-white/95`}>
            <Icon size={18} />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.26em] text-slate-500 font-semibold">
              {title}
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const ActionCard = ({ icon: Icon, title, description, accent, to }) => (
    <Link to={to} className="block">
      <motion.div
        whileHover={{ y: -3 }}
        className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm cursor-pointer hover:border-blue-200"
      >
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-2xl ${accent}`}>
            <Icon size={18} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">{title}</p>
            <p className="mt-2 text-sm text-gray-600">{description}</p>
          </div>
        </div>
      </motion.div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-blue-600 font-semibold mb-3">
            Admin Control Center
          </p>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Welcome back, {user?.name || 'Administrator'}
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Your admin dashboard delivers marketplace health, order flow, and revenue insights in one place.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-4 lg:grid-cols-[1.9fr_1.1fr] mb-10"
        >
          <div className="grid gap-4 items-start">
            <MiniStatCard
              icon={FiUsers}
              title="Total Users"
              value={stats?.totalUsers ?? '--'}
              color="text-blue-600"
              bg="bg-gradient-to-br from-blue-50 to-blue-100"
            />
            <MiniStatCard
              icon={FiTrendingUp}
              title="Total Vendors"
              value={stats?.totalVendors ?? '--'}
              color="text-purple-600"
              bg="bg-gradient-to-br from-purple-50 to-purple-100"
            />
            <MiniStatCard
              icon={FiUsers}
              title="Total Customers"
              value={stats?.totalCustomers ?? '--'}
              color="text-green-600"
              bg="bg-gradient-to-br from-emerald-50 to-emerald-100"
            />
            <MiniStatCard
              icon={FiPackage}
              title="Total Products"
              value={stats?.totalProducts ?? '--'}
              color="text-orange-600"
              bg="bg-gradient-to-br from-orange-50 to-orange-100"
            />
            <MiniStatCard
              icon={FiPackage}
              title="Total Orders"
              value={stats?.totalOrders ?? '--'}
              color="text-indigo-600"
              bg="bg-gradient-to-br from-indigo-50 to-indigo-100"
            />
            <MiniStatCard
              icon={FiDollarSign}
              title="Total Revenue"
              value={stats?.totalRevenue ? `₹${stats.totalRevenue.toLocaleString()}` : '--'}
              color="text-yellow-600"
              bg="bg-gradient-to-br from-yellow-50 to-yellow-100"
            />
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-gray-500 font-semibold">
                  Admin actions
                </p>
                <h2 className="text-2xl font-bold text-gray-900 mt-2">Focus areas</h2>
              </div>
            </div>
            <div className="grid gap-4">
                <ActionCard
                icon={FiUsers}
                title="Manage Users"
                description="View and manage registered users across the platform."
                accent="bg-blue-100 text-blue-700"
                to="/admin/users"
              />
              <ActionCard
                icon={FiPackage}
                title="Manage Vendors"
                description="Review vendor accounts and approve or reject new vendors."
                accent="bg-yellow-100 text-yellow-700"
                to="/admin/vendors"
              />
              <ActionCard
                icon={FiClock}
                title="Review Orders"
                description="Check pending and overdue orders to keep rentals on track."
                accent="bg-red-100 text-red-700"
                to="/admin/orders"
              />
              <ActionCard
                icon={FiAlertTriangle}
                title="Review Grievances"
                description="Resolve customer or vendor issues raised through grievances."
                accent="bg-purple-100 text-purple-700"
                to="/admin/grievances"
              />
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
            />
          </div>
        ) : stats ? (
          <>
            {/* Key Metrics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            >
                <StatCard
                icon={FiDollarSign}
                title="Average Order Value"
                value={stats.avgOrderRevenue ? `₹${stats.avgOrderRevenue.toFixed(0)}` : '--'}
                color="text-orange-600"
                bg="bg-gradient-to-br from-orange-50 to-orange-100"
              />
              <StatCard
                icon={FiClock}
                title="Pending Orders"
                value={stats.pendingOrders}
                color="text-yellow-600"
                bg="bg-gradient-to-br from-yellow-50 to-yellow-100"
              />
              <StatCard
                icon={FiAlertTriangle}
                title="Overdue Orders"
                value={stats.overdueOrders}
                color="text-red-600"
                bg="bg-gradient-to-br from-red-50 to-red-100"
              />
            </motion.div>

            {/* Status Overview */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            >
              <StatCard
                icon={FiActivity}
                title="Active Rentals"
                value={stats.activeRentals}
                color="text-red-600"
                bg="bg-gradient-to-br from-red-50 to-red-100"
              />
              <StatCard
                icon={FiCheckCircle}
                title="Completed Orders"
                value={stats.completedOrders}
                color="text-emerald-600"
                bg="bg-gradient-to-br from-emerald-50 to-emerald-100"
              />
              <StatCard
                icon={FiXCircle}
                title="Cancelled Orders"
                value={stats.cancelledOrders}
                color="text-slate-600"
                bg="bg-gradient-to-br from-slate-50 to-slate-100"
              />
            </motion.div>

            {/* Summary Cards */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 grid md:grid-cols-2 gap-6"
            >
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg shadow-lg p-6 border border-gray-200"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-4">Platform Overview</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Users per Day:</span>
                    <span className="font-bold text-blue-600">
                      {Math.round(stats.totalUsers / 30)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vendor to Customer Ratio:</span>
                    <span className="font-bold text-purple-600">
                      1:{Math.round(stats.totalCustomers / (stats.totalVendors || 1))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Grievances:</span>
                    <span className="font-bold text-red-600">
                      {stats.totalGrievances}
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg shadow-lg p-6 border border-gray-200"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Insights</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                    <span className="text-gray-600">
                      {stats.totalProducts} products available for rent
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-600"></div>
                    <span className="text-gray-600">
                      {stats.activeRentals} active rentals ongoing
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-600"></div>
                    <span className="text-gray-600">
                      ₹{stats.avgOrderRevenue?.toFixed(0)} avg order value
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-2xl text-gray-600">Failed to load dashboard</p>
          </div>
        )}
      </div>
    </div>
  );
};
