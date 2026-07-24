import fs from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

async function loadArtifactTool() {
  try {
    return await import("@oai/artifact-tool");
  } catch (error) {
    const fallback =
      process.env.ARTIFACT_TOOL_MODULE ||
      "/Users/sangy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs";
    return import(pathToFileURL(fallback).href);
  }
}

const { SpreadsheetFile, Workbook } = await loadArtifactTool();

const outputDir = "/private/tmp/vej-sheet-template/outputs";
const outputPath = join(outputDir, "video-editor-jobs-intake.xlsx");

const intakeHeaders = [
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

const matchHeaders = [
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

const communityPostHeaders = [
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

const statusValues = ["new", "reviewed", "needs_follow_up", "matched", "not_fit", "spam", "closed"];
const priorityValues = ["high", "medium", "low"];
const nextActionValues = [
  "review",
  "email editor",
  "ask for portfolio",
  "ask for brief details",
  "find hiring match",
  "send intro",
  "no action",
];
const matchStatusValues = ["proposed", "intro_sent", "active", "won", "lost", "closed"];
const communityPostStatusValues = ["planned", "posted", "needs_reply", "paused", "removed", "done"];
const communityPlatformValues = ["reddit", "facebook", "forum", "discord", "linkedin", "other"];
const preparedRows = 50;

const communityPostSeedRows = [
  [
    "2026-06-29T00:00:00.000Z",
    "post-reddit-editors-001",
    "planned",
    "reddit",
    "Video editing community",
    "",
    "",
    "editors",
    "feedback on editor intake fields",
    "What would make a video-editor-only job board worth joining?",
    "https://videoeditorjobs.com/editors/?utm_source=reddit&utm_medium=community&utm_campaign=early_editor_list",
    "reddit",
    "community",
    "early_editor_list",
    "",
    "0",
    "0",
    "Use Reddit editor post draft from docs/community-launch-kit.md.",
    "review community rules",
    "",
  ],
  [
    "2026-06-29T00:00:00.000Z",
    "post-facebook-editors-001",
    "planned",
    "facebook",
    "Video editor Facebook group",
    "",
    "",
    "editors",
    "trustworthy job post feedback",
    "What makes a video editing job post feel trustworthy enough to apply to?",
    "https://videoeditorjobs.com/editors/?utm_source=facebook&utm_medium=group&utm_campaign=early_editor_list",
    "facebook",
    "group",
    "early_editor_list",
    "",
    "0",
    "0",
    "Use Facebook group post draft from docs/community-launch-kit.md.",
    "review group rules",
    "",
  ],
  [
    "2026-06-29T00:00:00.000Z",
    "post-reddit-hiring-001",
    "planned",
    "reddit",
    "Creator or agency community",
    "",
    "",
    "hiring",
    "better hiring brief feedback",
    "What details do editors need before they can judge a video editing gig?",
    "https://videoeditorjobs.com/hire-video-editor/?utm_source=reddit&utm_medium=community&utm_campaign=early_hiring_briefs",
    "reddit",
    "community",
    "early_hiring_briefs",
    "",
    "0",
    "0",
    "Use Reddit hiring post draft from docs/community-launch-kit.md.",
    "find allowed hiring-side community",
    "",
  ],
  [
    "2026-06-29T00:00:00.000Z",
    "post-forum-community-001",
    "planned",
    "forum",
    "Editing or creator forum",
    "",
    "",
    "both",
    "community feedback page",
    "Which editing-specific details should every job post include?",
    "https://videoeditorjobs.com/video-editor-community/?utm_source=forum&utm_medium=community&utm_campaign=early_community",
    "forum",
    "community",
    "early_community",
    "",
    "0",
    "0",
    "Use forum reply draft only when it answers the thread.",
    "find relevant thread",
    "",
  ],
  [
    "2026-06-29T00:00:00.000Z",
    "cal-reddit-editor-fields-001",
    "planned",
    "reddit",
    "Video editing community",
    "",
    "",
    "editors",
    "editor intake feedback",
    "What fields would make a video-editor-only job board worth joining?",
    "https://videoeditorjobs.com/editors/?utm_source=reddit&utm_medium=community&utm_campaign=early_editor_list",
    "reddit",
    "community",
    "early_editor_list",
    "",
    "0",
    "0",
    "Day 1 calendar post from docs/community-posting-calendar.md.",
    "review rules and post",
    "",
  ],
  [
    "2026-06-29T00:00:00.000Z",
    "cal-facebook-trust-001",
    "planned",
    "facebook",
    "Video editor Facebook group",
    "",
    "",
    "editors",
    "trustworthy job posts",
    "What makes a video editing job post feel trustworthy enough to apply to?",
    "https://videoeditorjobs.com/editors/?utm_source=facebook&utm_medium=group&utm_campaign=early_editor_list",
    "facebook",
    "group",
    "early_editor_list",
    "",
    "0",
    "0",
    "Day 2 calendar post from docs/community-posting-calendar.md.",
    "review group rules",
    "",
  ],
  [
    "2026-06-29T00:00:00.000Z",
    "cal-reddit-hiring-brief-001",
    "planned",
    "reddit",
    "Creator or agency community",
    "",
    "",
    "hiring",
    "useful hiring briefs",
    "What details do editors need before judging a video editing gig?",
    "https://videoeditorjobs.com/hire-video-editor/?utm_source=reddit&utm_medium=community&utm_campaign=early_hiring_briefs",
    "reddit",
    "community",
    "early_hiring_briefs",
    "",
    "0",
    "0",
    "Day 3 calendar post from docs/community-posting-calendar.md.",
    "find hiring-side community",
    "",
  ],
  [
    "2026-06-29T00:00:00.000Z",
    "cal-forum-job-fields-001",
    "planned",
    "forum",
    "Editing or creator forum",
    "",
    "",
    "both",
    "job post field feedback",
    "Which editing-specific details should every job post include?",
    "https://videoeditorjobs.com/video-editor-community/?utm_source=forum&utm_medium=community&utm_campaign=early_community",
    "forum",
    "community",
    "early_community",
    "",
    "0",
    "0",
    "Day 4 calendar post from docs/community-posting-calendar.md.",
    "find relevant thread",
    "",
  ],
  [
    "2026-06-29T00:00:00.000Z",
    "cal-reddit-portfolio-001",
    "planned",
    "reddit",
    "Video editing community",
    "",
    "",
    "editors",
    "portfolio examples",
    "What portfolio examples make an editor easier to hire?",
    "https://videoeditorjobs.com/blog/video-editor-portfolio-examples/?utm_source=reddit&utm_medium=comment&utm_campaign=blog_guide",
    "reddit",
    "comment",
    "blog_guide",
    "",
    "0",
    "0",
    "Day 5 calendar reply from docs/community-posting-calendar.md.",
    "use as reply only",
    "",
  ],
  [
    "2026-06-29T00:00:00.000Z",
    "cal-facebook-pricing-001",
    "planned",
    "facebook",
    "Video editor Facebook group",
    "",
    "",
    "both",
    "pricing and revisions",
    "How do you price video editing when revision load is unclear?",
    "https://videoeditorjobs.com/blog/freelance-video-editor-rates/?utm_source=facebook&utm_medium=group&utm_campaign=blog_guide",
    "facebook",
    "group",
    "blog_guide",
    "",
    "0",
    "0",
    "Day 9 calendar post from docs/community-posting-calendar.md.",
    "review group rules",
    "",
  ],
  [
    "2026-06-29T00:00:00.000Z",
    "cal-reddit-youtube-brief-001",
    "planned",
    "reddit",
    "Creator or agency community",
    "",
    "",
    "hiring",
    "YouTube editor brief",
    "What should a YouTube editor job description include beyond software?",
    "https://videoeditorjobs.com/blog/youtube-video-editor-job-description/?utm_source=reddit&utm_medium=community&utm_campaign=blog_guide",
    "reddit",
    "community",
    "blog_guide",
    "",
    "0",
    "0",
    "Day 12 calendar post from docs/community-posting-calendar.md.",
    "find creator community",
    "",
  ],
];

function colLetter(index) {
  let n = index + 1;
  let label = "";
  while (n > 0) {
    const rem = (n - 1) % 26;
    label = String.fromCharCode(65 + rem) + label;
    n = Math.floor((n - 1) / 26);
  }
  return label;
}

function setHeaderStyle(range) {
  range.format.fill = { color: "#F1F3F4" };
  range.format.font = { bold: true, color: "#202124" };
  range.format.borders = { preset: "outside", style: "thin", color: "#DADCE0" };
}

function setTableStyle(sheet, lastCol, lastRow = preparedRows) {
  sheet.showGridLines = true;
  sheet.freezePanes.freezeRows(1);
  const used = sheet.getRange(`A1:${colLetter(lastCol - 1)}${lastRow}`);
  used.format.font = { name: "Arial", size: 10 };
  sheet.getRange(`A1:${colLetter(lastCol - 1)}1`).format.rowHeightPx = 42;
  sheet.getRange(`A1:${colLetter(lastCol - 1)}1`).format.wrapText = true;
  sheet.getRange(`A2:${colLetter(lastCol - 1)}${lastRow}`).format.wrapText = true;
}

function setColumnWidths(sheet, widths) {
  widths.forEach((width, index) => {
    sheet.getRange(`${colLetter(index)}:${colLetter(index)}`).format.columnWidthPx = width;
  });
}

function applyIntakeValidation(sheet) {
  sheet.getRange(`D2:D${preparedRows}`).dataValidation = { rule: { type: "list", values: statusValues } };
  sheet.getRange(`E2:E${preparedRows}`).dataValidation = { rule: { type: "list", values: priorityValues } };
  sheet.getRange(`G2:G${preparedRows}`).dataValidation = { rule: { type: "list", values: nextActionValues } };
}

function addIntakeSheet(workbook, name, sampleRow) {
  const sheet = workbook.worksheets.add(name);
  const rows = [intakeHeaders, sampleRow];
  sheet.getRangeByIndexes(0, 0, rows.length, intakeHeaders.length).values = rows;
  setHeaderStyle(sheet.getRange(`A1:${colLetter(intakeHeaders.length - 1)}1`));
  setTableStyle(sheet, intakeHeaders.length);
  setColumnWidths(sheet, [
    145, 150, 80, 120, 95, 100, 145, 145, 220, 130, 90, 280, 95, 145, 340, 140, 190, 160, 160,
    175, 150, 150, 155, 220, 120, 150, 120, 130, 170, 160, 220, 180, 170, 160, 160, 160, 260,
    260, 260, 300, 240, 120, 180, 180, 110, 110, 140, 140, 110, 100, 260, 260,
  ]);
  applyIntakeValidation(sheet);
  return sheet;
}

function addMatchesSheet(workbook) {
  const sheet = workbook.worksheets.add("Matches");
  const sampleRow = [
    "2026-06-29T00:00:00.000Z",
    "match-2026-06-29-001",
    "proposed",
    "editor-sample",
    "hiring-sample",
    "Sample Editor",
    "Sample Hiring Team",
    "YouTube editor work",
    "$800/video",
    "Example only. Replace with real match notes.",
    "",
    "",
    "",
  ];
  const rows = [matchHeaders, sampleRow];
  sheet.getRangeByIndexes(0, 0, rows.length, matchHeaders.length).values = rows;
  setHeaderStyle(sheet.getRange(`A1:${colLetter(matchHeaders.length - 1)}1`));
  setTableStyle(sheet, matchHeaders.length);
  setColumnWidths(sheet, [145, 170, 110, 170, 170, 150, 170, 180, 130, 320, 145, 120, 260]);
  sheet.getRange(`C2:C${preparedRows}`).dataValidation = { rule: { type: "list", values: matchStatusValues } };
}

function addCommunityPostsSheet(workbook) {
  const sheet = workbook.worksheets.add("Community Posts");
  const rows = [communityPostHeaders, ...communityPostSeedRows];
  sheet.getRangeByIndexes(0, 0, rows.length, communityPostHeaders.length).values = rows;
  setHeaderStyle(sheet.getRange(`A1:${colLetter(communityPostHeaders.length - 1)}1`));
  setTableStyle(sheet, communityPostHeaders.length);
  setColumnWidths(sheet, [
    145, 165, 120, 110, 190, 260, 260, 110, 220, 320, 360, 120, 120, 160, 145, 120, 145, 320,
    180, 120,
  ]);
  sheet.getRange(`C2:C${preparedRows}`).dataValidation = { rule: { type: "list", values: communityPostStatusValues } };
  sheet.getRange(`D2:D${preparedRows}`).dataValidation = { rule: { type: "list", values: communityPlatformValues } };
}

function addDashboardSheet(workbook) {
  const sheet = workbook.worksheets.add("Dashboard");
  const rows = [
    ["Video Editor Jobs Dashboard", "", ""],
    ["Metric", "Value", "Next step"],
    ["New editor submissions", "", "Review portfolio, fit, and availability."],
    ["New hiring briefs", "", "Review budget, role type, and brief quality."],
    ["High priority editors", "", "Consider for warm intros first."],
    ["High priority hiring briefs", "", "Find matching editors or ask for missing details."],
    ["Open matches", "", "Send intros or update outcomes."],
    ["Introductions sent", "", "Follow up and capture outcomes."],
    ["Planned community posts", "", "Review the next planned post before publishing."],
    ["Published community posts", "", "Reply to useful comments and record outcomes."],
    ["Replies needing response", "", "Answer comments before posting elsewhere."],
    ["Editor rows", "", "Watch by utm_source and page_path."],
    ["Hiring rows", "", "Watch by utm_source and page_path."],
  ];
  sheet.getRangeByIndexes(0, 0, rows.length, rows[0].length).values = rows;
  sheet.getRange("B3:B13").formulas = [
    ['=COUNTIF(Editors!D2:D50,"new")'],
    ['=COUNTIF(\'Hiring Requests\'!D2:D50,"new")'],
    ['=COUNTIF(Editors!E2:E50,"high")'],
    ['=COUNTIF(\'Hiring Requests\'!E2:E50,"high")'],
    ['=COUNTIF(Matches!C2:C50,"proposed")+COUNTIF(Matches!C2:C50,"active")'],
    ['=COUNTIF(Matches!C2:C50,"intro_sent")'],
    ['=COUNTIF(\'Community Posts\'!C2:C50,"planned")'],
    ['=COUNTIF(\'Community Posts\'!C2:C50,"posted")'],
    ['=COUNTIF(\'Community Posts\'!C2:C50,"needs_reply")'],
    ["=MAX(COUNTA(Editors!B2:B50),0)"],
    ["=MAX(COUNTA('Hiring Requests'!B2:B50),0)"],
  ];
  sheet.getRange("A1:C1").merge();
  sheet.getRange("A1").format.font = { bold: true, size: 14, color: "#202124" };
  sheet.getRange("A1").format.fill = { color: "#F1F3F4" };
  setHeaderStyle(sheet.getRange("A2:C2"));
  sheet.freezePanes.freezeRows(2);
  sheet.getRange("A1:C13").format.wrapText = true;
  sheet.getRange("A:A").format.columnWidthPx = 220;
  sheet.getRange("B:B").format.columnWidthPx = 110;
  sheet.getRange("C:C").format.columnWidthPx = 360;
  sheet.showGridLines = true;
}

function countByHeaderFormula(sheetName, headerName, value) {
  const quoted = `'${sheetName.replace(/'/g, "''")}'`;
  return `=COUNTIF(INDEX(${quoted}!A:ZZ,,MATCH("${headerName}",${quoted}!1:1,0)),"${String(value).replace(/"/g, '""')}")`;
}

function addSourceSummarySheet(workbook) {
  const sheet = workbook.worksheets.add("Source Summary");
  const sources = ["reddit", "reddit.com", "chatgpt.com", "perplexity.ai", "facebook", "forum", "community", "referral", "organic", "direct", "apps_script", "smoke", "manual"];
  const campaigns = [
    "voice_profile_interest",
    "editor_supply_2026_07",
    "early_editor_list",
    "early_hiring_briefs",
    "early_community",
    "blog_guide",
    "seo_resource",
    "editor_invite",
    "hiring_invite",
    "hiring_resource_share",
    "repeat_hiring_brief",
    "portfolio_examples_share",
    "job_template_share",
    "community_share",
    "integration_test",
    "intake_endpoint",
    "sheet_template",
  ];
  const pages = [
    "/",
    "/editors/",
    "/voice-profile/",
    "/hire-video-editor/",
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
  const rows = [
    ["Video Editor Jobs Source Summary", "", "", ""],
    ["Rows by source", "", "", ""],
    ["Source", "Editor submissions", "Hiring briefs", "Review hint"],
    ...sources.map((source) => [source, "", "", "Compare quality, not just volume."]),
    ["", "", "", ""],
    ["Rows by campaign", "", "", ""],
    ["Campaign", "Editor submissions", "Hiring briefs", "Review hint"],
    ...campaigns.map((campaign) => [campaign, "", "", "Compare post angle and landing page."]),
    ["", "", "", ""],
    ["Rows by page path", "", "", ""],
    ["Page path", "Editor submissions", "Hiring briefs", "Review hint"],
    ...pages.map((pagePath) => [pagePath, "", "", "Watch which entry point converts."]),
  ];
  sheet.getRangeByIndexes(0, 0, rows.length, 4).values = rows;

  sources.forEach((source, index) => {
    const row = 4 + index;
    sheet.getRange(`B${row}`).formulas = [[countByHeaderFormula("Editors", "utm_source", source)]];
    sheet.getRange(`C${row}`).formulas = [[countByHeaderFormula("Hiring Requests", "utm_source", source)]];
  });

  const campaignStartRow = 4 + sources.length + 3;
  campaigns.forEach((campaign, index) => {
    const row = campaignStartRow + index;
    sheet.getRange(`B${row}`).formulas = [[countByHeaderFormula("Editors", "utm_campaign", campaign)]];
    sheet.getRange(`C${row}`).formulas = [[countByHeaderFormula("Hiring Requests", "utm_campaign", campaign)]];
  });

  const pageStartRow = campaignStartRow + campaigns.length + 3;
  pages.forEach((pagePath, index) => {
    const row = pageStartRow + index;
    sheet.getRange(`B${row}`).formulas = [[countByHeaderFormula("Editors", "page_path", pagePath)]];
    sheet.getRange(`C${row}`).formulas = [[countByHeaderFormula("Hiring Requests", "page_path", pagePath)]];
  });

  sheet.getRange("A1:D1").merge();
  sheet.getRange("A1").format.font = { bold: true, size: 14, color: "#202124" };
  sheet.getRange("A1").format.fill = { color: "#F1F3F4" };
  sheet.getRange(`A2:A${rows.length}`).format.font = { bold: true };
  sheet.getRange("A3:D3").format.font = { bold: true };
  sheet.getRange(`A${campaignStartRow - 1}:D${campaignStartRow - 1}`).format.font = { bold: true };
  sheet.getRange(`A${pageStartRow - 1}:D${pageStartRow - 1}`).format.font = { bold: true };
  sheet.getRange(`A1:D${rows.length}`).format.wrapText = true;
  sheet.getRange("A:A").format.columnWidthPx = 210;
  sheet.getRange("B:B").format.columnWidthPx = 150;
  sheet.getRange("C:C").format.columnWidthPx = 190;
  sheet.getRange("D:D").format.columnWidthPx = 120;
  sheet.showGridLines = true;
}

function addSetupSheet(workbook) {
  const sheet = workbook.worksheets.add("Setup");
  const rows = [
    ["Video Editor Jobs Intake Sheet", ""],
    ["Tabs", "Dashboard, Source Summary, Editors, Hiring Requests, Matches, Community Posts, and Setup are present."],
    [
      "Apps Script",
      "Paste docs/google-sheets-apps-script.js into Extensions > Apps Script, save, run setup(), run seedCommunityPosts(), approve Sheets/send-email permissions, then run launchHealthCheck(). Confirm ok: true and scriptVersion: vej-2026-07-20-intake-summary before deploying.",
    ],
    [
      "Test Submission",
      "Run testSubmission() and confirm one editor row, one hiring row, and at least one proposed match row appear. Then run cleanupTestSubmissions() to remove only generated test rows and test matches.",
    ],
    [
      "Deploy",
      "Deploy Apps Script as a Web app. Execute as Me. Access Anyone. Copy the /exec URL, open it, and confirm ok: true plus scriptVersion: vej-2026-07-20-intake-summary.",
    ],
    ["Environment", "Run npm run configure:endpoint -- <exec-url>, then deploy with VEJ_INTAKE_ENDPOINT set in production."],
    [
      "Smoke Test",
      "Run npm run smoke:intake after /exec deploy. Confirm health.scriptVersion is vej-2026-07-20-intake-summary and one editor row plus one hiring row land with triage and confirmation results.",
    ],
    [
      "Launch Gate",
      "Run npm run launch:ready -- --require-endpoint, then npm run smoke:live -- https://videoeditorjobs.com --require-endpoint after deploy. Current local bundle verifies 18 crawlable pages.",
    ],
    ["Match Suggestions", "Run suggestMatches() in Apps Script to add proposed rows to Matches for manual review."],
    ["Daily Review", "Open Dashboard, Source Summary, and Community Posts. Filter status = new. Sort by priority and lead_score. Review next_action and add review_notes."],
    ["Privacy", "Keep https://videoeditorjobs.com/privacy/ and /terms/ live before public posting."],
  ];
  sheet.getRangeByIndexes(0, 0, rows.length, 2).values = rows;
  sheet.getRange("A1:B1").merge();
  sheet.getRange("A1").format.font = { bold: true, size: 14, color: "#202124" };
  sheet.getRange("A1").format.fill = { color: "#F1F3F4" };
  sheet.getRange(`A2:A${rows.length}`).format.font = { bold: true };
  sheet.getRange(`A1:B${rows.length}`).format.borders = { preset: "outside", style: "thin", color: "#DADCE0" };
  sheet.getRange(`A1:B${rows.length}`).format.wrapText = true;
  sheet.getRange("A:A").format.columnWidthPx = 150;
  sheet.getRange("B:B").format.columnWidthPx = 620;
  sheet.showGridLines = true;
}

const workbook = Workbook.create();

addSetupSheet(workbook);

addIntakeSheet(workbook, "Editors", [
  "2026-06-29T00:00:00.000Z",
  "editor-sample",
  "editor",
  "new",
  "medium",
  "",
  "review",
  "",
  "Example only. Delete after setup.",
  "manual",
  "7",
  "tracked source; fit present; portfolio present; rate present; capacity present",
  "yes",
  "2026-06-29T00:00:00.000Z",
  "I agree to be contacted about video editor jobs, hiring matches, and community updates, and I accept the terms and privacy policy.",
  "Sample Editor",
  "editor@example.com",
  "",
  "Los Angeles, PT",
  "YouTube editor work",
  "",
  "Professional editor",
  "Remote only",
  "https://example.com/portfolio",
  "$50/hr",
  "10 hrs/week",
  "",
  "",
  "",
  "",
  "",
  "",
  "Premiere, Resolve",
  "3 to 5 days",
  "Available now",
  "",
  "",
  "Strong long-form pacing and shorts repurposing.",
  "",
  "https://videoeditorjobs.com/editors/",
  "/editors/",
  "Join as a Video Editor",
  "",
  "manual",
  "setup",
  "sheet_template",
  "",
  "",
  "",
  "",
  "{}",
]);

addIntakeSheet(workbook, "Hiring Requests", [
  "2026-06-29T00:00:00.000Z",
  "hiring-sample",
  "hiring",
  "new",
  "high",
  "",
  "review",
  "",
  "Example only. Delete after setup.",
  "manual",
  "8",
  "tracked source; role type present; budget present; timeline present; references present",
  "yes",
  "2026-06-29T00:00:00.000Z",
  "I agree to be contacted about video editor jobs, hiring matches, and community updates, and I accept the terms and privacy policy.",
  "Sample Hiring Lead",
  "producer@example.com",
  "Sample Channel",
  "Remote, ET overlap",
  "",
  "YouTube editor",
  "",
  "",
  "",
  "",
  "",
  "$800/video",
  "This month",
  "YouTube, Shorts",
  "Weekly channel",
  "1 long-form video and 3 shorts",
  "90 minutes raw footage per week",
  "Premiere, Frame.io, Google Drive",
  "",
  "",
  "One producer review, one revision round, final approval by channel owner.",
  "https://example.com/reference",
  "",
  "Need weekly long-form edit plus three shorts.",
  "https://videoeditorjobs.com/hire-video-editor/",
  "/hire-video-editor/",
  "Hire a Video Editor",
  "",
  "manual",
  "setup",
  "sheet_template",
  "",
  "",
  "",
  "",
  "{}",
]);

addMatchesSheet(workbook);
addCommunityPostsSheet(workbook);
addDashboardSheet(workbook);
addSourceSummarySheet(workbook);

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "formula error scan",
});

if (String(errors.ndjson || "").includes("#")) {
  throw new Error(`Workbook formula errors found:\n${errors.ndjson}`);
}

await fs.mkdir(outputDir, { recursive: true });
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);

console.log(outputPath);
