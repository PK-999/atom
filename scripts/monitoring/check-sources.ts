export interface SourceVerificationTarget {
  id: string;
  title: string;
  url: string;
  lastVerifiedOn?: string;
}

export type SourceCheckStatus =
  "healthy" | "broken" | "inconclusive" | "stale" | "invalid_url";

export interface SourceCheckResult {
  id: string;
  title: string;
  url: string;
  status: SourceCheckStatus;
  httpStatus?: number;
  message: string;
  checkedAt: string;
  isStale: boolean;
}

export interface MonitoringReport {
  timestamp: string;
  totalChecked: number;
  healthyCount: number;
  inconclusiveCount: number;
  brokenCount: number;
  staleCount: number;
  results: SourceCheckResult[];
}

export interface CheckSourcesOptions {
  timeoutMs?: number;
  concurrency?: number;
  maxRetries?: number;
  staleThresholdDays?: number;
  fetchFn?: typeof fetch;
}

const DEFAULT_TIMEOUT_MS = 5000;
const DEFAULT_CONCURRENCY = 5;
const DEFAULT_MAX_RETRIES = 1;
const DEFAULT_STALE_DAYS = 180; // ~6 months

export async function checkSingleSource(
  source: SourceVerificationTarget,
  options: CheckSourcesOptions = {},
): Promise<SourceCheckResult> {
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
  const staleThresholdDays = options.staleThresholdDays ?? DEFAULT_STALE_DAYS;
  const fetchFn = options.fetchFn ?? fetch;

  const checkedAt = new Date().toISOString();
  let isStale = false;

  if (source.lastVerifiedOn) {
    const verifiedDate = new Date(source.lastVerifiedOn).getTime();
    if (!Number.isNaN(verifiedDate)) {
      const ageInDays = (Date.now() - verifiedDate) / (1000 * 60 * 60 * 24);
      if (ageInDays > staleThresholdDays) {
        isStale = true;
      }
    }
  }

  // Validate URL syntax
  try {
    const parsed = new URL(source.url);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return {
        id: source.id,
        title: source.title,
        url: source.url,
        status: "invalid_url",
        message: `Unsupported protocol: ${parsed.protocol}`,
        checkedAt,
        isStale,
      };
    }
  } catch {
    return {
      id: source.id,
      title: source.title,
      url: source.url,
      status: "invalid_url",
      message: "Invalid URL string",
      checkedAt,
      isStale,
    };
  }

  let attempt = 0;
  let lastError: unknown;
  let lastHttpStatus: number | undefined;

  while (attempt <= maxRetries) {
    attempt++;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      // Try HEAD first to save bandwidth
      let response = await fetchFn(source.url, {
        method: "HEAD",
        signal: controller.signal,
        headers: { "User-Agent": "ATOM-Source-Monitor/1.0" },
      });

      // If method not allowed, try GET with stream abort
      if (response.status === 405) {
        response = await fetchFn(source.url, {
          method: "GET",
          signal: controller.signal,
          headers: {
            "User-Agent": "ATOM-Source-Monitor/1.0",
            Range: "bytes=0-100",
          },
        });
      }

      clearTimeout(timer);
      lastHttpStatus = response.status;

      if (response.ok || (response.status >= 300 && response.status < 400)) {
        return {
          id: source.id,
          title: source.title,
          url: source.url,
          status: isStale ? "stale" : "healthy",
          httpStatus: response.status,
          message: isStale
            ? `Source is reachable (${response.status}) but exceeds stale threshold of ${staleThresholdDays} days`
            : `Source reachable (${response.status})`,
          checkedAt,
          isStale,
        };
      }

      // 403 Forbidden or 429 Rate Limited are inconclusive, NOT broken
      if (response.status === 403 || response.status === 429) {
        return {
          id: source.id,
          title: source.title,
          url: source.url,
          status: "inconclusive",
          httpStatus: response.status,
          message: `Check inconclusive (${response.status}); access restricted or rate-limited. Does not invalidate scientific claim.`,
          checkedAt,
          isStale,
        };
      }

      // 404 or 410 represent broken sources
      if (response.status === 404 || response.status === 410) {
        return {
          id: source.id,
          title: source.title,
          url: source.url,
          status: "broken",
          httpStatus: response.status,
          message: `Source broken (${response.status}): target not found`,
          checkedAt,
          isStale,
        };
      }

      // Other 4xx/5xx - retry or inconclusive
      if (attempt <= maxRetries) {
        continue;
      }

      return {
        id: source.id,
        title: source.title,
        url: source.url,
        status: "inconclusive",
        httpStatus: response.status,
        message: `HTTP ${response.status} returned; check inconclusive.`,
        checkedAt,
        isStale,
      };
    } catch (err: unknown) {
      clearTimeout(timer);
      lastError = err;
      if (attempt <= maxRetries) {
        continue;
      }
    }
  }

  // If timed out or network error after retries:
  const isTimeout =
    (lastError as { name?: string })?.name === "AbortError" ||
    String(lastError).includes("abort");

  return {
    id: source.id,
    title: source.title,
    url: source.url,
    status: "inconclusive",
    httpStatus: lastHttpStatus,
    message: isTimeout
      ? `Check inconclusive: request timed out after ${timeoutMs}ms. Does not invalidate scientific claim.`
      : `Check inconclusive: network error (${(lastError as Error)?.message || "unknown"}). Does not invalidate scientific claim.`,
    checkedAt,
    isStale,
  };
}

export async function runSourceMonitoring(
  sources: SourceVerificationTarget[],
  options: CheckSourcesOptions = {},
): Promise<MonitoringReport> {
  const concurrency = options.concurrency ?? DEFAULT_CONCURRENCY;
  const results: SourceCheckResult[] = [];

  // Bounded concurrency pool
  for (let i = 0; i < sources.length; i += concurrency) {
    const chunk = sources.slice(i, i + concurrency);
    const chunkResults = await Promise.all(
      chunk.map((s) => checkSingleSource(s, options)),
    );
    results.push(...chunkResults);
  }

  const report: MonitoringReport = {
    timestamp: new Date().toISOString(),
    totalChecked: results.length,
    healthyCount: results.filter((r) => r.status === "healthy").length,
    inconclusiveCount: results.filter((r) => r.status === "inconclusive")
      .length,
    brokenCount: results.filter((r) => r.status === "broken").length,
    staleCount: results.filter((r) => r.status === "stale" || r.isStale).length,
    results,
  };

  return report;
}
