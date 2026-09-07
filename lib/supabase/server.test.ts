// @vitest-environment node

import { afterEach, describe, expect, it, vi } from "vitest";

const { cookiesMock, createServerClientMock } = vi.hoisted(() => ({
  cookiesMock: vi.fn(),
  createServerClientMock: vi.fn(),
}));

vi.mock("next/headers", () => ({ cookies: cookiesMock }));
vi.mock("@supabase/ssr", () => ({
  createServerClient: createServerClientMock,
}));

import { createClient } from "@/lib/supabase/server";

afterEach(() => {
  cookiesMock.mockReset();
  createServerClientMock.mockReset();
  vi.unstubAllEnvs();
});

describe("request-scoped server Supabase client", () => {
  it("uses the validated publishable-key environment contract", async () => {
    vi.stubEnv(
      "NEXT_PUBLIC_SUPABASE_URL",
      "https://configured-project.supabase.co",
    );
    vi.stubEnv(
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
      "sb_publishable_configured",
    );
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "legacy-key-must-not-be-used");
    cookiesMock.mockResolvedValue({ getAll: vi.fn(), set: vi.fn() });
    const client = { kind: "server-client" };
    createServerClientMock.mockReturnValue(client);

    await expect(createClient()).resolves.toBe(client);
    expect(createServerClientMock).toHaveBeenCalledWith(
      "https://configured-project.supabase.co",
      "sb_publishable_configured",
      expect.objectContaining({
        cookies: expect.objectContaining({
          getAll: expect.any(Function),
          setAll: expect.any(Function),
        }),
      }),
    );
  });
});
