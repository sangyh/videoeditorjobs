import { copyFile, mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  activeBlogPosts,
  activePages,
  appPages,
  keywords,
  nav,
  sampleJobs,
  site,
  trustPages,
} from "../src/site-data.mjs";
import { defaultIntakeEndpoint, loadLocalEnv } from "./env.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, "dist");
await loadLocalEnv();
const intakeEndpoint = process.env.VEJ_INTAKE_ENDPOINT || defaultIntakeEndpoint;
const assetVersion = "20260629-checkbox";

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const escapeAttr = escapeHtml;
const toUrl = (slug = "") => `${site.origin}/${slug ? `${slug}/` : ""}`;
const toPath = (slug = "") => join(dist, slug, "index.html");
const toRfc822 = (value) => new Date(`${value}T12:00:00.000Z`).toUTCString();

const blogIndexPage = {
  slug: "blog",
  priority: "0.8",
  changefreq: "weekly",
  title: "Video Editor Jobs Blog",
  description:
    "Tight guides for video editors and creator teams around portfolios, recurring workflows, briefs, rates, and YouTube editing roles.",
  h1: "Video Editor Jobs Blog",
};

const searchPage = {
  slug: "search",
  priority: "0.45",
  changefreq: "weekly",
  title: "Search Video Editor Jobs",
  description: "Search the current Video Editor Jobs intake pages, creator workflow guides, and hiring resources.",
  h1: "Search Video Editor Jobs",
};

const utilityPages = [
  {
    slug: "thanks-editor",
    title: "Editor Submission Received | Video Editor Jobs",
    description: "Confirmation page for Video Editor Jobs editor intake submissions.",
    h1: "You are on the editor list",
    eyebrow: "Submission received",
    intro:
      "Your profile is in the review queue. We will use your portfolio, editing fit, availability, and source details to understand where you fit best.",
    primaryCta: ["Review your profile", "/editors/"],
    secondaryCta: ["See portfolio examples", "/blog/video-editor-portfolio-examples/"],
    nextSteps: [
      "Keep your portfolio link current and easy to scan.",
      "Reply quickly if we reach out about a matching brief.",
      "Share the editor list with editors who would make this community stronger.",
    ],
    shareLinks: [
      {
        label: "Invite another editor",
        href: "/editors/?utm_source=referral&utm_medium=thank_you&utm_campaign=editor_invite",
        text: "Send the editor intake to a peer whose portfolio should be in the early list.",
      },
      {
        label: "Send to a hiring team",
        href: "/hire-video-editor/?utm_source=referral&utm_medium=thank_you&utm_campaign=hiring_invite",
        text: "Know someone hiring editors? Route them to the brief form instead of a vague post.",
      },
      {
        label: "Share the jobs guide",
        href: "/blog/where-to-find-video-editor-jobs/?utm_source=referral&utm_medium=thank_you&utm_campaign=resource_share",
        text: "A practical guide editors can use even before the job board has public listings.",
      },
      {
        label: "Share portfolio examples",
        href: "/blog/video-editor-portfolio-examples/?utm_source=referral&utm_medium=thank_you&utm_campaign=portfolio_examples_share",
        text: "Useful for editors who need to show matched proof instead of sending a generic reel.",
      },
    ],
  },
  {
    slug: "thanks-hiring",
    title: "Hiring Brief Received | Video Editor Jobs",
    description: "Confirmation page for Video Editor Jobs hiring intake submissions.",
    h1: "Your hiring brief is in",
    eyebrow: "Submission received",
    intro:
      "Your request is in the hiring review queue. We will look at budget, workflow, timeline, content format, and portfolio requirements before matching it with editors.",
    primaryCta: ["Improve your brief", "/blog/video-editor-job-description-template/"],
    secondaryCta: ["Hiring guide", "/blog/how-to-hire-a-video-editor/"],
    nextSteps: [
      "Gather 2 or 3 examples of the edit style you want.",
      "Clarify source footage volume, revision process, and deadline.",
      "Watch your email for follow-up if the brief needs more detail.",
    ],
    shareLinks: [
      {
        label: "Share with an editor",
        href: "/editors/?utm_source=referral&utm_medium=thank_you&utm_campaign=editor_invite",
        text: "Invite editors who should be considered as the early talent list grows.",
      },
      {
        label: "Send the hiring guide",
        href: "/blog/how-to-hire-a-video-editor/?utm_source=referral&utm_medium=thank_you&utm_campaign=hiring_resource_share",
        text: "A useful resource for anyone writing a clearer editor brief.",
      },
      {
        label: "Post another brief",
        href: "/hire-video-editor/?utm_source=referral&utm_medium=thank_you&utm_campaign=repeat_hiring_brief",
        text: "Use this when a second role, channel, or project needs a separate editor profile.",
      },
      {
        label: "Share the job template",
        href: "/blog/video-editor-job-description-template/?utm_source=referral&utm_medium=thank_you&utm_campaign=job_template_share",
        text: "Give another hiring team the structure editors need before judging a role.",
      },
      {
        label: "Send the community page",
        href: "/video-editor-community/?utm_source=referral&utm_medium=thank_you&utm_campaign=community_share",
        text: "A neutral page for people who want to understand both sides of the early market.",
      },
    ],
  },
];

