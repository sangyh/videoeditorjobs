const CONFIG = {
  spreadsheetId: "19Hx9jc-cMI2yjYAzSG5NVca8yABCTLygomKs59CuTXI",
  editorSheetName: "Editors",
  hiringSheetName: "Hiring Requests",
  matchesSheetName: "Matches",
  communityPostsSheetName: "Community Posts",
  dashboardSheetName: "Dashboard",
  sourceSummarySheetName: "Source Summary",
  notificationEmail: "sangy@rightjoin.co",
  notifyOnSubmission: true,
  sendConfirmationEmail: true,
  confirmationEmailName: "Video Editor Jobs",
};

const SCRIPT_VERSION = "vej-2026-07-14-public-jobs-200";

const HEADERS = [
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

const MATCH_HEADERS = [
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

const COMMUNITY_POST_HEADERS = [
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

const COMMUNITY_POST_SEEDS = [
  {
    post_id: "post-reddit-editors-001",
    status: "planned",
    platform: "reddit",
    community_name: "Video editing community",
    community_url: "",
    audience: "editors",
    angle: "feedback on editor intake fields",
    question: "What would make a video-editor-only job board worth joining?",
    target_url: "https://videoeditorjobs.com/editors/?utm_source=reddit&utm_medium=community&utm_campaign=early_editor_list",
    utm_source: "reddit",
    utm_medium: "community",
    utm_campaign: "early_editor_list",
    quality_notes: "Use Reddit editor post draft from docs/community-launch-kit.md.",
    next_action: "review community rules",
  },
  {
    post_id: "post-facebook-editors-001",
    status: "planned",
    platform: "facebook",
    community_name: "Video editor Facebook group",
    community_url: "",
    audience: "editors",
    angle: "trustworthy job post feedback",
    question: "What makes a video editing job post feel trustworthy enough to apply to?",
    target_url: "https://videoeditorjobs.com/editors/?utm_source=facebook&utm_medium=group&utm_campaign=early_editor_list",
    utm_source: "facebook",
    utm_medium: "group",
    utm_campaign: "early_editor_list",
    quality_notes: "Use Facebook group post draft from docs/community-launch-kit.md.",
    next_action: "review group rules",
  },
  {
    post_id: "post-reddit-hiring-001",
    status: "planned",
    platform: "reddit",
    community_name: "Creator or agency community",
    community_url: "",
    audience: "hiring",
    angle: "better hiring brief feedback",
    question: "What details do editors need before they can judge a video editing gig?",
    target_url: "https://videoeditorjobs.com/hire-video-editor/?utm_source=reddit&utm_medium=community&utm_campaign=early_hiring_briefs",
    utm_source: "reddit",
    utm_medium: "community",
    utm_campaign: "early_hiring_briefs",
    quality_notes: "Use Reddit hiring post draft from docs/community-launch-kit.md.",
    next_action: "find allowed hiring-side community",
  },
  {
    post_id: "post-forum-community-001",
    status: "planned",
    platform: "forum",
    community_name: "Editing or creator forum",
    community_url: "",
    audience: "both",
    angle: "community feedback page",
    question: "Which editing-specific details should every job post include?",
    target_url: "https://videoeditorjobs.com/video-editor-community/?utm_source=forum&utm_medium=community&utm_campaign=early_community",
    utm_source: "forum",
    utm_medium: "community",
    utm_campaign: "early_community",
    quality_notes: "Use forum reply draft only when it answers the thread.",
    next_action: "find relevant thread",
  },
  {
    post_id: "cal-reddit-editor-fields-001",
    status: "planned",
    platform: "reddit",
    community_name: "Video editing community",
    community_url: "",
    audience: "editors",
    angle: "editor intake feedback",
    question: "What fields would make a video-editor-only job board worth joining?",
    target_url: "https://videoeditorjobs.com/editors/?utm_source=reddit&utm_medium=community&utm_campaign=early_editor_list",
    utm_source: "reddit",
    utm_medium: "community",
    utm_campaign: "early_editor_list",
    quality_notes: "Day 1 calendar post from docs/community-posting-calendar.md.",
    next_action: "review rules and post",
  },
  {
    post_id: "cal-facebook-trust-001",
    status: "planned",
    platform: "facebook",
    community_name: "Video editor Facebook group",
    community_url: "",
    audience: "editors",
    angle: "trustworthy job posts",
    question: "What makes a video editing job post feel trustworthy enough to apply to?",
    target_url: "https://videoeditorjobs.com/editors/?utm_source=facebook&utm_medium=group&utm_campaign=early_editor_list",
    utm_source: "facebook",
    utm_medium: "group",
    utm_campaign: "early_editor_list",
    quality_notes: "Day 2 calendar post from docs/community-posting-calendar.md.",
    next_action: "review group rules",
  },
  {
    post_id: "cal-reddit-hiring-brief-001",
    status: "planned",
    platform: "reddit",
    community_name: "Creator or agency community",
    community_url: "",
    audience: "hiring",
    angle: "useful hiring briefs",
    question: "What details do editors need before judging a video editing gig?",
    target_url: "https://videoeditorjobs.com/hire-video-editor/?utm_source=reddit&utm_medium=community&utm_campaign=early_hiring_briefs",
    utm_source: "reddit",
    utm_medium: "community",
    utm_campaign: "early_hiring_briefs",
    quality_notes: "Day 3 calendar post from docs/community-posting-calendar.md.",
    next_action: "find hiring-side community",
  },
  {
    post_id: "cal-forum-job-fields-001",
    status: "planned",
    platform: "forum",
    community_name: "Editing or creator forum",
    community_url: "",
    audience: "both",
    angle: "job post field feedback",
    question: "Which editing-specific details should every job post include?",
    target_url: "https://videoeditorjobs.com/video-editor-community/?utm_source=forum&utm_medium=community&utm_campaign=early_community",
    utm_source: "forum",
    utm_medium: "community",
    utm_campaign: "early_community",
    quality_notes: "Day 4 calendar post from docs/community-posting-calendar.md.",
    next_action: "find relevant thread",
  },
  {
    post_id: "cal-reddit-portfolio-001",
    status: "planned",
    platform: "reddit",
    community_name: "Video editing community",
    community_url: "",
    audience: "editors",
    angle: "portfolio examples",
    question: "What portfolio examples make an editor easier to hire?",
    target_url: "https://videoeditorjobs.com/blog/video-editor-portfolio-examples/?utm_source=reddit&utm_medium=comment&utm_campaign=blog_guide",
    utm_source: "reddit",
    utm_medium: "comment",
    utm_campaign: "blog_guide",
    quality_notes: "Day 5 calendar reply from docs/community-posting-calendar.md.",
    next_action: "use as reply only",
  },
  {
    post_id: "cal-facebook-pricing-001",
    status: "planned",
    platform: "facebook",
    community_name: "Video editor Facebook group",
    community_url: "",
    audience: "both",
    angle: "pricing and revisions",
    question: "How do you price video editing when revision load is unclear?",
    target_url: "https://videoeditorjobs.com/blog/freelance-video-editor-rates/?utm_source=facebook&utm_medium=group&utm_campaign=blog_guide",
    utm_source: "facebook",
    utm_medium: "group",
    utm_campaign: "blog_guide",
    quality_notes: "Day 9 calendar post from docs/community-posting-calendar.md.",
    next_action: "review group rules",
  },
  {
    post_id: "cal-reddit-youtube-brief-001",
    status: "planned",
    platform: "reddit",
    community_name: "Creator or agency community",
    community_url: "",
    audience: "hiring",
    angle: "YouTube editor brief",
    question: "What should a YouTube editor job description include beyond software?",
    target_url: "https://videoeditorjobs.com/blog/youtube-video-editor-job-description/?utm_source=reddit&utm_medium=community&utm_campaign=blog_guide",
    utm_source: "reddit",
    utm_medium: "community",
    utm_campaign: "blog_guide",
    quality_notes: "Day 12 calendar post from docs/community-posting-calendar.md.",
    next_action: "find creator community",
  },
];

function doPost(event) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const payload = JSON.parse(event.postData.contents || "{}");
    return jsonResponse(appendSubmission(payload));
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error) });
  } finally {
    lock.releaseLock();
  }
}

