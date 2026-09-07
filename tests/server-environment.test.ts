// @vitest-environment node

import { describe, expect, it } from "vitest";

import { parseServerEnv } from "@/lib/env/server";

describe("server environment", () => {
  it("allows an unconnected local evidence environment", () => {
    expect(parseServerEnv({})).toEqual({});
  });

  it("accepts the canonical server-only Supabase API configuration", () => {
    expect(
      parseServerEnv({
        SUPABASE_SECRET_KEY: "sb_secret_test",
        SUPABASE_URL: "https://project.supabase.co",
      }),
    ).toEqual({
      secretKey: "sb_secret_test",
      url: "https://project.supabase.co",
    });
  });

  it("rejects a partial server-only Supabase API configuration", () => {
    expect(() =>
      parseServerEnv({ SUPABASE_URL: "https://project.supabase.co" }),
    ).toThrow(/configured together/i);
  });
});
