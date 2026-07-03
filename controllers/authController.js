const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { registerSchema, loginSchema, refreshTokenSchema } = require("../schemas/authSchema");

// Generate JWT tokens
const generateTokens = (userId, email, role) => {
  const accessToken = jwt.sign(
    { userId, email, role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" } // Access token expires in 15 minutes
  );

  const refreshToken = jwt.sign(
    { userId, email },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" } // Refresh token expires in 7 days
  );

  return { accessToken, refreshToken };
};

// REGISTER
const register = async (req, res) => {
  try {
    // Validate input
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = value;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Create user (password gets hashed by pre-save hook)
    const newUser = new User({
      email,
      password,
      role: "user",
    });

    await newUser.save();

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(
      newUser._id,
      newUser.email,
      newUser.role
    );

    // Store refresh token in DB
    newUser.refreshTokens.push({ token: refreshToken });
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      accessToken,
      refreshToken,
      user: newUser.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    // Validate input
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = value;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(
      user._id,
      user.email,
      user.role
    );

    // Store refresh token and login history
    user.refreshTokens.push({ token: refreshToken });
    user.lastLogin = new Date();
    user.loginHistory.push({
      timestamp: new Date(),
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    // Keep only last 10 login records
    if (user.loginHistory.length > 10) {
      user.loginHistory = user.loginHistory.slice(-10);
    }

    await user.save();

    res.json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// REFRESH TOKEN
const refreshToken = async (req, res) => {
  try {
    // Validate input
    const { error, value } = refreshTokenSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { refreshToken: token } = value;

    // Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch {
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    // Find user and check if token exists
    const user = await User.findById(decoded.userId);
    if (!user || !user.refreshTokens.some(rt => rt.token === token)) {
      return res.status(403).json({ error: "Refresh token not found" });
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      user._id,
      user.email,
      user.role
    );

    // Replace old refresh token with new one
    user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== token);
    user.refreshTokens.push({ token: newRefreshToken });
    await user.save();

    res.json({
      message: "Token refreshed",
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LOGOUT
const logout = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Refresh token required" });
    }

    // Find user and remove refresh token
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $pull: { refreshTokens: { token } } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET PROFILE
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET LOGIN HISTORY
const getLoginHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      loginHistory: user.loginHistory,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
  getLoginHistory,
};
