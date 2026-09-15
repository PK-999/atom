import { z } from "zod";

const IDENTIFIER_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const SafeIdentifierSchema = z
  .string()
  .regex(IDENTIFIER_REGEX, {
    message: "Identifier must be lowercase alphanumeric with optional dashes.",
  })
  .max(64);

export const EVENT_SCHEMAS = {
  comparison_opened: z
    .object({
      level: z.enum(["beginner", "explorer", "curious", "deep-dive", "geeky"]),
      sources_count: z.number().int().min(0).max(32),
    })
    .strict(),
  energy_source_added: z
    .object({
      technology: SafeIdentifierSchema,
    })
    .strict(),
  energy_source_removed: z
    .object({
      technology: SafeIdentifierSchema,
    })
    .strict(),
  metric_changed: z
    .object({
      metric_id: SafeIdentifierSchema,
    })
    .strict(),
  geography_changed: z
    .object({
      geography: SafeIdentifierSchema,
    })
    .strict(),
  display_mode_changed: z
    .object({
      mode: z.enum(["typical", "range", "raw"]),
    })
    .strict(),
  units_changed: z
    .object({
      units: z.enum(["scientific", "human"]),
    })
    .strict(),
  complexity_changed: z
    .object({
      level: z.enum(["beginner", "explorer", "curious", "deep-dive", "geeky"]),
    })
    .strict(),
  data_passport_opened: z
    .object({
      technology: SafeIdentifierSchema,
      metric_id: SafeIdentifierSchema,
    })
    .strict(),
  number_challenged: z
    .object({
      technology: SafeIdentifierSchema,
      metric_id: SafeIdentifierSchema,
    })
    .strict(),
  comparison_shared: z
    .object({
      sources_count: z.number().int().min(0).max(32),
      metric_id: SafeIdentifierSchema,
    })
    .strict(),
  table_view_opened: z
    .object({
      sources_count: z.number().int().min(0).max(32),
    })
    .strict(),
  source_opened: z
    .object({
      source_id: SafeIdentifierSchema,
    })
    .strict(),
  web_vitals: z
    .object({
      name: z.enum(["FCP", "LCP", "CLS", "FID", "TTFB", "INP"]),
      value: z.number(),
      rating: z.enum(["good", "needs-improvement", "poor"]),
    })
    .strict(),
} as const;

export type AnalyticsEvent = keyof typeof EVENT_SCHEMAS;
export type AnalyticsPayload<E extends AnalyticsEvent> = z.infer<
  (typeof EVENT_SCHEMAS)[E]
>;

export interface AnalyticsTransport {
  send(event: string, payload: Record<string, unknown>): Promise<void> | void;
}

export class NoopTransport implements AnalyticsTransport {
  send(): void {
    // Intentionally a no-op
  }
}

class BrowserTransport implements AnalyticsTransport {
  send(event: string, payload: Record<string, unknown>): void {
    if (typeof window !== "undefined" && "va" in window) {
      // @ts-expect-error - Vercel analytics injected globally
      window.va("event", event, payload);
    }
  }
}

let activeTransport: AnalyticsTransport =
  process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true"
    ? new BrowserTransport()
    : new NoopTransport();

export function setAnalyticsTransport(transport: AnalyticsTransport): void {
  activeTransport = transport;
}

export function resetAnalyticsTransport(): void {
  activeTransport =
    process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true"
      ? new BrowserTransport()
      : new NoopTransport();
}

/**
 * Validates whether an event name and payload comply with privacy rules.
 * Throws a ZodError or Error if validation fails.
 */
export function validateAnalyticsEvent<E extends AnalyticsEvent>(
  eventName: E,
  payload: unknown,
): AnalyticsPayload<E> {
  const schema = EVENT_SCHEMAS[eventName];
  if (!schema) {
    throw new Error(`Unknown analytics event: ${String(eventName)}`);
  }
  return schema.parse(payload) as AnalyticsPayload<E>;
}

/**
 * Privacy-respecting analytics tracker.
 * Only tracks typed, strictly-validated, non-identifying events.
 * Disallowed fields (PII, emails, query URLs, free text) are rejected.
 * Any transport or validation error fails closed without interrupting application logic.
 */
export function trackEvent<E extends AnalyticsEvent>(
  eventName: E,
  payload: AnalyticsPayload<E>,
): boolean {
  try {
    const validated = validateAnalyticsEvent(eventName, payload);

    if (process.env.NODE_ENV === "development") {
      console.debug(`[Analytics] ${eventName}`, validated);
    }

    activeTransport.send(eventName, validated);
    return true;
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[Analytics validation rejected] ${eventName}`, err);
    }
    // Fail closed: do not throw to caller
    return false;
  }
}
