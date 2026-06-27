import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { pages, site } from "../src/site-data.mjs";

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

for (const page of pages) {
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
for (const page of pages) {
  const url = `${site.origin}/${page.slug ? `${page.slug}/` : ""}`;
  if (!sitemap.includes(`<loc>${url}</loc>`)) {
    errors.push(`Sitemap missing ${url}`);
  }
}

const robots = await readFile(join(dist.pathname, "robots.txt"), "utf8");
if (!robots.includes(`Sitemap: ${site.origin}/sitemap.xml`)) {
  errors.push("robots.txt missing sitemap");
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

console.log(`Verified ${pages.length} pages, sitemap, robots.txt, and assets for ${site.origin}`);
