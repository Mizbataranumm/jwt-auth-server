require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
if (process.env.NODE_ENV !== "test") {
  connectDB();
}

// Routes
app.use("/auth", authRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "JWT & OAuth2 Authorization Server",
    status: "running",
    endpoints: {
      register: "POST /auth/register",
      login: "POST /auth/login",
      refreshToken: "POST /auth/refresh-token",
      profile: "GET /auth/profile",
      logout: "POST /auth/logout",
      loginHistory: "GET /auth/login-history",
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
