const express = require("express");
const router = express.Router();
const {
  createGrievance,
  getCustomerGrievances,
  getVendorGrievances,
  getGrievanceById,
  getOrderGrievances,
  respondToGrievance,
} = require("../controllers/grievanceController");
const { protect } = require("../middleware/authMiddleware");
const { vendorOnly } = require("../middleware/roleMiddleware");

router.post("/", protect, createGrievance);
router.get("/customer", protect, getCustomerGrievances);
router.get("/vendor", protect, vendorOnly, getVendorGrievances);
router.get("/order/:orderId", protect, getOrderGrievances);
router.get("/:grievanceId", protect, getGrievanceById);
router.put("/:grievanceId/respond", protect, vendorOnly, respondToGrievance);

module.exports = router;
