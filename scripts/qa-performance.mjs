import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
const base = process.env.ATOM_QA_URL || "http://127.0.0.1:3104";
const browser = await chromium.launch();
const results = [];
for (let run = 1; run <= 3; run++) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.addInitScript(() => {
    window.__atomVitals = { lcp: 0, cls: 0 };
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries())
        window.__atomVitals.lcp = entry.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries())
        if (!entry.hadRecentInput) window.__atomVitals.cls += entry.value;
    }).observe({ type: "layout-shift", buffered: true });
  });
  const cdp = await context.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 150,
    downloadThroughput: 200000,
    uploadThroughput: 93750,
  });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await page.goto(base, { waitUntil: "networkidle" });
  results.push({
    run,
    ...(await page.evaluate(() => ({
      ...window.__atomVitals,
      transferredBytes: performance
        .getEntriesByType("resource")
        .reduce((sum, entry) => sum + entry.transferSize, 0),
    }))),
  });
  await context.close();
}
await mkdir("artifacts/experience", { recursive: true });
await writeFile(
  "artifacts/experience/performance.json",
  JSON.stringify(
    {
      base,
      conditions:
        "Chromium, cold cache, 390×844, 150ms latency, 1.6Mbps down, 4× CPU throttle; local production server, not field data.",
      results,
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(results));
await browser.close();
