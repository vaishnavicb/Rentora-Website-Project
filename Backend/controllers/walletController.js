const User = require("../models/User");
const Transaction = require("../models/Transaction");

// Get wallet balance
exports.getWallet = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      balance: user.walletBalance,
      message: "Wallet balance retrieved successfully"
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching wallet", error: error.message });
  }
};

// Add money to wallet
exports.addMoney = async (req, res) => {
  try {
    const { amount } = req.body;

    // Validation
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    if (amount > 1000000) {
      return res.status(400).json({ message: "Amount exceeds maximum limit (₹1,000,000)" });
    }

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add money to wallet
    user.walletBalance += amount;
    await user.save();

    // Validate final balance
    if (user.walletBalance < 0) {
      // This should never happen with our validation, but just in case
      console.error(`Wallet balance went negative after adding money: ${user.walletBalance}`);
      return res.status(500).json({ message: "Transaction error. Please contact support." });
    }

    res.status(200).json({
      message: `₹${amount} added to wallet successfully`,
      newBalance: user.walletBalance,
      amountAdded: amount
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding money to wallet", error: error.message });
  }
};

// Withdraw money from wallet
exports.withdrawMoney = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    if (amount > 1000000) {
      return res.status(400).json({ message: "Amount exceeds maximum limit (₹1,000,000)" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.walletBalance < amount) {
      return res.status(400).json({ message: `Insufficient wallet balance. Available: ₹${user.walletBalance}` });
    }

    user.walletBalance -= amount;
    await user.save();

    await Transaction.create({
      user: user._id,
      amount,
      type: "debit",
      description: "Wallet withdrawal"
    });

    res.status(200).json({
      message: `₹${amount} withdrawn successfully`,
      newBalance: user.walletBalance,
      amountWithdrawn: amount
    });
  } catch (error) {
    res.status(500).json({ message: "Error withdrawing money from wallet", error: error.message });
  }
};

// Deduct money from wallet (used internally for orders)
exports.deductMoney = async (userId, amount) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Validate current balance
    if (!user.walletBalance || user.walletBalance < 0) {
      throw new Error(`Invalid wallet balance: ₹${user.walletBalance}`);
    }

    if (user.walletBalance < amount) {
      throw new Error(`Insufficient wallet balance. Available: ₹${user.walletBalance}, Required: ₹${amount}`);
    }

    // Calculate new balance and ensure it doesn't go negative
    const newBalance = user.walletBalance - amount;
    if (newBalance < 0) {
      throw new Error(`Transaction would result in negative balance: ₹${newBalance}`);
    }

    user.walletBalance = newBalance;
    await user.save();

    return user.walletBalance;
  } catch (error) {
    throw error;
  }
};

// Refund money to wallet (used when order is cancelled or item returned)
exports.refundMoney = async (userId, amount) => {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error("User not found");
    }

    user.walletBalance += amount;
    await user.save();

    return user.walletBalance;
  } catch (error) {
    throw error;
  }
};
