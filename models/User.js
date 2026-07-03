const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    refreshTokens: [
      {
        token: String,
        createdAt: { type: Date, default: Date.now, expires: 604800 }, // 7 days
      },
    ],
    loginHistory: [
      {
        timestamp: { type: Date, default: Date.now },
        ip: String,
        userAgent: String,
      },
    ],
    createdAt: { type: Date, default: Date.now },
    lastLogin: Date,
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to exclude password from responses
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.refreshTokens;
  return user;
};

module.exports = mongoose.model("User", userSchema);
