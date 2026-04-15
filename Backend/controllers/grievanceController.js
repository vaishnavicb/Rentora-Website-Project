const Grievance = require("../models/Grievance");
const Order = require("../models/Order");

exports.createGrievance = async (req, res) => {
  try {
    const { orderId, message } = req.body;

    if (!orderId || !message || !message.trim()) {
      return res.status(400).json({ message: "Order and message are required" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the customer who placed the order can submit a grievance" });
    }

    const grievance = await Grievance.create({
      order: order._id,
      product: order.product,
      customer: order.customer,
      vendor: order.vendor,
      message: message.trim(),
    });

    res.status(201).json(grievance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCustomerGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find({ customer: req.user._id })
      .populate("order", "status createdAt")
      .populate("product", "title category")
      .sort({ createdAt: -1 });

    res.json(grievances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getVendorGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find({ vendor: req.user._id })
      .populate("order", "status createdAt")
      .populate("product", "title category")
      .populate("customer", "name email")
      .sort({ createdAt: -1 });

    res.json(grievances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getGrievanceById = async (req, res) => {
  try {
    const { grievanceId } = req.params;
    const grievance = await Grievance.findById(grievanceId)
      .populate("order", "status createdAt startDate endDate")
      .populate("product", "title category")
      .populate("customer", "name email")
      .populate("vendor", "name email");

    if (!grievance) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    const userId = req.user._id.toString();
    if (
      grievance.customer._id.toString() !== userId &&
      grievance.vendor._id.toString() !== userId
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(grievance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrderGrievances = async (req, res) => {
  try {
    const { orderId } = req.params;
    const grievances = await Grievance.find({ order: orderId })
      .populate("order", "status createdAt startDate endDate")
      .populate("product", "title category")
      .populate("customer", "name email")
      .populate("vendor", "name email")
      .sort({ createdAt: -1 });

    if (!grievances.length) {
      return res.status(404).json({ message: "No grievances found for this order" });
    }

    const userId = req.user._id.toString();
    const accessible = grievances.every((g) => {
      return g.customer._id.toString() === userId || g.vendor._id.toString() === userId;
    });

    if (!accessible) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(grievances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.respondToGrievance = async (req, res) => {
  try {
    const { grievanceId } = req.params;
    const { response, status } = req.body;

    const grievance = await Grievance.findById(grievanceId);
    if (!grievance) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    if (grievance.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the vendor can respond to this grievance" });
    }

    if (response !== undefined) grievance.response = response.trim();
    if (status && ["open", "in-review", "resolved"].includes(status)) {
      grievance.status = status;
    }

    await grievance.save();
    res.json(grievance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
