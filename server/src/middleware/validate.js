import { HttpError } from "../utils/HttpError.js";

/** Validates and sanitises req.body against a Joi schema. */
export const validateBody = (schema) => (req, _res, next) => {
  const { value, error } = schema.validate(req.body ?? {}, { abortEarly: false, stripUnknown: true });

  if (error) {
    const details = {};
    for (const issue of error.details) {
      const field = issue.path.join(".");
      details[field] ??= issue.message;
    }
    return next(new HttpError(400, error.details[0].message, { code: "VALIDATION_ERROR", details }));
  }

  req.body = value;
  next();
};
