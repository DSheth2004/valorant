// Mirrors server/src/validators/auth.schemas.js so users get instant feedback.
// The server remains the source of truth and re-validates every request.

export const PASSWORD_RULES = [
  { id: "length", label: "8+ characters", test: (value) => value.length >= 8 },
  { id: "upper", label: "Uppercase letter", test: (value) => /[A-Z]/.test(value) },
  { id: "lower", label: "Lowercase letter", test: (value) => /[a-z]/.test(value) },
  { id: "number", label: "Number", test: (value) => /\d/.test(value) },
  { id: "symbol", label: "Symbol", test: (value) => /[^A-Za-z0-9]/.test(value) },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_PATTERN = /^[A-Za-z0-9_]{3,20}$/;

export function validateAuthForm({ username, email, password }, mode) {
  const errors = {};

  if (mode === "register") {
    if (!username.trim()) errors.username = "Username is required";
    else if (!USERNAME_PATTERN.test(username.trim())) {
      errors.username = "3–20 characters: letters, numbers and underscores only";
    }
  }

  if (!email.trim()) errors.email = "Email is required";
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = "Enter a valid email address";

  if (!password) errors.password = "Password is required";
  else if (mode === "register" && !PASSWORD_RULES.every((rule) => rule.test(password))) {
    errors.password = "Password doesn't meet all the requirements below";
  }

  return errors;
}
