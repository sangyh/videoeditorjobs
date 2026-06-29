import { readFile } from "node:fs/promises";
import { join } from "node:path";

const dist = new URL("../dist/", import.meta.url);
const errors = [];

async function readDist(...parts) {
  return readFile(join(dist.pathname, ...parts), "utf8");
}

function requireIncludes(html, needle, label) {
  if (!html.includes(needle)) {
    errors.push(`Missing ${label}`);
  }
}

function countMatches(html, pattern) {
  return Array.from(html.matchAll(pattern)).length;
}

const editorHtml = await readDist("editors", "index.html");
const hiringHtml = await readDist("hire-video-editor", "index.html");
const postJobHtml = await readDist("post-video-editor-job", "index.html");
const briefBuilderHtml = await readDist("video-editor-job-brief-builder", "index.html");
const portfolioChecklistHtml = await readDist("video-editor-portfolio-checklist", "index.html");
const rateCalculatorHtml = await readDist("video-editing-rate-calculator", "index.html");
const communityPostGeneratorHtml = await readDist("video-editor-community-post-generator", "index.html");
const homeHtml = await readDist("index.html");
const searchHtml = await readDist("search", "index.html");
const privacyHtml = await readDist("privacy", "index.html");
const termsHtml = await readDist("terms", "index.html");
const thanksEditorHtml = await readDist("thanks-editor", "index.html");
const thanksHiringHtml = await readDist("thanks-hiring", "index.html");
const sitemap = await readDist("sitemap.xml");
const rss = await readDist("rss.xml");
const formsJs = await readDist("assets", "forms.js");
const appsScript = await readFile(new URL("../docs/google-sheets-apps-script.js", import.meta.url), "utf8");
const appsScriptProjectCode = await readFile(new URL("../apps-script/Code.js", import.meta.url), "utf8");
const appsScriptManifest = await readFile(new URL("../apps-script/appsscript.json", import.meta.url), "utf8");
const vercelJson = await readFile(new URL("../vercel.json", import.meta.url), "utf8");
const packageJson = await readFile(new URL("../package.json", import.meta.url), "utf8");
const smokeScript = await readFile(new URL("../scripts/smoke-intake-endpoint.mjs", import.meta.url), "utf8");
const liveSmokeScript = await readFile(new URL("../scripts/smoke-live-site.mjs", import.meta.url), "utf8");
const readinessScript = await readFile(new URL("../scripts/check-launch-readiness.mjs", import.meta.url), "utf8");
const configureEndpointScript = await readFile(new URL("../scripts/configure-intake-endpoint.mjs", import.meta.url), "utf8");
const envScript = await readFile(new URL("../scripts/env.mjs", import.meta.url), "utf8");
const gitignore = await readFile(new URL("../.gitignore", import.meta.url), "utf8");
const setupDoc = await readFile(new URL("../docs/google-sheets-setup.md", import.meta.url), "utf8");
const launchRunbook = await readFile(new URL("../docs/launch-day-runbook.md", import.meta.url), "utf8");
const communityLaunchKit = await readFile(new URL("../docs/community-launch-kit.md", import.meta.url), "utf8");
const finalLaunchHandoff = await readFile(new URL("../docs/final-launch-handoff.md", import.meta.url), "utf8");
const operatorEmailTemplates = await readFile(new URL("../docs/operator-email-templates.md", import.meta.url), "utf8");
const searchConsoleHandoff = await readFile(new URL("../docs/search-console-handoff.md", import.meta.url), "utf8");
const seoThirtyDayPlan = await readFile(new URL("../docs/seo-30-day-plan.md", import.meta.url), "utf8");

requireIncludes(editorHtml, 'form class="intake-form" data-intake-kind="editor"', "editor intake form");
requireIncludes(editorHtml, 'data-success-path="/thanks-editor/"', "editor success path");
requireIncludes(editorHtml, 'name="portfolio_url"', "editor portfolio field");
requireIncludes(editorHtml, 'name="primary_fit"', "editor primary fit field");
requireIncludes(editorHtml, 'name="experience_level"', "editor experience level field");
requireIncludes(editorHtml, 'name="work_preference"', "editor work preference field");
requireIncludes(editorHtml, 'name="weekly_capacity"', "editor weekly capacity field");
requireIncludes(editorHtml, 'name="turnaround_time"', "editor turnaround time field");
requireIncludes(editorHtml, 'name="consent" type="checkbox"', "editor consent checkbox");
requireIncludes(editorHtml, 'href="/terms/"', "editor terms link");
requireIncludes(editorHtml, 'href="/privacy/"', "editor privacy link");
requireIncludes(editorHtml, 'name="website"', "editor honeypot");
requireIncludes(editorHtml, 'class="form-status" role="status"', "editor live status");

