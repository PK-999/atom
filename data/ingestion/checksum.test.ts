import { describe, expect, it } from "vitest";

import { sha256 } from "./checksum";

describe("sha256", () => {
  it("returns the lowercase SHA-256 digest for input bytes", () => {
    expect(sha256(new TextEncoder().encode("ATOM"))).toBe(
      "939f34238170826d249f0103a04e8d7406da30abd2dad9a8dc92702e31165ff5",
    );
  });
});
