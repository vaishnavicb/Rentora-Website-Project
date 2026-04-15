const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getVendorProducts,
  updateProduct,
  getProductById,
  deleteProduct,
} = require("../controllers/productController");

const { protect } = require("../middleware/authMiddleware");
const { vendorOnly } = require("../middleware/roleMiddleware");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", protect, vendorOnly, upload.single("image"), createProduct);
router.get("/", getAllProducts);
router.get("/my-products", protect, vendorOnly, getVendorProducts);
router.put("/:productId", protect, vendorOnly, upload.single("image"), updateProduct);
router.get("/:id", getProductById);
router.delete("/:productId", protect, vendorOnly, deleteProduct);

module.exports = router;