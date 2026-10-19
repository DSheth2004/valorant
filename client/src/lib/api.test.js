import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, fetchResource, request } from "./api";

const jsonResponse = (status, body) =>
  Promise.resolve(new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } }));

afterEach(() => vi.unstubAllGlobals());

describe("request", () => {
  it("sends JSON with credentials and returns the parsed body", async () => {
    const fetchMock = vi.fn(() => jsonResponse(200, { ok: true }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(request("/auth/login", { method: "POST", body: { email: "a@b.co" } })).resolves.toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/auth/login",
      expect.objectContaining({ method: "POST", credentials: "include", body: '{"email":"a@b.co"}' }),
    );
  });

  it("turns error responses into ApiError with field details", async () => {
    vi.stubGlobal("fetch", () =>
      jsonResponse(409, { message: "Taken", code: "DUPLICATE", details: { email: "Taken" } }),
    );

    const error = await request("/auth/register").catch((e) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 409, code: "DUPLICATE", details: { email: "Taken" } });
  });

  it("reports network failures with a friendly message", async () => {
    vi.stubGlobal("fetch", () => Promise.reject(new TypeError("Failed to fetch")));
    await expect(request("/agents")).rejects.toMatchObject({ code: "NETWORK" });
  });
});

describe("fetchResource", () => {
  it("dedupes in-flight requests and evicts failures so they can be retried", async () => {
    const fetchMock = vi
      .fn()
      .mockImplementationOnce(() => jsonResponse(500, { message: "boom" }))
      .mockImplementation(() => jsonResponse(200, { maps: [] }));
    vi.stubGlobal("fetch", fetchMock);

    const first = fetchResource("/maps-test");
    expect(fetchResource("/maps-test")).toBe(first);
    await expect(first).rejects.toBeInstanceOf(ApiError);

    await expect(fetchResource("/maps-test")).resolves.toEqual({ maps: [] });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
