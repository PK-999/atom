// @vitest-environment node

import { describe, expect, it } from "vitest";

import { parseServerEnv } from "@/lib/env/server";

describe("server environment", () => {
  it("allows an unconnected local evidence environment", () => {
    expect(parseServerEnv({})).toEqual({});
  });

  it("requires database and service-role credentials together", () => {
    expect(() =>
      parseServerEnv({ SUPABASE_SERVICE_ROLE_KEY: "server-secret" }),
    ).toThrow();

    expect(
      parseServerEnv({
        SUPABASE_DATABASE_URL: "postgresql://localhost:54322/postgres",
        SUPABASE_SERVICE_ROLE_KEY: "server-secret",
      }),
    ).toEqual({
      SUPABASE_DATABASE_URL: "postgresql://localhost:54322/postgres",
      SUPABASE_SERVICE_ROLE_KEY: "server-secret",
    });
  });
});