const allCrawlPages = [
  ...activePages,
  ...appPages,
  blogIndexPage,
  ...activeBlogPosts.map((post) => ({
    ...post,
    slug: `blog/${post.slug}`,
  })),
  ...trustPages,
];

function jsonScript(entry) {
  return `<script type="application/ld+json">${JSON.stringify(entry)}</script>`;
}

function baseJsonLd(page, canonical) {
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
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: page.h1 || page.title,
      url: canonical,
      description: page.description,
    },
  ];

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

  return base.map(jsonScript).join("\n");
}

function navMarkup(currentSlug) {
  return nav
    .map((item) => {
      const hrefSlug = item.href.replace(/^\/|\/$/g, "");
      const active = currentSlug === hrefSlug || (!currentSlug && item.href === "/");
      return `<a href="${item.href}"${active ? ' aria-current="page"' : ""}>${escapeHtml(item.label)}</a>`;
    })
    .join("");
}

function head({ title, description, slug, h1, faq, extraJsonLd = "", robots = "index, follow, max-image-preview:large" }) {
  const canonical = toUrl(slug);
  return `<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeAttr(description)}">
    <link rel="canonical" href="${canonical}">
    <meta name="robots" content="${escapeAttr(robots)}">
    <meta property="og:site_name" content="${escapeAttr(site.name)}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${escapeAttr(title)}">
    <meta property="og:description" content="${escapeAttr(description)}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${site.origin}/assets/video-editor-jobs-og.svg">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeAttr(title)}">
    <meta name="twitter:description" content="${escapeAttr(description)}">
    <meta name="twitter:image" content="${site.origin}/assets/video-editor-jobs-og.svg">
    <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
    <link rel="alternate" type="application/rss+xml" title="${escapeAttr(site.name)} Blog" href="${site.origin}/rss.xml">
    <link rel="stylesheet" href="/assets/styles.css?v=${assetVersion}">
    ${baseJsonLd({ title, description, h1, faq }, canonical)}
    ${extraJsonLd}
    <script>window.VEJ_CONFIG = { intakeEndpoint: ${JSON.stringify(intakeEndpoint)} };</script>
  </head>`;
}

function shell({ page, body, extraClass = "" }) {
  const currentSlug = page.slug || "";
  return `<!doctype html>
<html lang="en">
  ${head(page)}
  <body class="${extraClass}">
    <a class="skip-link" href="#main">Skip to content</a>
    <header class="site-header">
      <a class="brand" href="/" aria-label="Video Editor Jobs home">
        <span class="brand-mark">VEJ</span>
        <span>Video Editor Jobs</span>
      </a>
      <nav class="site-nav" aria-label="Primary navigation">
        ${navMarkup(currentSlug)}
      </nav>
      <div class="header-actions">
        <a class="header-cta post" href="/hire-video-editor/">Post job</a>
      </div>
    </header>
    <main id="main">${body}</main>
    ${footer()}
    <script src="/assets/forms.js?v=${assetVersion}" defer></script>
  </body>
</html>`;
}

function footer() {
  return `<footer class="site-footer">
    <div class="footer-inner">
      <section class="footer-brand" aria-label="Video Editor Jobs">
        <strong>Video Editor Jobs</strong>
        <p>A focused editor community and hiring intake surface for recurring video work.</p>
        <div class="footer-actions">
          <a class="footer-cta primary" href="/editors/">Join as editor</a>
          <a class="footer-cta" href="/hire-video-editor/">Post a job</a>
        </div>
      </section>
      <nav class="footer-link-groups" aria-label="Footer navigation">
        <section class="footer-group" aria-labelledby="footer-start">
          <h2 id="footer-start">Start</h2>
          <a href="/editors/">Editors</a>
          <a href="/hire-video-editor/">Post job</a>
        </section>
        <section class="footer-group" aria-labelledby="footer-resources">
          <h2 id="footer-resources">Resources</h2>
          <a href="/blog/">Blog</a>
          <a href="/video-editor-community/">Community</a>
          <a href="/search/">Search</a>
          <a href="/rss.xml">RSS</a>
          <a href="/sitemap.xml">Sitemap</a>
        </section>
        <section class="footer-group" aria-labelledby="footer-company">
          <h2 id="footer-company">Company</h2>
          <a href="/privacy/">Privacy</a>
          <a href="/terms/">Terms</a>
          <a href="mailto:${site.email}">${site.email}</a>
        </section>
      </nav>
    </div>
  </footer>`;
}