requireIncludes(hiringHtml, 'form class="intake-form hiring-form" data-intake-kind="hiring"', "hiring intake form");
requireIncludes(hiringHtml, 'data-success-path="/thanks-hiring/"', "hiring success path");
requireIncludes(hiringHtml, 'name="role_type"', "hiring role type field");
requireIncludes(hiringHtml, 'name="brief"', "hiring brief field");
requireIncludes(hiringHtml, 'name="budget"', "hiring budget field");
requireIncludes(hiringHtml, 'name="project_scope"', "hiring project scope field");
requireIncludes(hiringHtml, 'name="deliverables"', "hiring deliverables field");
requireIncludes(hiringHtml, 'name="footage_volume"', "hiring footage volume field");
requireIncludes(hiringHtml, 'name="revision_process"', "hiring revision process field");
requireIncludes(hiringHtml, 'name="reference_urls"', "hiring reference URLs field");
requireIncludes(hiringHtml, 'name="consent" type="checkbox"', "hiring consent checkbox");
requireIncludes(hiringHtml, 'href="/terms/"', "hiring terms link");
requireIncludes(hiringHtml, 'href="/privacy/"', "hiring privacy link");
requireIncludes(hiringHtml, 'class="form-status" role="status"', "hiring live status");

requireIncludes(postJobHtml, 'form class="intake-form hiring-form" data-intake-kind="hiring"', "post job hiring intake form");
requireIncludes(postJobHtml, "<h1>Post a video editor job</h1>", "post job h1");
requireIncludes(postJobHtml, 'data-success-path="/thanks-hiring/"', "post job success path");
requireIncludes(postJobHtml, 'name="brief"', "post job brief field");
requireIncludes(postJobHtml, 'name="consent" type="checkbox"', "post job consent checkbox");

requireIncludes(briefBuilderHtml, "<h1>Video Editor Job Brief Builder</h1>", "brief builder h1");
requireIncludes(briefBuilderHtml, 'id="brief-builder-form"', "brief builder form");
requireIncludes(briefBuilderHtml, 'id="brief-score"', "brief builder score");
requireIncludes(briefBuilderHtml, "vej:brief-builder:hiring", "brief builder storage key");
requireIncludes(briefBuilderHtml, "utm_campaign=brief_builder", "brief builder campaign link");
requireIncludes(briefBuilderHtml, "SoftwareApplication", "brief builder schema");
requireIncludes(briefBuilderHtml, 'href="/blog/video-editor-job-description-template/"', "brief builder template link");

requireIncludes(portfolioChecklistHtml, "<h1>Video Editor Portfolio Checklist</h1>", "portfolio checklist h1");
requireIncludes(portfolioChecklistHtml, 'id="portfolio-checklist-form"', "portfolio checklist form");
requireIncludes(portfolioChecklistHtml, 'id="portfolio-score"', "portfolio checklist score");
requireIncludes(portfolioChecklistHtml, "vej:portfolio-checklist:editor", "portfolio checklist storage key");
requireIncludes(portfolioChecklistHtml, "utm_campaign=portfolio_checklist", "portfolio checklist campaign link");
requireIncludes(portfolioChecklistHtml, "SoftwareApplication", "portfolio checklist schema");
requireIncludes(portfolioChecklistHtml, 'href="/blog/video-editor-portfolio-examples/"', "portfolio checklist examples link");

requireIncludes(rateCalculatorHtml, "<h1>Video Editing Rate Calculator</h1>", "rate calculator h1");
requireIncludes(rateCalculatorHtml, 'id="rate-calculator-form"', "rate calculator form");
requireIncludes(rateCalculatorHtml, 'id="rate-estimate"', "rate calculator estimate");
requireIncludes(rateCalculatorHtml, "utm_campaign=rate_calculator", "rate calculator campaign link");
requireIncludes(rateCalculatorHtml, "SoftwareApplication", "rate calculator schema");
requireIncludes(rateCalculatorHtml, 'href="/video-editor-job-brief-builder/?', "rate calculator hiring link");

