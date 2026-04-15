const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getVendorOrders,
  updateOrderStatus,
  returnProduct,
  cancelOrder
} = require("../controllers/orderController");

const { protect } = require("../middleware/authMiddleware");
const { vendorOnly } = require("../middleware/roleMiddleware");

router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/vendor-orders", protect, vendorOnly, getVendorOrders);
router.put("/update-status", protect, vendorOnly, updateOrderStatus);
router.put("/return", protect, returnProduct);
router.put("/cancel/:orderId", protect, cancelOrder);

module.exports = router;