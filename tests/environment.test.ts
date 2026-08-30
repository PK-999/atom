// @vitest-environment node

import { describe, expect, it } from "vitest";

import { parsePublicEnv } from "@/lib/env/public";

describe("public environment", () => {
  it("defaults the local site URL", () => {
    expect(parsePublicEnv({}).NEXT_PUBLIC_SITE_URL).toBe(
      "http://localhost:3000",
    );
  });

  it("rejects a malformed site URL", () => {
    expect(() =>
      parsePublicEnv({ NEXT_PUBLIC_SITE_URL: "not-a-url" }),
    ).toThrow();
  });
});