function doGet(event) {
  if (event && event.parameter && event.parameter.action === "jobs") {
    return jsonResponse(publicJobs());
  }

  const spreadsheet = SpreadsheetApp.openById(CONFIG.spreadsheetId);
  return jsonResponse({
    ok: true,
    scriptVersion: SCRIPT_VERSION,
    spreadsheetId: CONFIG.spreadsheetId,
    spreadsheetName: spreadsheet.getName(),
    sheets: spreadsheet.getSheets().map((sheet) => sheet.getName()),
    checkedAt: new Date().toISOString(),
  });
}

function publicJobs() {
  const sheet = getOrCreateSheet(CONFIG.hiringSheetName);
  const values = sheet.getDataRange().getDisplayValues();
  const headers = values.shift() || [];
  const jobs = values
    .map((row) => rowToObject(row, headers))
    .filter(
      (row) =>
        String(row.kind || "").toLowerCase() === "hiring" &&
        String(row.source_bucket || "").toLowerCase() === "reddit.com" &&
        /^https:\/\/(www\.)?reddit\.com\/r\/VideoEditingJobs\/comments\//i.test(String(row.page_url || ""))
    )
    .map(toPublicJob)
    .sort((a, b) => String(b.dateListed).localeCompare(String(a.dateListed)) || String(a.id).localeCompare(String(b.id)));

  return {
    ok: true,
    scriptVersion: SCRIPT_VERSION,
    generatedAt: new Date().toISOString(),
    jobCount: jobs.length,
    jobs,
  };
}

function rowToObject(row, headers) {
  const record = {};
  headers.forEach((header, index) => {
    if (header) record[header] = row[index];
  });
  return record;
}

