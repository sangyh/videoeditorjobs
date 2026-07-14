import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { defaultIntakeEndpoint, loadLocalEnv } from "./env.mjs";

await loadLocalEnv();

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outFile = join(root, "src", "sheet-jobs-data.mjs");
const inputArg = process.argv.find((arg) => arg.startsWith("--input="));
const strict = process.argv.includes("--strict");
const endpoint = process.env.VEJ_JOBS_ENDPOINT || `${process.env.VEJ_INTAKE_ENDPOINT || defaultIntakeEndpoint}?action=jobs`;

const sheetExportHeaders = [
  "created_at",
  "submission_id",
  "kind",
  "status",
  "priority",
  "owner",
  "next_action",
  "last_contacted_at",
  "review_notes",
  "name",
  "email",
  "company",
  "location",
  "primary_fit",
  "role_type",
  "portfolio_url",
  "rate_range",
  "budget",
  "timeline",
  "content_format",
  "software",
  "availability",
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
  "consent",
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
];

function clean(value = "") {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function rowToRecord(row) {
  return Object.fromEntries(sheetExportHeaders.map((header, index) => [header, row[index] ?? ""]));
}

function publicJobId(value) {
  return clean(value).replace(/^reddit-/i, "job-");
}

function publicJobFromRecord(record) {
  const id = publicJobId(record.submission_id);
  return {
    id,
    title: clean(record.page_title || record.role_type || record.primary_fit || "Video editor needed"),
    company: clean(record.company) || "Independent creator",
    location: clean(record.location || record.work_preference) || "Remote / see post",
    dateListed: clean(record.created_at).slice(0, 10),
    sourceName: "VideoEditorJobs",
    sourceType: "marketplace opportunity",
    sourceUrl: `/editors/?job=${encodeURIComponent(id)}`,
    roleFamily: clean(record.role_type || record.primary_fit) || "Video editing",
    confidence: "direct",
    tags: [record.content_format, record.budget, record.timeline].map(clean).filter(Boolean).slice(0, 3),
  };
}

function normalizePublicJob(job) {
  const id = publicJobId(job.id);
  const company = clean(job.company);
  return {
    ...job,
    id,
    company: !company || /^u\//i.test(company) || /reddit/i.test(company) ? "Independent creator" : company,
    sourceName: "VideoEditorJobs",
    sourceType: "marketplace opportunity",
    sourceUrl: `/editors/?job=${encodeURIComponent(id)}`,
  };
}

function jobsFromExport(payload) {
  const rows = Array.isArray(payload) ? payload : payload.rows;
  if (!Array.isArray(rows)) throw new Error("Sheet export must contain a rows array");

  return rows
    .map(rowToRecord)
    .filter(
      (record) =>
        clean(record.kind).toLowerCase() === "hiring" &&
        clean(record.source_bucket).toLowerCase() === "reddit.com" &&
        /^https:\/\/(www\.)?reddit\.com\/r\/VideoEditingJobs\/comments\//i.test(clean(record.page_url))
    )
    .map(publicJobFromRecord);
}

function validateJobs(jobs) {
  if (!Array.isArray(jobs) || !jobs.length) throw new Error("No public jobs were returned");
  const ids = new Set();
  const urls = new Set();

  for (const job of jobs) {
    for (const field of ["id", "title", "dateListed", "sourceName", "sourceUrl", "roleFamily", "confidence"]) {
      if (!clean(job[field])) throw new Error(`Job is missing ${field}: ${JSON.stringify(job)}`);
    }
    if (!/^\/editors\/\?job=[a-z0-9%._~-]+$/i.test(job.sourceUrl)) throw new Error(`Unexpected application URL: ${job.sourceUrl}`);
    if (/reddit/i.test(`${job.company} ${job.sourceName} ${job.sourceType} ${job.sourceUrl}`)) {
      throw new Error(`Public job exposed its acquisition source: ${job.id}`);
    }
    if (ids.has(job.id)) throw new Error(`Duplicate job id: ${job.id}`);
    if (urls.has(job.sourceUrl)) throw new Error(`Duplicate source URL: ${job.sourceUrl}`);
    ids.add(job.id);
    urls.add(job.sourceUrl);
  }
}

async function loadJobs() {
  if (inputArg) {
    const inputPath = inputArg.slice("--input=".length);
    const payload = JSON.parse(await readFile(inputPath, "utf8"));
    return jobsFromExport(payload);
  }

  const response = await fetch(endpoint, { headers: { "user-agent": "VideoEditorJobs.com sheet sync" } });
  const text = await response.text();
  if (!response.ok) throw new Error(`Jobs endpoint returned HTTP ${response.status}: ${text.slice(0, 300)}`);
  const payload = JSON.parse(text);
  if (!payload.ok || !Array.isArray(payload.jobs)) throw new Error(`Jobs endpoint returned no jobs: ${text.slice(0, 300)}`);
  return payload.jobs.map(normalizePublicJob);
}

try {
  const jobs = (await loadJobs()).map(normalizePublicJob);
  validateJobs(jobs);
  jobs.sort((a, b) => b.dateListed.localeCompare(a.dateListed) || a.id.localeCompare(b.id));
  const generatedAt = new Date().toISOString();
  const moduleSource = `// Generated by scripts/sync-sheet-jobs.mjs from public marketplace opportunities in Hiring Requests.\nexport const sheetJobFeedMeta = ${JSON.stringify(
    {
      generatedAt,
      jobCount: jobs.length,
      sourceCount: 1,
      sources: ["VideoEditorJobs marketplace"],
    },
    null,
    2
  )};\n\nexport const sheetJobs = ${JSON.stringify(jobs, null, 2)};\n`;
  await writeFile(outFile, moduleSource);
  console.log(`Wrote ${jobs.length} public sheet jobs to ${outFile}`);
} catch (error) {
  if (strict || !existsSync(outFile)) throw error;
  console.warn(`Sheet jobs sync skipped; preserving committed feed: ${error.message}`);
}
