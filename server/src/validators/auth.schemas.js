import Joi from "joi";

export const PASSWORD_RULES = {
  minLength: 8,
  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,72}$/,
};

const email = Joi.string().trim().lowercase().email().max(254).messages({
  "string.email": "Enter a valid email address",
  "string.empty": "Email is required",
  "any.required": "Email is required",
});

export const registerSchema = Joi.object({
  username: Joi.string()
    .trim()
    .min(3)
    .max(20)
    .pattern(/^[A-Za-z0-9_]+$/)
    .required()
    .messages({
      "string.pattern.base": "Username can only contain letters, numbers and underscores",
      "string.min": "Username must be at least 3 characters",
      "string.max": "Username must be at most 20 characters",
      "string.empty": "Username is required",
      "any.required": "Username is required",
    }),
  email: email.required(),
  password: Joi.string().pattern(PASSWORD_RULES.pattern).required().messages({
    "string.pattern.base":
      "Password needs 8+ characters with an uppercase letter, a lowercase letter, a number and a symbol",
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
});

export const loginSchema = Joi.object({
  email: email.required(),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
});
