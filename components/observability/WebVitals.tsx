"use client";

import { useReportWebVitals } from "next/web-vitals";
import { trackEvent } from "@/lib/analytics/tracker";

export function WebVitals() {
  useReportWebVitals(
    (metric: { name: string; value: number; rating: string }) => {
      // Only track major core web vitals including INP, LCP, CLS
      if (["FCP", "LCP", "CLS", "FID", "TTFB", "INP"].includes(metric.name)) {
        const rating =
          metric.rating === "good" ||
          metric.rating === "needs-improvement" ||
          metric.rating === "poor"
            ? metric.rating
            : "needs-improvement";

        trackEvent("web_vitals", {
          name: metric.name as "FCP" | "LCP" | "CLS" | "FID" | "TTFB" | "INP",
          value: metric.value,
          rating,
        });
      }
    },
  );

  return null;
}
