import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { appPages, blogPosts, pages, site, toolPages, trustPages } from "../src/site-data.mjs";

const dist = new URL("../dist/", import.meta.url);
const errors = [];

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

const crawlPages = [
  ...pages,
  ...appPages,
  ...toolPages,
  {
    slug: "blog",
    title: "Video Editor Jobs Blog: Editor Career and Hiring Guides",
    description:
      "Guides for finding video editor jobs, hiring editors, writing briefs, building portfolios, setting rates, and understanding editing workflows.",
    h1: "Video Editor Jobs Blog",
  },
  {
    slug: "search",
    title: "Search Video Editor Jobs",
    description: "Search Video Editor Jobs pages, hiring guides, editor resources, local pages, and community intake routes.",
    h1: "Search Video Editor Jobs",
  },
  ...blogPosts.map((post) => ({
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

const robots = await readFile(join(dist.pathname, "robots.txt"), "utf8");
if (!robots.includes(`Sitemap: ${site.origin}/sitemap.xml`)) {
  errors.push("robots.txt missing sitemap");
}

const rss = await readFile(join(dist.pathname, "rss.xml"), "utf8");
if (!rss.includes(`<title>${site.name} Blog</title>`)) {
  errors.push("rss.xml missing channel title");
}

for (const post of blogPosts) {
  const url = `${site.origin}/blog/${post.slug}/`;
  if (!rss.includes(`<guid isPermaLink="true">${url}</guid>`)) {
    errors.push(`RSS missing ${url}`);
  }
}

const llms = await readFile(join(dist.pathname, "llms.txt"), "utf8");
for (const needle of [
  `# ${site.name}`,
  `${site.origin}/editors/`,
  `${site.origin}/hire-video-editor/`,
  `${site.origin}/search/`,
  `${site.origin}/sitemap.xml`,
  `${site.origin}/rss.xml`,
]) {
  if (!llms.includes(needle)) {
    errors.push(`llms.txt missing ${needle}`);
  }
}

for (const asset of ["styles.css", "forms.js", "editor-workstation.svg", "video-editor-jobs-og.svg", "favicon.svg"]) {
  if (!(await exists(join(dist.pathname, "assets", asset)))) {
    errors.push(`Missing asset: ${asset}`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Verified ${crawlPages.length} pages, sitemap, robots.txt, and assets for ${site.origin}`);
