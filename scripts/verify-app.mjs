import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { activeBlogPosts, activePages, appPages, jobBoardPage, site, trustPages } from "../src/site-data.mjs";

const dist = new URL("../dist/", import.meta.url);
const errors = [];

async function readDist(...parts) {
  return readFile(join(dist.pathname, ...parts), "utf8");
}

async function readRoot(path) {
  return readFile(new URL(`../${path}`, import.meta.url), "utf8");
}

function requireIncludes(html, needle, label) {
  if (!html.includes(needle)) {
    errors.push(`Missing ${label}`);
  }
}

function requireExcludes(html, needle, label) {
  if (html.includes(needle)) {
    errors.push(`Unexpected ${label}`);
  }
}

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
  "/video-editor-jobs-nyc/",
  "/video-editor-jobs-manhattan/",
  "/post-video-editor-job/",
];

const [
  homeHtml,
  editorHtml,
  hiringHtml,
  jobsHtml,
  blogHtml,
  communityHtml,
  searchHtml,
  privacyHtml,
  termsHtml,
  thanksEditorHtml,
  thanksHiringHtml,
  sitemap,
  robots,
  formsJs,
  canonicalAppsScript,
  projectAppsScript,
  searchConsoleHandoff,
  deploymentChecklist,
  seoPlan,
  finalLaunchHandoff,
  packageJson,
] = await Promise.all([
  readDist("index.html"),
  readDist("editors", "index.html"),
  readDist("hire-video-editor", "index.html"),
  readDist("jobs", "index.html"),
  readDist("blog", "index.html"),
  readDist("video-editor-community", "index.html"),
  readDist("search", "index.html"),
  readDist("privacy", "index.html"),
  readDist("terms", "index.html"),
  readDist("thanks-editor", "index.html"),
  readDist("thanks-hiring", "index.html"),
  readDist("sitemap.xml"),
  readDist("robots.txt"),
  readDist("assets", "forms.js"),
  readRoot("docs/google-sheets-apps-script.js"),
  readRoot("apps-script/Code.js"),
  readRoot("docs/search-console-handoff.md"),
  readRoot("docs/deployment-checklist.md"),
  readRoot("docs/seo-30-day-plan.md"),
  readRoot("docs/final-launch-handoff.md"),
  readRoot("package.json"),
]);

requireIncludes(editorHtml, 'form class="intake-form" data-intake-kind="editor"', "editor intake form");
requireIncludes(editorHtml, 'name="portfolio_url"', "editor portfolio field");
requireIncludes(editorHtml, 'name="primary_fit"', "editor primary fit field");
requireIncludes(editorHtml, 'name="weekly_capacity"', "editor weekly capacity field");
requireIncludes(editorHtml, 'name="consent" type="checkbox"', "editor consent checkbox");

requireIncludes(hiringHtml, 'form class="intake-form hiring-form" data-intake-kind="hiring"', "hiring intake form");
requireIncludes(hiringHtml, 'name="budget"', "hiring budget field");
requireIncludes(hiringHtml, 'name="deliverables"', "hiring deliverables field");
requireIncludes(hiringHtml, 'name="revision_process"', "hiring revision process field");
requireIncludes(hiringHtml, 'name="reference_urls"', "hiring reference URLs field");
requireIncludes(hiringHtml, 'name="brief"', "hiring brief field");

requireIncludes(homeHtml, "creator teams", "home creator-team positioning");
requireIncludes(homeHtml, "Manual matching from real submissions", "home manual matching signal");
requireIncludes(homeHtml, 'href="/jobs/"', "home jobs link");
requireIncludes(homeHtml, "Real listings with dates and source links", "home live jobs section");
requireIncludes(homeHtml, 'href="/editors/"', "home editor CTA");
requireIncludes(homeHtml, 'href="/hire-video-editor/"', "home hiring CTA");
requireExcludes(homeHtml, 'href="/post-video-editor-job/"', "home duplicate post-job CTA");
requireIncludes(homeHtml, 'href="/video-editor-community/"', "home community link");

