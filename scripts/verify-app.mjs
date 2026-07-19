import { readFile } from "node:fs/promises";
import { join } from "node:path";
import {
  activeBlogPosts,
  activePages,
  appPages,
  jobBoardPage,
  site,
  trustPages,
  voiceProfilePage,
} from "../src/site-data.mjs";
import { liveJobs as externalJobs } from "../src/jobs-data.mjs";
import { sheetJobs } from "../src/sheet-jobs-data.mjs";

const dist = new URL("../dist/", import.meta.url);
const errors = [];

const liveJobs = [...sheetJobs, ...externalJobs].filter(
  (job, index, jobs) => jobs.findIndex((candidate) => candidate.sourceUrl === job.sourceUrl) === index
);

const isMarketplaceJob = (job) =>
  job.sourceType === "marketplace opportunity" || String(job.sourceUrl || "").startsWith("/");
const marketplaceSample = liveJobs.find(isMarketplaceJob);
const externalSample = liveJobs.find((job) => !isMarketplaceJob(job));

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

const jobRoutes = liveJobs.map((job) => `/jobs/${job.id}/`);

const crawlRoutes = [
  ...activePages.map((page) => `/${page.slug ? `${page.slug}/` : ""}`),
  `/${jobBoardPage.slug}/`,
  ...appPages.map((page) => `/${page.slug}/`),
  `/${voiceProfilePage.slug}/`,
  "/blog/",
  ...activeBlogPosts.map((post) => `/blog/${post.slug}/`),
  ...trustPages.map((page) => `/${page.slug}/`),
  ...jobRoutes,
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
  thanksVoiceHtml,
  voiceHtml,
  editorMarketplaceJobHtml,
  externalJobHtml,
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
  readDist("thanks-voice", "index.html"),
  readDist("voice-profile", "index.html"),
  readDist("jobs", marketplaceSample.id, "index.html"),
  readDist("jobs", externalSample.id, "index.html"),
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
requireExcludes(homeHtml, "Manual matching from real submissions", "home post-mock matching note");
requireIncludes(homeHtml, 'class="home-hero"', "home Plum and Bone hero");
requireIncludes(homeHtml, "Find editors with the right eye, or work that fits yours.", "home selected direction copy");
requireIncludes(homeHtml, 'class="home-workflow"', "home workflow navigation");
requireIncludes(homeHtml, "Any format", "home format workflow filter");
requireIncludes(homeHtml, "Any timeframe", "home turnaround workflow filter");
requireIncludes(homeHtml, "Any software", "home software workflow filter");
requireIncludes(homeHtml, "Any cadence", "home review cadence workflow filter");
requireIncludes(homeHtml, 'class="home-job-list"', "home live opportunity list");
requireIncludes(homeHtml, 'href="/jobs/"', "home jobs link");
requireIncludes(homeHtml, "Real listings with on-platform applications", "home live jobs section");
requireIncludes(homeHtml, "on-platform applications", "home application model");
requireIncludes(homeHtml, 'href="/editors/"', "home editor CTA");
requireIncludes(homeHtml, 'href="/hire-video-editor/"', "home hiring CTA");
requireExcludes(homeHtml, 'href="/post-video-editor-job/"', "home duplicate post-job CTA");
requireIncludes(homeHtml, 'href="/video-editor-community/"', "home community link");
requireExcludes(homeHtml, "Categories the feed is learning from", "home post-mock role examples");
requireExcludes(homeHtml, "Guides that support better matches", "home post-mock guide cards");
requireExcludes(homeHtml, "The few routes worth testing first", "home post-mock route grid");

requireIncludes(blogHtml, "creator teams scoping recurring work", "blog tight positioning");
requireIncludes(blogHtml, "Video editor portfolio examples", "blog portfolio examples");
requireIncludes(blogHtml, "How to hire a video editor", "blog hiring guide");
requireIncludes(communityHtml, "Video Editor Community", "community h1");
requireIncludes(communityHtml, 'href="/editors/"', "community editor CTA");
requireIncludes(communityHtml, 'href="/hire-video-editor/"', "community hiring CTA");
requireIncludes(jobsHtml, "<h1>Real video and creator-side jobs</h1>", "jobs h1");
requireIncludes(jobsHtml, "250 live opportunities", "combined jobs count");
requireIncludes(jobsHtml, "Apply on VideoEditorJobs", "on-platform application links");
requireIncludes(jobsHtml, "Apply through VideoEditorJobs", "on-platform application label");
requireIncludes(jobsHtml, 'href="/editors/?job=', "job-specific editor intake links");
for (const forbidden of ["reddit.com/r/VideoEditingJobs", "Reddit: r/VideoEditingJobs", "View original listing"]) {
  requireExcludes(homeHtml, forbidden, `home source exposure ${forbidden}`);
  requireExcludes(jobsHtml, forbidden, `jobs source exposure ${forbidden}`);
}
requireExcludes(jobsHtml, "?job=reddit-", "source-revealing job identifiers");

requireIncludes(searchHtml, '<meta name="robots" content="noindex, follow">', "search noindex");
requireIncludes(searchHtml, "site-search-input", "search input");
requireIncludes(homeHtml, '"@type":"WebSite"', "home WebSite structured data");
requireExcludes(homeHtml, '"@type":"SearchAction"', "obsolete SearchAction structured data");
requireIncludes(privacyHtml, "<h1>Privacy Policy</h1>", "privacy h1");
requireIncludes(termsHtml, "<h1>Terms</h1>", "terms h1");
requireIncludes(thanksEditorHtml, '<meta name="robots" content="noindex, follow">', "editor thanks noindex");
requireIncludes(thanksHiringHtml, '<meta name="robots" content="noindex, follow">', "hiring thanks noindex");
requireIncludes(thanksVoiceHtml, '<meta name="robots" content="noindex, follow">', "voice thanks noindex");
requireIncludes(thanksEditorHtml, voiceProfilePage.slug, "editor thanks voice CTA");

// Voice-verified profile interest page and its demand-test wiring.
requireIncludes(voiceHtml, `<h1>${voiceProfilePage.h1}</h1>`, "voice-profile h1");
requireIncludes(voiceHtml, '<meta name="robots" content="index, follow', "voice-profile indexable");
requireIncludes(voiceHtml, 'data-intake-kind="editor"', "voice-profile form routes to editors tab");
requireIncludes(voiceHtml, 'data-utm-campaign="voice_profile_interest"', "voice-profile campaign override");
requireIncludes(voiceHtml, 'data-success-path="/thanks-voice/"', "voice-profile success path");
requireIncludes(voiceHtml, 'name="consent" type="checkbox"', "voice-profile consent checkbox");
requireIncludes(voiceHtml, 'name="website"', "voice-profile honeypot");
requireIncludes(editorHtml, "utm_campaign=voice_profile_interest", "editor page voice CTA campaign");
requireIncludes(formsJs, "data-utm-campaign", "forms campaign override support");

// Per-job pages: JSON-LD, apply flow, interlinking, and no scraped-source leakage.
requireIncludes(editorMarketplaceJobHtml, '"@type":"JobPosting"', "marketplace job posting JSON-LD");
requireIncludes(editorMarketplaceJobHtml, '"directApply":true', "marketplace job directApply");
requireIncludes(editorMarketplaceJobHtml, `href="/editors/?job=${marketplaceSample.id}"`, "marketplace job on-platform apply");
requireIncludes(editorMarketplaceJobHtml, 'href="/jobs/"', "marketplace job back link");
requireIncludes(editorMarketplaceJobHtml, "voice-profile", "marketplace job voice CTA");
requireIncludes(externalJobHtml, '"@type":"JobPosting"', "external job posting JSON-LD");
requireIncludes(externalJobHtml, 'rel="nofollow noopener"', "external job attributed link-out");
requireIncludes(externalJobHtml, `href="${externalSample.sourceUrl}"`, "external job source URL");

for (const forbidden of ["reddit.com/r/VideoEditingJobs", "Reddit: r/VideoEditingJobs", "View original listing"]) {
  requireExcludes(editorMarketplaceJobHtml, forbidden, `marketplace job source exposure ${forbidden}`);
  requireExcludes(externalJobHtml, forbidden, `external job source exposure ${forbidden}`);
  requireExcludes(voiceHtml, forbidden, `voice-profile source exposure ${forbidden}`);
}
requireExcludes(editorMarketplaceJobHtml, "marketplace opportunity", "marketplace job source-type leak");
requireExcludes(editorMarketplaceJobHtml, "?job=reddit-", "marketplace job source-revealing identifier");

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
  "vej-2026-07-14-onsite-applications",
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