requireIncludes(communityPostGeneratorHtml, "<h1>Video Editor Community Post Generator</h1>", "community post generator h1");
requireIncludes(communityPostGeneratorHtml, 'id="community-post-form"', "community post generator form");
requireIncludes(communityPostGeneratorHtml, "community_post_generator", "community post generator campaign");
requireIncludes(communityPostGeneratorHtml, 'id="community-target-link"', "community post generator target link");
requireIncludes(communityPostGeneratorHtml, "SoftwareApplication", "community post generator schema");

requireIncludes(homeHtml, 'href="/editors/"', "home editor CTA");
requireIncludes(homeHtml, 'href="/hire-video-editor/"', "home hiring CTA");
requireIncludes(homeHtml, 'href="/post-video-editor-job/"', "home post job CTA");
requireIncludes(homeHtml, 'href="/video-editor-job-brief-builder/"', "home brief builder link");
requireIncludes(homeHtml, 'href="/video-editor-portfolio-checklist/"', "home portfolio checklist link");
requireIncludes(homeHtml, 'href="/video-editing-rate-calculator/"', "home rate calculator link");
requireIncludes(homeHtml, 'href="/video-editor-community-post-generator/"', "home community post generator link");
requireIncludes(homeHtml, 'href="/video-editor-community/"', "home community nav link");
requireIncludes(homeHtml, 'href="/blog/"', "home blog CTA");
requireIncludes(homeHtml, 'href="/search/"', "footer search link");
requireIncludes(homeHtml, 'href="/work-from-home-video-editor-jobs/"', "home work-from-home category link");
requireIncludes(homeHtml, 'href="/travel-video-editor-jobs/"', "home travel category link");
requireIncludes(homeHtml, 'href="/night-shift-video-editor-jobs/"', "home night-shift category link");
requireIncludes(homeHtml, 'href="/student-video-editor-jobs/"', "home student category link");
requireIncludes(homeHtml, 'href="/new-video-editor-jobs/"', "home new jobs category link");
requireIncludes(homeHtml, 'href="/privacy/"', "footer privacy link");
requireIncludes(homeHtml, 'href="/terms/"', "footer terms link");
requireIncludes(homeHtml, 'href="/rss.xml"', "footer RSS link");
requireIncludes(homeHtml, 'class="header-actions"', "header two-sided actions");
requireIncludes(homeHtml, 'class="header-cta post"', "header post job CTA");
requireIncludes(privacyHtml, "<h1>Privacy Policy</h1>", "privacy h1");
requireIncludes(privacyHtml, "Campaign parameters", "privacy campaign attribution disclosure");
requireIncludes(privacyHtml, "Source attribution stored in local storage", "privacy local attribution disclosure");
requireIncludes(termsHtml, "<h1>Terms</h1>", "terms h1");
requireIncludes(searchHtml, "<h1>Search Video Editor Jobs</h1>", "search h1");
requireIncludes(searchHtml, "site-search-input", "search input");
requireIncludes(searchHtml, "searchIndex", "search index");
requireIncludes(thanksEditorHtml, '<meta name="robots" content="noindex, follow">', "editor thanks noindex");
requireIncludes(thanksEditorHtml, "<h1>You are on the editor list</h1>", "editor thanks h1");
requireIncludes(thanksEditorHtml, "utm_campaign=editor_invite", "editor thanks referral link");
requireIncludes(thanksEditorHtml, "utm_campaign=hiring_invite", "editor thanks hiring referral link");
requireIncludes(thanksEditorHtml, "utm_campaign=fresh_jobs_share", "editor thanks fresh jobs referral link");
requireIncludes(thanksEditorHtml, "utm_campaign=early_career_share", "editor thanks early career referral link");
requireIncludes(thanksEditorHtml, "utm_campaign=travel_editor_share", "editor thanks travel referral link");
requireIncludes(thanksEditorHtml, "share-card", "editor thanks share cards");
requireIncludes(thanksHiringHtml, '<meta name="robots" content="noindex, follow">', "hiring thanks noindex");
requireIncludes(thanksHiringHtml, "<h1>Your hiring brief is in</h1>", "hiring thanks h1");
requireIncludes(thanksHiringHtml, "utm_campaign=repeat_hiring_brief", "hiring thanks repeat brief referral link");
requireIncludes(thanksHiringHtml, "utm_campaign=hiring_resource_share", "hiring thanks resource referral link");
requireIncludes(thanksHiringHtml, "utm_campaign=job_template_share", "hiring thanks job template referral link");
requireIncludes(thanksHiringHtml, "utm_campaign=travel_hiring_share", "hiring thanks travel referral link");
requireIncludes(thanksHiringHtml, "utm_campaign=community_share", "hiring thanks community referral link");
requireIncludes(thanksHiringHtml, "share-card", "hiring thanks share cards");
requireIncludes(rss, "<rss version=\"2.0\">", "rss document");
requireIncludes(rss, "How to Hire a Video Editor", "rss blog item");

