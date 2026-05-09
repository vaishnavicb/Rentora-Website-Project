const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getVendorOrders,
  updateOrderStatus,
  returnProduct,
  cancelOrder,
  getAllOrders
} = require("../controllers/orderController");

const { protect } = require("../middleware/authMiddleware");
const { vendorOnly, adminOnly } = require("../middleware/roleMiddleware");

router.post("/", protect, createOrder);
router.get("/", protect, adminOnly, getAllOrders);
router.get("/my-orders", protect, getMyOrders);
router.get("/vendor-orders", protect, vendorOnly, getVendorOrders);
router.put("/update-status", protect, vendorOnly, updateOrderStatus);
router.put("/return", protect, returnProduct);
router.put("/cancel/:orderId", protect, cancelOrder);

module.exports = router;