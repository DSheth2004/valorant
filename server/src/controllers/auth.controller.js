import { User } from "../models/User.js";
import { HttpError } from "../utils/HttpError.js";
import { clearSession, issueSession } from "../middleware/auth.js";

export async function register(req, res) {
  const { username, email, password } = req.body;

  // The unique indexes are the real guard; this check just gives a friendlier message.
  const existing = await User.findOne({ $or: [{ email }, { username }] })
    .collation({ locale: "en", strength: 2 })
    .lean();
  if (existing) {
    const field = existing.email === email ? "email" : "username";
    const message = field === "email" ? "An account with that email already exists" : "That username is taken";
    throw new HttpError(409, message, { code: "DUPLICATE", details: { [field]: message } });
  }

  const user = await User.create({ username, email, password });
  issueSession(res, user);
  res.status(201).json({ user });
}

export async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  // Same message for unknown email and wrong password, so accounts can't be enumerated.
  if (!user || !(await user.comparePassword(password))) {
    throw new HttpError(401, "Invalid email or password", { code: "INVALID_CREDENTIALS" });
  }

  issueSession(res, user);
  res.json({ user });
}

export function logout(_req, res) {
  clearSession(res);
  res.status(204).end();
}

export function me(req, res) {
  res.json({ user: req.user });
}
