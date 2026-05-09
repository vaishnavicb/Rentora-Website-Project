const express = require("express");
const router = express.Router();
const { register, login, registerAdmin, getAllUsers } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/register-admin", registerAdmin);
router.get("/users", protect, adminOnly, getAllUsers);

module.exports = router;