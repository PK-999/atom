import { expect, it } from "vitest";
import { getAdminClient, ingestObservation } from "./pipeline";
it("quarantines the mutable legacy write path before client creation", async () => {
  expect(() => getAdminClient()).toThrow(/retired/i);
  await expect(ingestObservation({})).rejects.toThrow(/retired/i);
});
