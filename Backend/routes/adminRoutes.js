const express = require("express");
const router = express.Router();

const { getDashboardStats } = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");

router.get("/dashboard", protect, adminOnly, getDashboardStats);

module.exports = router;