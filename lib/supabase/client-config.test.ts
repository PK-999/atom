import { describe, expect, it } from "vitest";

import {
  getSupabaseDatabaseUrl,
  getSupabasePublicConfig,
  getSupabaseServerConfig,
} from "@/lib/supabase/client-config";

describe("Supabase configuration", () => {
  it("allows absent public and server-only API configurations", () => {
    expect(getSupabasePublicConfig({})).toBeUndefined();
    expect(getSupabaseServerConfig({})).toBeUndefined();
  });

  it("maps complete publishable and secret API configurations", () => {
    expect(
      getSupabasePublicConfig({
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test",
        NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co",
      }),
    ).toEqual({
      publishableKey: "sb_publishable_test",
      url: "https://project.supabase.co",
    });
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

  it("rejects partial API configuration", () => {
    expect(() =>
      getSupabasePublicConfig({
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test",
      }),
    ).toThrow(/configured together/i);
    expect(() =>
      getSupabaseServerConfig({ SUPABASE_URL: "https://project.supabase.co" }),
    ).toThrow(/configured together/i);
  });

  it("keeps the direct database URL independent and PostgreSQL-only", () => {
    expect(
      getSupabaseDatabaseUrl({
        SUPABASE_DATABASE_URL: "postgresql://localhost:55322/postgres",
      }),
    ).toBe("postgresql://localhost:55322/postgres");
    expect(() =>
      getSupabaseDatabaseUrl({
        SUPABASE_DATABASE_URL: "https://project.supabase.co/database",
      }),
    ).toThrow(/postgres/i);
  });
});
