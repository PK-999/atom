// @vitest-environment node
import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { parseEvidenceCliArgs } from "./ingest";
describe("evidence CLI boundary", () => {
  it("rejects duplicate and unknown flags before loading privileged dependencies", () => {
    expect(() =>
      parseEvidenceCliArgs([
        "ingest",
        "--manifest",
        "a",
        "--manifest",
        "b",
        "--artifact",
        "c",
      ]),
    ).toThrow(/duplicate/i);
    expect(() =>
      parseEvidenceCliArgs([
        "ingest",
        "--manifest",
        "a",
        "--artifact",
        "b",
        "--parser",
        "unsafe.ts",
      ]),
    ).toThrow(/unknown/i);
  });
  it("requires the reviewer to supply the exact reviewed artifact and manifest identities", () => {
    expect(() =>
      parseEvidenceCliArgs([
        "review",
        "--dataset-version",
        "version",
        "--role",
        "scientific",
        "--reviewer",
        "person",
      ]),
    ).toThrow(/artifact-checksum/);
  });
  it("the real command fails closed without database config, with sanitized output", () => {
    const child = spawnSync(
      process.execPath,
      [
        "--conditions=react-server",
        "--import",
        "tsx",
        "scripts/evidence/ingest.ts",
        "publish",
        "--dataset-version",
        "synthetic-version",
      ],
      {
        cwd: process.cwd(),
        encoding: "utf8",
        env: { PATH: process.env.PATH, NODE_ENV: "test" },
      },
    );
    expect(child.status).toBe(1);
    expect(child.stdout).toBe("");
    expect(child.stderr).toBe("Evidence ingestion command failed.\n");
  });
});
