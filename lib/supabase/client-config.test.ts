import { describe, expect, it } from "vitest";

import {
  getSupabasePublicConfig,
  requireSupabasePublicConfig,
} from "@/lib/supabase/client-config";

describe("public Supabase configuration", () => {
  it("allows an absent public API configuration", () => {
    expect(getSupabasePublicConfig({})).toBeUndefined();
  });

  it("maps a complete publishable API configuration", () => {
    expect(
      getSupabasePublicConfig({
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test",
        NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co",
      }),
    ).toEqual({
      publishableKey: "sb_publishable_test",
      url: "https://project.supabase.co",
    });
  });

  it("rejects partial public API configuration", () => {
    expect(() =>
      getSupabasePublicConfig({
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test",
      }),
    ).toThrow(/configured together/i);
  });

  it("requires a complete configuration before constructing a client", () => {
    expect(() => requireSupabasePublicConfig({})).toThrow(
      /public supabase configuration is required/i,
    );
    expect(
      requireSupabasePublicConfig({
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test",
        NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co",
      }),
    ).toEqual({
      publishableKey: "sb_publishable_test",
      url: "https://project.supabase.co",
    });
  });
});
