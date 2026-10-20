import { describe, expect, it } from "vitest";
import request from "supertest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import app from "../src/app.js";
import { PLAYER_CARDS } from "../src/data/playerCards.js";

const PUBLIC_DIR = join(import.meta.dirname, "../../client/public");

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

  it("offers at most four skins per weapon", async () => {
    const res = await request(app).get("/api/weapons").expect(200);
    for (const weapon of res.body.weapons) {
      expect(weapon.skins.length, weapon.name).toBeLessThanOrEqual(4);
    }
  });

  it("gives every skin at least one in-game showcase video", async () => {
    const res = await request(app).get("/api/weapons").expect(200);
    const withoutVideo = res.body.weapons
      .flatMap((w) => w.skins)
      .filter((s) => !s.videos?.length || !s.videos.every((v) => v.url.startsWith("https://") && v.label));
    expect(withoutVideo.map((s) => s.id)).toEqual([]);
  });

  it("only references images that exist in client/public", async () => {
    const [agents, maps, weapons] = await Promise.all(
      ["/api/agents", "/api/maps", "/api/weapons"].map((path) => request(app).get(path)),
    );
    const urls = [
      ...agents.body.agents.flatMap((a) => [a.portrait, a.icon, a.background, ...a.abilities.map((ab) => ab.icon)]),
      ...maps.body.maps.map((m) => m.image),
      ...weapons.body.weapons.flatMap((w) => [w.image, ...w.skins.map((s) => s.image)]),
      ...PLAYER_CARDS.map((c) => c.image),
    ];
    const missing = urls.filter((url) => !existsSync(join(PUBLIC_DIR, url.split("?")[0])));
    expect(missing).toEqual([]);
  });

  it("reports health and returns JSON 404s for unknown routes", async () => {
    const health = await request(app).get("/api/health").expect(200);
    expect(health.body).toMatchObject({ status: "ok", database: "connected" });

    const missing = await request(app).get("/api/nope").expect(404);
    expect(missing.body.code).toBe("NOT_FOUND");
  });
});
