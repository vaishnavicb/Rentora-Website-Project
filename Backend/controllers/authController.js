const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (role === 'admin') {
    return res.status(403).json({ message: 'Admin registration is not allowed through the public signup form' });
  }

  const userRole = ['customer', 'vendor'].includes(role) ? role : 'customer';

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: userRole
  });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    message: "User Registered Successfully",
    token,
    user: {
      id: user._id,
      name: user.name,
      role: user.role
    }
  });
};

exports.registerAdmin = async (req, res) => {
  const { name, email, password, adminCode } = req.body;

  const adminSecret = process.env.ADMIN_REGISTRATION_CODE;
  const adminLimit = parseInt(process.env.ADMIN_ACCOUNT_LIMIT || '3', 10);

  if (!adminSecret) {
    return res.status(500).json({ message: 'Admin registration is not configured on the server' });
  }

  if (adminCode !== adminSecret) {
    return res.status(403).json({ message: 'Invalid admin registration code' });
  }

  const adminCount = await User.countDocuments({ role: 'admin' });
  if (adminCount >= adminLimit) {
    return res.status(403).json({ message: `Admin registration limit reached (${adminLimit} admins)` });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: 'admin'
  });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    message: "Admin Registered Successfully",
    token,
    user: {
      id: user._id,
      name: user.name,
      role: user.role
    }
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      role: user.role
    }
  });
};