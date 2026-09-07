import { describe, expect, it, vi } from "vitest";
import {
  checkSingleSource,
  runSourceMonitoring,
  type SourceVerificationTarget,
} from "./check-sources";

describe("check-sources monitoring", () => {
  it("classifies 200 OK as healthy", async () => {
    const mockFetch = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 200 }));
    const source: SourceVerificationTarget = {
      id: "src-1",
      title: "IEA World Energy Outlook",
      url: "https://iea.org/weo",
      lastVerifiedOn: new Date().toISOString(),
    };

    const result = await checkSingleSource(source, { fetchFn: mockFetch });
    expect(result.status).toBe("healthy");
    expect(result.httpStatus).toBe(200);
    expect(result.isStale).toBe(false);
  });

  it("classifies 403 Forbidden and 429 Rate Limit as inconclusive, not false claims", async () => {
    const mockFetch403 = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 403 }));
    const result403 = await checkSingleSource(
      {
        id: "src-403",
        title: "Paywalled / Protected",
        url: "https://nature.com/article",
      },
      { fetchFn: mockFetch403 },
    );
    expect(result403.status).toBe("inconclusive");
    expect(result403.message).toContain("Does not invalidate scientific claim");

    const mockFetch429 = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 429 }));
    const result429 = await checkSingleSource(
      { id: "src-429", title: "Rate Limited", url: "https://api.example.com" },
      { fetchFn: mockFetch429 },
    );
    expect(result429.status).toBe("inconclusive");
    expect(result429.message).toContain("Does not invalidate scientific claim");
  });

  it("classifies timeouts as inconclusive", async () => {
    const mockFetchTimeout = vi.fn().mockImplementation(() => {
      const error = new Error("The operation was aborted");
      error.name = "AbortError";
      return Promise.reject(error);
    });

    const result = await checkSingleSource(
      {
        id: "src-timeout",
        title: "Slow Source",
        url: "https://slow.example.com",
      },
      { fetchFn: mockFetchTimeout, timeoutMs: 50, maxRetries: 0 },
    );
    expect(result.status).toBe("inconclusive");
    expect(result.message).toContain("timed out");
    expect(result.message).toContain("Does not invalidate scientific claim");
  });

  it("classifies 404 Not Found as broken", async () => {
    const mockFetch = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 404 }));
    const result = await checkSingleSource(
      { id: "src-404", title: "Gone Source", url: "https://example.com/dead" },
      { fetchFn: mockFetch },
    );
    expect(result.status).toBe("broken");
    expect(result.httpStatus).toBe(404);
  });

  it("detects stale verification dates beyond threshold", async () => {
    const mockFetch = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 200 }));
    const source: SourceVerificationTarget = {
      id: "src-stale",
      title: "Old Source",
      url: "https://example.com/old",
      lastVerifiedOn: "2024-01-01T00:00:00Z",
    };

    const result = await checkSingleSource(source, {
      fetchFn: mockFetch,
      staleThresholdDays: 90,
    });
    expect(result.status).toBe("stale");
    expect(result.isStale).toBe(true);
  });

  it("handles invalid URL formats gracefully", async () => {
    const result = await checkSingleSource({
      id: "src-bad-url",
      title: "Bad URL",
      url: "not a url",
    });
    expect(result.status).toBe("invalid_url");
  });

  it("aggregates report with bounded concurrency", async () => {
    const mockFetch = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 200 }));
    const sources: SourceVerificationTarget[] = [
      { id: "s1", title: "Source 1", url: "https://s1.example.com" },
      { id: "s2", title: "Source 2", url: "https://s2.example.com" },
      { id: "s3", title: "Source 3", url: "https://s3.example.com" },
    ];

    const report = await runSourceMonitoring(sources, {
      concurrency: 2,
      fetchFn: mockFetch,
    });
    expect(report.totalChecked).toBe(3);
    expect(report.healthyCount).toBe(3);
    expect(report.brokenCount).toBe(0);
    expect(report.inconclusiveCount).toBe(0);
  });
});
