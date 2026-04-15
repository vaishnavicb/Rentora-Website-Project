const express = require("express");
const { getWallet, addMoney, withdrawMoney } = require("../controllers/walletController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Get wallet balance (protected)
router.get("/", protect, getWallet);

// Add money to wallet (protected)
router.post("/add-money", protect, addMoney);

// Withdraw money from wallet (protected)
router.post("/withdraw", protect, withdrawMoney);

module.exports = router;
