import { describe, expect, it } from "vitest";
import { validateAndNormalize } from "./quality";
import { manifest, metric, observation } from "./test-fixtures";

const store = {
  async getMetricDefinition() {
    return metric;
  },
};
describe("ingestion quality", () => {
  it("normalizes a draft using the metric canonical unit without mutating input", async () => {
    const row = observation();
    const result = await validateAndNormalize([row], manifest(), store);
    expect(result.normalized[0]).toMatchObject({
      value: 1000,
      unit: "MW",
      publicationStatus: "draft",
    });
    expect(row).toMatchObject({ value: 1, unit: "GW" });
  });
  it.each([
    { datasetId: "another-dataset" },
    { sourceId: "another-source" },
    { publicationStatus: "published" },
    { publicationStatus: "withdrawn" },
    { license: { ...observation().license, id: "another-license" } },
  ] as Partial<ReturnType<typeof observation>>[])(
    "rejects unbound or nondraft parser records: %j",
    async (change) => {
      await expect(
        validateAndNormalize([observation(change)], manifest(), store),
      ).rejects.toThrow();
    },
  );
  it("rejects duplicate IDs even when composite identities differ", async () => {
    await expect(
      validateAndNormalize(
        [observation(), observation({ technologyId: "another-technology" })],
        manifest(),
        store,
      ),
    ).rejects.toThrow(/duplicate/i);
  });
  it("rejects duplicate composite identities with different IDs", async () => {
    await expect(
      validateAndNormalize(
        [observation(), observation({ id: "another-row" })],
        manifest(),
        store,
      ),
    ).rejects.toThrow(/duplicate/i);
  });
  it("rejects a convertible but noncanonical target", async () => {
    await expect(
      validateAndNormalize(
        [observation()],
        manifest(undefined, { canonicalUnits: { [metric.id]: "GW" } }),
        store,
      ),
    ).rejects.toThrow(/canonical/i);
  });
  it("rejects restricted redistribution and nonfinite normalized output", async () => {
    await expect(
      validateAndNormalize(
        [observation()],
        manifest(undefined, { redistribution: "restricted" }),
        store,
      ),
    ).rejects.toThrow(/restriction|redistribution/i);
    await expect(
      validateAndNormalize(
        [
          observation({ value: Number.MAX_VALUE } as Partial<
            ReturnType<typeof observation>
          >),
        ],
        manifest(),
        store,
      ),
    ).rejects.toThrow();
  });
});
