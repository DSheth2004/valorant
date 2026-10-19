import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("content", () => {
  it("lists agents grouped with roles", async () => {
    const res = await request(app).get("/api/agents").expect(200);
    expect(res.body.roles.map((r) => r.id)).toEqual(["duelist", "controller", "initiator", "sentinel"]);
    expect(res.body.agents.length).toBeGreaterThan(0);
    for (const agent of res.body.agents) {
      expect(agent.abilities.map((a) => a.key)).toEqual(["C", "Q", "E", "X"]);
    }
    expect(res.headers["cache-control"]).toContain("s-maxage");
  });

  it("returns a single map or 404", async () => {
    const ok = await request(app).get("/api/maps/lotus").expect(200);
    expect(ok.body.map.sites).toEqual(["A", "B", "C"]);
    await request(app).get("/api/maps/atlantis").expect(404);
  });

  it("gives every skin a unique id", async () => {
    const res = await request(app).get("/api/weapons").expect(200);
    const ids = res.body.weapons.flatMap((w) => w.skins.map((s) => s.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("reports health and returns JSON 404s for unknown routes", async () => {
    const health = await request(app).get("/api/health").expect(200);
    expect(health.body).toMatchObject({ status: "ok", database: "connected" });

    const missing = await request(app).get("/api/nope").expect(404);
    expect(missing.body.code).toBe("NOT_FOUND");
  });
});
