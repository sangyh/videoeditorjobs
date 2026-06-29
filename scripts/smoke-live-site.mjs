import { appPages, blogPosts, pages, toolPages, trustPages } from "../src/site-data.mjs";
import { defaultIntakeEndpoint, loadLocalEnv, validateIntakeEndpoint } from "./env.mjs";

await loadLocalEnv();
const args = process.argv.slice(2);
const requireEndpoint = args.includes("--require-endpoint") || process.env.VEJ_REQUIRE_INTAKE_ENDPOINT === "1";
const originArg = args.find((arg) => !arg.startsWith("--"));
const origin = (originArg || process.env.VEJ_SITE_ORIGIN || "https://videoeditorjobs.com").replace(/\/+$/, "");
const expectedEndpoint = process.env.VEJ_INTAKE_ENDPOINT || defaultIntakeEndpoint;
const expectedSitemapUrls = pages.length + appPages.length + toolPages.length + blogPosts.length + trustPages.length + 2;
const errors = [];

function fail(message) {
  errors.push(message);
}

async function fetchText(path) {
  const url = `${origin}${path}`;
  const response = await fetch(url, {
    headers: {
      "User-Agent": "video-editor-jobs-live-smoke/1.0",
    },
  });
  const text = await response.text();

  if (!response.ok) {
    fail(`${url} returned HTTP ${response.status}`);
  }

  return { url, response, text };
}

function requireIncludes(text, needle, label) {
  if (!text.includes(needle)) {
    fail(`Missing ${label}`);
  }
}

function assertNoIndexHeaderConflict(response, label) {
  const robotsHeader = response.headers.get("x-robots-tag");
  if (robotsHeader && /\bindex\b/i.test(robotsHeader) && !/\bnoindex\b/i.test(robotsHeader)) {
    fail(`${label} has conflicting X-Robots-Tag header: ${robotsHeader}`);
  }
}

function extractEndpoint(html) {
  const match = html.match(/window\.VEJ_CONFIG\s*=\s*\{\s*intakeEndpoint:\s*"([^"]*)"/);
  return match ? match[1] : "";
}

const pageChecks = [
  {
    path: "/",
    checks: [
      "Video Editor Jobs",
      'href="/editors/"',
      'href="/hire-video-editor/"',
      'href="/post-video-editor-job/"',
      'href="/video-editor-job-brief-builder/"',
      'href="/video-editor-portfolio-checklist/"',
      'href="/video-editing-rate-calculator/"',
      'href="/video-editor-community-post-generator/"',
      'href="/blog/"',
    ],
  },
  {
    path: "/editors/",
    checks: ['form class="intake-form" data-intake-kind="editor"', 'name="portfolio_url"', 'name="consent" type="checkbox"'],
  },
  {
    path: "/hire-video-editor/",
    checks: ['form class="intake-form hiring-form" data-intake-kind="hiring"', 'name="brief"', 'name="consent" type="checkbox"'],
  },
  {
    path: "/post-video-editor-job/",
    checks: ["Post a video editor job", 'form class="intake-form hiring-form" data-intake-kind="hiring"', 'name="brief"'],
  },
  {
    path: "/video-editor-job-brief-builder/",
    checks: ["Video Editor Job Brief Builder", 'id="brief-builder-form"', "vej:brief-builder:hiring"],
  },
  {
    path: "/video-editor-portfolio-checklist/",
    checks: ["Video Editor Portfolio Checklist", 'id="portfolio-checklist-form"', "vej:portfolio-checklist:editor"],
  },
  {
    path: "/video-editing-rate-calculator/",
    checks: ["Video Editing Rate Calculator", 'id="rate-calculator-form"', "utm_campaign=rate_calculator"],
  },
  {
    path: "/video-editor-community-post-generator/",
    checks: ["Video Editor Community Post Generator", 'id="community-post-form"', "community_post_generator"],
  },
  {
    path: "/blog/",
    checks: ["Video Editor Jobs Blog", "How to hire a video editor", "Where to find video editor jobs"],
  },
  {
    path: "/video-editor-community/",
    checks: ["Video Editor Community", 'href="/editors/"', 'href="/hire-video-editor/"'],
  },
  {
    path: "/on-call-travel-video-editor-jobs/",
    checks: ["On-Call Travel Video Editor Jobs", "travel dates", 'href="/editors/"'],
  },
  {
    path: "/teen-video-editor-jobs/",
    checks: ["Teen Video Editor Jobs", "portfolio-building", 'href="/editors/"'],
  },
  {
    path: "/remote-video-editing-jobs/",
    checks: ["Remote Video Editing Jobs", "Remote editing is a workflow", 'href="/editors/"'],
  },
  {
    path: "/night-shift-teen-video-editor-jobs/",
    checks: ["Night Shift Teen Video Editor Jobs", "Safer fits for young editors", 'href="/editors/"'],
  },
  {
    path: "/french-video-editor-jobs/",
    checks: ["French Video Editor Jobs", "bilingual English-French", 'href="/editors/"'],
  },
  {
    path: "/video-editor-jobs-nyc/",
    checks: ["Video Editor Jobs in NYC", "Manhattan", 'href="/editors/"'],
  },
  {
    path: "/video-editor-jobs-manhattan/",
    checks: ["Video Editor Jobs in Manhattan", "Manhattan listings", 'href="/editors/"'],
  },
  {
    path: "/blog/how-to-get-jobs-as-a-video-editor/",
    checks: ["How to get jobs as a video editor", "Build matched samples", 'href="/editors/"'],
  },
  {
    path: "/blog/how-to-find-video-editor-jobs/",
    checks: ["How to find video editor jobs", "Use specific search terms", 'href="/editors/"'],
  },
  {
    path: "/video-editor-jobs-last-3-days/",
    checks: ["Video Editor Jobs Last 3 Days", "early intake mode", 'href="/editors/"'],
  },
];

