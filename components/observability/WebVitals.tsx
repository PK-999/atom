"use client";

import { useReportWebVitals } from "next/web-vitals";
import { trackEvent } from "@/lib/analytics/tracker";

export function WebVitals() {
  useReportWebVitals(
    (metric: { name: string; value: number; rating: string }) => {
      // Only track major core web vitals
      if (["FCP", "LCP", "CLS", "FID", "TTFB"].includes(metric.name)) {
        trackEvent("web_vitals", {
          name: metric.name,
          value: metric.value,
          rating: metric.rating,
        });
      }
    },
  );

  return null;
}
