// @vitest-environment node

import { describe, expect, it } from "vitest";

import { GET } from "@/app/health/route";

describe("GET /health (liveness probe)", () => {
  it("returns a non-sensitive service liveness contract without database dependency", async () => {
    const response = await GET();

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    await expect(response.json()).resolves.toEqual({
      service: "atom",
      status: "ok",
      version: 1,
    });
  });
});
