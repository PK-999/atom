// @vitest-environment node

import { describe, expect, it } from "vitest";

import { getSupabaseDatabaseUrl } from "@/lib/supabase/database-config";

describe("direct database configuration", () => {
  it("allows an absent direct database URL", () => {
    expect(getSupabaseDatabaseUrl({})).toBeUndefined();
  });

  it("accepts PostgreSQL connection URLs independently of API keys", () => {
    expect(
      getSupabaseDatabaseUrl({
        SUPABASE_DATABASE_URL: "postgresql://localhost:55322/postgres",
      }),
    ).toBe("postgresql://localhost:55322/postgres");
  });

  it("rejects non-PostgreSQL URLs", () => {
    expect(() =>
      getSupabaseDatabaseUrl({
        SUPABASE_DATABASE_URL: "https://project.supabase.co/database",
      }),
    ).toThrow(/postgres/i);
  });
});