function formStatus() {
  return `<div class="form-status" role="status" aria-live="polite" hidden></div>`;
}

function hiddenTracking(kind) {
  return `<input type="hidden" name="kind" value="${kind}">
    <label class="bot-field" aria-hidden="true">
      Website
      <input name="website" tabindex="-1" autocomplete="off">
    </label>`;
}

function editorForm({ compact = false } = {}) {
  return `<form class="intake-form" data-intake-kind="editor" data-mail-subject="Video Editor Jobs editor intake" data-success-path="/thanks-editor/">
    ${hiddenTracking("editor")}
    <div class="form-grid ${compact ? "compact" : ""}">
      <label>
        Name
        <input name="name" autocomplete="name" placeholder="Your name" required>
      </label>
      <label>
        Email
        <input name="email" type="email" autocomplete="email" placeholder="you@example.com" required>
      </label>
      <label>
        Location or timezone
        <input name="location" autocomplete="address-level2" placeholder="Los Angeles, ET, GMT+1">
      </label>
      <label>
        Primary editing fit
        <select name="primary_fit" required>
          <option value="">Choose one</option>
          <option>Remote video editor jobs</option>
          <option>Freelance video editor jobs</option>
          <option>YouTube editor work</option>
          <option>Short-form social editing</option>
          <option>Podcast or multicam editing</option>
          <option>Assistant or junior editor roles</option>
          <option>Agency or brand work</option>
        </select>
      </label>
      <label>
        Portfolio
        <input name="portfolio_url" type="url" placeholder="https://" required>
      </label>
      <label>
        Experience level
        <select name="experience_level">
          <option value="">Choose if relevant</option>
          <option>Professional editor</option>
          <option>Senior editor or lead editor</option>
          <option>Junior editor</option>
          <option>Assistant editor</option>
          <option>Student or early career</option>
        </select>
      </label>
      <label>
        Work preference
        <select name="work_preference">
          <option value="">Choose if relevant</option>
          <option>Remote only</option>
          <option>Remote or hybrid</option>
          <option>Local or studio work</option>
          <option>Open to travel or on-site</option>
        </select>
      </label>
      <label>
        Rate range
        <input name="rate_range" placeholder="$40/hr, $500/video, open to discuss">
      </label>
      <label>
        Weekly capacity
        <input name="weekly_capacity" placeholder="10 hrs/week, 2 videos/week, full-time">
      </label>
      <label>
        Software
        <input name="software" placeholder="Premiere, Resolve, Final Cut, After Effects">
      </label>
      <label>
        Typical turnaround
        <select name="turnaround_time">
          <option value="">Choose if relevant</option>
          <option>Same day when scoped</option>
          <option>1 to 2 days</option>
          <option>3 to 5 days</option>
          <option>1 week or more</option>
          <option>Depends on project scope</option>
        </select>
      </label>
      <label>
        Availability
        <select name="availability">
          <option value="">Choose if relevant</option>
          <option>Available now</option>
          <option>Available within 2 weeks</option>
          <option>Open to part-time projects</option>
          <option>Open to full-time roles</option>
          <option>Just joining the community</option>
        </select>
      </label>
    </div>
    <label>
      Best work examples or notes
      <textarea name="notes" rows="4" placeholder="Share the formats you edit best, links to favorite clips, turnaround speed, or clients you want more of."></textarea>
    </label>
    <label class="check">
      <input name="consent" type="checkbox" value="yes" required>
      <span>I agree to be contacted about video editor jobs, hiring matches, and community updates, and I accept the <a href="/terms/">terms</a> and <a href="/privacy/">privacy policy</a>.</span>
    </label>
    <button class="button primary" type="submit">Join the editor list</button>
    ${formStatus()}
    <p class="form-note">Submissions are routed to the Editors sheet when the Google Apps Script endpoint is configured.</p>
  </form>`;
}

