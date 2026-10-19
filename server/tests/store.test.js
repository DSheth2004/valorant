import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { User } from "../src/models/User.js";
import { getStoreRotation } from "../src/services/catalog.js";

async function signedInAgent() {
  const agent = request.agent(app);
  await agent
    .post("/api/auth/register")
    .send({ username: "Sage", email: "sage@example.com", password: "Healing#123" })
    .expect(201);
  return agent;
}

describe("store", () => {
  it("serves a deterministic daily rotation", async () => {
    const res = await request(app).get("/api/store").expect(200);
    expect(res.body.skins).toHaveLength(4);
    expect(res.body.cards).toHaveLength(4);
    expect(res.body).toEqual(JSON.parse(JSON.stringify(getStoreRotation())));
  });

  it("rotates on a new UTC day", () => {
    const today = getStoreRotation(new Date("2026-01-01T12:00:00Z"));
    const tomorrow = getStoreRotation(new Date("2026-01-02T12:00:00Z"));
    expect(today.refreshesAt).toBe("2026-01-02T00:00:00.000Z");
    expect(today.skins.map((s) => s.id)).not.toEqual(tomorrow.skins.map((s) => s.id));
  });

  it("requires authentication to purchase", async () => {
    const [skin] = getStoreRotation().skins;
    await request(app).post("/api/store/purchases").send({ itemId: skin.id }).expect(401);
  });

  it("deducts the server-side price and adds the item to the inventory", async () => {
    const agent = await signedInAgent();
    const [skin] = getStoreRotation().skins;

    const res = await agent.post("/api/store/purchases").send({ itemId: skin.id, price: 1 }).expect(201);

    expect(res.body.user.valorantPoints).toBe(5000 - skin.price);
    expect(res.body.user.inventory).toEqual([expect.objectContaining({ itemId: skin.id, pricePaid: skin.price })]);

    const collection = await agent.get("/api/users/me/collection").expect(200);
    expect(collection.body.items[0]).toMatchObject({ id: skin.id, name: skin.name });
    expect(collection.body.totalSpent).toBe(skin.price);
  });

  it("prevents buying the same item twice, even concurrently", async () => {
    const agent = await signedInAgent();
    const [skin] = getStoreRotation().skins;

    const results = await Promise.all(
      Array.from({ length: 5 }, () => agent.post("/api/store/purchases").send({ itemId: skin.id })),
    );

    expect(results.filter((r) => r.status === 201)).toHaveLength(1);
    expect(results.filter((r) => r.status === 409)).toHaveLength(4);
    const user = await User.findOne({ email: "sage@example.com" });
    expect(user.valorantPoints).toBe(5000 - skin.price);
  });

  it("rejects purchases the user cannot afford", async () => {
    const agent = await signedInAgent();
    await User.updateOne({ email: "sage@example.com" }, { valorantPoints: 10 });
    const [skin] = getStoreRotation().skins;

    const res = await agent.post("/api/store/purchases").send({ itemId: skin.id }).expect(400);
    expect(res.body.code).toBe("INSUFFICIENT_FUNDS");
  });

  it("rejects items that are not in today's rotation", async () => {
    const agent = await signedInAgent();
    const featured = new Set(getStoreRotation().skins.map((s) => s.id));
    const { body } = await request(app).get("/api/weapons");
    const offRotation = body.weapons.flatMap((w) => w.skins).find((s) => !featured.has(s.id));

    const res = await agent.post("/api/store/purchases").send({ itemId: offRotation.id }).expect(410);
    expect(res.body.code).toBe("OFFER_EXPIRED");
  });
});

describe("daily reward", () => {
  it("can be claimed once per 24 hours", async () => {
    const agent = await signedInAgent();

    const first = await agent.post("/api/users/me/daily-reward").expect(200);
    expect(first.body.user.valorantPoints).toBe(5500);

    const second = await agent.post("/api/users/me/daily-reward").expect(429);
    expect(new Date(second.body.availableAt).getTime()).toBeGreaterThan(Date.now());
  });
});

describe("favorites", () => {
  it("adds and removes favorite agents idempotently", async () => {
    const agent = await signedInAgent();

    await agent.put("/api/users/me/favorites/jett").expect(200);
    const added = await agent.put("/api/users/me/favorites/jett").expect(200);
    expect(added.body.user.favoriteAgents).toEqual(["jett"]);

    const removed = await agent.delete("/api/users/me/favorites/jett").expect(200);
    expect(removed.body.user.favoriteAgents).toEqual([]);

    await agent.put("/api/users/me/favorites/not-an-agent").expect(404);
  });
});
