#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const baseUrl = process.env.LIGHTHOUSE_BASE_URL ?? "http://localhost:3008";
const formFactor = process.env.LIGHTHOUSE_FORM_FACTOR ?? "mobile";
if (formFactor !== "mobile" && formFactor !== "desktop") {
  throw new Error("LIGHTHOUSE_FORM_FACTOR must be mobile or desktop");
}
const outputDirectory = resolve(process.env.LIGHTHOUSE_OUTPUT_DIR ?? "/tmp/anda-lighthouse");
const routes = process.argv.slice(2);
// "/" is left out on purpose: it answers 307 to a locale chosen from
// Accept-Language, so its score would belong to the destination page.
const publicRoutes = routes.length
  ? routes
  : ["/nl", "/nl/boodschap", "/nl/pilaren", "/nl/diepte", "/nl/ands", "/nl/boek", "/nl/contact", "/en"];
const summary = [];

mkdirSync(outputDirectory, { recursive: true });

for (const [index, route] of publicRoutes.entries()) {
  const url = new URL(route, baseUrl).href;
  const reportPath = resolve(
    outputDirectory,
    `${index + 1}-${route.replace(/[^a-z0-9]+/gi, "-") || "home"}.json`
  );
  const result = spawnSync(
    "npx",
    [
      "--yes",
      "lighthouse@13.5.0",
      url,
      ...(formFactor === "desktop" ? ["--preset=desktop"] : []),
      "--only-categories=performance,accessibility,best-practices,seo",
      "--output=json",
      `--output-path=${reportPath}`,
      `--chrome-flags=${process.env.LIGHTHOUSE_CHROME_FLAGS ?? "--headless"}`,
      "--quiet",
    ],
    { stdio: "inherit" }
  );
  if (result.error || result.status !== 0) {
    throw result.error ?? new Error(`Lighthouse failed for ${url} (exit ${result.status})`);
  }
  const report = JSON.parse(readFileSync(reportPath, "utf8"));
  if (report.runtimeError) throw new Error(`${url}: ${report.runtimeError.message}`);
  const row = {
    requestedUrl: url,
    formFactor,
    finalUrl: report.finalDisplayedUrl,
    redirected: url !== report.finalDisplayedUrl,
    auditStatus: url === report.finalDisplayedUrl ? "audited" : "redirected-not-audited",
    scores:
      url === report.finalDisplayedUrl
        ? Object.fromEntries(
            Object.entries(report.categories).map(([name, category]) => [
              name,
              Math.round(category.score * 100),
            ])
          )
        : null,
    lcpMs: report.audits["largest-contentful-paint"].numericValue,
    tbtMs: report.audits["total-blocking-time"].numericValue,
    cls: report.audits["cumulative-layout-shift"].numericValue,
    // The pass aims at payload (images, client JavaScript), so the transferred
    // bytes are kept next to the noisy timing metrics.
    totalByteWeight: report.audits["total-byte-weight"].numericValue,
    reportPath,
  };
  summary.push(row);
  if (row.redirected) {
    console.warn(
      `Excluded ${url}: Lighthouse reached ${row.finalUrl}; scores belong to the destination.`
    );
    process.exitCode = 1;
  }
  console.log(JSON.stringify(row));
  writeFileSync(resolve(outputDirectory, "summary.json"), JSON.stringify(summary, null, 2));
}
