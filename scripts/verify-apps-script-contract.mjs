import { readFile } from "node:fs/promises";
import vm from "node:vm";
import { expectedScriptVersion } from "./env.mjs";

const errors = [];

function fail(message) {
  errors.push(message);
}

function requireIncludes(text, needle, label) {
  if (!text.includes(needle)) {
    fail(`Missing ${label}`);
  }
}

function evaluateTopLevelConstants(code) {
  return vm.runInNewContext(
    `${code}\n;({ CONFIG, SCRIPT_VERSION, HEADERS, MATCH_HEADERS, COMMUNITY_POST_HEADERS, COMMUNITY_POST_SEEDS });`,
    {}
  );
}

function extractStringArray(code, variableName) {
  const pattern = new RegExp(`const ${variableName} = \\[([\\s\\S]*?)\\];`);
  const match = code.match(pattern);
  if (!match) {
    fail(`Missing ${variableName} array`);
    return [];
  }

  return vm.runInNewContext(`[${match[1]}]`, {});
}

const expectedHeaders = [
  "created_at",
  "submission_id",
  "kind",
  "status",
  "priority",
  "owner",
  "next_action",
  "last_contacted_at",
  "review_notes",
  "source_bucket",
  "lead_score",
  "review_reason",
  "consent",
  "consent_at",
  "consent_text",
  "name",
  "email",
  "company",
  "location",
  "primary_fit",
  "role_type",
  "experience_level",
  "work_preference",
  "portfolio_url",
  "rate_range",
  "weekly_capacity",
  "budget",
  "timeline",
  "content_format",
  "project_scope",
  "deliverables",
  "footage_volume",
  "software",
  "turnaround_time",
  "availability",
  "revision_process",
  "reference_urls",
  "notes",
  "brief",
  "page_url",
  "page_path",
  "page_title",
  "referrer",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "ref",
  "user_agent",
  "raw_payload",
];

const expectedMatchHeaders = [
  "created_at",
  "match_id",
  "status",
  "editor_submission_id",
  "hiring_submission_id",
  "editor_name",
  "hiring_name",
  "role_or_fit",
  "budget_or_rate",
  "match_notes",
  "intro_sent_at",
  "outcome",
  "outcome_notes",
];

const expectedCommunityPostHeaders = [
  "created_at",
  "post_id",
  "status",
  "platform",
  "community_name",
  "community_url",
  "post_url",
  "audience",
  "angle",
  "question",
  "target_url",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "posted_at",
  "replies_count",
  "submissions_count",
  "quality_notes",
  "next_action",
  "owner",
];

const expectedCommunityPostSeedIds = [
  "post-reddit-editors-001",
  "post-facebook-editors-001",
  "post-reddit-hiring-001",
  "post-forum-community-001",
  "cal-reddit-editor-fields-001",
  "cal-facebook-trust-001",
  "cal-reddit-hiring-brief-001",
  "cal-forum-job-fields-001",
  "cal-reddit-portfolio-001",
  "cal-facebook-pricing-001",
  "cal-reddit-youtube-brief-001",
];

const requiredSourceSummarySources = ["reddit", "facebook", "forum", "community", "referral", "organic", "direct", "apps_script", "smoke", "manual"];
const requiredSourceSummaryPages = [
  "/",
  "/editors/",
  "/hire-video-editor/",
  "/post-video-editor-job/",
  "/video-editor-community/",
  "/remote-video-editor-jobs/",
  "/freelance-video-editor-jobs/",
  "/youtube-video-editor-jobs/",
  "/part-time-video-editor-jobs/",
  "/blog/",
  "/blog/where-to-find-video-editor-jobs/",
  "/blog/video-editor-portfolio-examples/",
  "/blog/how-to-hire-a-video-editor/",
  "/blog/video-editor-job-description-template/",
  "/blog/freelance-video-editor-rates/",
  "/blog/youtube-video-editor-job-description/",
];

const [canonicalCode, projectCode, manifestText, smokeScript, workbookScript] = await Promise.all([
  readFile(new URL("../docs/google-sheets-apps-script.js", import.meta.url), "utf8"),
  readFile(new URL("../apps-script/Code.js", import.meta.url), "utf8"),
  readFile(new URL("../apps-script/appsscript.json", import.meta.url), "utf8"),
  readFile(new URL("../scripts/smoke-intake-endpoint.mjs", import.meta.url), "utf8"),
  readFile(new URL("../scripts/create-intake-workbook.mjs", import.meta.url), "utf8"),
]);

if (canonicalCode !== projectCode) {
  fail("apps-script/Code.js is out of sync with docs/google-sheets-apps-script.js");
}

let constants = { CONFIG: {}, SCRIPT_VERSION: "", HEADERS: [], MATCH_HEADERS: [], COMMUNITY_POST_HEADERS: [], COMMUNITY_POST_SEEDS: [] };
try {
  constants = evaluateTopLevelConstants(canonicalCode);
} catch (error) {
  fail(`Apps Script constants could not be evaluated: ${error.message}`);
}

const manifest = JSON.parse(manifestText);

if (constants.CONFIG.spreadsheetId !== "19Hx9jc-cMI2yjYAzSG5NVca8yABCTLygomKs59CuTXI") {
  fail("CONFIG.spreadsheetId does not match the live intake Sheet");
}

if (constants.CONFIG.notificationEmail !== "sangy@rightjoin.co") {
  fail("CONFIG.notificationEmail should be sangy@rightjoin.co");
}

