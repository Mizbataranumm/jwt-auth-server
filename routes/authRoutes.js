const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verifyToken, authorize, loginLimiter, registerLimiter } = require("../middleware/auth");

// Public routes
router.post("/register", registerLimiter, authController.register);
router.post("/login", loginLimiter, authController.login);
router.post("/refresh-token", authController.refreshToken);

// Protected routes (require valid JWT)
router.get("/profile", verifyToken, authController.getProfile);
router.post("/logout", verifyToken, authController.logout);
router.get("/login-history", verifyToken, authController.getLoginHistory);

// Admin-only route (example)
router.get("/admin-only", verifyToken, authorize("admin"), (req, res) => {
  res.json({ message: "This is admin-only content", user: req.user });
});

module.exports = router;
