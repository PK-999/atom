import path from "node:path";

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

export const CORE_MONITORED_SOURCES: SourceVerificationTarget[] = [
  {
    id: "ipcc-ar5-wg3",
    title: "IPCC Working Group III Fifth Assessment Report, Annex III",
    url: "https://www.ipcc.ch/report/ar5/wg3/",
    lastVerifiedOn: "2026-08-30",
  },
  {
    id: "unece-lca-2021",
    title: "UNECE Life Cycle Assessment of Electricity Generation Options",
    url: "https://unece.org/sed/documents/2021/10/reports/life-cycle-assessment-electricity-generation-options",
    lastVerifiedOn: "2026-08-30",
  },
  {
    id: "unscear-2020-2021",
    title: "UNSCEAR 2020/2021 Report to the General Assembly, Annex B",
    url: "https://www.unscear.org/unscear/en/publications/2020_2021_1.html",
    lastVerifiedOn: "2026-08-30",
  },
  {
    id: "owid-safest-sources",
    title: "Our World in Data: Safest Sources of Energy",
    url: "https://ourworldindata.org/safest-sources-of-energy",
    lastVerifiedOn: "2026-08-30",
  },
  {
    id: "iaea-pris",
    title: "IAEA Power Reactor Information System (PRIS)",
    url: "https://pris.iaea.org",
    lastVerifiedOn: "2026-08-30",
  },
  {
    id: "iaea-waste-trends",
    title:
      "IAEA Status and Trends in Spent Fuel and Radioactive Waste Management",
    url: "https://www.iaea.org/publications/14746/status-and-trends-in-spent-fuel-and-radioactive-waste-management",
    lastVerifiedOn: "2026-08-30",
  },
  {
    id: "us-nrc-pwr",
    title: "US Nuclear Regulatory Commission: Pressurized Water Reactors",
    url: "https://www.nrc.gov/reactors/pwrs.html",
    lastVerifiedOn: "2026-08-30",
  },
  {
    id: "us-nrc-bwr",
    title: "US Nuclear Regulatory Commission: Boiling Water Reactors",
    url: "https://www.nrc.gov/reactors/bwrs.html",
    lastVerifiedOn: "2026-08-30",
  },
  {
    id: "cea-india-exec-summary",
    title: "Central Electricity Authority (CEA) Monthly Executive Summary",
    url: "https://cea.nic.in/executive-summary/?lang=en",
    lastVerifiedOn: "2026-08-30",
  },
  {
    id: "dae-india",
    title: "Department of Atomic Energy (DAE) Government of India",
    url: "https://dae.gov.in",
    lastVerifiedOn: "2026-08-30",
  },
  {
    id: "npcil-india",
    title: "Nuclear Power Corporation of India Limited (NPCIL)",
    url: "https://www.npcil.nic.in",
    lastVerifiedOn: "2026-08-30",
  },
];

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

export interface CliMonitoringOptions extends CheckSourcesOptions {
  writeReport?: boolean;
  reportPath?: string;
  exitOnError?: boolean;
}

export async function checkSourcesCli(
  args: string[] = process.argv.slice(2),
  options: CliMonitoringOptions = {},
): Promise<MonitoringReport> {
  const isDryRun = args.includes("--dry-run");
  const timeoutArg = args
    .find((a) => a.startsWith("--timeout="))
    ?.split("=")[1];
  const concurrencyArg = args
    .find((a) => a.startsWith("--concurrency="))
    ?.split("=")[1];
  const reportPathArg = args
    .find((a) => a.startsWith("--report-out="))
    ?.split("=")[1];

  const timeoutMs = timeoutArg
    ? parseInt(timeoutArg, 10)
    : (options.timeoutMs ?? DEFAULT_TIMEOUT_MS);
  const concurrency = concurrencyArg
    ? parseInt(concurrencyArg, 10)
    : (options.concurrency ?? DEFAULT_CONCURRENCY);
  const reportPath =
    reportPathArg ??
    options.reportPath ??
    path.join(
      process.cwd(),
      "docs/engineering/verification/latest-source-monitoring.json",
    );
  const writeReport = options.writeReport ?? true;
  const exitOnError = options.exitOnError ?? true;

  const fetchFn = isDryRun
    ? async () => new Response(null, { status: 200 })
    : (options.fetchFn ?? fetch);

  console.log(
    `[ATOM Monitor] Checking ${CORE_MONITORED_SOURCES.length} evidence sources...`,
  );
  const report = await runSourceMonitoring(CORE_MONITORED_SOURCES, {
    timeoutMs,
    concurrency,
    fetchFn,
    staleThresholdDays: options.staleThresholdDays,
    maxRetries: options.maxRetries,
  });

  console.log(
    `\n================ ATOM Source Monitoring Report ================`,
  );
  console.log(`Timestamp:    ${report.timestamp}`);
  console.log(`Total:        ${report.totalChecked}`);
  console.log(`Healthy:      ${report.healthyCount}`);
  console.log(`Inconclusive: ${report.inconclusiveCount}`);
  console.log(`Broken:       ${report.brokenCount}`);
  console.log(`Stale:        ${report.staleCount}`);
  console.log(
    `===============================================================\n`,
  );

  for (const res of report.results) {
    const symbol =
      res.status === "healthy" ? "✓" : res.status === "broken" ? "✗" : "⚠";
    console.log(
      `[${symbol}] ${res.id.padEnd(24)} [${res.status.padEnd(12)}] ${res.message}`,
    );
  }

  if (writeReport) {
    const fs = await import("node:fs/promises");
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2), "utf-8");
    console.log(`\nReport written to: ${reportPath}`);
  }

  if (exitOnError && report.brokenCount > 0) {
    process.exit(1);
  }

  return report;
}

if (
  process.argv[1] &&
  (process.argv[1].endsWith("check-sources.ts") ||
    process.argv[1].endsWith("check-sources.js"))
) {
  checkSourcesCli().catch((err) => {
    console.error("Source monitoring error:", err);
    process.exit(1);
  });
}