for (const route of [
  "/editors/",
  "/hire-video-editor/",
  "/post-video-editor-job/",
  "/video-editor-job-brief-builder/",
  "/video-editor-portfolio-checklist/",
  "/video-editing-rate-calculator/",
  "/video-editor-community-post-generator/",
  "/blog/",
  "/search/",
  "/video-editor-jobs-near-me/",
  "/work-from-home-video-editor-jobs/",
  "/remote-video-editing-jobs/",
  "/travel-video-editor-jobs/",
  "/on-call-travel-video-editor-jobs/",
  "/night-shift-video-editor-jobs/",
  "/night-shift-teen-video-editor-jobs/",
  "/student-video-editor-jobs/",
  "/teen-video-editor-jobs/",
  "/new-video-editor-jobs/",
  "/video-editor-jobs-last-3-days/",
  "/video-editor-community/",
  "/assistant-video-editor-jobs/",
  "/video-editor-jobs-nyc/",
  "/video-editor-jobs-manhattan/",
  "/privacy/",
  "/terms/",
]) {
  requireIncludes(sitemap, `<loc>https://videoeditorjobs.com${route}</loc>`, `sitemap route ${route}`);
}

for (const route of ["/thanks-editor/", "/thanks-hiring/"]) {
  if (sitemap.includes(`<loc>https://videoeditorjobs.com${route}</loc>`)) {
    errors.push(`Sitemap should not include noindex utility route ${route}`);
  }
}

for (const route of [
  "blog/how-to-find-remote-video-editor-jobs",
  "blog/where-to-find-video-editor-jobs",
  "blog/how-to-find-video-editor-jobs",
  "blog/video-editor-portfolio-guide",
  "blog/video-editor-portfolio-examples",
  "blog/how-to-hire-a-video-editor",
  "blog/video-editor-interview-questions",
  "blog/youtube-video-editor-job-description",
  "blog/video-editor-job-description-template",
  "blog/freelance-video-editor-rates",
  "blog/how-to-price-video-editing-work",
  "blog/how-to-get-jobs-as-a-video-editor",
]) {
  requireIncludes(sitemap, `<loc>https://videoeditorjobs.com/${route}/</loc>`, `sitemap blog route ${route}`);
}

if (countMatches(editorHtml, /data-intake-kind="editor"/g) !== 1) {
  errors.push("Editor page should have exactly one editor intake form");
}

if (countMatches(hiringHtml, /data-intake-kind="hiring"/g) !== 1) {
  errors.push("Hiring page should have exactly one hiring intake form");
}

for (const needle of [
  "submission_id",
  "consent_at",
  "consent_text",
  "consentText",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "fetch(endpoint",
  "mode: \"no-cors\"",
  "mailto:",
  "website",
  "data-success-path",
  "redirectAfterSuccess",
  "localStorage",
  "draftStoragePrefix",
  "trackingStoragePrefix",
  "briefBuilderStorageKey",
  "portfolioChecklistStorageKey",
  "captureAttribution",
  "trackingFromUrl",
  "readStoredTracking(\"latest\")",
  "readStoredTracking(\"first\")",
  "writeStoredTracking(\"first\"",
  "writeStoredTracking(\"latest\"",
  "restoreDraft",
  "writeDraft",
  "clearDraft",
  "restoreBriefBuilderDraft",
  "Brief builder draft loaded.",
  "restorePortfolioChecklistDraft",
  "Portfolio checklist draft loaded.",
  "Draft restored from this browser.",
  "submission_id",
  "source_path",
  "experience_level",
  "work_preference",
  "weekly_capacity",
  "turnaround_time",
  "project_scope",
  "deliverables",
  "footage_volume",
  "revision_process",
  "reference_urls",
]) {
  requireIncludes(formsJs, needle, `forms.js ${needle}`);
}

