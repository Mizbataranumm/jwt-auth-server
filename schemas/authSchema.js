const Joi = require("joi");

const registerSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Must be a valid email",
      "any.required": "Email is required",
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.min": "Password must be at least 6 characters",
      "any.required": "Password is required",
    }),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .required(),
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
};
