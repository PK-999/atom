// @vitest-environment node

import { describe, expect, it } from "vitest";

import nextConfig from "@/next.config";

describe("security headers", () => {
  it("applies baseline browser protections to every route", async () => {
    const entries = await nextConfig.headers?.();
    const allRoutes = entries?.find((entry) => entry.source === "/(.*)");
    const headers = new Map(
      allRoutes?.headers.map(({ key, value }) => [key, value]),
    );

    expect(headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(headers.get("X-Frame-Options")).toBe("DENY");
    expect(headers.get("Referrer-Policy")).toBe(
      "strict-origin-when-cross-origin",
    );
    expect(headers.get("Permissions-Policy")).toContain("camera=()");
  });
});