for (const needle of [
  "LockService.getScriptLock",
  "function doGet()",
  "function testSubmission()",
  "function cleanupTestSubmissions()",
  "function appendSubmission(payload)",
  "function validatePayload(payload, kind)",
  "function sendSubmissionNotification(payload)",
  "function isValidEmail(value)",
  "function isHoneypotSpam(payload)",
  "function getHeaderRow(sheet)",
  "missingHeaders",
  "getHeaderRow(sheet).indexOf(\"submission_id\")",
  "isDuplicateSubmission",
  "19Hx9jc-cMI2yjYAzSG5NVca8yABCTLygomKs59CuTXI",
  "submission_id",
  "consent_at",
  "consent_text",
  "experience_level",
  "work_preference",
  "weekly_capacity",
  "turnaround_time",
  "project_scope",
  "deliverables",
  "footage_volume",
  "revision_process",
  "reference_urls",
  "source_bucket",
  "lead_score",
  "review_reason",
  "notificationEmail",
  "notifyOnSubmission",
  "sendConfirmationEmail",
  "confirmationEmailName",
  "MailApp.sendEmail",
  "notification",
  "confirmation",
  "matchesSheetName",
  "dashboardSheetName",
  "sourceSummarySheetName",
  "function ensureDashboard()",
  "function ensureSourceSummary()",
  "function countByHeaderFormula(sheetName, headerName, value)",
  "COUNTIF(INDEX",
  'countByHeaderFormula(CONFIG.editorSheetName, "utm_source"',
  'countByHeaderFormula(CONFIG.editorSheetName, "utm_campaign"',
  'countByHeaderFormula(CONFIG.hiringSheetName, "page_path"',
  "Rows by campaign",
  "early_editor_list",
  "fresh_jobs_share",
  "travel_hiring_share",
  "community_share",
  "integration_test",
  "Source Summary",
  "Video Editor Jobs Dashboard",
  "MATCH_HEADERS",
  "editor_submission_id",
  "hiring_submission_id",
  "missing required field",
  "invalid email",
  "spam: true",
  "status: \"new\"",
  "function triageSubmission(payload, kind)",
  "function sourceBucket(payload)",
  "function nextAction(kind, fields, score)",
  "function sendSubmitterConfirmation(payload)",
  "function confirmationEditorLines(payload)",
  "function confirmationHiringLines(payload)",
  "function firstName(name)",
  "example_email",
  "replyTo: CONFIG.notificationEmail",
  "ask for brief details",
  "next_action: triage.next_action",
  "createFilter",
]) {
  requireIncludes(appsScript, needle, `Apps Script ${needle}`);
}

if (appsScriptProjectCode !== appsScript) {
  errors.push("apps-script/Code.js is out of sync with docs/google-sheets-apps-script.js");
}

for (const needle of [
  '"runtimeVersion": "V8"',
  '"access": "ANYONE_ANONYMOUS"',
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/script.send_mail",
]) {
  requireIncludes(appsScriptManifest, needle, `Apps Script manifest ${needle}`);
}

requireIncludes(packageJson, '"smoke:intake"', "package smoke:intake script");
requireIncludes(packageJson, '"smoke:live"', "package smoke:live script");
requireIncludes(packageJson, '"launch:ready"', "package launch:ready script");
requireIncludes(packageJson, '"sync:apps-script"', "package sync:apps-script script");
requireIncludes(packageJson, '"configure:endpoint"', "package configure:endpoint script");
requireIncludes(packageJson, '"verify:apps-script"', "package verify:apps-script script");
requireIncludes(gitignore, ".env.local", "gitignore .env.local");

if (vercelJson.includes('"X-Robots-Tag"') && vercelJson.includes("index, follow")) {
  errors.push("vercel.json must not set a global X-Robots-Tag: index, follow header because thank-you pages are noindex");
}

for (const needle of [
  "VEJ_INTAKE_ENDPOINT",
  "validateIntakeEndpoint(endpoint)",
  "Smoke Test Editor",
  "Smoke Test Hiring",
  "fetch(endpoint",
  "consent_at",
  "consent_text",
  "experience_level",
  "project_scope",
  "deliverables",
  "revision_process",
  "reference_urls",
  "triage",
  "source_bucket",
  "lead_score",
  "confirmation",
]) {
  requireIncludes(smokeScript, needle, `smoke intake ${needle}`);
}

for (const needle of [
  "loadLocalEnv",
  "validateIntakeEndpoint",
  ".env.local",
  "wroteEnvLocal",
  "npm run smoke:intake",
  "npm run launch:ready -- --require-endpoint",
]) {
  requireIncludes(configureEndpointScript, needle, `configure endpoint ${needle}`);
}

