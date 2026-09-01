import { describe, expect, it } from "vitest";

import { createIdempotencyKey } from "./version";

describe("createIdempotencyKey", () => {
  it("creates a stable idempotency key from identity, checksum, and transform", () => {
    expect(
      createIdempotencyKey({
        datasetId: "eia-capacity-factor",
        sourceVersion: "2026-08",
        inputChecksum: "abc123",
        transformationVersion: "1.0.0",
      }),
    ).toBe("eia-capacity-factor:2026-08:abc123:1.0.0");
  });
});