function toPublicJob(row) {
  const username = String(row.name || "").replace(/^u\//i, "").trim();
  return {
    id: String(row.submission_id || "").trim(),
    title: String(row.page_title || row.role_type || row.primary_fit || "Video editor needed").trim(),
    company: String(row.company || "").trim() || (username ? `u/${username}` : "Reddit hiring post"),
    location: String(row.location || row.work_preference || "Remote / see post").trim(),
    dateListed: String(row.created_at || "").slice(0, 10),
    sourceName: "Reddit: r/VideoEditingJobs",
    sourceType: "community hiring post",
    sourceUrl: String(row.page_url || "").trim(),
    roleFamily: String(row.role_type || row.primary_fit || "Video editing").trim(),
    confidence: "direct",
    tags: [row.content_format, row.budget, row.timeline].map((value) => String(value || "").trim()).filter(Boolean).slice(0, 3),
  };
}

function setup() {
  ensureHeaders(getOrCreateSheet(CONFIG.editorSheetName));
  ensureHeaders(getOrCreateSheet(CONFIG.hiringSheetName));
  ensureHeaders(getOrCreateSheet(CONFIG.matchesSheetName), MATCH_HEADERS);
  ensureHeaders(getOrCreateSheet(CONFIG.communityPostsSheetName), COMMUNITY_POST_HEADERS);
  ensureDashboard();
  ensureSourceSummary();
  return {
    ok: true,
    scriptVersion: SCRIPT_VERSION,
    sheets: [
      CONFIG.editorSheetName,
      CONFIG.hiringSheetName,
      CONFIG.matchesSheetName,
      CONFIG.communityPostsSheetName,
      CONFIG.dashboardSheetName,
      CONFIG.sourceSummarySheetName,
    ],
    checkedAt: new Date().toISOString(),
  };
}

function launchHealthCheck() {
  const setupResult = setup();
  const seedResult = seedCommunityPosts();
  const spreadsheet = SpreadsheetApp.openById(CONFIG.spreadsheetId);
  const sheetNames = spreadsheet.getSheets().map((sheet) => sheet.getName());
  const requiredSheets = [
    CONFIG.editorSheetName,
    CONFIG.hiringSheetName,
    CONFIG.matchesSheetName,
    CONFIG.communityPostsSheetName,
    CONFIG.dashboardSheetName,
    CONFIG.sourceSummarySheetName,
  ];
  const missingSheets = requiredSheets.filter((sheetName) => sheetNames.indexOf(sheetName) === -1);
  const communitySheet = getOrCreateSheet(CONFIG.communityPostsSheetName);
  const communityPostIds = getColumnValuesByHeader(communitySheet, "post_id");
  const expectedSeedIds = COMMUNITY_POST_SEEDS.map((seed) => seed.post_id);
  const missingCommunitySeedIds = expectedSeedIds.filter((postId) => communityPostIds.indexOf(postId) === -1);
  const statusCounts = countColumnValues(communitySheet, "status", ["planned", "posted", "needs_reply", "paused", "removed", "done"]);
  const headerChecks = {
    editors: missingHeadersForSheet(CONFIG.editorSheetName, HEADERS),
    hiringRequests: missingHeadersForSheet(CONFIG.hiringSheetName, HEADERS),
    matches: missingHeadersForSheet(CONFIG.matchesSheetName, MATCH_HEADERS),
    communityPosts: missingHeadersForSheet(CONFIG.communityPostsSheetName, COMMUNITY_POST_HEADERS),
  };
  const headerOk = Object.keys(headerChecks).every((key) => headerChecks[key].missing.length === 0);
  const ok = !missingSheets.length && headerOk && !missingCommunitySeedIds.length;

  return {
    ok,
    scriptVersion: SCRIPT_VERSION,
    spreadsheetId: CONFIG.spreadsheetId,
    spreadsheetName: spreadsheet.getName(),
    sheets: sheetNames,
    missingSheets,
    setup: setupResult,
    seedCommunityPosts: seedResult,
    headers: headerChecks,
    communityPosts: {
      expectedSeeds: expectedSeedIds.length,
      presentSeeds: expectedSeedIds.length - missingCommunitySeedIds.length,
      missingSeedIds: missingCommunitySeedIds,
      planned: statusCounts.planned || 0,
      posted: statusCounts.posted || 0,
      needs_reply: statusCounts.needs_reply || 0,
      paused: statusCounts.paused || 0,
      removed: statusCounts.removed || 0,
      done: statusCounts.done || 0,
    },
    nextStep: ok ? "Deploy Web App and run npm run smoke:intake with the /exec URL." : "Fix missing sheets, headers, or community seed rows before deploying.",
    checkedAt: new Date().toISOString(),
  };
}

function seedCommunityPosts() {
  setup();
  const sheet = getOrCreateSheet(CONFIG.communityPostsSheetName);
  ensureHeaders(sheet, COMMUNITY_POST_HEADERS);
  const headers = getHeaderRow(sheet);
  const postIdColumn = headers.indexOf("post_id") + 1;
  const existingIds = postIdColumn && sheet.getLastRow() > 1
    ? sheet.getRange(2, postIdColumn, sheet.getLastRow() - 1, 1).getValues().map((row) => String(row[0] || ""))
    : [];
  let inserted = 0;

  COMMUNITY_POST_SEEDS.forEach((seed) => {
    if (existingIds.indexOf(seed.post_id) !== -1) {
      return;
    }
    sheet.appendRow(toCommunityPostRow(seed, headers));
    existingIds.push(seed.post_id);
    inserted += 1;
  });

  return { ok: true, scriptVersion: SCRIPT_VERSION, inserted, totalSeeds: COMMUNITY_POST_SEEDS.length };
}

function testSubmission() {
  setup();
  const timestamp = new Date().toISOString();
  const editorResult = appendSubmission({
    submission_id: `editor-test-${Date.now()}`,
    kind: "editor",
    created_at: timestamp,
    page_url: "https://videoeditorjobs.com/editors/?utm_source=apps_script&utm_medium=test&utm_campaign=integration_test",
    page_path: "/editors/",
    page_title: "Join as a Video Editor",
    referrer: "Apps Script test",
    user_agent: "Apps Script",
    consent: "yes",
    consent_at: timestamp,
    consent_text: "I agree to be contacted about video editor jobs, hiring matches, and community updates, and I accept the terms and privacy policy.",
    tracking: {
      utm_source: "apps_script",
      utm_medium: "test",
      utm_campaign: "integration_test",
    },
    fields: {
      name: "Apps Script Test Editor",
      email: "test-editor@example.com",
      location: "Test timezone",
      primary_fit: "YouTube editor work",
      experience_level: "Professional editor",
      work_preference: "Remote only",
      portfolio_url: "https://example.com/editor",
      rate_range: "$50/hr",
      weekly_capacity: "10 hrs/week",
      software: "Premiere, Resolve",
      turnaround_time: "3 to 5 days",
      availability: "Available now",
      notes: "Generated by testSubmission(). Delete after verification.",
      consent: "yes",
    },
  });
  const hiringResult = appendSubmission({
    submission_id: `hiring-test-${Date.now()}`,
    kind: "hiring",
    created_at: timestamp,
    page_url: "https://videoeditorjobs.com/hire-video-editor/?utm_source=apps_script&utm_medium=test&utm_campaign=integration_test",
    page_path: "/hire-video-editor/",
    page_title: "Hire a Video Editor",
    referrer: "Apps Script test",
    user_agent: "Apps Script",
    consent: "yes",
    consent_at: timestamp,
    consent_text: "I agree to be contacted about video editor jobs, hiring matches, and community updates, and I accept the terms and privacy policy.",
    tracking: {
      utm_source: "apps_script",
      utm_medium: "test",
      utm_campaign: "integration_test",
    },
    fields: {
      name: "Apps Script Test Hiring",
      email: "test-hiring@example.com",
      company: "Test Channel",
      role_type: "YouTube editor",
      budget: "$800/video",
      timeline: "This month",
      location: "Remote",
      content_format: "YouTube, Shorts",
      project_scope: "Weekly channel",
      deliverables: "1 long-form video and 3 shorts",
      footage_volume: "90 minutes raw footage per week",
      software: "Premiere, Frame.io, Google Drive",
      revision_process: "One producer review, one revision round, final approval by channel owner.",
      reference_urls: "https://example.com/reference",
      brief: "Generated by testSubmission(). Delete after verification.",
      consent: "yes",
    },
  });
  const matchSuggestionResult = suggestMatches(5);
  return { ok: true, scriptVersion: SCRIPT_VERSION, editorResult, hiringResult, matchSuggestionResult };
}

function cleanupTestSubmissions() {
  setup();
  const editorResult = deleteRowsWhere(getOrCreateSheet(CONFIG.editorSheetName), isTestIntakeRow);
  const hiringResult = deleteRowsWhere(getOrCreateSheet(CONFIG.hiringSheetName), isTestIntakeRow);
  const matchResult = deleteRowsWhere(getOrCreateSheet(CONFIG.matchesSheetName), isTestMatchRow);
  return {
    ok: true,
    scriptVersion: SCRIPT_VERSION,
    editorsDeleted: editorResult.deleted,
    hiringBriefsDeleted: hiringResult.deleted,
    matchesDeleted: matchResult.deleted,
    checkedAt: new Date().toISOString(),
  };
}

function isTestIntakeRow(row) {
  const submissionId = cell(row, "submission_id");
  const email = cell(row, "email");
  const notes = `${cell(row, "notes")} ${cell(row, "brief")}`;
  return (
    /^editor-test-\d+$/.test(submissionId) ||
    /^hiring-test-\d+$/.test(submissionId) ||
    /^test-(editor|hiring)@example\.com$/i.test(email) ||
    notes.indexOf("Generated by testSubmission(). Delete after verification.") !== -1
  );
}

function isTestMatchRow(row) {
  const editorId = cell(row, "editor_submission_id");
  const hiringId = cell(row, "hiring_submission_id");
  const status = cell(row, "status");
  return status === "proposed" && (/^editor-test-\d+$/.test(editorId) || /^hiring-test-\d+$/.test(hiringId));
}

function deleteRowsWhere(sheet, predicate) {
  const rows = getRowsAsObjects(sheet);
  let deleted = 0;
  rows
    .filter(predicate)
    .map((row) => row._rowNumber)
    .sort((a, b) => b - a)
    .forEach((rowNumber) => {
      sheet.deleteRow(rowNumber);
      deleted += 1;
    });
  return { deleted };
}

function appendSubmission(payload) {
  payload = payload || {};
  const kind = payload.kind === "hiring" ? "hiring" : "editor";
  if (isHoneypotSpam(payload)) {
    return { ok: true, scriptVersion: SCRIPT_VERSION, spam: true, kind, submission_id: payload.submission_id || "" };
  }

  const validation = validatePayload(payload, kind);
  if (!validation.ok) {
    return { ok: false, error: validation.error, kind, submission_id: payload.submission_id || "" };
  }

  const sheetName = kind === "hiring" ? CONFIG.hiringSheetName : CONFIG.editorSheetName;
  const sheet = getOrCreateSheet(sheetName);
  ensureHeaders(sheet);
  if (isDuplicateSubmission(sheet, payload.submission_id)) {
    return { ok: true, scriptVersion: SCRIPT_VERSION, duplicate: true, kind, submission_id: payload.submission_id };
  }
  const triage = triageSubmission(payload, kind);
  const enrichedPayload = Object.assign({}, payload, { kind, triage });
  sheet.appendRow(toRow(enrichedPayload, getHeaderRow(sheet)));
  const notification = sendSubmissionNotification(enrichedPayload);
  const confirmation = sendSubmitterConfirmation(enrichedPayload);
  return {
    ok: true,
    scriptVersion: SCRIPT_VERSION,
    duplicate: false,
    kind,
    submission_id: payload.submission_id,
    triage,
    notification,
    confirmation,
  };
}

function validatePayload(payload, kind) {
  const fields = payload.fields || {};
  const requiredFields = kind === "hiring" ? ["name", "email", "role_type", "brief"] : ["name", "email", "primary_fit", "portfolio_url"];

  if (!String(payload.submission_id || "").trim()) {
    return { ok: false, error: "missing required field: submission_id" };
  }

  for (let index = 0; index < requiredFields.length; index += 1) {
    const fieldName = requiredFields[index];
    if (!String(fields[fieldName] || "").trim()) {
      return { ok: false, error: `missing required field: ${fieldName}` };
    }
  }

  if (!isValidEmail(fields.email)) {
    return { ok: false, error: "invalid email" };
  }

  if (String(fields.consent || "").toLowerCase() !== "yes") {
    return { ok: false, error: "missing consent" };
  }

  return { ok: true };
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

function isHoneypotSpam(payload) {
  const fields = payload.fields || {};
  return Boolean(String(fields.website || payload.website || "").trim());
}

function triageSubmission(payload, kind) {
  const fields = payload.fields || {};
  const tracking = payload.tracking || {};
  const reasons = [];
  let score = 0;

  if (tracking.utm_source || tracking.utm_campaign || tracking.ref) {
    score += 1;
    reasons.push("tracked source");
  }

  if (kind === "hiring") {
    score += scoreField(fields.role_type, 1, "role type present", reasons);
    score += scoreField(fields.budget, 2, "budget present", reasons);
    score += scoreField(fields.timeline, 1, "timeline present", reasons);
    score += scoreField(fields.content_format, 1, "format present", reasons);
    score += scoreField(fields.deliverables, 1, "deliverables present", reasons);
    score += scoreField(fields.footage_volume, 1, "footage volume present", reasons);
    score += scoreField(fields.revision_process, 1, "revision process present", reasons);
    score += scoreField(fields.reference_urls, 1, "references present", reasons);
    if (String(fields.brief || "").trim().length >= 120) {
      score += 2;
      reasons.push("detailed brief");
    } else {
      reasons.push("brief needs more detail");
    }
  } else {
    score += scoreField(fields.primary_fit, 1, "fit present", reasons);
    score += scoreField(fields.portfolio_url, 3, "portfolio present", reasons);
    score += scoreField(fields.experience_level, 1, "experience present", reasons);
    score += scoreField(fields.work_preference, 1, "work preference present", reasons);
    score += scoreField(fields.rate_range, 1, "rate present", reasons);
    score += scoreField(fields.weekly_capacity, 1, "capacity present", reasons);
    score += scoreField(fields.software, 1, "software present", reasons);
    score += scoreField(fields.turnaround_time, 1, "turnaround present", reasons);
    if (String(fields.notes || "").trim().length >= 80) {
      score += 1;
      reasons.push("useful notes");
    }
  }

  score = Math.min(score, 10);
  return {
    source_bucket: sourceBucket(payload),
    lead_score: score,
    priority: score >= 7 ? "high" : score >= 4 ? "medium" : "low",
    next_action: nextAction(kind, fields, score),
    review_reason: reasons.slice(0, 6).join("; "),
  };
}

function scoreField(value, points, reason, reasons) {
  if (!String(value || "").trim()) {
    return 0;
  }
  reasons.push(reason);
  return points;
}

function sourceBucket(payload) {
  const tracking = payload.tracking || {};
  const source = String(tracking.utm_source || "").toLowerCase();
  const medium = String(tracking.utm_medium || "").toLowerCase();
  const referrer = String(payload.referrer || "").toLowerCase();
  const pagePath = String(payload.page_path || "").toLowerCase();

  if (source) return source;
  if (medium === "community" || pagePath.indexOf("community") !== -1) return "community";
  if (referrer.indexOf("reddit") !== -1) return "reddit";
  if (referrer.indexOf("facebook") !== -1 || referrer.indexOf("fb.") !== -1) return "facebook";
  if (referrer.indexOf("google") !== -1 || referrer.indexOf("bing") !== -1) return "organic";
  if (referrer) return "referral";
  return "direct";
}

function nextAction(kind, fields, score) {
  if (kind === "hiring") {
    if (!fields.budget || !fields.timeline || !fields.reference_urls || !fields.revision_process) {
      return "ask for brief details";
    }
    return score >= 7 ? "find hiring match" : "review";
  }

  if (!fields.portfolio_url) return "ask for portfolio";
  if (!fields.rate_range || !fields.weekly_capacity) return "email editor";
  return score >= 7 ? "review" : "email editor";
}

function getOrCreateSheet(name) {
  const spreadsheet = SpreadsheetApp.openById(CONFIG.spreadsheetId);
  return spreadsheet.getSheetByName(name) || spreadsheet.insertSheet(name);
}

function ensureDashboard() {
  const sheet = getOrCreateSheet(CONFIG.dashboardSheetName);
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

  sheet.clear();
  sheet.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
  sheet.getRange("B3:B13").setFormulas([
    [`=COUNTIF('${CONFIG.editorSheetName}'!D2:D,"new")`],
    [`=COUNTIF('${CONFIG.hiringSheetName}'!D2:D,"new")`],
    [`=COUNTIF('${CONFIG.editorSheetName}'!E2:E,"high")`],
    [`=COUNTIF('${CONFIG.hiringSheetName}'!E2:E,"high")`],
    [`=COUNTIF('${CONFIG.matchesSheetName}'!C2:C,"proposed")+COUNTIF('${CONFIG.matchesSheetName}'!C2:C,"active")`],
    [`=COUNTIF('${CONFIG.matchesSheetName}'!C2:C,"intro_sent")`],
    [`=COUNTIF('${CONFIG.communityPostsSheetName}'!C2:C,"planned")`],
    [`=COUNTIF('${CONFIG.communityPostsSheetName}'!C2:C,"posted")`],
    [`=COUNTIF('${CONFIG.communityPostsSheetName}'!C2:C,"needs_reply")`],
    [`=MAX(COUNTA('${CONFIG.editorSheetName}'!B2:B),0)`],
    [`=MAX(COUNTA('${CONFIG.hiringSheetName}'!B2:B),0)`],
  ]);
  sheet.getRange("A1:C1").merge();
  sheet.getRange("A1").setFontWeight("bold").setFontSize(14);
  sheet.getRange("A2:C2").setFontWeight("bold");
  sheet.setFrozenRows(2);
  sheet.autoResizeColumns(1, 3);
}

function ensureSourceSummary() {
  const sheet = getOrCreateSheet(CONFIG.sourceSummarySheetName);
  const sources = ["reddit", "facebook", "forum", "community", "referral", "organic", "direct", "apps_script", "smoke", "manual"];
  const campaigns = [
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

  sheet.clear();
  sheet.getRange(1, 1, rows.length, 4).setValues(rows);
  for (let index = 0; index < sources.length; index += 1) {
    const row = 4 + index;
    sheet.getRange(row, 2).setFormula(countByHeaderFormula(CONFIG.editorSheetName, "utm_source", sources[index]));
    sheet.getRange(row, 3).setFormula(countByHeaderFormula(CONFIG.hiringSheetName, "utm_source", sources[index]));
  }

  const campaignStartRow = 4 + sources.length + 3;
  for (let index = 0; index < campaigns.length; index += 1) {
    const row = campaignStartRow + index;
    sheet.getRange(row, 2).setFormula(countByHeaderFormula(CONFIG.editorSheetName, "utm_campaign", campaigns[index]));
    sheet.getRange(row, 3).setFormula(countByHeaderFormula(CONFIG.hiringSheetName, "utm_campaign", campaigns[index]));
  }

  const pageStartRow = campaignStartRow + campaigns.length + 3;
  for (let index = 0; index < pages.length; index += 1) {
    const row = pageStartRow + index;
    sheet.getRange(row, 2).setFormula(countByHeaderFormula(CONFIG.editorSheetName, "page_path", pages[index]));
    sheet.getRange(row, 3).setFormula(countByHeaderFormula(CONFIG.hiringSheetName, "page_path", pages[index]));
  }

  sheet.getRange("A1:D1").merge();
  sheet.getRange("A1").setFontWeight("bold").setFontSize(14);
  sheet.getRange(2, 1, rows.length - 1, 1).setFontWeight("bold");
  sheet.getRange("A3:D3").setFontWeight("bold");
  sheet.getRange(campaignStartRow - 1, 1, 1, 4).setFontWeight("bold");
  sheet.getRange(pageStartRow - 1, 1, 1, 4).setFontWeight("bold");
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, 4);
}

function countByHeaderFormula(sheetName, headerName, value) {
  const quoted = quoteSheetName(sheetName);
  return `=COUNTIF(INDEX(${quoted}!A:ZZ,,MATCH("${headerName}",${quoted}!1:1,0)),"${String(value).replace(/"/g, '""')}")`;
}

function quoteSheetName(sheetName) {
  return `'${String(sheetName).replace(/'/g, "''")}'`;
}

function ensureHeaders(sheet, headers) {
  const headerRow = headers || HEADERS;
  const current = sheet.getRange(1, 1, 1, headerRow.length).getValues()[0];
  const hasHeaders = current.some(Boolean);
  if (!hasHeaders) {
    sheet.getRange(1, 1, 1, headerRow.length).setValues([headerRow]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headerRow.length).setFontWeight("bold");
    sheet.autoResizeColumns(1, headerRow.length);
    if (!sheet.getFilter()) {
      sheet.getRange(1, 1, 1, headerRow.length).createFilter();
    }
    return;
  }

  const existingHeaders = getHeaderRow(sheet);
  const existingHeaderNames = existingHeaders.filter(Boolean);
  const missingHeaders = headerRow.filter((header) => existingHeaderNames.indexOf(header) === -1);
  if (!missingHeaders.length) {
    return;
  }

  const startColumn = sheet.getLastColumn() + 1;
  sheet.getRange(1, startColumn, 1, missingHeaders.length).setValues([missingHeaders]);
  sheet.getRange(1, startColumn, 1, missingHeaders.length).setFontWeight("bold");
  sheet.autoResizeColumns(startColumn, missingHeaders.length);
  if (!sheet.getFilter()) {
    sheet.getRange(1, 1, Math.max(sheet.getLastRow(), 1), sheet.getLastColumn()).createFilter();
  }
}

function getHeaderRow(sheet) {
  const lastColumn = Math.max(sheet.getLastColumn(), 1);
  return sheet.getRange(1, 1, 1, lastColumn).getValues()[0].map((header) => String(header || "").trim());
}

function missingHeadersForSheet(sheetName, expectedHeaders) {
  const sheet = getOrCreateSheet(sheetName);
  const headers = getHeaderRow(sheet);
  const missing = expectedHeaders.filter((header) => headers.indexOf(header) === -1);
  return {
    sheetName,
    expected: expectedHeaders.length,
    present: expectedHeaders.length - missing.length,
    missing,
  };
}

function getColumnValuesByHeader(sheet, headerName) {
  const headers = getHeaderRow(sheet);
  const column = headers.indexOf(headerName) + 1;
  if (!column || sheet.getLastRow() < 2) {
    return [];
  }
  return sheet
    .getRange(2, column, sheet.getLastRow() - 1, 1)
    .getValues()
    .map((row) => String(row[0] || ""))
    .filter(Boolean);
}

function countColumnValues(sheet, headerName, values) {
  const counts = {};
  values.forEach((value) => {
    counts[value] = 0;
  });
  getColumnValuesByHeader(sheet, headerName).forEach((value) => {
    if (Object.prototype.hasOwnProperty.call(counts, value)) {
      counts[value] += 1;
    }
  });
  return counts;
}

function isDuplicateSubmission(sheet, submissionId) {
  if (!submissionId || sheet.getLastRow() < 2) {
    return false;
  }

  const submissionIdColumn = getHeaderRow(sheet).indexOf("submission_id") + 1;
  if (!submissionIdColumn) {
    return false;
  }

  const values = sheet.getRange(2, submissionIdColumn, sheet.getLastRow() - 1, 1).getValues();
  return values.some((row) => row[0] === submissionId);
}

function toRow(payload, headers) {
  const fields = payload.fields || {};
  const tracking = payload.tracking || {};
  const triage = payload.triage || triageSubmission(payload, payload.kind === "hiring" ? "hiring" : "editor");
  const values = {
    created_at: payload.created_at || new Date().toISOString(),
    submission_id: payload.submission_id || "",
    kind: payload.kind || "",
    status: "new",
    priority: triage.priority || "",
    owner: "",
    next_action: triage.next_action || "review",
    last_contacted_at: "",
    review_notes: "",
    source_bucket: triage.source_bucket || "",
    lead_score: triage.lead_score || "",
    review_reason: triage.review_reason || "",
    consent: payload.consent || fields.consent || "",
    consent_at: payload.consent_at || "",
    consent_text: payload.consent_text || "",
    name: fields.name || "",
    email: fields.email || "",
    company: fields.company || "",
    location: fields.location || "",
    primary_fit: fields.primary_fit || "",
    role_type: fields.role_type || "",
    experience_level: fields.experience_level || "",
    work_preference: fields.work_preference || "",
    portfolio_url: fields.portfolio_url || "",
    rate_range: fields.rate_range || "",
    weekly_capacity: fields.weekly_capacity || "",
    budget: fields.budget || "",
    timeline: fields.timeline || "",
    content_format: fields.content_format || "",
    project_scope: fields.project_scope || "",
    deliverables: fields.deliverables || "",
    footage_volume: fields.footage_volume || "",
    software: fields.software || "",
    turnaround_time: fields.turnaround_time || "",
    availability: fields.availability || "",
    revision_process: fields.revision_process || "",
    reference_urls: fields.reference_urls || "",
    notes: fields.notes || "",
    brief: fields.brief || "",
    page_url: payload.page_url || "",
    page_path: payload.page_path || "",
    page_title: payload.page_title || "",
    referrer: payload.referrer || "",
    utm_source: tracking.utm_source || "",
    utm_medium: tracking.utm_medium || "",
    utm_campaign: tracking.utm_campaign || "",
    utm_content: tracking.utm_content || "",
    utm_term: tracking.utm_term || "",
    ref: tracking.ref || "",
    user_agent: payload.user_agent || "",
    raw_payload: JSON.stringify(payload),
  };

  return (headers || HEADERS).map((header) => values[header] || "");
}

function toCommunityPostRow(seed, headers) {
  const values = {
    created_at: seed.created_at || new Date().toISOString(),
    post_id: seed.post_id || "",
    status: seed.status || "planned",
    platform: seed.platform || "",
    community_name: seed.community_name || "",
    community_url: seed.community_url || "",
    post_url: seed.post_url || "",
    audience: seed.audience || "",
    angle: seed.angle || "",
    question: seed.question || "",
    target_url: seed.target_url || "",
    utm_source: seed.utm_source || "",
    utm_medium: seed.utm_medium || "",
    utm_campaign: seed.utm_campaign || "",
    posted_at: seed.posted_at || "",
    replies_count: seed.replies_count || 0,
    submissions_count: seed.submissions_count || 0,
    quality_notes: seed.quality_notes || "",
    next_action: seed.next_action || "",
    owner: seed.owner || "",
  };

  return (headers || COMMUNITY_POST_HEADERS).map((header) => values[header] || "");
}

function suggestMatches(limit) {
  setup();
  const maxSuggestions = Math.max(1, Math.min(Number(limit) || 25, 100));
  const editorRows = getRowsAsObjects(getOrCreateSheet(CONFIG.editorSheetName)).filter((row) => isMatchableEditor(row));
  const hiringRows = getRowsAsObjects(getOrCreateSheet(CONFIG.hiringSheetName)).filter((row) => isMatchableHiring(row));
  const matchesSheet = getOrCreateSheet(CONFIG.matchesSheetName);
  ensureHeaders(matchesSheet, MATCH_HEADERS);
  const existingKeys = existingMatchKeys(matchesSheet);
  const suggestions = [];

  editorRows.forEach((editor) => {
    hiringRows.forEach((hiring) => {
      const editorId = cell(editor, "submission_id");
      const hiringId = cell(hiring, "submission_id");
      const key = `${editorId}::${hiringId}`;
      if (!editorId || !hiringId || existingKeys[key]) {
        return;
      }
      const score = scoreMatch(editor, hiring);
      if (score.score < 4) {
        return;
      }
      suggestions.push({
        score: score.score,
        reasons: score.reasons,
        editor,
        hiring,
      });
    });
  });

  suggestions
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSuggestions)
    .forEach((suggestion) => {
      matchesSheet.appendRow(toMatchRow(suggestion, getHeaderRow(matchesSheet)));
    });

  return {
    ok: true,
    editorsConsidered: editorRows.length,
    hiringBriefsConsidered: hiringRows.length,
    suggestionsCreated: Math.min(suggestions.length, maxSuggestions),
    candidatesFound: suggestions.length,
    checkedAt: new Date().toISOString(),
  };
}

function isMatchableEditor(row) {
  const status = cell(row, "status").toLowerCase();
  return cell(row, "submission_id") && status !== "spam" && status !== "closed" && status !== "not_fit";
}

function isMatchableHiring(row) {
  const status = cell(row, "status").toLowerCase();
  return cell(row, "submission_id") && status !== "spam" && status !== "closed" && status !== "not_fit";
}

function existingMatchKeys(sheet) {
  const rows = getRowsAsObjects(sheet);
  const keys = {};
  rows.forEach((row) => {
    const editorId = cell(row, "editor_submission_id");
    const hiringId = cell(row, "hiring_submission_id");
    if (editorId && hiringId) {
      keys[`${editorId}::${hiringId}`] = true;
    }
  });
  return keys;
}

function scoreMatch(editor, hiring) {
  const reasons = [];
  let score = 0;
  const editorText = [
    cell(editor, "primary_fit"),
    cell(editor, "experience_level"),
    cell(editor, "work_preference"),
    cell(editor, "software"),
    cell(editor, "notes"),
  ].join(" ");
  const hiringText = [
    cell(hiring, "role_type"),
    cell(hiring, "content_format"),
    cell(hiring, "project_scope"),
    cell(hiring, "deliverables"),
    cell(hiring, "software"),
    cell(hiring, "brief"),
  ].join(" ");

  if (sharedKeywords(editorText, hiringText, ["youtube", "shorts", "short-form", "podcast", "brand", "agency", "social", "paid", "assistant"]).length) {
    score += 3;
    reasons.push("format overlap");
  }
  if (sharedKeywords(cell(editor, "software"), cell(hiring, "software"), ["premiere", "resolve", "final cut", "after effects", "frame.io", "drive"]).length) {
    score += 1;
    reasons.push("software overlap");
  }
  if (locationCompatible(cell(editor, "location"), cell(editor, "work_preference"), cell(hiring, "location"))) {
    score += 1;
    reasons.push("location/work preference compatible");
  }
  if (cell(editor, "portfolio_url")) {
    score += 1;
    reasons.push("portfolio available");
  }
  if (cell(editor, "weekly_capacity") && cell(hiring, "timeline")) {
    score += 1;
    reasons.push("capacity and timeline present");
  }
  if (cell(editor, "rate_range") && cell(hiring, "budget")) {
    score += 1;
    reasons.push("rate and budget present");
  }
  if (Number(cell(editor, "lead_score")) >= 7) {
    score += 1;
    reasons.push("high-quality editor profile");
  }
  if (Number(cell(hiring, "lead_score")) >= 7) {
    score += 1;
    reasons.push("high-quality hiring brief");
  }

  return { score, reasons };
}

function sharedKeywords(left, right, keywords) {
  const leftText = String(left || "").toLowerCase();
  const rightText = String(right || "").toLowerCase();
  return keywords.filter((keyword) => leftText.indexOf(keyword) !== -1 && rightText.indexOf(keyword) !== -1);
}

function locationCompatible(editorLocation, workPreference, hiringLocation) {
  const editor = `${editorLocation || ""} ${workPreference || ""}`.toLowerCase();
  const hiring = String(hiringLocation || "").toLowerCase();
  if (!hiring || hiring.indexOf("remote") !== -1) return true;
  if (editor.indexOf("remote") !== -1 && hiring.indexOf("remote") !== -1) return true;
  return Boolean(editor && hiring && (editor.indexOf(hiring) !== -1 || hiring.indexOf(editor) !== -1));
}

function toMatchRow(suggestion, headers) {
  const editor = suggestion.editor;
  const hiring = suggestion.hiring;
  const editorId = cell(editor, "submission_id");
  const hiringId = cell(hiring, "submission_id");
  const values = {
    created_at: new Date().toISOString(),
    match_id: `match-${Utilities.getUuid().slice(0, 8)}`,
    status: "proposed",
    editor_submission_id: editorId,
    hiring_submission_id: hiringId,
    editor_name: cell(editor, "name"),
    hiring_name: cell(hiring, "name") || cell(hiring, "company"),
    role_or_fit: cell(hiring, "role_type") || cell(editor, "primary_fit"),
    budget_or_rate: [cell(hiring, "budget"), cell(editor, "rate_range")].filter(Boolean).join(" / "),
    match_notes: `Score ${suggestion.score}: ${suggestion.reasons.join("; ")}`,
    intro_sent_at: "",
    outcome: "",
    outcome_notes: "",
  };

  return (headers || MATCH_HEADERS).map((header) => values[header] || "");
}

function getRowsAsObjects(sheet) {
  const headers = getHeaderRow(sheet);
  if (sheet.getLastRow() < 2 || !headers.length) {
    return [];
  }
  return sheet
    .getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn())
    .getValues()
    .map((values, index) => {
      const row = { _rowNumber: index + 2 };
      headers.forEach((header, columnIndex) => {
        if (header) {
          row[header] = values[columnIndex];
        }
      });
      return row;
    });
}

