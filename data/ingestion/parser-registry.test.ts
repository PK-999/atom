import { describe, expect, it } from "vitest";
import { createDefaultParserRegistry } from "./parser-registry";
import { artifact, observation } from "./test-fixtures";
describe("explicit reference artifact parser", () => {
  it("reads a complete synthetic artifact", async () => {
    await expect(
      createDefaultParserRegistry().parse(
        "observation-envelope-v1",
        artifact(),
      ),
    ).resolves.toEqual([observation()]);
  });
  it.each([
    { header: "wrong", expectedIds: ["synthetic-row"], rows: [observation()] },
    {
      header: "atom-evidence-observations-v1",
      expectedIds: ["synthetic-row"],
      rows: [observation(), observation()],
    },
    {
      header: "atom-evidence-observations-v1",
      expectedIds: ["synthetic-row", "missing"],
      rows: [observation()],
    },
    {
      header: "atom-evidence-observations-v1",
      expectedIds: ["synthetic-row"],
      rows: [{ ...observation(), value: "not numeric" }],
    },
  ])(
    "rejects malformed header, duplicate/missing row or nonnumeric cell: %j",
    async (body) => {
      await expect(
        createDefaultParserRegistry().parse(
          "observation-envelope-v1",
          new TextEncoder().encode(JSON.stringify(body)),
        ),
      ).rejects.toThrow();
    },
  );
  it("rejects executable parser paths", async () => {
    await expect(
      createDefaultParserRegistry().parse("./unsafe.ts", artifact()),
    ).rejects.toThrow(/registered/i);
  });
});
