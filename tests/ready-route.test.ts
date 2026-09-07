// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

describe("GET /ready (readiness probe)", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns 200 when database connectivity is healthy", async () => {
    const { createClient } = await import("@/lib/supabase/server");
    vi.mocked(createClient).mockResolvedValue({
      from: () => ({
        select: () => ({
          limit: () => Promise.resolve({ data: [{ id: 1 }], error: null }),
        }),
      }),
    } as unknown as Awaited<ReturnType<typeof createClient>>);

    const { GET } = await import("@/app/ready/route");
    const response = await GET();

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    await expect(response.json()).resolves.toEqual({
      service: "atom",
      status: "ready",
      db: "connected",
    });
  });

  it("returns 503 when client creation fails (e.g. absent/invalid config)", async () => {
    const { createClient } = await import("@/lib/supabase/server");
    vi.mocked(createClient).mockRejectedValue(
      new Error("Missing Supabase configuration secret=leak-test"),
    );

    const { GET } = await import("@/app/ready/route");
    const response = await GET();

    expect(response.status).toBe(503);
    const body = await response.json();
    expect(body).toEqual({
      service: "atom",
      status: "unavailable",
      db: "disconnected",
    });
    // Ensure no error strings or secrets leaked
    expect(JSON.stringify(body)).not.toContain("leak-test");
  });

  it("returns 503 when database query errors", async () => {
    const { createClient } = await import("@/lib/supabase/server");
    vi.mocked(createClient).mockResolvedValue({
      from: () => ({
        select: () => ({
          limit: () =>
            Promise.resolve({
              data: null,
              error: { message: "database offline host=internal-pg" },
            }),
        }),
      }),
    } as unknown as Awaited<ReturnType<typeof createClient>>);

    const { GET } = await import("@/app/ready/route");
    const response = await GET();

    expect(response.status).toBe(503);
    const body = await response.json();
    expect(body).toEqual({
      service: "atom",
      status: "unavailable",
      db: "disconnected",
    });
    expect(JSON.stringify(body)).not.toContain("internal-pg");
  });

  it("returns 503 when database check times out", async () => {
    const { createClient } = await import("@/lib/supabase/server");
    vi.mocked(createClient).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(resolve, 3000);
        }),
    );

    const { GET } = await import("@/app/ready/route");
    const response = await GET();

    expect(response.status).toBe(503);
    const body = await response.json();
    expect(body).toEqual({
      service: "atom",
      status: "unavailable",
      db: "disconnected",
    });
  }, 5000);
});
