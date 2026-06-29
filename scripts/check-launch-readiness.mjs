import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { appPages, blogPosts, pages, toolPages, trustPages } from "../src/site-data.mjs";
import { loadLocalEnv, validateIntakeEndpoint } from "./env.mjs";

const root = new URL("../", import.meta.url);
const dist = new URL("../dist/", import.meta.url);
await loadLocalEnv();
const args = process.argv.slice(2);
const requireEndpoint = args.includes("--require-endpoint") || process.env.VEJ_REQUIRE_INTAKE_ENDPOINT === "1";
const expectedEndpoint = process.env.VEJ_INTAKE_ENDPOINT || "";
const expectedSitemapUrls = pages.length + appPages.length + toolPages.length + blogPosts.length + trustPages.length + 2;
const errors = [];
const warnings = [];

async function readRoot(...parts) {
  return readFile(new URL(parts.join("/"), root), "utf8");
}

async function readDist(...parts) {
  return readFile(join(dist.pathname, ...parts), "utf8");
}

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
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

function extractEndpoint(html) {
  const match = html.match(/window\.VEJ_CONFIG\s*=\s*\{\s*intakeEndpoint:\s*"([^"]*)"/);
  return match ? match[1] : "";
}

const [
  homeHtml,
  editorHtml,
  hiringHtml,
  thanksEditorHtml,
  thanksHiringHtml,
  sitemap,
  robots,
  packageJsonText,
  appsScript,
  appsScriptProjectCode,
  appsScriptManifestText,
  vercelJsonText,
  setupDoc,
  deploymentChecklist,
  launchRunbook,
  finalLaunchHandoff,
  operatorEmailTemplates,
  communityPostingCalendar,
  searchConsoleHandoff,
  seoThirtyDayPlan,
] = await Promise.all([
  readDist("index.html"),
  readDist("editors", "index.html"),
  readDist("hire-video-editor", "index.html"),
  readDist("thanks-editor", "index.html"),
  readDist("thanks-hiring", "index.html"),
  readDist("sitemap.xml"),
  readDist("robots.txt"),
  readRoot("package.json"),
  readRoot("docs/google-sheets-apps-script.js"),
  readRoot("apps-script/Code.js"),
  readRoot("apps-script/appsscript.json"),
  readRoot("vercel.json"),
  readRoot("docs/google-sheets-setup.md"),
  readRoot("docs/deployment-checklist.md"),
  readRoot("docs/launch-day-runbook.md"),
  readRoot("docs/final-launch-handoff.md"),
  readRoot("docs/operator-email-templates.md"),
  readRoot("docs/community-posting-calendar.md"),
  readRoot("docs/search-console-handoff.md"),
  readRoot("docs/seo-30-day-plan.md"),
]);

const packageJson = JSON.parse(packageJsonText);
const appsScriptManifest = JSON.parse(appsScriptManifestText);
const vercelJson = JSON.parse(vercelJsonText);
const endpoint = extractEndpoint(homeHtml);
const locCount = Array.from(sitemap.matchAll(/<loc>/g)).length;

if (locCount !== expectedSitemapUrls) {
  fail(`sitemap.xml should list ${expectedSitemapUrls} URLs, found ${locCount}`);
}

for (const route of [
  "/editors/",
  "/hire-video-editor/",
  "/post-video-editor-job/",
  "/video-editor-job-brief-builder/",
  "/video-editor-portfolio-checklist/",
  "/video-editing-rate-calculator/",
  "/video-editor-community-post-generator/",
  "/blog/",
  "/video-editor-community/",
  "/video-editor-jobs-last-3-days/",
  "/remote-video-editing-jobs/",
  "/night-shift-teen-video-editor-jobs/",
  "/french-video-editor-jobs/",
  "/thanks-editor/",
  "/thanks-hiring/",
]) {
  const path = route === "/" ? ["index.html"] : route.replace(/^\/|\/$/g, "").split("/").concat("index.html");
  if (!(await exists(join(dist.pathname, ...path)))) {
    fail(`Missing generated route ${route}`);
  }
}

