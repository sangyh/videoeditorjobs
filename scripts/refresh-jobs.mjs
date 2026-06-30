import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outFile = join(root, "src", "jobs-data.mjs");

const cacheDirArg = process.argv.find((arg) => arg.startsWith("--cache-dir="));
const cacheDir = cacheDirArg ? cacheDirArg.split("=").slice(1).join("=") : join(root, ".cache", "job-feeds");
const noFetch = process.argv.includes("--no-fetch");
const maxJobs = Number(process.argv.find((arg) => arg.startsWith("--max="))?.split("=")[1] || 50);

const sourceDefs = [
  {
    id: "remotive-video",
    type: "json",
    sourceName: "Remotive",
    url: "https://remotive.com/api/remote-jobs?search=video",
    cacheNames: ["remotive-video.json", "vej-remotive-video.json"],
  },
  {
    id: "workingnomads-design",
    type: "json",
    sourceName: "Working Nomads",
    url: "https://www.workingnomads.com/api/exposed_jobs/?category=design",
    cacheNames: ["workingnomads-design.json", "vej-workingnomads-design.json"],
  },
  {
    id: "workingnomads-marketing",
    type: "json",
    sourceName: "Working Nomads",
    url: "https://www.workingnomads.com/api/exposed_jobs/?category=marketing",
    cacheNames: ["workingnomads-marketing.json", "vej-workingnomads-marketing.json"],
  },
  {
    id: "workingnomads-writing",
    type: "json",
    sourceName: "Working Nomads",
    url: "https://www.workingnomads.com/api/exposed_jobs/?category=writing",
    cacheNames: ["workingnomads-writing.json", "vej-workingnomads-writing.json"],
  },
  {
    id: "wwr-design",
    type: "rss",
    sourceName: "We Work Remotely",
    url: "https://weworkremotely.com/categories/remote-design-jobs.rss",
    cacheNames: ["wwr-design.rss", "vej-wwr.rss"],
  },
  {
    id: "wwr-marketing",
    type: "rss",
    sourceName: "We Work Remotely",
    url: "https://weworkremotely.com/categories/remote-sales-and-marketing-jobs.rss",
    cacheNames: ["wwr-marketing.rss", "vej-wwr-marketing.rss"],
  },
  {
    id: "wwr-copywriting",
    type: "rss",
    sourceName: "We Work Remotely",
    url: "https://weworkremotely.com/categories/remote-copywriting-jobs.rss",
    cacheNames: ["wwr-copywriting.rss", "vej-wwr-copywriting.rss"],
  },
];

const greenhouseBoards = [
  "coursera",
  "discord",
  "duolingo",
  "later",
  "masterclass",
  "reddit",
  "spotter",
  "twitch",
  "webflow",
];

for (const board of greenhouseBoards) {
  sourceDefs.push({
    id: `greenhouse-${board}`,
    type: "greenhouse",
    sourceName: `Greenhouse: ${titleCase(board)}`,
    url: `https://boards-api.greenhouse.io/v1/boards/${board}/jobs?content=true`,
    cacheNames: [`gh-${board}.json`, `vej-gh-${board}.json`, `vej-gh2-${board}.json`],
  });
}

const includePattern =
  /(video editor|cinematic video editor|video production|video producer|post[- ]production|motion designer|motion graphics|creative producer|content creator|social media|tiktok|youtube|podcast|paid media|creative strategist|creative technologist|content marketing|copywriter|brand designer|graphic design|animation|ad creative|creative director|creative lead|editorial|writer|content marketer|content manager|marketing coordinator|media buyer|performance marketing|ugc|reels|shorts|creator success|influencer|community manager|brand campaigns|learning designer|instructional designer)/i;

const titleSignalPattern =
  /(video|editor|producer|motion|creative|content|copywriter|brand|graphic|animation|podcast|youtube|tiktok|media buyer|paid media|performance marketer|marketing|writer|designer|ugc|social|creator|influencer|community|campaign|communications|learning designer|instructional designer)/i;

const excludeTitlePattern =
  /(software|developer|engineer|architect|finance|accountant|account executive|sales engineer|support engineer|customer support|legal|counsel|data analyst|data scientist|devops|security|it |recruiter|hr|people|payroll|administrator|business development|tax|machine learning|strategy and corporate|executive assistant|government affairs|talent management|swift|react|python|node|java|salesforce)/i;

