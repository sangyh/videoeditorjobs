import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { activeBlogPosts, activePages, appPages, jobBoardPage, site, trustPages } from "../src/site-data.mjs";
import { defaultIntakeEndpoint, loadLocalEnv, validateIntakeEndpoint } from "./env.mjs";

const root = new URL("../", import.meta.url);
const dist = new URL("../dist/", import.meta.url);
await loadLocalEnv();

const args = process.argv.slice(2);
const requireEndpoint = args.includes("--require-endpoint") || process.env.VEJ_REQUIRE_INTAKE_ENDPOINT === "1";
const expectedEndpoint = process.env.VEJ_INTAKE_ENDPOINT || defaultIntakeEndpoint;
const errors = [];
const warnings = [];

const crawlRoutes = [
  ...activePages.map((page) => `/${page.slug ? `${page.slug}/` : ""}`),
  `/${jobBoardPage.slug}/`,
  ...appPages.map((page) => `/${page.slug}/`),
  "/blog/",
  ...activeBlogPosts.map((post) => `/blog/${post.slug}/`),
  ...trustPages.map((page) => `/${page.slug}/`),
];

const cutRoutes = [
  "/video-editor-job-brief-builder/",
  "/video-editor-portfolio-checklist/",
  "/video-editing-rate-calculator/",
  "/video-editor-community-post-generator/",
  "/video-editor-jobs-last-3-days/",
  "/on-call-travel-video-editor-jobs/",
  "/teen-video-editor-jobs/",
  "/night-shift-teen-video-editor-jobs/",
  "/french-video-editor-jobs/",
  "/post-video-editor-job/",
];

async function readRoot(...parts) {
  return readFile(new URL(parts.join("/"), root), "utf8");
}

async function readDist(...parts) {
  return readFile(join(dist.pathname, ...parts), "utf8");
}

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

function requireIncludes(text, needle, label) {
  if (!text.includes(needle)) {
    fail(`Missing ${label}`);
  }
}

function requireExcludes(text, needle, label) {
  if (text.includes(needle)) {
    fail(`Unexpected ${label}`);
  }
}

function extractEndpoint(html) {
  const match = html.match(/window\.VEJ_CONFIG\s*=\s*\{\s*intakeEndpoint:\s*"([^"]*)"/);
  return match ? match[1] : "";
}

const [
  homeHtml,
  editorHtml,
  hiringHtml,
  sitemap,
  robots,
  thanksEditorHtml,
  thanksHiringHtml,
  canonicalAppsScript,
  projectAppsScript,
  setupDoc,
  deploymentChecklist,
  launchRunbook,
  finalLaunchHandoff,
  searchConsoleHandoff,
  seoPlan,
] = await Promise.all([
  readDist("index.html"),
  readDist("editors", "index.html"),
  readDist("hire-video-editor", "index.html"),
  readDist("sitemap.xml"),
  readDist("robots.txt"),
  readDist("thanks-editor", "index.html"),
  readDist("thanks-hiring", "index.html"),
  readRoot("docs/google-sheets-apps-script.js"),
  readRoot("apps-script/Code.js"),
  readRoot("docs/google-sheets-setup.md"),
  readRoot("docs/deployment-checklist.md"),
  readRoot("docs/launch-day-runbook.md"),
  readRoot("docs/final-launch-handoff.md"),
  readRoot("docs/search-console-handoff.md"),
  readRoot("docs/seo-30-day-plan.md"),
]);

const endpoint = extractEndpoint(homeHtml);
const locCount = Array.from(sitemap.matchAll(/<loc>/g)).length;

if (locCount !== crawlRoutes.length) {
  fail(`sitemap.xml should list ${crawlRoutes.length} URLs, found ${locCount}`);
}

for (const route of crawlRoutes) {
  requireIncludes(sitemap, `<loc>${site.origin}${route}</loc>`, `sitemap route ${route}`);
}

for (const route of ["/search/", "/thanks-editor/", "/thanks-hiring/", ...cutRoutes]) {
  requireExcludes(sitemap, `<loc>${site.origin}${route}</loc>`, `sitemap excluded route ${route}`);
}

requireIncludes(robots, `Sitemap: ${site.origin}/sitemap.xml`, "robots sitemap URL");
requireIncludes(editorHtml, 'data-intake-kind="editor"', "editor intake form");
requireIncludes(hiringHtml, 'data-intake-kind="hiring"', "hiring intake form");
requireIncludes(thanksEditorHtml, '<meta name="robots" content="noindex, follow">', "editor thanks noindex");
requireIncludes(thanksHiringHtml, '<meta name="robots" content="noindex, follow">', "hiring thanks noindex");

for (const route of cutRoutes.slice(0, 4)) {
  requireExcludes(homeHtml, `href="${route}"`, `home cut route ${route}`);
}

if (canonicalAppsScript !== projectAppsScript) {
  fail("apps-script/Code.js is out of sync with docs/google-sheets-apps-script.js");
}

for (const needle of [
  "vej-2026-07-20-intake-summary",
  "function launchHealthCheck()",
  "portfolio_examples_share",
  "/part-time-video-editor-jobs/",
]) {
  requireIncludes(canonicalAppsScript, needle, `Apps Script ${needle}`);
}

if (requireEndpoint && !endpoint) {
  fail("Built site is missing window.VEJ_CONFIG.intakeEndpoint");
}

if (requireEndpoint && endpoint.includes("DEPLOYMENT_ID")) {
  fail("Built site still has the placeholder Apps Script deployment ID");
}

if (expectedEndpoint && endpoint !== expectedEndpoint) {
  fail(`Built endpoint does not match VEJ_INTAKE_ENDPOINT. Found ${endpoint || "(empty)"}`);
}

if (expectedEndpoint) {
  const validation = validateIntakeEndpoint(expectedEndpoint);
  if (!validation.ok) {
    fail(`VEJ_INTAKE_ENDPOINT is invalid: ${validation.reason}`);
  }
}

if (requireEndpoint) {
  const validation = validateIntakeEndpoint(endpoint);
  if (!validation.ok) {
    fail(`Built endpoint is invalid: ${validation.reason}`);
  }
}

if (!requireEndpoint && !endpoint) {
  warn("No intake endpoint embedded; forms will use email fallback until VEJ_INTAKE_ENDPOINT is set.");
}

for (const doc of [
  ["Google Sheets setup", setupDoc],
  ["deployment checklist", deploymentChecklist],
  ["launch runbook", launchRunbook],
  ["final launch handoff", finalLaunchHandoff],
  ["Search Console handoff", searchConsoleHandoff],
  ["SEO plan", seoPlan],
]) {
  requireIncludes(doc[1], "18 crawlable URLs", `${doc[0]} tight sitemap count`);
}

requireIncludes(searchConsoleHandoff, "Removed From Crawl", "Search Console removed-route guidance");

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      endpointConfigured: Boolean(endpoint),
      endpointRequired: requireEndpoint,
      sitemapUrls: locCount,
      appsScriptSynced: true,
      warnings,
    },
    null,
    2
  )
);
