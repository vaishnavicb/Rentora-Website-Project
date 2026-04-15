exports.vendorOnly = (req, res, next) => {
  if (req.user.role !== "vendor") {
    return res.status(403).json({ message: "Vendor access only" });
  }
  next();
};

exports.adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};