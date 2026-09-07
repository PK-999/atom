// @vitest-environment node

import { describe, expect, it, vi } from "vitest";

import { GET } from "@/app/health/route";

vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({
    from: () => ({
      select: () => ({
        limit: () => Promise.resolve({ data: [{ id: 1 }], error: null }),
      }),
    }),
  }),
}));

describe("GET /health", () => {
  it("returns a non-sensitive service health contract", async () => {
    const response = await GET();

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    await expect(response.json()).resolves.toEqual({
      service: "atom",
      status: "ok",
      version: 1,
      db_status: "ok",
    });
  });
});
