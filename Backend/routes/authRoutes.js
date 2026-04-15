const express = require("express");
const router = express.Router();
const { register, login, registerAdmin } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/register-admin", registerAdmin);

module.exports = router;