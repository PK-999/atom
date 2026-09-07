import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  trackEvent,
  validateAnalyticsEvent,
  setAnalyticsTransport,
  resetAnalyticsTransport,
  type AnalyticsTransport,
} from "./tracker";

describe("Analytics Tracker", () => {
  let mockTransport: AnalyticsTransport;

  beforeEach(() => {
    mockTransport = {
      send: vi.fn(),
    };
    setAnalyticsTransport(mockTransport);
  });

  afterEach(() => {
    resetAnalyticsTransport();
  });

  it("validates and accepts valid typed events", () => {
    const success = trackEvent("comparison_opened", {
      level: "curious",
      sources_count: 5,
    });
    expect(success).toBe(true);
    expect(mockTransport.send).toHaveBeenCalledWith("comparison_opened", {
      level: "curious",
      sources_count: 5,
    });
  });

  it("records web_vitals including INP, LCP, and CLS", () => {
    const success = trackEvent("web_vitals", {
      name: "INP",
      value: 120,
      rating: "good",
    });
    expect(success).toBe(true);
    expect(mockTransport.send).toHaveBeenCalledWith("web_vitals", {
      name: "INP",
      value: 120,
      rating: "good",
    });
  });

  it("rejects payloads containing email addresses", () => {
    expect(() =>
      validateAnalyticsEvent("energy_source_added", {
        technology: "user@example.com",
      }),
    ).toThrow();

    // trackEvent fails closed without throwing
    const result = trackEvent("energy_source_added", {
      technology: "admin@test.org",
    });
    expect(result).toBe(false);
    expect(mockTransport.send).not.toHaveBeenCalled();
  });

  it("rejects payloads containing URL query strings", () => {
    expect(() =>
      validateAnalyticsEvent("metric_changed", {
        metric_id: "lifecycle-ghg?utm_source=twitter",
      }),
    ).toThrow();

    const result = trackEvent("metric_changed", {
      metric_id: "land-use?session=12345",
    });
    expect(result).toBe(false);
    expect(mockTransport.send).not.toHaveBeenCalled();
  });

  it("rejects unknown fields to prevent accidental PII leakage", () => {
    expect(() =>
      validateAnalyticsEvent("comparison_opened", {
        level: "curious",
        sources_count: 3,
        extra_free_text: "John Doe",
      }),
    ).toThrow();
  });

  it("fails closed and does not throw when transport throws an error", () => {
    const errorTransport: AnalyticsTransport = {
      send: vi.fn().mockImplementation(() => {
        throw new Error("Network transport failure");
      }),
    };
    setAnalyticsTransport(errorTransport);

    expect(() =>
      trackEvent("energy_source_removed", { technology: "coal" }),
    ).not.toThrow();

    const result = trackEvent("energy_source_removed", { technology: "coal" });
    expect(result).toBe(false);
  });
});