function hiringForm({ compact = false } = {}) {
  return `<form class="intake-form hiring-form" data-intake-kind="hiring" data-mail-subject="Video Editor Jobs hiring intake" data-success-path="/thanks-hiring/">
    ${hiddenTracking("hiring")}
    <div class="form-grid ${compact ? "compact" : ""}">
      <label>
        Name
        <input name="name" autocomplete="name" placeholder="Your name" required>
      </label>
      <label>
        Work email
        <input name="email" type="email" autocomplete="email" placeholder="producer@company.com" required>
      </label>
      <label>
        Company or channel
        <input name="company" placeholder="Brand, agency, creator, studio">
      </label>
      <label>
        Role type
        <select name="role_type" required>
          <option value="">Choose one</option>
          <option>Freelance editor</option>
          <option>Remote editor</option>
          <option>YouTube editor</option>
          <option>Short-form social editor</option>
          <option>Podcast editor</option>
          <option>Assistant editor</option>
          <option>Full-time editor</option>
        </select>
      </label>
      <label>
        Budget or rate
        <input name="budget" placeholder="$50/hr, $800/video, $70k salary">
      </label>
      <label>
        Timeline
        <input name="timeline" placeholder="This week, next month, ongoing">
      </label>
      <label>
        Location or timezone
        <input name="location" placeholder="Remote, LA hybrid, ET overlap">
      </label>
      <label>
        Content format
        <input name="content_format" placeholder="YouTube, TikTok, paid social, podcast, brand film">
      </label>
      <label>
        Project scope
        <input name="project_scope" placeholder="One-off, weekly channel, launch sprint, full-time">
      </label>
      <label>
        Deliverables
        <input name="deliverables" placeholder="1 long-form video, 3 shorts, captions, thumbnails">
      </label>
      <label>
        Footage volume
        <input name="footage_volume" placeholder="90 min raw, multicam podcast, 20 product clips">
      </label>
      <label>
        Software or workflow
        <input name="software" placeholder="Premiere, Resolve, Frame.io, Drive, Descript">
      </label>
    </div>
    <label>
      Revision process
      <textarea name="revision_process" rows="3" placeholder="Share review cadence, number of revision rounds, approval flow, and who gives notes."></textarea>
    </label>
    <label>
      Reference links
      <textarea name="reference_urls" rows="3" placeholder="Paste example videos, channels, ads, or portfolio references that show the edit style."></textarea>
    </label>
    <label>
      Brief, references, and workflow
      <textarea name="brief" rows="5" placeholder="Describe deliverables, edit volume, review process, software, examples of the style, and what a great editor should already understand." required></textarea>
    </label>
    <label class="check">
      <input name="consent" type="checkbox" value="yes" required>
      <span>I agree to be contacted about this hiring request and relevant editor matches, and I accept the <a href="/terms/">terms</a> and <a href="/privacy/">privacy policy</a>.</span>
    </label>
    <button class="button secondary" type="submit">Submit hiring brief</button>
    ${formStatus()}
    <p class="form-note">Submissions are routed to the Hiring Requests sheet when the Google Apps Script endpoint is configured.</p>
  </form>`;
}

