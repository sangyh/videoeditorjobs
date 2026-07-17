import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { assetFiles } from "../src/asset-manifest.mjs";
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

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

const crawlPages = [
  ...activePages,
  jobBoardPage,
  ...appPages,
  {
    slug: "blog",
    title: "Video Editor Jobs Blog: Editor Career and Hiring Guides",
    description:
      "Focused guides for finding video editor jobs, hiring editors, writing briefs, building portfolios, setting rates, and understanding creator editing workflows.",
    h1: "Video Editor Jobs Blog",
  },
  voiceProfilePage,
  ...activeBlogPosts.map((post) => ({
    ...post,
    slug: `blog/${post.slug}`,
  })),
  ...trustPages,
];

for (const page of crawlPages) {
  const file = join(dist.pathname, page.slug, "index.html");
  if (!(await exists(file))) {
    errors.push(`Missing page: ${page.slug || "/"}`);
    continue;
  }

  const html = await readFile(file, "utf8");
  const canonical = `${site.origin}/${page.slug ? `${page.slug}/` : ""}`;
  const checks = [
    [`<title>${page.title}</title>`, "title"],
    [`<meta name="description" content="${page.description}">`, "description"],
    [`<link rel="canonical" href="${canonical}">`, "canonical"],
    [`<h1>${page.h1}</h1>`, "h1"],
    [`application/ld+json`, "json-ld"],
    [`og:image`, "open graph image"],
  ];

  for (const [needle, label] of checks) {
    if (!html.includes(needle)) {
      errors.push(`Missing ${label} on ${page.slug || "/"}`);
    }
  }
}

const sitemap = await readFile(join(dist.pathname, "sitemap.xml"), "utf8");
for (const page of crawlPages) {
  const url = `${site.origin}/${page.slug ? `${page.slug}/` : ""}`;
  if (!sitemap.includes(`<loc>${url}</loc>`)) {
    errors.push(`Sitemap missing ${url}`);
  }
}

// Per-job pages: every deduped live job must have its own indexable page and sitemap entry.
for (const job of liveJobs) {
  const file = join(dist.pathname, "jobs", job.id, "index.html");
  if (!(await exists(file))) {
    errors.push(`Missing job page: jobs/${job.id}`);
    continue;
  }
  const html = await readFile(file, "utf8");
  const canonical = `${site.origin}/jobs/${job.id}/`;
  for (const [needle, label] of [
    [`<link rel="canonical" href="${canonical}">`, "canonical"],
    ['"@type":"JobPosting"', "JobPosting JSON-LD"],
    ['"@type":"BreadcrumbList"', "breadcrumb JSON-LD"],
    ["og:image", "open graph image"],
  ]) {
    if (!html.includes(needle)) {
      errors.push(`Missing ${label} on jobs/${job.id}`);
    }
  }
  if (!sitemap.includes(`<loc>${canonical}</loc>`)) {
    errors.push(`Sitemap missing ${canonical}`);
  }
}

const expectedLocCount = crawlPages.length + liveJobs.length;
const locCount = Array.from(sitemap.matchAll(/<loc>/g)).length;
if (locCount !== expectedLocCount) {
  errors.push(`sitemap.xml should list ${expectedLocCount} URLs (${crawlPages.length} core + ${liveJobs.length} jobs), found ${locCount}`);
}

const robots = await readFile(join(dist.pathname, "robots.txt"), "utf8");
if (!robots.includes(`Sitemap: ${site.origin}/sitemap.xml`)) {
  errors.push("robots.txt missing sitemap");
}

const rss = await readFile(join(dist.pathname, "rss.xml"), "utf8");
if (!rss.includes(`<title>${site.name} Blog</title>`)) {
  errors.push("rss.xml missing channel title");
}

for (const post of activeBlogPosts) {
  const url = `${site.origin}/blog/${post.slug}/`;
  if (!rss.includes(`<guid isPermaLink="true">${url}</guid>`)) {
    errors.push(`RSS missing ${url}`);
  }
}

const llms = await readFile(join(dist.pathname, "llms.txt"), "utf8");
for (const needle of [
  `# ${site.name}`,
  `${site.origin}/editors/`,
  `${site.origin}/jobs/`,
  `${site.origin}/hire-video-editor/`,
  `${site.origin}/voice-profile/`,
  `${site.origin}/search/`,
  `${site.origin}/sitemap.xml`,
  `${site.origin}/rss.xml`,
  "dedicated page under /jobs/",
]) {
  if (!llms.includes(needle)) {
    errors.push(`llms.txt missing ${needle}`);
  }
}

for (const { destination } of assetFiles) {
  if (!(await exists(join(dist.pathname, destination)))) {
    errors.push(`Missing asset: ${destination}`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Verified ${crawlPages.length} pages, sitemap, robots.txt, and assets for ${site.origin}`);
