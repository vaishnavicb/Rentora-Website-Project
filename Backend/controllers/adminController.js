const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Transaction = require("../models/Transaction");
const Grievance = require("../models/Grievance");

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalVendors = await User.countDocuments({ role: "vendor" });
    const totalCustomers = await User.countDocuments({ role: "customer" });

    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const activeRentals = await Order.countDocuments({
      status: { $in: ["approved", "in-use"] }
    });

    const pendingOrders = await Order.countDocuments({ status: "pending" });
    const cancelledOrders = await Order.countDocuments({ status: "cancelled" });
    const overdueOrders = await Order.countDocuments({ status: "overdue" });

    const completedOrders = await Order.countDocuments({
      status: "completed"
    });

    const totalRevenueData = await Transaction.aggregate([
      { $match: { type: "debit" } },
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }
    ]);

    const totalRevenue =
      totalRevenueData.length > 0 ? totalRevenueData[0].totalRevenue : 0;

    const avgOrderRevenue = totalOrders ? totalRevenue / totalOrders : 0;
    const totalGrievances = await Grievance.countDocuments();

    res.json({
      totalUsers,
      totalVendors,
      totalCustomers,
      totalProducts,
      totalOrders,
      activeRentals,
      pendingOrders,
      cancelledOrders,
      overdueOrders,
      completedOrders,
      totalRevenue,
      avgOrderRevenue,
      totalGrievances
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};