function cell(row, header) {
  return String((row || {})[header] || "").trim();
}

function sendSubmissionNotification(payload) {
  if (!CONFIG.notifyOnSubmission || !CONFIG.notificationEmail) {
    return { sent: false, reason: "disabled" };
  }

  try {
    const fields = payload.fields || {};
    const tracking = payload.tracking || {};
    const kindLabel = payload.kind === "hiring" ? "Hiring brief" : "Editor profile";
    const subject = `[Video Editor Jobs] New ${kindLabel}: ${fields.name || payload.submission_id}`;
    const lines = [
      `${kindLabel} received`,
      "",
      `Name: ${fields.name || ""}`,
      `Email: ${fields.email || ""}`,
      `Company: ${fields.company || ""}`,
      `Primary fit: ${fields.primary_fit || ""}`,
      `Role type: ${fields.role_type || ""}`,
      `Experience: ${fields.experience_level || ""}`,
      `Work preference: ${fields.work_preference || ""}`,
      `Availability: ${fields.availability || ""}`,
      `Weekly capacity: ${fields.weekly_capacity || ""}`,
      `Rate range: ${fields.rate_range || ""}`,
      `Budget: ${fields.budget || ""}`,
      `Timeline: ${fields.timeline || ""}`,
      `Content format: ${fields.content_format || ""}`,
      `Project scope: ${fields.project_scope || ""}`,
      `Deliverables: ${fields.deliverables || ""}`,
      `Footage volume: ${fields.footage_volume || ""}`,
      `Software/workflow: ${fields.software || ""}`,
      `Turnaround: ${fields.turnaround_time || ""}`,
      `Portfolio: ${fields.portfolio_url || ""}`,
      `Reference links: ${fields.reference_urls || ""}`,
      `Source bucket: ${payload.triage?.source_bucket || ""}`,
      `Lead score: ${payload.triage?.lead_score || ""}`,
      `Priority: ${payload.triage?.priority || ""}`,
      `Next action: ${payload.triage?.next_action || ""}`,
      `Review reason: ${payload.triage?.review_reason || ""}`,
      "",
      `Notes: ${fields.notes || ""}`,
      `Brief: ${fields.brief || ""}`,
      `Revision process: ${fields.revision_process || ""}`,
      "",
      `Submission ID: ${payload.submission_id || ""}`,
      `Created at: ${payload.created_at || ""}`,
      `Page: ${payload.page_url || ""}`,
      `UTM source: ${tracking.utm_source || ""}`,
      `UTM medium: ${tracking.utm_medium || ""}`,
      `UTM campaign: ${tracking.utm_campaign || ""}`,
      "",
      `Sheet: https://docs.google.com/spreadsheets/d/${CONFIG.spreadsheetId}`,
    ];

    MailApp.sendEmail(CONFIG.notificationEmail, subject, lines.join("\n"));
    return { sent: true };
  } catch (error) {
    return { sent: false, error: String(error) };
  }
}