if (constants.SCRIPT_VERSION !== expectedScriptVersion) {
  fail(`SCRIPT_VERSION should be ${expectedScriptVersion}`);
}

if (JSON.stringify(constants.HEADERS) !== JSON.stringify(expectedHeaders)) {
  fail(`HEADERS contract mismatch. Expected ${expectedHeaders.length}, found ${constants.HEADERS.length}`);
}

if (JSON.stringify(constants.MATCH_HEADERS) !== JSON.stringify(expectedMatchHeaders)) {
  fail(`MATCH_HEADERS contract mismatch. Expected ${expectedMatchHeaders.length}, found ${constants.MATCH_HEADERS.length}`);
}

if (JSON.stringify(constants.COMMUNITY_POST_HEADERS) !== JSON.stringify(expectedCommunityPostHeaders)) {
  fail(
    `COMMUNITY_POST_HEADERS contract mismatch. Expected ${expectedCommunityPostHeaders.length}, found ${constants.COMMUNITY_POST_HEADERS.length}`
  );
}

for (const postId of expectedCommunityPostSeedIds) {
  if (!constants.COMMUNITY_POST_SEEDS.some((seed) => seed.post_id === postId)) {
    fail(`COMMUNITY_POST_SEEDS missing ${postId}`);
  }
  if (!workbookScript.includes(postId)) {
    fail(`Workbook community post seeds missing ${postId}`);
  }
}

if (manifest.runtimeVersion !== "V8") {
  fail("Apps Script manifest should use V8 runtime");
}

if (manifest.webapp?.executeAs !== "USER_DEPLOYING") {
  fail("Apps Script webapp should execute as USER_DEPLOYING");
}

if (manifest.webapp?.access !== "ANYONE_ANONYMOUS") {
  fail("Apps Script webapp access should be ANYONE_ANONYMOUS");
}

for (const scope of ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/script.send_mail"]) {
  if (!manifest.oauthScopes?.includes(scope)) {
    fail(`Apps Script manifest missing scope ${scope}`);
  }
}

for (const needle of [
  "function doGet()",
  "function doPost(event)",
  "scriptVersion: SCRIPT_VERSION",
  "LockService.getScriptLock",
  "function setup()",
  "communityPostsSheetName",
  "COMMUNITY_POST_HEADERS",
  "COMMUNITY_POST_SEEDS",
  "function launchHealthCheck()",
  "missingHeadersForSheet",
  "missingCommunitySeedIds",
  "expectedSeeds",
  "function seedCommunityPosts()",
  "toCommunityPostRow",
  "function testSubmission()",
  "matchSuggestionResult",
  "function cleanupTestSubmissions()",
  "function deleteRowsWhere(sheet, predicate)",
  "function appendSubmission(payload)",
  "function validatePayload(payload, kind)",
  "function triageSubmission(payload, kind)",
  "function suggestMatches(limit)",
  "function scoreMatch(editor, hiring)",
  "function toMatchRow(suggestion, headers)",
  "function sendSubmissionNotification(payload)",
  "function sendSubmitterConfirmation(payload)",
  "isDuplicateSubmission",
  "missing consent",
  "invalid email",
  "spam: true",
  "confirmation",
  "Planned community posts",
  "Published community posts",
  "Replies needing response",
  "needs_reply",
]) {
  requireIncludes(canonicalCode, needle, `Apps Script ${needle}`);
}

for (const needle of [
  "communityPostHeaders",
  "addCommunityPostsSheet(workbook)",
  "communityPostSeedRows",
  "communityPostStatusValues",
  "communityPlatformValues",
  "Planned community posts",
  "Published community posts",
  "Replies needing response",
  expectedScriptVersion,
  "health.scriptVersion",
  "18 crawlable pages",
]) {
  requireIncludes(workbookScript, needle, `workbook ${needle}`);
}

const sourceSummarySources = extractStringArray(canonicalCode, "sources");
const sourceSummaryPages = extractStringArray(canonicalCode, "pages");
const workbookSources = extractStringArray(workbookScript, "sources");
const workbookPages = extractStringArray(workbookScript, "pages");

for (const source of requiredSourceSummarySources) {
  if (!sourceSummarySources.includes(source)) {
    fail(`Apps Script Source Summary missing source ${source}`);
  }
  if (!workbookSources.includes(source)) {
    fail(`Workbook Source Summary missing source ${source}`);
  }
}

for (const page of requiredSourceSummaryPages) {
  if (!sourceSummaryPages.includes(page)) {
    fail(`Apps Script Source Summary missing page path ${page}`);
  }
  if (!workbookPages.includes(page)) {
    fail(`Workbook Source Summary missing page path ${page}`);
  }
}

for (const needle of [
  "expectedScriptVersion",
  "health.scriptVersion",
  "triage.source_bucket",
  "triage.lead_score",
  "confirmation.sent",
  "validateIntakeEndpoint(endpoint)",
]) {
  requireIncludes(smokeScript, needle, `smoke intake endpoint ${needle}`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      scriptVersion: constants.SCRIPT_VERSION,
      expectedScriptVersion,
      headers: constants.HEADERS.length,
      matchHeaders: constants.MATCH_HEADERS.length,
      communityPostHeaders: constants.COMMUNITY_POST_HEADERS.length,
      communityPostSeeds: constants.COMMUNITY_POST_SEEDS.length,
      sourceSummarySources: sourceSummarySources.length,
      sourceSummaryPages: sourceSummaryPages.length,
      manifestAccess: manifest.webapp?.access,
    },
    null,
    2
  )
);
