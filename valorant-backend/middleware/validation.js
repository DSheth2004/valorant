// middleware/validation.js
const Joi = require("joi");

const registerValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.empty": "Email cannot be empty",
      "string.email": "Invalid email format",
    }),
    password: Joi.string()
      .min(8)
      .max(20)
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"))
      .required()
      .messages({
        "string.empty": "Password cannot be empty",
        "string.min": "Password must be at least 8 characters long",
        "string.max": "Password must not exceed 20 characters",
        "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      }),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  next();
};

const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.empty": "Email cannot be empty",
      "string.email": "Invalid email format",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Password cannot be empty",
    }),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  next();
};

module.exports = { registerValidation, loginValidation };