function sendSubmitterConfirmation(payload) {
  if (!CONFIG.sendConfirmationEmail) {
    return { sent: false, reason: "disabled" };
  }

  const fields = payload.fields || {};
  const email = String(fields.email || "").trim();
  if (!isValidEmail(email)) {
    return { sent: false, reason: "missing_or_invalid_email" };
  }

  if (/@example\.(com|org|net)$/i.test(email)) {
    return { sent: false, reason: "example_email" };
  }

  try {
    const isHiring = payload.kind === "hiring";
    const subject = isHiring
      ? "We received your Video Editor Jobs hiring brief"
      : "You are on the Video Editor Jobs editor list";
    const lines = isHiring
      ? confirmationHiringLines(payload)
      : confirmationEditorLines(payload);

    MailApp.sendEmail(email, subject, lines.join("\n"), {
      name: CONFIG.confirmationEmailName,
      replyTo: CONFIG.notificationEmail,
    });
    return { sent: true };
  } catch (error) {
    return { sent: false, error: String(error) };
  }
}

function confirmationEditorLines(payload) {
  const fields = payload.fields || {};
  return [
    `Hi ${firstName(fields.name) || "there"},`,
    "",
    "Thanks for joining the Video Editor Jobs editor list. Your profile is in the review queue.",
    "",
    "What we received:",
    `Primary fit: ${fields.primary_fit || ""}`,
    `Portfolio: ${fields.portfolio_url || ""}`,
    `Experience: ${fields.experience_level || ""}`,
    `Work preference: ${fields.work_preference || ""}`,
    `Availability: ${fields.availability || ""}`,
    "",
    "What happens next:",
    "We review portfolios, work preferences, availability, and source context as hiring briefs come in.",
    "If a brief looks relevant, we may follow up by email for more detail or a possible intro.",
    "",
    `Submission ID: ${payload.submission_id || ""}`,
    "",
    "Video Editor Jobs",
    "https://videoeditorjobs.com",
  ];
}

function confirmationHiringLines(payload) {
  const fields = payload.fields || {};
  return [
    `Hi ${firstName(fields.name) || "there"},`,
    "",
    "Thanks for sending a Video Editor Jobs hiring brief. Your request is in the review queue.",
    "",
    "What we received:",
    `Role type: ${fields.role_type || ""}`,
    `Budget: ${fields.budget || ""}`,
    `Timeline: ${fields.timeline || ""}`,
    `Content format: ${fields.content_format || ""}`,
    `Project scope: ${fields.project_scope || ""}`,
    "",
    "What happens next:",
    "We review budget, scope, references, revision process, and timeline before looking for matching editors.",
    "If the brief needs more detail, we may follow up by email.",
    "",
    `Submission ID: ${payload.submission_id || ""}`,
    "",
    "Video Editor Jobs",
    "https://videoeditorjobs.com",
  ];
}

function firstName(name) {
  return String(name || "").trim().split(/\s+/)[0] || "";
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