function sampleJobRows() {
  return sampleJobs
    .map(
      (job) => `<article class="job-row">
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

function pageCards(currentSlug) {
  return activePages
    .filter((page) => page.slug && page.slug !== currentSlug)
    .map(
      (page) => `<a class="route-link" href="/${page.slug}/">
        <span>${escapeHtml(page.eyebrow)}</span>
        <strong>${escapeHtml(page.h1)}</strong>
      </a>`
    )
    .join("");
}

function blogCards(limit = 3) {
  return activeBlogPosts
    .slice(0, limit)
    .map(
      (post) => `<article class="blog-card">
        <a href="/blog/${post.slug}/">
          <span>${escapeHtml(post.audience)}</span>
          <h3>${escapeHtml(post.h1)}</h3>
          <p>${escapeHtml(post.excerpt)}</p>
        </a>
      </article>`
    )
    .join("");
}

function blogCardsFor(filterFn, limit = activeBlogPosts.length) {
  return activeBlogPosts
    .filter(filterFn)
    .slice(0, limit)
    .map(
      (post) => `<article class="blog-card">
        <a href="/blog/${post.slug}/">
          <span>${escapeHtml(post.audience)}</span>
          <h3>${escapeHtml(post.h1)}</h3>
          <p>${escapeHtml(post.excerpt)}</p>
        </a>
      </article>`
    )
    .join("");
}

function faqMarkup(page) {
  if (!page.faq?.length) return "";
  return `<section class="band faq" id="faq">
    <div class="section-head">
      <p>Answers</p>
      <h2>Questions editors and hiring teams ask first</h2>
    </div>
    <div class="faq-list">
      ${page.faq
        .map(
          (item) => `<details>
            <summary>${escapeHtml(item.question)}</summary>
            <p>${escapeHtml(item.answer)}</p>
          </details>`
        )
        .join("")}
    </div>
  </section>`;
}

function renderLandingPage(page) {
  const body = `<section class="hero">
    <div class="hero-copy">
      <p class="eyebrow">${escapeHtml(page.eyebrow)}</p>
      <h1>${escapeHtml(page.h1)}</h1>
      <p class="lede">${escapeHtml(page.intro)}</p>
      <p class="intent">${escapeHtml(page.intent)}</p>
    </div>
    <div class="hero-art" aria-label="Video editing timeline and job board preview">
      <img src="/assets/editor-workstation.svg" alt="Editing timeline beside video editor job listings">
    </div>
  </section>

  <section class="signal-strip" aria-label="Launch search signals">
    <span>Editor profiles first</span>
    <span>Hiring briefs in a separate queue</span>
    <span>Manual matching from real submissions</span>
  </section>

  <section class="band app-split" id="join">
    <div class="section-head">
      <p>Start here</p>
      <h2>Two paths, one focused market</h2>
    </div>
    <div class="path-grid">
      <article class="path-panel">
        <span>Editors</span>
        <h3>Share your portfolio and work preferences</h3>
        <p>Remote, freelance, YouTube, short-form, podcast, assistant editor, brand, agency, and studio work.</p>
        <a class="button primary" href="/editors/">Join the editor list</a>
      </article>
      <article class="path-panel hire">
        <span>Hiring teams</span>
        <h3>Send a brief editors can actually evaluate</h3>
        <p>Budget, format, deliverables, deadline, software, references, review process, and location or timezone.</p>
        <a class="button secondary" href="/hire-video-editor/">Submit a hiring brief</a>
      </article>
    </div>
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
    <div class="job-stack">${sampleJobRows()}</div>
  </section>

  <section class="band editorial">
    ${page.sections
      .map(
        (section) => `<article>
          <h2>${escapeHtml(section.heading)}</h2>
          <p>${escapeHtml(section.body)}</p>
        </article>`
      )
      .join("")}
  </section>

  <section class="band blog-band">
    <div class="section-head">
      <p>Blog</p>
      <h2>Guides that support better matches</h2>
    </div>
    <div class="blog-grid">${blogCards(3)}</div>
  </section>

  <section class="band routes">
    <div class="section-head">
      <p>Browse</p>
      <h2>The few routes worth testing first</h2>
    </div>
    <div class="route-grid">${pageCards(page.slug)}</div>
  </section>

  ${faqMarkup(page)}`;

  return shell({ page, body });
}

function renderCollectionPage(page) {
  const body = `<section class="compact-hero">
    <p class="eyebrow">${escapeHtml(page.eyebrow)}</p>
    <h1>${escapeHtml(page.h1)}</h1>
    <p class="lede">${escapeHtml(page.intro)}</p>
    <p class="intent">${escapeHtml(page.intent)}</p>
  </section>

  <section class="band editorial">
    ${page.sections
      .map(
        (section) => `<article>
          <h2>${escapeHtml(section.heading)}</h2>
          <p>${escapeHtml(section.body)}</p>
        </article>`
      )
      .join("")}
  </section>

  <section class="band split">
    <div class="section-head">
      <p>Role examples</p>
      <h2>Editing work this page routes toward</h2>
    </div>
    <div class="job-stack">${sampleJobRows()}</div>
  </section>

  <section class="band inline-intakes">
    <div class="mini-form">
      <h2>Editors</h2>
      <p>Join the early list for this category and tell us what kind of work fits.</p>
      ${editorForm({ compact: true })}
    </div>
    <div class="mini-form">
      <h2>Hiring teams</h2>
      <p>Submit a role or project with enough detail for editors to judge fit.</p>
      ${hiringForm({ compact: true })}
    </div>
  </section>

  <section class="band routes">
    <div class="section-head">
      <p>Browse</p>
      <h2>Other traction routes</h2>
    </div>
    <div class="route-grid">${pageCards(page.slug)}</div>
  </section>

  ${faqMarkup(page)}`;

  return shell({ page, body });
}

function renderAppPage(page) {
  const isEditor = page.formKind === "editor";
  const proof = isEditor
    ? [
        "Portfolio and best clips",
        "Editing niches and software",
        "Rates, availability, and location",
        "Consent for job matches and community updates",
      ]
    : [
        "Role type, budget, and timeline",
        "Content format and workflow",
        "References, software, and review process",
        "Consent for follow-up and editor matches",
      ];
  const form = isEditor ? editorForm() : hiringForm();

  const body = `<section class="app-hero">
    <div>
      <p class="eyebrow">${escapeHtml(page.eyebrow)}</p>
      <h1>${escapeHtml(page.h1)}</h1>
      <p class="lede">${escapeHtml(page.intro)}</p>
    </div>
    <aside class="proof-panel" aria-label="What this form collects">
      <h2>What we collect</h2>
      <ul>${proof.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </aside>
  </section>

  <section class="band intake-page">
    <div class="intake-copy">
      <h2>${isEditor ? "Make your fit obvious" : "Write the brief editors need"}</h2>
      <p>${
        isEditor
          ? "The first matching pass is manual, so clear details matter. Share the formats you edit best, the tools you use, and the kind of work you want more of."
          : "A specific brief gets better responses. Editors need to know the format, volume, budget, tools, review process, deadline, and examples of the style you want."
      }</p>
      <ol class="steps">
        <li>Submit the form.</li>
        <li>Your row lands in the right Google Sheet tab once the endpoint is configured.</li>
        <li>We use the sheet as the early matching queue.</li>
      </ol>
    </div>
    ${form}
  </section>

  <section class="band blog-band">
    <div class="section-head">
      <p>Useful guides</p>
      <h2>${isEditor ? "For editors joining early" : "For teams hiring editors"}</h2>
    </div>
    <div class="blog-grid">${blogCards(3)}</div>
  </section>`;

  return shell({ page, body, extraClass: "app-page" });
}

function renderBlogIndex() {
  const page = {
    slug: "blog",
    title: "Video Editor Jobs Blog: Editor Career and Hiring Guides",
    description:
      "Focused guides for finding video editor jobs, hiring editors, writing briefs, building portfolios, setting rates, and understanding creator editing workflows.",
    h1: "Video Editor Jobs Blog",
  };

  const body = `<section class="compact-hero">
    <p class="eyebrow">Blog</p>
    <h1>${page.h1}</h1>
    <p class="lede">A small resource library for the two sides of the market: editors proving fit and creator teams scoping recurring work.</p>
  </section>

  <section class="band resource-hub" aria-label="Resource hub">
    <div class="section-head">
      <p>Start here</p>
      <h2>Choose the question you are trying to answer</h2>
    </div>
    <div class="resource-grid">
      <a class="resource-panel" href="/editors/">
        <span>Editors</span>
        <strong>Get found for the work you actually want</strong>
        <p>Portfolio examples, remote job search, rates, outreach, and early editor list guidance.</p>
      </a>
      <a class="resource-panel hiring" href="/hire-video-editor/">
        <span>Hiring teams</span>
        <strong>Write a brief editors can evaluate</strong>
        <p>Job descriptions, interview questions, YouTube editor briefs, workflow, budget, and revision process.</p>
      </a>
      <a class="resource-panel community" href="/video-editor-community/">
        <span>Community</span>
        <strong>Turn repeated questions into better pages</strong>
        <p>Use Reddit, Facebook, and forum replies to decide which guides and category pages to improve next.</p>
      </a>
    </div>
  </section>

  <section class="band blog-lanes">
    <div class="section-head">
      <p>Editors</p>
      <h2>Portfolio, jobs, outreach, and rates</h2>
    </div>
    <div class="blog-grid full">${blogCardsFor((post) => post.audience.includes("Editors"))}</div>
  </section>

  <section class="band blog-lanes alt">
    <div class="section-head">
      <p>Hiring teams</p>
      <h2>Briefs, screening, and scope</h2>
    </div>
    <div class="blog-grid full">${blogCardsFor((post) => post.audience.includes("Hiring") || post.audience.includes("hiring"))}</div>
  </section>

  <section class="band topic-list">
    <div class="section-head">
      <p>Content queue</p>
      <h2>Use community replies to decide what to publish next</h2>
    </div>
    <ul>
      <li>Questions about portfolios should route to portfolio examples, then the editor intake.</li>
      <li>Questions about vague job posts should route to the job description template, then the hiring intake.</li>
      <li>Questions about pay should route to pricing and rates guides, then collect clearer budget ranges.</li>
      <li>Questions about remote work should route to remote pages, then capture timezone, capacity, and software.</li>
    </ul>
  </section>

  <section class="band blog-index">
    <div class="section-head">
      <p>All guides</p>
      <h2>Every current resource</h2>
    </div>
    <div class="blog-grid full">${blogCards(activeBlogPosts.length)}</div>
  </section>`;

  return shell({ page, body });
}

function renderBlogPost(post) {
  const page = {
    slug: `blog/${post.slug}`,
    title: post.title,
    description: post.description,
    h1: post.h1,
  };
  const articleJsonLd = jsonScript({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.published,
    dateModified: post.published,
    author: {
      "@type": "Organization",
      name: site.name,
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: site.origin,
    },
    mainEntityOfPage: toUrl(page.slug),
  });
  const hiringAudience = post.audience.includes("Hiring") || post.audience.includes("hiring");

  const body = `<article class="article">
    <header>
      <p class="eyebrow">${escapeHtml(post.audience)}</p>
      <h1>${escapeHtml(post.h1)}</h1>
      <p class="lede">${escapeHtml(post.excerpt)}</p>
    </header>
    <div class="article-body">
      ${post.sections
        .map(
          (section) => `<section>
            <h2>${escapeHtml(section.heading)}</h2>
            <p>${escapeHtml(section.body)}</p>
          </section>`
        )
        .join("")}
    </div>
  </article>
  <section class="band cta-band">
    <div>
      <h2>${hiringAudience ? "Need an editor?" : "Want better editing work?"}</h2>
      <p>${hiringAudience ? "Send a hiring brief and start the early matching queue." : "Join the editor list and tell us what work fits you."}</p>
    </div>
    <a class="button ${hiringAudience ? "secondary" : "primary"}" href="${hiringAudience ? "/hire-video-editor/" : "/editors/"}">${
      hiringAudience ? "Post job" : "Join as an editor"
    }</a>
  </section>`;

  return `<!doctype html>
<html lang="en">
  ${head({ ...page, extraJsonLd: articleJsonLd })}
  <body>
    <a class="skip-link" href="#main">Skip to content</a>
    <header class="site-header">
      <a class="brand" href="/" aria-label="Video Editor Jobs home">
        <span class="brand-mark">VEJ</span>
        <span>Video Editor Jobs</span>
      </a>
      <nav class="site-nav" aria-label="Primary navigation">
        ${navMarkup("blog")}
      </nav>
      <div class="header-actions">
        <a class="header-cta post" href="/hire-video-editor/">Post job</a>
      </div>
    </header>
    <main id="main">${body}</main>
    ${footer()}
    <script src="/assets/forms.js" defer></script>
  </body>
</html>`;
}

function searchableText(page) {
  const parts = [
    page.title,
    page.h1,
    page.description,
    page.eyebrow,
    page.intro,
    page.intent,
    page.audience,
    page.excerpt,
    ...(page.sections || []).flatMap((section) => [section.heading, section.body]),
    ...(page.faq || []).flatMap((item) => [item.question, item.answer]),
  ];
  return parts.filter(Boolean).join(" ");
}

function searchItems() {
  return allCrawlPages
    .filter((page) => page.slug !== "search")
    .map((page) => ({
      title: page.h1 || page.title,
      description: page.excerpt || page.description,
      url: `/${page.slug ? `${page.slug}/` : ""}`,
      type: page.slug?.startsWith("blog/") ? "Blog" : page.slug === "blog" ? "Blog" : page.formKind ? "Intake" : "Page",
      searchText: searchableText(page).toLowerCase(),
    }));
}

function renderSearchPage() {
  const indexJson = JSON.stringify(searchItems()).replaceAll("</", "<\\/");
  const body = `<section class="compact-hero search-hero">
    <p class="eyebrow">Search</p>
    <h1>${escapeHtml(searchPage.h1)}</h1>
    <p class="lede">Find the current intake pages, creator-workflow routes, hiring resources, and editor proof guides.</p>
  </section>

  <section class="band search-band">
    <form class="search-panel" role="search">
      <label>
        Search the site
        <input id="site-search-input" name="q" type="search" autocomplete="off" placeholder="remote, YouTube, portfolio, brief, hire">
      </label>
    </form>
    <div class="search-results" id="site-search-results" aria-live="polite"></div>
  </section>

  <script>
    const searchIndex = ${indexJson};
    const input = document.getElementById("site-search-input");
    const results = document.getElementById("site-search-results");
    const params = new URLSearchParams(window.location.search);

    function normalize(value) {
      return String(value || "").trim().toLowerCase();
    }

    function render(query) {
      const terms = normalize(query).split(/\\s+/).filter(Boolean);
      const matches = terms.length
        ? searchIndex.filter((item) => terms.every((term) => item.searchText.includes(term)))
        : searchIndex.slice(0, 8);

      results.innerHTML = matches.length
        ? matches
            .slice(0, 24)
            .map(
              (item) => '<a class="search-result" href="' + item.url + '"><span>' + item.type + '</span><strong>' + item.title + '</strong><p>' + item.description + '</p></a>'
            )
            .join("")
        : '<p class="empty-search">No matching pages yet. Try remote, freelance, YouTube, portfolio, brief, hire, or community.</p>';
    }

    input.value = params.get("q") || "";
    render(input.value);
    input.addEventListener("input", () => {
      const url = new URL(window.location.href);
      if (input.value.trim()) {
        url.searchParams.set("q", input.value.trim());
      } else {
        url.searchParams.delete("q");
      }
      window.history.replaceState({}, "", url);
      render(input.value);
    });
  </script>`;

  return shell({ page: { ...searchPage, robots: "noindex, follow" }, body });
}

function renderTrustPage(page) {
  const body = `<article class="article">
    <header>
      <p class="eyebrow">Trust</p>
      <h1>${escapeHtml(page.h1)}</h1>
      <p class="lede">${escapeHtml(page.intro)}</p>
    </header>
    <div class="article-body">
      ${page.sections
        .map(
          (section) => `<section>
            <h2>${escapeHtml(section.heading)}</h2>
            <p>${escapeHtml(section.body)}</p>
          </section>`
        )
        .join("")}
    </div>
  </article>`;

  return shell({ page, body });
}

function renderUtilityPage(page) {
  const body = `<section class="compact-hero thanks-hero">
    <p class="eyebrow">${escapeHtml(page.eyebrow)}</p>
    <h1>${escapeHtml(page.h1)}</h1>
    <p class="lede">${escapeHtml(page.intro)}</p>
    <div class="hero-actions">
      <a class="button primary" href="${page.primaryCta[1]}">${escapeHtml(page.primaryCta[0])}</a>
      <a class="button secondary" href="${page.secondaryCta[1]}">${escapeHtml(page.secondaryCta[0])}</a>
    </div>
  </section>

  <section class="band thanks-panel">
    <div class="section-head">
      <p>Next</p>
      <h2>What happens now</h2>
    </div>
    <ol class="steps">
      ${page.nextSteps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}
    </ol>
  </section>

  <section class="band share-panel">
    <div class="section-head">
      <p>Share</p>
      <h2>Help the early list get stronger</h2>
    </div>
    <div class="share-grid">
      ${page.shareLinks
        .map(
          (link) => `<a class="share-card" href="${escapeAttr(link.href)}">
            <strong>${escapeHtml(link.label)}</strong>
            <span>${escapeHtml(link.text)}</span>
          </a>`
        )
        .join("")}
    </div>
  </section>`;

  return shell({ page: { ...page, robots: "noindex, follow" }, body, extraClass: "utility-page" });
}

function sitemap() {
  const urls = allCrawlPages
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

function llmsTxt() {
  const primaryRoutes = [
    ["Editor intake", "/editors/", "Video editors can join the early talent list."],
    ["Hiring intake", "/hire-video-editor/", "Hiring teams can submit editing briefs and role details."],
    ["Search", "/search/", "Search current guides and intake routes."],
    ["Blog", "/blog/", "Guides for editors and hiring teams."],
    ["Sitemap", "/sitemap.xml", "XML sitemap for crawl discovery."],
    ["RSS", "/rss.xml", "RSS feed for blog posts."],
  ];

  const categoryRoutes = activePages
    .filter((page) => page.slug)
    .map((page) => `- [${page.h1}](${toUrl(page.slug)}): ${page.description}`);

  const blogRoutes = activeBlogPosts.map((post) => `- [${post.h1}](${toUrl(`blog/${post.slug}`)}): ${post.excerpt}`);

  return `# ${site.name}

${site.description}

## Audience

- Video editors looking for remote, freelance, YouTube, short-form, assistant, local, and agency or brand editing work.
- Hiring teams looking for freelance, remote, YouTube, podcast, social, brand, agency, and assistant video editors.

## Primary Routes

${primaryRoutes.map(([label, path, description]) => `- [${label}](${site.origin}${path}): ${description}`).join("\n")}

## SEO Category Routes

${categoryRoutes.join("\n")}

## Blog Guides

${blogRoutes.join("\n")}

## Contact

${site.email}
`;
}

function rss() {
  const items = activeBlogPosts
    .map((post) => {
      const url = toUrl(`blog/${post.slug}`);
      return `<item>
      <title>${escapeHtml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${toRfc822(post.published)}</pubDate>
      <description>${escapeHtml(post.excerpt)}</description>
    </item>`;
    })
    .join("\n    ");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeHtml(site.name)} Blog</title>
    <link>${site.origin}/blog/</link>
    <description>${escapeHtml(site.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${toRfc822(site.launchDate)}</lastBuildDate>
    ${items}
  </channel>
</rss>
`;
}

async function writePage(slug, html) {
  const filePath = toPath(slug);
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, html);
}

await rm(dist, { recursive: true, force: true });
await mkdir(join(dist, "assets"), { recursive: true });

for (const page of activePages) {
  await writePage(page.slug, page.pageType === "home" ? renderLandingPage(page) : renderCollectionPage(page));
}

for (const page of appPages) {
  await writePage(page.slug, renderAppPage(page));
}

await writePage("blog", renderBlogIndex());
await writePage("search", renderSearchPage());

for (const post of activeBlogPosts) {
  await writePage(`blog/${post.slug}`, renderBlogPost(post));
}

for (const page of trustPages) {
  await writePage(page.slug, renderTrustPage(page));
}

for (const page of utilityPages) {
  await writePage(page.slug, renderUtilityPage(page));
}

await writeFile(join(dist, "sitemap.xml"), sitemap());
await writeFile(join(dist, "robots.txt"), robots());
await writeFile(join(dist, "rss.xml"), rss());
await writeFile(join(dist, "llms.txt"), llmsTxt());
await copyFile(join(root, "src", "styles.css"), join(dist, "assets", "styles.css"));
await copyFile(join(root, "src", "forms.js"), join(dist, "assets", "forms.js"));
await copyFile(join(root, "src", "assets", "editor-workstation.svg"), join(dist, "assets", "editor-workstation.svg"));
await copyFile(join(root, "src", "assets", "video-editor-jobs-og.svg"), join(dist, "assets", "video-editor-jobs-og.svg"));
await copyFile(join(root, "src", "assets", "favicon.svg"), join(dist, "assets", "favicon.svg"));

console.log(`Built ${allCrawlPages.length} pages in dist/`);