for (const route of [
  "/editors/",
  "/hire-video-editor/",
  "/post-video-editor-job/",
  "/video-editor-job-brief-builder/",
  "/video-editor-portfolio-checklist/",
  "/video-editing-rate-calculator/",
  "/video-editor-community-post-generator/",
  "/blog/",
  "/video-editor-community/",
  "/remote-video-editing-jobs/",
  "/night-shift-teen-video-editor-jobs/",
  "/french-video-editor-jobs/",
]) {
  requireIncludes(sitemap, `<loc>https://videoeditorjobs.com${route}</loc>`, `sitemap route ${route}`);
}

for (const route of ["/thanks-editor/", "/thanks-hiring/"]) {
  if (sitemap.includes(`<loc>https://videoeditorjobs.com${route}</loc>`)) {
    fail(`Sitemap should not include noindex utility route ${route}`);
  }
}

requireIncludes(robots, "Sitemap: https://videoeditorjobs.com/sitemap.xml", "robots sitemap URL");
requireIncludes(editorHtml, 'data-intake-kind="editor"', "editor intake form");
requireIncludes(hiringHtml, 'data-intake-kind="hiring"', "hiring intake form");
requireIncludes(thanksEditorHtml, '<meta name="robots" content="noindex, follow">', "editor thanks noindex");
requireIncludes(thanksHiringHtml, '<meta name="robots" content="noindex, follow">', "hiring thanks noindex");

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

for (const scriptName of [
  "check",
  "vercel-build",
  "verify:apps-script",
  "smoke:intake",
  "smoke:live",
  "launch:ready",
  "sync:apps-script",
  "configure:endpoint",
  "prepare:apps-script",
]) {
  if (!packageJson.scripts?.[scriptName]) {
    fail(`package.json missing ${scriptName} script`);
  }
}

if (appsScriptProjectCode !== appsScript) {
  fail("apps-script/Code.js is out of sync with docs/google-sheets-apps-script.js");
}

for (const needle of [
  "LockService.getScriptLock",
  "function triageSubmission(payload, kind)",
  "function sendSubmitterConfirmation(payload)",
  "source_bucket",
  "lead_score",
  "review_reason",
  "confirmation",
  "MailApp.sendEmail",
  "COMMUNITY_POST_HEADERS",
  "COMMUNITY_POST_SEEDS",
  "function launchHealthCheck()",
  "function seedCommunityPosts()",
  "function cleanupTestSubmissions()",
  "Community Posts",
  "needs_reply",
]) {
  requireIncludes(appsScript, needle, `Apps Script ${needle}`);
}

if (appsScriptManifest.webapp?.access !== "ANYONE_ANONYMOUS") {
  fail("Apps Script manifest webapp access should be ANYONE_ANONYMOUS");
}

if (!appsScriptManifest.oauthScopes?.includes("https://www.googleapis.com/auth/script.send_mail")) {
  fail("Apps Script manifest missing send_mail scope");
}

if (vercelJsonText.includes('"X-Robots-Tag"') && vercelJsonText.includes("index, follow")) {
  fail("vercel.json must not set a global X-Robots-Tag: index, follow header");
}

for (const needle of [
  "VEJ_INTAKE_ENDPOINT",
  "npm run configure:endpoint",
  "npm run smoke:intake",
  "triage.source_bucket",
  "confirmation.sent",
  "Community Posts",
  "planned community posts",
  "seedCommunityPosts()",
  "launchHealthCheck()",
  "suggestMatches()",
  "cleanupTestSubmissions()",
]) {
  requireIncludes(setupDoc, needle, `Google Sheets setup doc ${needle}`);
}

for (const needle of ["npm run smoke:live", "npm run smoke:intake", "50 crawlable URLs", "Community Posts", "seedCommunityPosts()"]) {
  requireIncludes(launchRunbook, needle, `launch runbook ${needle}`);
}

