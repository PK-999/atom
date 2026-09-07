// @vitest-environment node

import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";

const temporaryDirectories: string[] = [];

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { force: true, recursive: true });
  }
});

describe("the retired reference ingestion script", () => {
  it("fails closed before loading local credentials or attempting ingestion", () => {
    const isolatedWorkingDirectory = mkdtempSync(
      join(tmpdir(), "atom-ingest-reference-"),
    );
    temporaryDirectories.push(isolatedWorkingDirectory);

    const result = spawnSync(
      resolve(process.cwd(), "node_modules/.bin/tsx"),
      [resolve(process.cwd(), "scripts/ingest-reference.ts")],
      {
        cwd: isolatedWorkingDirectory,
        encoding: "utf8",
        env: {
          NODE_ENV: "test",
          PATH: process.env.PATH ?? "",
        },
      },
    );

    expect(result.status).toBe(1);
    expect(result.stderr).toMatch(/unverified development example/i);
    expect(result.stderr).toMatch(/reviewed evidence pipeline/i);
    expect(result.stdout).toBe("");
  });
});
