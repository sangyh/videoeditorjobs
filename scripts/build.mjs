import { mkdir, rm, writeFile, copyFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { keywords, nav, pages, sampleJobs, site } from "../src/site-data.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, "dist");

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const toUrl = (slug = "") => `${site.origin}/${slug ? `${slug}/` : ""}`;
const toPath = (slug = "") => join(dist, slug, "index.html");

function jsonLd(page) {
  const base = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: site.name,
      url: site.origin,
      potentialAction: {
        "@type": "SearchAction",
        target: `${site.origin}/search/?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: site.name,
      url: site.origin,
      email: site.email,
      description: site.description,
    },
  ];

  if (page.pageType === "home") {
    base.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Video editor job categories",
      itemListElement: pages
        .filter((item) => item.slug)
        .slice(0, 8)
        .map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.h1,
          url: toUrl(item.slug),
        })),
    });
  } else {
    base.push({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: page.h1,
      url: toUrl(page.slug),
      isPartOf: {
        "@type": "WebSite",
        name: site.name,
        url: site.origin,
      },
      about: page.h1,
      description: page.description,
    });
  }

  if (page.faq?.length) {
    base.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    });
  }

  return base
    .map((entry) => `<script type="application/ld+json">${JSON.stringify(entry)}</script>`)
    .join("\n");
}

function pageCards(currentSlug) {
  return pages
    .filter((page) => page.slug && page.slug !== currentSlug)
    .slice(0, 6)
    .map(
      (page) => `
        <a class="route-link" href="/${page.slug}/">
          <span>${escapeHtml(page.eyebrow)}</span>
          <strong>${escapeHtml(page.h1)}</strong>
        </a>`
    )
    .join("");
}

function sampleJobRows() {
  return sampleJobs
    .map(
      (job) => `
        <article class="job-row">
          <div>
            <span class="job-type">${escapeHtml(job.type)}</span>
            <h3>${escapeHtml(job.title)}</h3>
            <p>${escapeHtml(job.fit)}</p>
          </div>
          <ul>
            ${job.signals.map((signal) => `<li>${escapeHtml(signal)}</li>`).join("")}
          </ul>
        </article>`
    )
    .join("");
}

function renderPage(page) {
  const canonical = toUrl(page.slug);
  const activeNav = nav
    .map(
      (item) =>
        `<a href="${item.href}"${item.href === `/${page.slug}/` ? ' aria-current="page"' : ""}>${escapeHtml(
          item.label
        )}</a>`
    )
    .join("");

  const faq = page.faq?.length
    ? `<section class="band faq" id="faq">
        <div class="section-head">
          <p>Answers</p>
          <h2>Questions editors and hiring teams ask first</h2>
        </div>
        <div class="faq-list">
          ${page.faq
            .map(
              (item) => `
              <details>
                <summary>${escapeHtml(item.question)}</summary>
                <p>${escapeHtml(item.answer)}</p>
              </details>`
            )
            .join("")}
        </div>
      </section>`
    : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(page.title)}</title>
    <meta name="description" content="${escapeHtml(page.description)}">
    <link rel="canonical" href="${canonical}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <meta property="og:site_name" content="${escapeHtml(site.name)}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${escapeHtml(page.title)}">
    <meta property="og:description" content="${escapeHtml(page.description)}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${site.origin}/assets/video-editor-jobs-og.svg">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(page.title)}">
    <meta name="twitter:description" content="${escapeHtml(page.description)}">
    <meta name="twitter:image" content="${site.origin}/assets/video-editor-jobs-og.svg">
    <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="/assets/styles.css">
    ${jsonLd(page)}
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to content</a>
    <header class="site-header">
      <a class="brand" href="/" aria-label="Video Editor Jobs home">
        <span class="brand-mark">VEJ</span>
        <span>Video Editor Jobs</span>
      </a>
      <nav class="site-nav" aria-label="Primary navigation">
        ${activeNav}
      </nav>
      <a class="header-cta" href="#editor-alerts">Get alerts</a>
    </header>

    <main id="main">
      <section class="hero">
        <div class="hero-copy">
          <p class="eyebrow">${escapeHtml(page.eyebrow)}</p>
          <h1>${escapeHtml(page.h1)}</h1>
          <p class="lede">${escapeHtml(page.intro)}</p>
          <p class="intent">${escapeHtml(page.intent)}</p>
          <div class="hero-actions">
            <a class="button primary" href="#editor-alerts">Join editor alerts</a>
            <a class="button secondary" href="#employers">Post a role early</a>
          </div>
        </div>
        <div class="hero-art" aria-label="Video editing timeline and job board preview">
          <img src="/assets/editor-workstation.svg" alt="Editing timeline beside video editor job listings">
        </div>
      </section>

      <section class="signal-strip" aria-label="Launch search signals">
        <span>7.1K US searches/mo for video editor jobs</span>
        <span>Remote and freelance demand first</span>
        <span>TalentPrism backend planned</span>
      </section>

      <section class="band categories">
        <div class="section-head">
          <p>Search map</p>
          <h2>Built around the phrases editors already use</h2>
        </div>
        <div class="keyword-grid">
          ${keywords.map((keyword) => `<span>${escapeHtml(keyword)}</span>`).join("")}
        </div>
      </section>

      <section class="band split">
        <div class="section-head">
          <p>Role examples</p>
          <h2>Early categories before live listings</h2>
        </div>
        <div class="job-stack">
          ${sampleJobRows()}
        </div>
      </section>

      <section class="band editorial">
        ${page.sections
          .map(
            (section) => `
            <article>
              <h2>${escapeHtml(section.heading)}</h2>
              <p>${escapeHtml(section.body)}</p>
            </article>`
          )
          .join("")}
      </section>

      <section class="band routes">
        <div class="section-head">
          <p>Browse</p>
          <h2>Related video editor job pages</h2>
        </div>
        <div class="route-grid">
          ${pageCards(page.slug)}
        </div>
      </section>

      <section class="band intake" id="editor-alerts">
        <div>
          <p class="eyebrow">Editors</p>
          <h2>Get on the early list</h2>
          <p>Tell us the work you want: remote, freelance, YouTube, social, agency, brand, assistant editor, or city-specific roles.</p>
        </div>
        <form class="intake-form" data-mail-subject="Editor alert request">
          <label>
            Email
            <input name="email" type="email" autocomplete="email" placeholder="you@example.com" required>
          </label>
          <label>
            Best fit
            <select name="fit" required>
              <option value="">Choose one</option>
              <option>Remote video editor jobs</option>
              <option>Freelance video editor jobs</option>
              <option>YouTube video editor jobs</option>
              <option>Entry-level or assistant editor jobs</option>
              <option>Local studio or agency work</option>
            </select>
          </label>
          <label>
            Portfolio or LinkedIn
            <input name="portfolio" type="url" placeholder="https://">
          </label>
          <button class="button primary" type="submit">Prepare email</button>
          <p class="form-note">Static launch mode: this opens an email draft until the TalentPrism intake endpoint is connected.</p>
        </form>
      </section>

      <section class="band intake employer" id="employers">
        <div>
          <p class="eyebrow">Hiring teams</p>
          <h2>Post a video editor role early</h2>
          <p>Good listings should include content format, edit volume, software stack, compensation, timezone or location, revision cadence, and portfolio examples.</p>
        </div>
        <form class="intake-form" data-mail-subject="Early employer role">
          <label>
            Work email
            <input name="email" type="email" autocomplete="email" placeholder="producer@company.com" required>
          </label>
          <label>
            Role type
            <select name="fit" required>
              <option value="">Choose one</option>
              <option>Remote editor</option>
              <option>Freelance editor</option>
              <option>YouTube editor</option>
              <option>Assistant editor</option>
              <option>Local editor</option>
            </select>
          </label>
          <label>
            Role page or notes
            <input name="portfolio" type="text" placeholder="URL, pay range, workflow, or deadline">
          </label>
          <button class="button secondary" type="submit">Prepare email</button>
          <p class="form-note">Connect this form to TalentPrism when the backend posting flow is ready.</p>
        </form>
      </section>

      ${faq}
    </main>

    <footer class="site-footer">
      <div>
        <strong>Video Editor Jobs</strong>
        <p>SEO launch site for videoeditorjobs.com. Built to start crawl discovery before the live TalentPrism job graph is connected.</p>
      </div>
      <nav aria-label="Footer navigation">
        <a href="/sitemap.xml">Sitemap</a>
        <a href="/robots.txt">Robots</a>
        <a href="mailto:${site.email}">${site.email}</a>
      </nav>
    </footer>
    <script src="/assets/forms.js" defer></script>
  </body>
</html>`;
}

function sitemap() {
  const urls = pages
    .map(
      (page) => `
  <url>
    <loc>${toUrl(page.slug)}</loc>
    <lastmod>${site.launchDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>
`;
}

function robots() {
  return `User-agent: *
Allow: /

Sitemap: ${site.origin}/sitemap.xml
`;
}

async function writePage(slug, html) {
  const filePath = toPath(slug);
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, html);
}

await rm(dist, { recursive: true, force: true });
await mkdir(join(dist, "assets"), { recursive: true });

for (const page of pages) {
  await writePage(page.slug, renderPage(page));
}

await writeFile(join(dist, "sitemap.xml"), sitemap());
await writeFile(join(dist, "robots.txt"), robots());
await copyFile(join(root, "src", "styles.css"), join(dist, "assets", "styles.css"));
await copyFile(join(root, "src", "forms.js"), join(dist, "assets", "forms.js"));
await copyFile(join(root, "src", "assets", "editor-workstation.svg"), join(dist, "assets", "editor-workstation.svg"));
await copyFile(join(root, "src", "assets", "video-editor-jobs-og.svg"), join(dist, "assets", "video-editor-jobs-og.svg"));
await copyFile(join(root, "src", "assets", "favicon.svg"), join(dist, "assets", "favicon.svg"));

console.log(`Built ${pages.length} pages in dist/`);