requireIncludes(blogHtml, "creator teams scoping recurring work", "blog tight positioning");
requireIncludes(blogHtml, "Video editor portfolio examples", "blog portfolio examples");
requireIncludes(blogHtml, "How to hire a video editor", "blog hiring guide");
requireIncludes(communityHtml, "Video Editor Community", "community h1");
requireIncludes(communityHtml, 'href="/editors/"', "community editor CTA");
requireIncludes(communityHtml, 'href="/hire-video-editor/"', "community hiring CTA");
requireIncludes(jobsHtml, "<h1>Real video and creator-side jobs</h1>", "jobs h1");
requireIncludes(jobsHtml, "source-attributed jobs", "jobs count summary");
requireIncludes(jobsHtml, "250 source-attributed jobs", "combined jobs count");
requireIncludes(jobsHtml, "Reddit: r/VideoEditingJobs", "Reddit jobs source label");
requireIncludes(jobsHtml, "View original listing", "jobs outbound links");

requireIncludes(searchHtml, '<meta name="robots" content="noindex, follow">', "search noindex");
requireIncludes(searchHtml, "site-search-input", "search input");
requireIncludes(privacyHtml, "<h1>Privacy Policy</h1>", "privacy h1");
requireIncludes(termsHtml, "<h1>Terms</h1>", "terms h1");
requireIncludes(thanksEditorHtml, '<meta name="robots" content="noindex, follow">', "editor thanks noindex");
requireIncludes(thanksHiringHtml, '<meta name="robots" content="noindex, follow">', "hiring thanks noindex");

for (const route of crawlRoutes) {
  requireIncludes(sitemap, `<loc>${site.origin}${route}</loc>`, `sitemap route ${route}`);
}

const locCount = Array.from(sitemap.matchAll(/<loc>/g)).length;
if (locCount !== crawlRoutes.length) {
  errors.push(`sitemap.xml should list ${crawlRoutes.length} URLs, found ${locCount}`);
}

for (const route of ["/search/", "/thanks-editor/", "/thanks-hiring/", ...cutRoutes]) {
  requireExcludes(sitemap, `<loc>${site.origin}${route}</loc>`, `sitemap route ${route}`);
}

for (const route of cutRoutes) {
  requireExcludes(homeHtml, `href="${route}"`, `home link ${route}`);
  requireExcludes(blogHtml, `href="${route}"`, `blog link ${route}`);
  requireExcludes(searchHtml, `"url":"${route}"`, `search index route ${route}`);
}

requireIncludes(robots, `Sitemap: ${site.origin}/sitemap.xml`, "robots sitemap URL");

for (const needle of [
  "submission_id",
  "consent_at",
  "utm_source",
  "utm_campaign",
  "fetch(endpoint",
  "mode: \"no-cors\"",
  "localStorage",
  "restoreDraft",
  "writeDraft",
]) {
  requireIncludes(formsJs, needle, `forms.js ${needle}`);
}

for (const needle of ["briefBuilderStorageKey", "portfolioChecklistStorageKey", "Brief builder draft loaded", "Portfolio checklist draft loaded"]) {
  requireExcludes(formsJs, needle, `forms.js stale tool handoff ${needle}`);
}

if (canonicalAppsScript !== projectAppsScript) {
  errors.push("apps-script/Code.js is out of sync with docs/google-sheets-apps-script.js");
}

for (const needle of [
  "vej-2026-07-14-public-jobs-200",
  "portfolio_examples_share",
  "/part-time-video-editor-jobs/",
  "/blog/freelance-video-editor-rates/",
  "function launchHealthCheck()",
]) {
  requireIncludes(canonicalAppsScript, needle, `Apps Script ${needle}`);
}

for (const route of cutRoutes) {
  requireExcludes(canonicalAppsScript, route, `Apps Script Source Summary cut route ${route}`);
}

for (const doc of [
  ["search console handoff", searchConsoleHandoff],
  ["deployment checklist", deploymentChecklist],
  ["SEO 30-day plan", seoPlan],
  ["final launch handoff", finalLaunchHandoff],
]) {
  requireIncludes(doc[1], "18 crawlable URLs", `${doc[0]} tight sitemap count`);
}

requireIncludes(searchConsoleHandoff, "Removed From Crawl", "search console removed-route guidance");

for (const needle of ['"verify:app"', '"smoke:live"', '"launch:ready"']) {
  requireIncludes(packageJson, needle, `package ${needle}`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Verified tight intake app, ${crawlRoutes.length}-URL sitemap, noindex utility pages, and cut-route exclusions`);
