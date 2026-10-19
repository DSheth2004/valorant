import { describe, expect, it } from "vitest";
import { PASSWORD_RULES, validateAuthForm } from "./validation";

describe("validateAuthForm", () => {
  const valid = { username: "Killjoy_01", email: "kj@example.com", password: "Turret#2024" };

  it("accepts a valid registration", () => {
    expect(validateAuthForm(valid, "register")).toEqual({});
  });

  it("flags each invalid registration field", () => {
    const errors = validateAuthForm({ username: "a!", email: "nope", password: "weak" }, "register");
    expect(Object.keys(errors).sort()).toEqual(["email", "password", "username"]);
  });

  it("does not apply password strength rules on sign in", () => {
    expect(validateAuthForm({ ...valid, password: "weak" }, "login")).toEqual({});
  });

  it("requires every password rule", () => {
    expect(PASSWORD_RULES.every((rule) => rule.test(valid.password))).toBe(true);
    expect(PASSWORD_RULES.filter((rule) => !rule.test("alllowercase")).map((rule) => rule.id)).toEqual([
      "upper",
      "number",
      "symbol",
    ]);
  });
});
