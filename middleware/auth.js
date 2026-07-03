const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");

// JWT verification middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer token

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user to request
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

// Role-based access control
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }
    next();
  };
};

// Rate limiter for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: "Too many login attempts, try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for registration
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 registrations per IP
  message: "Too many accounts created, try again later",
});

module.exports = {
  verifyToken,
  authorize,
  loginLimiter,
  registerLimiter,
};