let homeHtml = "";
for (const page of pageChecks) {
  const { text } = await fetchText(page.path);
  if (page.path === "/") {
    homeHtml = text;
  }
  for (const needle of page.checks) {
    requireIncludes(text, needle, `${page.path} ${needle}`);
  }
}

const endpoint = extractEndpoint(homeHtml);
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

for (const path of ["/thanks-editor/", "/thanks-hiring/"]) {
  const { response, text } = await fetchText(path);
  requireIncludes(text, '<meta name="robots" content="noindex, follow">', `${path} noindex meta`);
  assertNoIndexHeaderConflict(response, path);
}

const sitemapResult = await fetchText("/sitemap.xml");
const locCount = Array.from(sitemapResult.text.matchAll(/<loc>/g)).length;
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
  "/on-call-travel-video-editor-jobs/",
  "/teen-video-editor-jobs/",
  "/remote-video-editing-jobs/",
  "/night-shift-teen-video-editor-jobs/",
  "/french-video-editor-jobs/",
  "/video-editor-jobs-nyc/",
  "/video-editor-jobs-manhattan/",
  "/blog/how-to-get-jobs-as-a-video-editor/",
  "/blog/how-to-find-video-editor-jobs/",
  "/video-editor-jobs-last-3-days/",
]) {
  requireIncludes(sitemapResult.text, `<loc>https://videoeditorjobs.com${route}</loc>`, `sitemap route ${route}`);
}

for (const route of ["/thanks-editor/", "/thanks-hiring/"]) {
  if (sitemapResult.text.includes(`<loc>https://videoeditorjobs.com${route}</loc>`)) {
    fail(`sitemap.xml should not include ${route}`);
  }
}

const robotsResult = await fetchText("/robots.txt");
requireIncludes(robotsResult.text, "Sitemap: https://videoeditorjobs.com/sitemap.xml", "robots sitemap URL");

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      origin,
      endpointConfigured: Boolean(endpoint),
      endpointRequired: requireEndpoint,
      sitemapUrls: locCount,
      checkedRoutes: [...pageChecks.map((page) => page.path), "/thanks-editor/", "/thanks-hiring/", "/sitemap.xml", "/robots.txt"],
    },
    null,
    2
  )
);
