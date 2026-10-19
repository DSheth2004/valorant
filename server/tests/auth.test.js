import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { STARTING_VP } from "../src/models/User.js";

const credentials = { username: "Phoenix", email: "phoenix@example.com", password: "Hotshot#123" };

describe("auth", () => {
  it("registers a user, sets a session cookie and never returns the password", async () => {
    const res = await request(app).post("/api/auth/register").send(credentials).expect(201);

    expect(res.body.user).toMatchObject({
      username: "Phoenix",
      email: "phoenix@example.com",
      valorantPoints: STARTING_VP,
    });
    expect(res.body.user.password).toBeUndefined();
    expect(res.headers["set-cookie"][0]).toMatch(/vh_session=.+HttpOnly/i);
  });

  it("rejects weak passwords with a field-level error", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ ...credentials, password: "password" })
      .expect(400);

    expect(res.body.code).toBe("VALIDATION_ERROR");
    expect(res.body.details.password).toBeDefined();
  });

  it("rejects duplicate emails and case-insensitive duplicate usernames", async () => {
    await request(app).post("/api/auth/register").send(credentials).expect(201);

    const sameEmail = await request(app)
      .post("/api/auth/register")
      .send({ ...credentials, username: "Someone" })
      .expect(409);
    expect(sameEmail.body.details.email).toBeDefined();

    const sameName = await request(app)
      .post("/api/auth/register")
      .send({ ...credentials, username: "PHOENIX", email: "other@example.com" })
      .expect(409);
    expect(sameName.body.details.username).toBeDefined();
  });

  it("logs in, resolves the session via /me, and logs out", async () => {
    await request(app).post("/api/auth/register").send(credentials);
    const agent = request.agent(app);

    await agent
      .post("/api/auth/login")
      .send({ email: "PHOENIX@example.com", password: credentials.password })
      .expect(200);

    const me = await agent.get("/api/auth/me").expect(200);
    expect(me.body.user.username).toBe("Phoenix");

    await agent.post("/api/auth/logout").expect(204);
    const afterLogout = await agent.get("/api/auth/me").expect(200);
    expect(afterLogout.body.user).toBeNull();
    await agent.get("/api/users/me/collection").expect(401);
  });

  it("treats guests as a null session rather than an error", async () => {
    const res = await request(app).get("/api/auth/me").expect(200);
    expect(res.body).toEqual({ user: null });
  });

  it("uses the same error for unknown emails and wrong passwords", async () => {
    await request(app).post("/api/auth/register").send(credentials);

    const wrongPassword = await request(app)
      .post("/api/auth/login")
      .send({ email: credentials.email, password: "Wrong#1234" })
      .expect(401);
    const unknownEmail = await request(app)
      .post("/api/auth/login")
      .send({ email: "nobody@example.com", password: "Wrong#1234" })
      .expect(401);

    expect(wrongPassword.body.message).toBe(unknownEmail.body.message);
  });

  it("rejects requests with a tampered token", async () => {
    await request(app)
      .get("/api/users/me/collection")
      .set("Authorization", "Bearer not-a-real-token")
      .expect(401);
    const probe = await request(app).get("/api/auth/me").set("Authorization", "Bearer not-a-real-token").expect(200);
    expect(probe.body.user).toBeNull();
  });
});
