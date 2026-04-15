const Order = require("../models/Order");
const Product = require("../models/Product");
const { calculateRental } = require("../utils/rentalCalculator");
const { calculateLateFee } = require("../utils/lateFeeCalculator");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

exports.createOrder = async (req, res) => {
  try {
    const { productId, startDate, endDate, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Validate quantity
    const requestedQuantity = Number(quantity);
    if (requestedQuantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    // Check if enough quantity is available
    if (product.availableQuantity < requestedQuantity) {
      return res.status(400).json({ 
        message: `Only ${product.availableQuantity} items available. Cannot rent ${requestedQuantity} items.` 
      });
    }

    // Prevent vendor from ordering their own product
    if (product.vendor.toString() === req.user._id.toString()) {
      return res.status(403).json({ message: "You cannot rent your own product" });
    }

    const { totalDays, rentalAmount, totalPayable } =
      calculateRental(
        startDate,
        endDate,
        product.rentalPricePerDay * requestedQuantity, // Multiply by quantity
        product.depositAmount * requestedQuantity     // Multiply by quantity
      );

    const customer = await User.findById(req.user._id);

    // 💰 Debug: log wallet vs payable
    console.log('createOrder: req.user id=', req.user && (req.user._id || req.user.id));
    console.log('createOrder: customer.walletBalance=', customer.walletBalance, 'totalPayable=', totalPayable);

    // 💰 Check wallet balance with detailed validation
    if (!customer.walletBalance || customer.walletBalance < 0) {
      return res.status(400).json({
        message: "Invalid wallet balance. Please contact support.",
        currentBalance: customer.walletBalance
      });
    }

    if (customer.walletBalance < totalPayable) {
      return res.status(400).json({
        message: `Insufficient wallet balance. You need ₹${totalPayable} but only have ₹${customer.walletBalance}. Please add ₹${totalPayable - customer.walletBalance} more to your wallet.`,
        currentBalance: customer.walletBalance,
        requiredAmount: totalPayable,
        shortfall: totalPayable - customer.walletBalance
      });
    }

    // 💰 Deduct total amount from customer (ensure it doesn't go negative)
    const newBalance = customer.walletBalance - totalPayable;
    if (newBalance < 0) {
      return res.status(400).json({
        message: "Transaction would result in negative balance. Operation cancelled.",
        currentBalance: customer.walletBalance,
        attemptedDeduction: totalPayable
      });
    }

    customer.walletBalance = newBalance;
    await customer.save();

    // 💰 Add rental amount to vendor's wallet
    const vendor = await User.findById(product.vendor);
    vendor.walletBalance += rentalAmount;
    await vendor.save();

    // 🧾 Create transaction records
    await Transaction.create({
      user: customer._id,
      amount: totalPayable,
      type: "debit",
      description: `Rental payment + deposit for ${requestedQuantity} item(s)`
    });

    await Transaction.create({
      user: vendor._id,
      amount: rentalAmount,
      type: "credit",
      description: `Rental income for ${requestedQuantity} item(s) rented`
    });

    // 📦 Decrease product availability and record rental count
    product.availableQuantity -= requestedQuantity;
    product.rentCount = (product.rentCount || 0) + requestedQuantity;
    await product.save();

    const order = await Order.create({
      customer: req.user._id,
      vendor: product.vendor,
      product: product._id,
      quantity: requestedQuantity,
      startDate,
      endDate,
      totalDays,
      rentalAmount,
      depositAmount: product.depositAmount * requestedQuantity
    });

    res.json({
      message: "Order Created",
      quantity: requestedQuantity,
      totalDays,
      rentalAmount,
      totalPayable,
      order
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ customer: req.user._id })
    .populate("product")
    .populate("vendor", "name email");

  res.json(orders);
};

exports.getVendorOrders = async (req, res) => {
  const orders = await Order.find({ vendor: req.user._id })
    .populate("product")
    .populate("customer", "name email");

  res.json(orders);
};

exports.updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // Only vendor can update their orders
  if (order.vendor.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }
  if (status === "completed") {
    if (order.status === "completed") {
      return res.status(400).json({ message: "Order is already completed" });
    }

    const customer = await User.findById(order.customer);
    const vendor = await User.findById(order.vendor);

    // If the order has already been returned, the wallet balances
    // were processed in returnProduct. Only update the status here.
    if (order.status === "returned") {
      order.status = "completed";
      await order.save();
      return res.json({ message: "Order marked completed", order });
    }

    let refundAmount = order.depositAmount - order.lateFee;
    if (refundAmount < 0) {
      refundAmount = 0;
    }

    // Return deposit to customer after deducting late fee
    customer.walletBalance += refundAmount;
    await customer.save();

    if (!order.lateFeeSettled && order.lateFee > 0) {
      vendor.walletBalance += order.lateFee;
      await vendor.save();

      // Transaction for late fee to vendor
      await Transaction.create({
        user: vendor._id,
        amount: order.lateFee,
        type: "credit",
        description: `Late fee income from order`
      });
    }

    // Transaction for deposit refund to customer
    await Transaction.create({
      user: customer._id,
      amount: refundAmount,
      type: "credit",
      description: "Deposit refund after rental completion"
    });

    // 📦 Restore product quantity when order is completed
    const product = await Product.findById(order.product);
    if (product) {
      product.availableQuantity += order.quantity;
      await product.save();
    }
  } else if (status === "overdue") {
    // Get product to access late fee rate
    const product = await Product.findById(order.product);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Calculate late fee based on current date vs end date
    const currentDate = new Date();
    const lateFee = calculateLateFee(order.endDate, currentDate, product.lateFeePerDay);
    order.lateFee = lateFee;
    order.lateFeeSettled = false;

    if (lateFee > 0) {
      const vendor = await User.findById(order.vendor);

      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }

      vendor.walletBalance += lateFee;
      order.lateFeeSettled = true;

      await vendor.save();

      await Transaction.create({
        user: vendor._id,
        amount: lateFee,
        type: "credit",
        description: "Late fee income from overdue order"
      });
    }

    // Late fee is stored on the order when marked overdue.
    // If the customer did not have enough wallet balance, the fee will be settled from deposit when returned.
    // Note: Product quantity is NOT restored for overdue orders until returned
  }
  order.status = status;
  await order.save();

  res.json({ message: "Order status updated", order });
};

exports.returnProduct = async (req, res) => {
  const { orderId, returnDate } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.customer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  // Get product to access late fee rate
  const product = await Product.findById(order.product);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const lateFee = calculateLateFee(order.endDate, returnDate, product.lateFeePerDay);
  order.lateFee = lateFee;
  order.status = "returned";

  // 💰 Handle wallet transactions for return
  const customer = await User.findById(order.customer);
  const vendor = await User.findById(order.vendor);

  let refundAmount = order.depositAmount - lateFee;
  if (refundAmount < 0) {
    refundAmount = 0;
  }

  // Return deposit to customer after deducting late fee
  customer.walletBalance += refundAmount;
  await customer.save();

  if (lateFee > 0 && !order.lateFeeSettled) {
    vendor.walletBalance += lateFee;
    await vendor.save();

    // Transaction for late fee to vendor
    await Transaction.create({
      user: vendor._id,
      amount: lateFee,
      type: "credit",
      description: `Late fee income from returned order`
    });
  }

  // Transaction for deposit refund to customer
  await Transaction.create({
    user: customer._id,
    amount: refundAmount,
    type: "credit",
    description: "Deposit refund after product return"
  });

  // 📦 Increase product availability when returned (restore the rented quantity)
  product.availableQuantity += order.quantity;
  await product.save();

  await order.save();

  res.json({
    message: "Product returned",
    lateFee,
    refundAmount,
    order
  });
};

  exports.cancelOrder = async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.customer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  // Only allow cancellation if order is pending or approved
  if (!["pending", "approved"].includes(order.status)) {
    return res.status(400).json({ message: "Cannot cancel order in current status" });
  }

  const customer = await User.findById(order.customer);
  const vendor = await User.findById(order.vendor);

  // Refund full amount (rental + deposit) to customer
  const refundAmount = order.rentalAmount + order.depositAmount;
  customer.walletBalance += refundAmount;
  await customer.save();

  // Deduct rental amount back from vendor (since they received it during order creation)
  vendor.walletBalance -= order.rentalAmount;
  await vendor.save();

  // Create transaction records
  await Transaction.create({
    user: customer._id,
    amount: refundAmount,
    type: "credit",
    description: "Order cancellation refund"
  });

  await Transaction.create({
    user: vendor._id,
    amount: order.rentalAmount,
    type: "debit",
    description: "Rental amount refund due to order cancellation"
  });

  // 📦 Increase product availability when cancelled (restore the rented quantity)
  const product = await Product.findById(order.product);
  if (product) {
    product.availableQuantity += order.quantity;
    await product.save();
  }

  order.status = "cancelled";
  await order.save();

  res.json({
    message: "Order cancelled and refund processed",
    refundAmount,
    newBalance: customer.walletBalance,
    order
  });
};

