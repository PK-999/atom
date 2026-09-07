// @vitest-environment node

import { describe, expect, it } from "vitest";

import { getSupabaseServerConfig } from "@/lib/supabase/server-config";

describe("server Supabase API configuration", () => {
  it("allows an absent server API configuration", () => {
    expect(getSupabaseServerConfig({})).toBeUndefined();
  });

  it("maps a complete secret-key API configuration", () => {
    expect(
      getSupabaseServerConfig({
        SUPABASE_SECRET_KEY: "sb_secret_test",
        SUPABASE_URL: "https://project.supabase.co",
      }),
    ).toEqual({
      secretKey: "sb_secret_test",
      url: "https://project.supabase.co",
    });
  });

  it("rejects partial server API configuration", () => {
    expect(() =>
      getSupabaseServerConfig({ SUPABASE_URL: "https://project.supabase.co" }),
    ).toThrow(/configured together/i);
  });
});