for (const needle of ["loadLocalEnv", "validateIntakeEndpoint", "DEPLOYMENT_ID", "script.google.com"]) {
  requireIncludes(envScript, needle, `env helper ${needle}`);
}

for (const needle of [
  "VEJ_REQUIRE_INTAKE_ENDPOINT",
  "--require-endpoint",
  "window.VEJ_CONFIG",
  "expectedSitemapUrls",
  "X-Robots-Tag",
  "/thanks-editor/",
  "/thanks-hiring/",
  "/on-call-travel-video-editor-jobs/",
  "/teen-video-editor-jobs/",
  "/blog/how-to-find-video-editor-jobs/",
  "/blog/how-to-get-jobs-as-a-video-editor/",
  "/video-editor-jobs-manhattan/",
  "/video-editor-jobs-last-3-days/",
]) {
  requireIncludes(liveSmokeScript, needle, `live smoke ${needle}`);
}

for (const needle of [
  "--require-endpoint",
  "loadLocalEnv",
  "validateIntakeEndpoint",
  "expectedSitemapUrls",
  "appsScriptProjectCode !== appsScript",
  "ANYONE_ANONYMOUS",
  "script.send_mail",
  "triage.source_bucket",
  "confirmation.sent",
  "npm run smoke:intake",
]) {
  requireIncludes(readinessScript, needle, `launch readiness ${needle}`);
}

for (const needle of [
  "Dashboard",
  "no-cors",
  "npm run configure:endpoint",
  "npm run smoke:intake",
  "authoritative endpoint checks",
  "rejects direct posts",
  "experience_level",
  "project_scope",
  "footage_volume",
  "revision_process",
  "notification email",
  "confirmation email",
  "send-email permissions",
  "Source Summary",
  "source_bucket",
  "lead_score",
  "review_reason",
  "utm_source",
  "early_editor_list",
  "integration_test",
  "page_path",
  "Community Posts",
  "planned community posts",
  "seedCommunityPosts()",
  "cleanupTestSubmissions()",
  "needs_reply",
]) {
  requireIncludes(setupDoc, needle, `Google Sheets setup doc ${needle}`);
}

for (const needle of [
  "npm run configure:endpoint",
  "npm run smoke:intake",
  "utm_source",
  "early_editor_list",
  "early_hiring_briefs",
  "early_community",
  "New editor submissions",
  "New hiring briefs",
  "Source Summary",
  "Community Posts",
  "seedCommunityPosts()",
  "posts needing replies",
  "At least 10 editor submissions",
  "At least 2 hiring briefs",
  "docs/operator-email-templates.md",
  "npm run smoke:live",
  "npm run launch:ready",
  "docs/search-console-handoff.md",
  "docs/seo-30-day-plan.md",
]) {
  requireIncludes(launchRunbook, needle, `launch runbook ${needle}`);
}

for (const needle of [
  "first/latest UTM",
  "local storage",
  "early_editor_list",
  "early_hiring_briefs",
  "early_community",
  "blog_guide",
  "fresh_jobs_share",
  "early_career_share",
  "travel_editor_share",
  "job_template_share",
  "travel_hiring_share",
  "community_share",
  "Comment Replies",
  "DM Follow-Ups",
  "Moderation Notes",
  "Community Posts",
  "seedCommunityPosts()",
  "needs_reply",
]) {
  requireIncludes(communityLaunchKit, needle, `community launch kit ${needle}`);
}

for (const needle of [
  "Final Launch Handoff",
  "Editors!AW1:AY1",
  "Hiring Requests!AW1:AY1",
  "source_bucket",
  "lead_score",
  "review_reason",
  "fresh_jobs_share",
  "npm run launch:ready",
  "npm run configure:endpoint",
  "npm run smoke:intake",
  "Community Posts",
  "seedCommunityPosts()",
  "cleanupTestSubmissions()",
  "docs/search-console-handoff.md",
  "docs/seo-30-day-plan.md",
  "docs/operator-email-templates.md",
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
  "last_contacted_at = today",
]) {
  requireIncludes(operatorEmailTemplates, needle, `operator email templates ${needle}`);
}

for (const needle of [
  "Search Console Handoff",
  "https://videoeditorjobs.com/sitemap.xml",
  "50 crawlable URLs",
  "URL Inspection Queue",
  "/editors/",
  "/hire-video-editor/",
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

console.log("Verified app intake routes, form fields, tracking, fallback behavior, and traction sitemap routes");
