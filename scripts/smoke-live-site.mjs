import { activeBlogPosts, activePages, appPages, jobBoardPage, site, trustPages } from "../src/site-data.mjs";
import { defaultIntakeEndpoint, loadLocalEnv, validateIntakeEndpoint } from "./env.mjs";

await loadLocalEnv();

const args = process.argv.slice(2);
const requireEndpoint = args.includes("--require-endpoint") || process.env.VEJ_REQUIRE_INTAKE_ENDPOINT === "1";
const originArg = args.find((arg) => !arg.startsWith("--"));
const origin = (originArg || process.env.VEJ_SITE_ORIGIN || site.origin).replace(/\/+$/, "");
const expectedEndpoint = process.env.VEJ_INTAKE_ENDPOINT || defaultIntakeEndpoint;
const errors = [];

const crawlRoutes = [
  ...activePages.map((page) => `/${page.slug ? `${page.slug}/` : ""}`),
  `/${jobBoardPage.slug}/`,
  ...appPages.map((page) => `/${page.slug}/`),
  "/blog/",
  ...activeBlogPosts.map((post) => `/blog/${post.slug}/`),
  ...trustPages.map((page) => `/${page.slug}/`),
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
  "/post-video-editor-job/",
];

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

function requireExcludes(text, needle, label) {
  if (text.includes(needle)) {
    fail(`Unexpected ${label}`);
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
    checks: ["Video Editor Jobs", "creator teams", "Manual matching from real submissions", 'href="/editors/"', 'href="/hire-video-editor/"'],
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
    path: "/jobs/",
    checks: ["Real video and creator-side jobs", "source-attributed jobs", "View original listing"],
  },
  {
    path: "/remote-video-editor-jobs/",
    checks: ["Remote Video Editor Jobs", "What remote hiring teams screen for", 'href="/editors/"'],
  },
  {
    path: "/freelance-video-editor-jobs/",
    checks: ["Freelance Video Editor Jobs", "Freelance signals that matter", 'href="/hire-video-editor/"'],
  },
  {
    path: "/youtube-video-editor-jobs/",
    checks: ["YouTube Video Editor Jobs", "What YouTube teams care about", 'href="/editors/"'],
  },
  {
    path: "/part-time-video-editor-jobs/",
    checks: ["Part-Time Video Editor Jobs", "Where part-time editing works", 'href="/hire-video-editor/"'],
  },
  {
    path: "/video-editor-community/",
    checks: ["Video Editor Community", 'href="/editors/"', 'href="/hire-video-editor/"'],
  },
  {
    path: "/blog/",
    checks: ["Video Editor Jobs Blog", "creator teams scoping recurring work", "How to hire a video editor"],
  },
  {
    path: "/blog/video-editor-portfolio-examples/",
    checks: ["Video editor portfolio examples", "Match examples to the role", 'href="/editors/"'],
  },
  {
    path: "/blog/how-to-hire-a-video-editor/",
    checks: ["How to hire a video editor", "Define the editing job", 'href="/hire-video-editor/"'],
  },
];

let homeHtml = "";
let blogHtml = "";
for (const page of pageChecks) {
  const { text } = await fetchText(page.path);
  if (page.path === "/") homeHtml = text;
  if (page.path === "/blog/") blogHtml = text;
  for (const needle of page.checks) {
    requireIncludes(text, needle, `${page.path} ${needle}`);
  }
}

for (const route of cutRoutes.slice(0, 4)) {
  requireExcludes(homeHtml, `href="${route}"`, `home cut route ${route}`);
  requireExcludes(blogHtml, `href="${route}"`, `blog cut route ${route}`);
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

for (const path of ["/search/", "/thanks-editor/", "/thanks-hiring/"]) {
  const { response, text } = await fetchText(path);
  requireIncludes(text, '<meta name="robots" content="noindex, follow">', `${path} noindex meta`);
  assertNoIndexHeaderConflict(response, path);
}

const sitemapResult = await fetchText("/sitemap.xml");
const locCount = Array.from(sitemapResult.text.matchAll(/<loc>/g)).length;
if (locCount !== crawlRoutes.length) {
  fail(`sitemap.xml should list ${crawlRoutes.length} URLs, found ${locCount}`);
}

for (const route of crawlRoutes) {
  requireIncludes(sitemapResult.text, `<loc>${site.origin}${route}</loc>`, `sitemap route ${route}`);
}

for (const route of ["/search/", "/thanks-editor/", "/thanks-hiring/", ...cutRoutes]) {
  requireExcludes(sitemapResult.text, `<loc>${site.origin}${route}</loc>`, `sitemap excluded route ${route}`);
}

const robotsResult = await fetchText("/robots.txt");
requireIncludes(robotsResult.text, `Sitemap: ${site.origin}/sitemap.xml`, "robots sitemap URL");

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
      checkedRoutes: [...pageChecks.map((page) => page.path), "/search/", "/thanks-editor/", "/thanks-hiring/", "/sitemap.xml", "/robots.txt"],
    },
    null,
    2
  )
);