function ascii(value = "") {
  return String(value)
    .normalize("NFKD")
    .replace(/[^\x00-\x7F]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function stripHtml(value = "") {
  return ascii(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#xa;/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function titleCase(value = "") {
  return ascii(value)
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function slugify(value = "") {
  return ascii(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function readCached(def) {
  for (const name of def.cacheNames) {
    const path = join(cacheDir, name);
    if (existsSync(path)) return readFile(path, "utf8");
  }
  return "";
}

async function fetchOrRead(def) {
  await mkdir(cacheDir, { recursive: true });
  const primaryCachePath = join(cacheDir, def.cacheNames[0]);

  if (!noFetch) {
    const response = await fetch(def.url, {
      headers: {
        "user-agent": "VideoEditorJobs.com job refresh (hello@videoeditorjobs.com)",
        accept: def.type === "rss" ? "application/rss+xml,text/xml,*/*" : "application/json,*/*",
      },
    });
    if (!response.ok) throw new Error(`${def.id} returned ${response.status}`);
    const text = await response.text();
    await writeFile(primaryCachePath, text);
    return text;
  }

  return readCached(def);
}

function normalizeDate(value) {
  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) return date.toISOString().slice(0, 10);
  return ascii(value).slice(0, 10);
}

function roleFamilyFor(text) {
  if (/video editor|cinematic video|post[- ]production|video production|\bediting\b/i.test(text)) return "Video editing";
  if (/creator success|influencer|community/i.test(text)) return "Creator partnerships";
  if (/content creator|youtube|tiktok|reels|shorts|ugc|podcast/i.test(text)) return "Creator content";
  if (/creative strategist|creative director|creative technologist|creative technology|creative lead|brand campaigns|ad creative/i.test(text)) {
    return "Creative strategy";
  }
  if (/motion|animation|graphic|brand designer|creative designer|illustrator|product designer|ux designer|ui .*designer/i.test(text)) {
    return "Design and motion";
  }
  if (/paid media|media buyer|performance marketing|marketing coordinator|content marketing|copywriter|writer|social media/i.test(text)) {
    return "Marketing content";
  }
  if (/learning designer|instructional designer/i.test(text)) return "Learning content";
  return "Creative adjacent";
}

function confidenceFor(text) {
  if (/video editor|cinematic video editor|post[- ]production|video production/i.test(text)) return "direct";
  if (/content creator|motion|creative|copywriter|writer|social media|youtube|tiktok|podcast|ugc|reels|shorts/i.test(text)) {
    return "near";
  }
  return "adjacent";
}

function scoreJob(job) {
  const text = `${job.title} ${job.company} ${job.roleFamily}`;
  let score = 0;
  if (job.confidence === "direct") score += 1000;
  if (job.confidence === "near") score += 500;
  if (/video|editor|post[- ]production/i.test(text)) score += 300;
  if (/content creator|youtube|tiktok|podcast|social|ugc|reels|shorts/i.test(text)) score += 200;
  if (/creative|motion|graphic|brand|copywriter|writer/i.test(text)) score += 100;
  score += Date.parse(`${job.dateListed}T00:00:00Z`) / 1000000000;
  return score;
}

function shouldKeep({ title, text }) {
  return includePattern.test(text) && titleSignalPattern.test(title) && !excludeTitlePattern.test(title);
}

function parseRemotive(raw, sourceName) {
  const json = JSON.parse(raw);
  return (json.jobs || [])
    .map((job) => {
      const title = ascii(job.title);
      const text = `${title} ${ascii(job.category)} ${ascii((job.tags || []).join(" "))} ${stripHtml(job.description).slice(0, 1600)}`;
      return {
        title,
        company: ascii(job.company_name),
        location: ascii(job.candidate_required_location || "Remote"),
        dateListed: normalizeDate(job.publication_date),
        sourceName,
        sourceType: "public API",
        sourceUrl: ascii(job.url),
        roleFamily: roleFamilyFor(text),
        confidence: confidenceFor(text),
        tags: (job.tags || []).slice(0, 4).map(ascii),
        text,
      };
    })
    .filter(shouldKeep);
}

function parseWorkingNomads(raw, sourceName) {
  const json = JSON.parse(raw);
  return json
    .map((job) => {
      const title = ascii(job.title);
      const text = `${title} ${ascii(job.category_name)} ${ascii(job.tags)} ${stripHtml(job.description).slice(0, 1600)}`;
      return {
        title,
        company: ascii(job.company_name),
        location: ascii(job.location || "Remote"),
        dateListed: normalizeDate(job.pub_date),
        sourceName,
        sourceType: "public API",
        sourceUrl: ascii(job.url),
        roleFamily: roleFamilyFor(text),
        confidence: confidenceFor(text),
        tags: ascii(job.tags)
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
          .slice(0, 4),
        text,
      };
    })
    .filter(shouldKeep);
}

function parseRss(raw, sourceName) {
  const jobs = [];
  for (const match of raw.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const body = match[1];
    const titleFull = stripHtml((body.match(/<title>([\s\S]*?)<\/title>/) || [])[1]);
    const titleParts = titleFull.split(":");
    const company = titleParts.length > 1 ? titleParts.shift().trim() : "";
    const title = titleParts.join(":").trim() || titleFull;
    const description = stripHtml((body.match(/<description>([\s\S]*?)<\/description>/) || [])[1]);
      const text = `${titleFull} ${description.slice(0, 1600)}`;
      const familyText = titleFull;
      const job = {
      title,
      company,
      location: "Remote",
      dateListed: normalizeDate((body.match(/<pubDate>([\s\S]*?)<\/pubDate>/) || [])[1]),
      sourceName,
      sourceType: "RSS",
      sourceUrl: stripHtml((body.match(/<link>([\s\S]*?)<\/link>/) || [])[1]),
      roleFamily: roleFamilyFor(familyText),
      confidence: confidenceFor(text),
      tags: [],
      text,
    };
    if (shouldKeep(job)) jobs.push(job);
  }
  return jobs;
}

function parseGreenhouse(raw, sourceName) {
  const json = JSON.parse(raw);
  return (json.jobs || [])
    .map((job) => {
      const departments = (job.departments || []).map((department) => department.name).join(" ");
      const offices = (job.offices || []).map((office) => office.name).join(" ");
      const title = ascii(job.title);
      const text = `${title} ${ascii(departments)} ${ascii(offices)} ${stripHtml(job.content).slice(0, 1600)}`;
      const familyText = `${title} ${ascii(departments)}`;
      return {
        title,
        company: sourceName.replace(/^Greenhouse: /, ""),
        location: ascii(job.location?.name || "See listing"),
        dateListed: normalizeDate(job.updated_at || job.created_at),
        sourceName,
        sourceType: "official company board",
        sourceUrl: ascii(job.absolute_url),
        roleFamily: roleFamilyFor(familyText),
        confidence: confidenceFor(text),
        tags: ascii(departments)
          .split(/\s*[,/]\s*/)
          .filter(Boolean)
          .slice(0, 4),
        text,
      };
    })
    .filter(shouldKeep);
}

function parseSource(raw, def) {
  if (!raw || raw.includes("Just a moment") || raw.includes("Page Not Found")) return [];
  if (def.type === "json" && def.id.startsWith("remotive")) return parseRemotive(raw, def.sourceName);
  if (def.type === "json" && def.id.startsWith("workingnomads")) return parseWorkingNomads(raw, def.sourceName);
  if (def.type === "rss") return parseRss(raw, def.sourceName);
  if (def.type === "greenhouse") return parseGreenhouse(raw, def.sourceName);
  return [];
}

function dedupe(jobs) {
  const seen = new Map();
  for (const job of jobs) {
    const key = `${slugify(job.company)}:${slugify(job.title)}:${slugify(job.location)}`;
    const existing = seen.get(key);
    if (!existing || scoreJob(job) > scoreJob(existing)) seen.set(key, job);
  }
  return [...seen.values()];
}

const errors = [];
const parsed = [];

for (const def of sourceDefs) {
  try {
    const raw = await fetchOrRead(def);
    parsed.push(...parseSource(raw, def));
  } catch (error) {
    errors.push(`${def.id}: ${error.message}`);
  }
}

const jobs = dedupe(parsed)
  .sort((a, b) => scoreJob(b) - scoreJob(a))
  .slice(0, maxJobs)
  .map(({ text, ...job }) => ({
    id: slugify(`${job.company}-${job.title}-${job.location}-${job.dateListed}`),
    ...job,
  }));

if (jobs.length < maxJobs) {
  throw new Error(`Only found ${jobs.length} jobs; expected ${maxJobs}. Sources with errors: ${errors.join("; ")}`);
}

const sourceNames = [...new Set(jobs.map((job) => job.sourceName))].sort();
const generatedAt = new Date().toISOString();

const moduleSource = `// Generated by scripts/refresh-jobs.mjs. Keep titles short, attributed, and link-out only.
export const jobFeedMeta = ${JSON.stringify(
  {
    generatedAt,
    jobCount: jobs.length,
    sourceCount: sourceNames.length,
    sources: sourceNames,
  },
  null,
  2
)};

export const liveJobs = ${JSON.stringify(jobs, null, 2)};
`;

await writeFile(outFile, moduleSource);

console.log(`Wrote ${jobs.length} jobs to ${outFile}`);
if (errors.length) console.log(`Skipped sources: ${errors.join("; ")}`);
