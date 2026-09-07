export type AnalyticsEvent =
  | "comparison_opened"
  | "energy_source_added"
  | "energy_source_removed"
  | "metric_changed"
  | "geography_changed"
  | "display_mode_changed"
  | "units_changed"
  | "source_opened"
  | "data_passport_opened"
  | "number_challenged"
  | "complexity_changed"
  | "comparison_shared"
  | "table_view_opened"
  | "web_vitals";

export interface AnalyticsPayload {
  [key: string]: string | number | boolean;
}

/**
 * Privacy-respecting analytics tracker.
 * Only tracks typed, non-identifying events.
 */
export function trackEvent(
  eventName: AnalyticsEvent,
  payload?: AnalyticsPayload,
) {
  // We do not send PII or precise timestamps.
  // In a production environment, this would post to a privacy-first analytics provider
  // such as Plausible, Fathom, or Vercel Web Analytics.

  if (process.env.NODE_ENV === "development") {
    console.debug(`[Analytics] ${eventName}`, payload ?? "");
  }

  // Example integration point for Vercel Web Analytics (window.va)
  if (typeof window !== "undefined" && "va" in window) {
    // @ts-expect-error - Vercel analytics injected globally
    window.va("event", eventName, payload);
  }
}