for (const needle of ["docs/search-console-handoff.md", "docs/seo-30-day-plan.md", "docs/community-posting-calendar.md", "Search Console"]) {
  requireIncludes(launchRunbook, needle, `launch runbook ${needle}`);
}

for (const needle of [
  "Community Posting Calendar",
  "Week 1",
  "Week 2",
  "Community Posts Rows To Seed",
  "cal-reddit-editor-fields-001",
  "cal-reddit-youtube-brief-001",
  "https://videoeditorjobs.com/blog/video-editor-portfolio-examples/",
  "https://videoeditorjobs.com/blog/how-to-price-video-editing-work/",
  "https://videoeditorjobs.com/blog/youtube-video-editor-job-description/",
  "utm_source",
  "utm_campaign",
]) {
  requireIncludes(communityPostingCalendar, needle, `community posting calendar ${needle}`);
}

for (const needle of ["npm run launch:ready", "npm run smoke:live", "VEJ_INTAKE_ENDPOINT", "npm run configure:endpoint"]) {
  requireIncludes(deploymentChecklist, needle, `deployment checklist ${needle}`);
}

for (const needle of ["docs/search-console-handoff.md", "docs/seo-30-day-plan.md", "URL Inspection"]) {
  requireIncludes(deploymentChecklist, needle, `deployment checklist ${needle}`);
}

for (const needle of [
  "Editors!AW1:AY1",
  "Hiring Requests!AW1:AY1",
  "source_bucket",
  "lead_score",
  "review_reason",
  "fresh_jobs_share",
  "VEJ_INTAKE_ENDPOINT",
  "npm run configure:endpoint",
  "npm run smoke:intake",
  "Community Posts",
  "seedCommunityPosts()",
  "launchHealthCheck()",
  "suggestMatches()",
  "cleanupTestSubmissions()",
]) {
  requireIncludes(finalLaunchHandoff, needle, `final launch handoff ${needle}`);
}

for (const needle of [
  "docs/search-console-handoff.md",
  "docs/seo-30-day-plan.md",
  "docs/community-posting-calendar.md",
  "https://videoeditorjobs.com/sitemap.xml",
]) {
  requireIncludes(finalLaunchHandoff, needle, `final launch handoff ${needle}`);
}

for (const needle of [
  "Operator Email Templates",
  "Editor Follow-Up: Strong Profile",
  "Editor Follow-Up: Missing Portfolio Or Details",
  "Hiring Follow-Up: Brief Needs More Detail",
  "Hiring Follow-Up: Usable Brief",
  "Match Intro",
  "Not A Fit",
  "Matches.status = intro_sent",
  "suggestMatches()",
]) {
  requireIncludes(operatorEmailTemplates, needle, `operator email templates ${needle}`);
}

for (const needle of [
  "Search Console Handoff",
  "https://videoeditorjobs.com/sitemap.xml",
  "50 crawlable URLs",
  "URL Inspection Queue",
  "/video-editor-job-brief-builder/",
  "/video-editor-portfolio-checklist/",
  "/video-editing-rate-calculator/",
  "/video-editor-community-post-generator/",
  "/video-editor-jobs-last-3-days/",
  "/on-call-travel-video-editor-jobs/",
  "/teen-video-editor-jobs/",
  "/remote-video-editing-jobs/",
  "/night-shift-teen-video-editor-jobs/",
  "/french-video-editor-jobs/",
  "Search Console queries",
]) {
  requireIncludes(searchConsoleHandoff, needle, `search console handoff ${needle}`);
}

for (const needle of [
  "SEO 30-Day Plan",
  "Week 1: Launch And Indexing",
  "Week 2: Query Review",
  "Week 3: Publish From Evidence",
  "Week 4: Conversion Review",
  "utm_source",
  "utm_campaign",
  "page_path",
  "lead_score",
  "review_reason",
]) {
  requireIncludes(seoThirtyDayPlan, needle, `SEO 30-day plan ${needle}`);
}

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
