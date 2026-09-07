// @vitest-environment node

import { afterEach, describe, expect, it, vi } from "vitest";

const { createBrowserClientMock } = vi.hoisted(() => ({
  createBrowserClientMock: vi.fn(),
}));

vi.mock("@supabase/ssr", () => ({
  createBrowserClient: createBrowserClientMock,
}));

import { createClient } from "@/lib/supabase/client";

afterEach(() => {
  createBrowserClientMock.mockReset();
  vi.unstubAllEnvs();
});

describe("browser Supabase client", () => {
  it("uses the validated publishable-key environment contract", () => {
    vi.stubEnv(
      "NEXT_PUBLIC_SUPABASE_URL",
      "https://configured-project.supabase.co",
    );
    vi.stubEnv(
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
      "sb_publishable_configured",
    );
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "legacy-key-must-not-be-used");
    const client = { kind: "browser-client" };
    createBrowserClientMock.mockReturnValue(client);

    expect(createClient()).toBe(client);
    expect(createBrowserClientMock).toHaveBeenCalledWith(
      "https://configured-project.supabase.co",
      "sb_publishable_configured",
    );
  });
});
