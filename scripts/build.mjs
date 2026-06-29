import { copyFile, mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { appPages, blogPosts, keywords, nav, pages, sampleJobs, site, toolPages, trustPages } from "../src/site-data.mjs";
import { loadLocalEnv } from "./env.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, "dist");
await loadLocalEnv();
const intakeEndpoint = process.env.VEJ_INTAKE_ENDPOINT || "";

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
  description: "Guides for finding video editor jobs, hiring editors, writing briefs, building portfolios, and understanding editing workflows.",
  h1: "Video Editor Jobs Blog",
};

const searchPage = {
  slug: "search",
  priority: "0.45",
  changefreq: "weekly",
  title: "Search Video Editor Jobs",
  description: "Search Video Editor Jobs pages, hiring guides, editor resources, local pages, and community intake routes.",
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
    primaryCta: ["Browse job pages", "/new-video-editor-jobs/"],
    secondaryCta: ["Read portfolio guide", "/blog/video-editor-portfolio-guide/"],
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
        label: "Share fresh job alerts",
        href: "/video-editor-jobs-last-3-days/?utm_source=referral&utm_medium=thank_you&utm_campaign=fresh_jobs_share",
        text: "Send editors to the fresh-alert page so they can join before public listings are live.",
      },
      {
        label: "Share with newer editors",
        href: "/teen-video-editor-jobs/?utm_source=referral&utm_medium=thank_you&utm_campaign=early_career_share",
        text: "A safer early-career route for teen, student, and portfolio-building editors.",
      },
      {
        label: "Share travel editor work",
        href: "/on-call-travel-video-editor-jobs/?utm_source=referral&utm_medium=thank_you&utm_campaign=travel_editor_share",
        text: "Useful for editors who want field, event, tour, or fast-turnaround travel work.",
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
        label: "Share travel editor guidance",
        href: "/on-call-travel-video-editor-jobs/?utm_source=referral&utm_medium=thank_you&utm_campaign=travel_hiring_share",
        text: "Useful when a team needs on-call, event, tour, or field editing help.",
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
  ...pages,
  ...appPages,
  ...toolPages,
  blogIndexPage,
  ...blogPosts.map((post) => ({
    ...post,
    slug: `blog/${post.slug}`,
  })),
  ...trustPages,
  searchPage,
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
    <meta name="viewport" content="width=device-width, initial-scale=1">
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
    <link rel="stylesheet" href="/assets/styles.css">
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
        <a class="header-cta" href="/editors/">Join</a>
        <a class="header-cta post" href="/post-video-editor-job/">Post job</a>
      </div>
    </header>
    <main id="main">${body}</main>
    ${footer()}
    <script src="/assets/forms.js" defer></script>
  </body>
</html>`;
}

function footer() {
  return `<footer class="site-footer">
    <div>
      <strong>Video Editor Jobs</strong>
      <p>A focused editor community and hiring intake surface for video editing work.</p>
    </div>
    <nav aria-label="Footer navigation">
      <a href="/editors/">Editors</a>
      <a href="/hire-video-editor/">Hire</a>
      <a href="/post-video-editor-job/">Post job</a>
      <a href="/video-editor-job-brief-builder/">Brief builder</a>
      <a href="/video-editor-portfolio-checklist/">Portfolio checklist</a>
      <a href="/video-editing-rate-calculator/">Rate calculator</a>
      <a href="/video-editor-community-post-generator/">Post generator</a>
      <a href="/blog/">Blog</a>
      <a href="/search/">Search</a>
      <a href="/privacy/">Privacy</a>
      <a href="/terms/">Terms</a>
      <a href="/rss.xml">RSS</a>
      <a href="/sitemap.xml">Sitemap</a>
      <a href="mailto:${site.email}">${site.email}</a>
    </nav>
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
  return pages
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
  return blogPosts
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

function blogCardsFor(filterFn, limit = blogPosts.length) {
  return blogPosts
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
      <div class="hero-actions">
        <a class="button primary" href="/editors/">Join as an editor</a>
        <a class="button secondary" href="/hire-video-editor/">Hire an editor</a>
      </div>
    </div>
    <div class="hero-art" aria-label="Video editing timeline and job board preview">
      <img src="/assets/editor-workstation.svg" alt="Editing timeline beside video editor job listings">
    </div>
  </section>

  <section class="signal-strip" aria-label="Launch search signals">
    <span>Editor profiles first</span>
    <span>Hiring briefs in a separate queue</span>
    <span>SEO pages plus blog growth</span>
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
      <h2>SEO that helps both sides of the market</h2>
    </div>
    <div class="blog-grid">${blogCards(3)}</div>
  </section>

  <section class="band routes">
    <div class="section-head">
      <p>Browse</p>
      <h2>Related video editor job pages</h2>
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
    <div class="hero-actions">
      <a class="button primary" href="/editors/">Join editor alerts</a>
      <a class="button secondary" href="/hire-video-editor/">Post a role</a>
    </div>
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
      <h2>Related video editor job pages</h2>
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

function briefBuilderJsonLd(page) {
  return jsonScript({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: page.h1,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: toUrl(page.slug),
    description: page.description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  });
}

function renderBriefBuilderPage(page) {
  const fields = [
    ["role_type", "Role type", "YouTube editor, short-form social editor, remote freelance editor"],
    ["content_format", "Content format", "Long-form YouTube, TikTok clips, podcast, paid social ads"],
    ["deliverables", "Deliverables", "1 long-form edit plus 3 shorts each week"],
    ["footage_volume", "Source footage", "90 minutes raw footage, two-camera podcast, product clips"],
    ["budget", "Budget or rate", "$800/video, $60/hr, $3k/month, $75k salary"],
    ["timeline", "Timeline", "First draft by Friday, ongoing weekly cadence"],
    ["software", "Software and handoff", "Premiere, Resolve, Frame.io, Google Drive, Descript"],
    ["revision_process", "Revision process", "Two rounds in Frame.io, producer gives final notes"],
    ["reference_urls", "Reference links", "Example channels, videos, ads, portfolios, style references"],
    ["brief", "What a great editor should understand", "Pacing, captions, retention hooks, brand tone, thumbnails"],
  ];

  const checklist = [
    "Role type",
    "Content format",
    "Deliverables",
    "Footage volume",
    "Budget",
    "Timeline",
    "Software",
    "Revision process",
    "References",
    "Success criteria",
  ];

  const body = `<section class="compact-hero builder-hero">
    <p class="eyebrow">${escapeHtml(page.eyebrow)}</p>
    <h1>${escapeHtml(page.h1)}</h1>
    <p class="lede">${escapeHtml(page.intro)}</p>
    <p class="intent">${escapeHtml(page.intent)}</p>
  </section>

  <section class="band builder-layout">
    <form class="brief-builder" id="brief-builder-form">
      <div class="section-head">
        <p>Build</p>
        <h2>Fill the fields editors use to judge fit</h2>
      </div>
      <div class="builder-field-grid">
        ${fields
          .map(
            ([name, label, placeholder], index) => `<label>
              ${escapeHtml(label)}
              ${
                index >= 7
                  ? `<textarea name="${name}" rows="3" placeholder="${escapeAttr(placeholder)}"></textarea>`
                  : `<input name="${name}" placeholder="${escapeAttr(placeholder)}">`
              }
            </label>`
          )
          .join("")}
      </div>
    </form>

    <aside class="builder-preview" aria-label="Generated brief preview">
      <div class="builder-score">
        <span id="brief-score">0%</span>
        <strong id="brief-score-label">Needs detail</strong>
      </div>
      <ul class="builder-checklist" id="brief-checklist">
        ${checklist.map((item) => `<li data-check="${escapeAttr(item)}">${escapeHtml(item)}</li>`).join("")}
      </ul>
      <div class="brief-output" id="brief-output">
        <h2>Generated brief</h2>
        <p>Add the details on the left and this preview will turn them into a cleaner editor brief.</p>
      </div>
      <div class="hero-actions">
        <button class="button primary" id="save-brief-button" type="button">Use this brief</button>
        <a class="button secondary" href="/blog/video-editor-job-description-template/">See template</a>
      </div>
      <p class="builder-note" id="builder-note">The builder saves only to this browser until you choose to submit the hiring form.</p>
    </aside>
  </section>

  <section class="band editorial">
    <article>
      <h2>Why this works better than a vague post</h2>
      <p>Editors need enough context to decide whether their portfolio, speed, software, and rate fit the work. A clear brief reduces mismatched applications and makes stronger editors more likely to reply.</p>
    </article>
    <article>
      <h2>What to do after the score improves</h2>
      <p>Use the generated brief as a starting point, then submit the hiring request. The post-job form routes budget, workflow, references, and review details into the hiring queue.</p>
    </article>
  </section>

  ${faqMarkup(page)}

  <script>
    const builderForm = document.getElementById("brief-builder-form");
    const scoreValue = document.getElementById("brief-score");
    const scoreLabel = document.getElementById("brief-score-label");
    const checklistItems = Array.from(document.querySelectorAll("#brief-checklist li"));
    const output = document.getElementById("brief-output");
    const saveButton = document.getElementById("save-brief-button");
    const note = document.getElementById("builder-note");
    const storageKey = "vej:brief-builder:hiring";
    const fieldLabels = ${JSON.stringify(Object.fromEntries(fields.map(([name, label]) => [name, label]))).replaceAll("</", "<\\/")};
    const checkMap = [
      ["Role type", ["role_type"]],
      ["Content format", ["content_format"]],
      ["Deliverables", ["deliverables"]],
      ["Footage volume", ["footage_volume"]],
      ["Budget", ["budget"]],
      ["Timeline", ["timeline"]],
      ["Software", ["software"]],
      ["Revision process", ["revision_process"]],
      ["References", ["reference_urls"]],
      ["Success criteria", ["brief"]],
    ];

    function value(name) {
      return String(new FormData(builderForm).get(name) || "").trim();
    }

    function fieldValues() {
      return Object.keys(fieldLabels).reduce((acc, name) => {
        acc[name] = value(name);
        return acc;
      }, {});
    }

    function escapeText(text) {
      return String(text || "").replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char]);
    }

    function generatedBrief(values) {
      const rows = [
        ["Role", values.role_type],
        ["Content format", values.content_format],
        ["Deliverables", values.deliverables],
        ["Source footage", values.footage_volume],
        ["Budget or rate", values.budget],
        ["Timeline", values.timeline],
        ["Software and handoff", values.software],
        ["Revision process", values.revision_process],
        ["Reference links", values.reference_urls],
        ["What a great editor should understand", values.brief],
      ].filter(([, detail]) => detail);

      return rows.map(([label, detail]) => label + ": " + detail).join("\\n");
    }

    function renderBuilder() {
      const values = fieldValues();
      const passed = checkMap.filter(([, names]) => names.some((name) => values[name])).map(([label]) => label);
      const score = Math.round((passed.length / checkMap.length) * 100);
      const brief = generatedBrief(values);

      scoreValue.textContent = score + "%";
      scoreLabel.textContent = score >= 80 ? "Ready to post" : score >= 50 ? "Getting clearer" : "Needs detail";

      checklistItems.forEach((item) => {
        item.dataset.complete = passed.includes(item.dataset.check) ? "true" : "false";
      });

      output.innerHTML = brief
        ? '<h2>Generated brief</h2><pre>' + escapeText(brief) + '</pre>'
        : '<h2>Generated brief</h2><p>Add the details on the left and this preview will turn them into a cleaner editor brief.</p>';
    }

    builderForm.addEventListener("input", renderBuilder);
    saveButton.addEventListener("click", () => {
      const values = fieldValues();
      const brief = generatedBrief(values);
      if (!brief) {
        note.textContent = "Add at least one detail before continuing.";
        return;
      }

      window.localStorage.setItem(
        storageKey,
        JSON.stringify({
          created_at: new Date().toISOString(),
          fields: {
            ...values,
            brief,
          },
        })
      );
      window.location.href = "/post-video-editor-job/?utm_source=site&utm_medium=tool&utm_campaign=brief_builder";
    });

    renderBuilder();
  </script>`;

  return shell({ page, body, extraClass: "tool-page" }).replace("</head>", `${briefBuilderJsonLd(page)}\n</head>`);
}

function renderPortfolioChecklistPage(page) {
  const fields = [
    ["portfolio_url", "Portfolio link", "https://yourportfolio.com or a curated playlist"],
    ["primary_fit", "Primary editing fit", "YouTube editor, short-form social, podcast, brand, agency"],
    ["software", "Software and workflow", "Premiere, Resolve, Final Cut, After Effects, Frame.io"],
    ["experience_level", "Experience level", "Professional editor, junior editor, assistant editor"],
    ["work_preference", "Work preference", "Remote, freelance, part-time, full-time, local, travel"],
    ["rate_range", "Rate range", "$50/hr, $800/video, day rate, monthly retainer"],
    ["weekly_capacity", "Weekly capacity", "10 hours/week, 2 videos/week, full-time"],
    ["turnaround_time", "Typical turnaround", "Same day, 1 to 2 days, 3 to 5 days, 1 week"],
    ["availability", "Availability", "Available now, within 2 weeks, open to projects"],
    ["notes", "Best work examples and proof", "Paste 2 to 4 clips and say what each one proves"],
  ];

  const checklist = [
    "Portfolio link",
    "Primary fit",
    "Software",
    "Experience level",
    "Work preference",
    "Rate range",
    "Capacity",
    "Turnaround",
    "Availability",
    "Proof notes",
  ];

  const body = `<section class="compact-hero builder-hero">
    <p class="eyebrow">${escapeHtml(page.eyebrow)}</p>
    <h1>${escapeHtml(page.h1)}</h1>
    <p class="lede">${escapeHtml(page.intro)}</p>
    <p class="intent">${escapeHtml(page.intent)}</p>
  </section>

  <section class="band builder-layout">
    <form class="brief-builder" id="portfolio-checklist-form">
      <div class="section-head">
        <p>Check</p>
        <h2>Make your editor profile easier to review</h2>
      </div>
      <div class="builder-field-grid">
        ${fields
          .map(
            ([name, label, placeholder], index) => `<label>
              ${escapeHtml(label)}
              ${
                index >= 9
                  ? `<textarea name="${name}" rows="3" placeholder="${escapeAttr(placeholder)}"></textarea>`
                  : `<input name="${name}" placeholder="${escapeAttr(placeholder)}">`
              }
            </label>`
          )
          .join("")}
      </div>
    </form>

    <aside class="builder-preview" aria-label="Generated editor profile preview">
      <div class="builder-score">
        <span id="portfolio-score">0%</span>
        <strong id="portfolio-score-label">Needs proof</strong>
      </div>
      <ul class="builder-checklist" id="portfolio-checklist">
        ${checklist.map((item) => `<li data-check="${escapeAttr(item)}">${escapeHtml(item)}</li>`).join("")}
      </ul>
      <div class="brief-output" id="portfolio-output">
        <h2>Profile preview</h2>
        <p>Add your details on the left and this preview will turn them into clearer editor intake notes.</p>
      </div>
      <div class="hero-actions">
        <button class="button primary" id="save-portfolio-button" type="button">Use this profile</button>
        <a class="button secondary" href="/blog/video-editor-portfolio-examples/">See examples</a>
      </div>
      <p class="builder-note" id="portfolio-note">The checklist saves only to this browser until you choose to submit the editor form.</p>
    </aside>
  </section>

  <section class="band editorial">
    <article>
      <h2>Why editors get skipped</h2>
      <p>Hiring teams often move past portfolios that do not show the right format, pace, turnaround, workflow, or availability. The goal is not more clips. It is clearer proof for the work you want.</p>
    </article>
    <article>
      <h2>What to do after the score improves</h2>
      <p>Use the generated notes as a starting point, then join the editor list. The editor intake routes portfolio, fit, capacity, rate, and availability into the review queue.</p>
    </article>
  </section>

  ${faqMarkup(page)}

  <script>
    const portfolioForm = document.getElementById("portfolio-checklist-form");
    const portfolioScoreValue = document.getElementById("portfolio-score");
    const portfolioScoreLabel = document.getElementById("portfolio-score-label");
    const portfolioChecklistItems = Array.from(document.querySelectorAll("#portfolio-checklist li"));
    const portfolioOutput = document.getElementById("portfolio-output");
    const savePortfolioButton = document.getElementById("save-portfolio-button");
    const portfolioNote = document.getElementById("portfolio-note");
    const portfolioStorageKey = "vej:portfolio-checklist:editor";
    const portfolioFieldLabels = ${JSON.stringify(Object.fromEntries(fields.map(([name, label]) => [name, label]))).replaceAll("</", "<\\/")};
    const portfolioCheckMap = [
      ["Portfolio link", ["portfolio_url"]],
      ["Primary fit", ["primary_fit"]],
      ["Software", ["software"]],
      ["Experience level", ["experience_level"]],
      ["Work preference", ["work_preference"]],
      ["Rate range", ["rate_range"]],
      ["Capacity", ["weekly_capacity"]],
      ["Turnaround", ["turnaround_time"]],
      ["Availability", ["availability"]],
      ["Proof notes", ["notes"]],
    ];

    function portfolioValue(name) {
      return String(new FormData(portfolioForm).get(name) || "").trim();
    }

    function portfolioValues() {
      return Object.keys(portfolioFieldLabels).reduce((acc, name) => {
        acc[name] = portfolioValue(name);
        return acc;
      }, {});
    }

    function escapePortfolioText(text) {
      return String(text || "").replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char]);
    }

    function generatedProfile(values) {
      const rows = [
        ["Portfolio", values.portfolio_url],
        ["Primary editing fit", values.primary_fit],
        ["Software and workflow", values.software],
        ["Experience level", values.experience_level],
        ["Work preference", values.work_preference],
        ["Rate range", values.rate_range],
        ["Weekly capacity", values.weekly_capacity],
        ["Typical turnaround", values.turnaround_time],
        ["Availability", values.availability],
        ["Best examples and proof", values.notes],
      ].filter(([, detail]) => detail);

      return rows.map(([label, detail]) => label + ": " + detail).join("\\n");
    }

    function renderPortfolioChecklist() {
      const values = portfolioValues();
      const passed = portfolioCheckMap.filter(([, names]) => names.some((name) => values[name])).map(([label]) => label);
      const score = Math.round((passed.length / portfolioCheckMap.length) * 100);
      const profile = generatedProfile(values);

      portfolioScoreValue.textContent = score + "%";
      portfolioScoreLabel.textContent = score >= 80 ? "Ready to join" : score >= 50 ? "Getting clearer" : "Needs proof";

      portfolioChecklistItems.forEach((item) => {
        item.dataset.complete = passed.includes(item.dataset.check) ? "true" : "false";
      });

      portfolioOutput.innerHTML = profile
        ? '<h2>Profile preview</h2><pre>' + escapePortfolioText(profile) + '</pre>'
        : '<h2>Profile preview</h2><p>Add your details on the left and this preview will turn them into clearer editor intake notes.</p>';
    }

    portfolioForm.addEventListener("input", renderPortfolioChecklist);
    savePortfolioButton.addEventListener("click", () => {
      const values = portfolioValues();
      const profile = generatedProfile(values);
      if (!profile) {
        portfolioNote.textContent = "Add at least one detail before continuing.";
        return;
      }

      window.localStorage.setItem(
        portfolioStorageKey,
        JSON.stringify({
          created_at: new Date().toISOString(),
          fields: {
            ...values,
            notes: profile,
          },
        })
      );
      window.location.href = "/editors/?utm_source=site&utm_medium=tool&utm_campaign=portfolio_checklist";
    });

    renderPortfolioChecklist();
  </script>`;

  return shell({ page, body, extraClass: "tool-page" }).replace("</head>", `${briefBuilderJsonLd(page)}\n</head>`);
}

function renderRateCalculatorPage(page) {
  const body = `<section class="compact-hero builder-hero">
    <p class="eyebrow">${escapeHtml(page.eyebrow)}</p>
    <h1>${escapeHtml(page.h1)}</h1>
    <p class="lede">${escapeHtml(page.intro)}</p>
    <p class="intent">${escapeHtml(page.intent)}</p>
  </section>

  <section class="band builder-layout">
    <form class="brief-builder" id="rate-calculator-form">
      <div class="section-head">
        <p>Estimate</p>
        <h2>Scope the editing work before quoting</h2>
      </div>
      <div class="builder-field-grid">
        <label>
          Project type
          <select name="project_type">
            <option value="short_form">Short-form social clips</option>
            <option value="youtube">Long-form YouTube</option>
            <option value="podcast">Podcast or multicam episode</option>
            <option value="paid_social">Paid social ad variants</option>
            <option value="brand">Brand or product video</option>
          </select>
        </label>
        <label>
          Raw footage minutes
          <input name="footage_minutes" type="number" min="5" max="1000" step="5" value="90">
        </label>
        <label>
          Finished video minutes
          <input name="finished_minutes" type="number" min="1" max="240" step="1" value="12">
        </label>
        <label>
          Deliverables
          <input name="deliverables_count" type="number" min="1" max="40" step="1" value="1">
        </label>
        <label>
          Complexity
          <select name="complexity">
            <option value="simple">Simple clean edit</option>
            <option value="standard" selected>Standard storytelling edit</option>
            <option value="advanced">Advanced pacing, captions, graphics</option>
            <option value="premium">Premium brand polish or ad variants</option>
          </select>
        </label>
        <label>
          Turnaround
          <select name="turnaround">
            <option value="relaxed">Flexible timeline</option>
            <option value="standard" selected>Standard turnaround</option>
            <option value="rush">Rush delivery</option>
          </select>
        </label>
        <label>
          Revision rounds
          <input name="revision_rounds" type="number" min="0" max="6" step="1" value="2">
        </label>
        <label>
          Editor level
          <select name="editor_level">
            <option value="junior">Junior editor</option>
            <option value="professional" selected>Professional editor</option>
            <option value="senior">Senior or lead editor</option>
          </select>
        </label>
      </div>
    </form>

    <aside class="builder-preview" aria-label="Editing rate estimate">
      <div class="builder-score rate-score">
        <span id="rate-estimate">$0</span>
        <strong id="rate-label">Estimated project range</strong>
      </div>
      <div class="rate-breakdown" id="rate-breakdown"></div>
      <div class="brief-output" id="rate-output">
        <h2>Quote note</h2>
        <p>Change the scope to create a practical pricing note for an editor profile or hiring brief.</p>
      </div>
      <div class="hero-actions">
        <a class="button primary" id="rate-editor-link" href="/editors/?utm_source=site&utm_medium=tool&utm_campaign=rate_calculator">Join as editor</a>
        <a class="button secondary" id="rate-hiring-link" href="/video-editor-job-brief-builder/?utm_source=site&utm_medium=tool&utm_campaign=rate_calculator">Build hiring brief</a>
      </div>
      <p class="builder-note">Use the estimate as a starting point. Real pricing still depends on scope, taste, speed, and editor experience.</p>
    </aside>
  </section>

  <section class="band editorial">
    <article>
      <h2>Why ranges are better than guesses</h2>
      <p>A useful rate conversation starts with scope. Footage volume, edit length, variants, turnaround, and revisions usually explain more than a flat hourly number.</p>
    </article>
    <article>
      <h2>What to do with the estimate</h2>
      <p>Editors can use the range to clarify rate expectations. Hiring teams can use it to avoid posting a role with an empty or unrealistic budget field.</p>
    </article>
  </section>

  ${faqMarkup(page)}

  <script>
    const rateForm = document.getElementById("rate-calculator-form");
    const rateEstimate = document.getElementById("rate-estimate");
    const rateLabel = document.getElementById("rate-label");
    const rateBreakdown = document.getElementById("rate-breakdown");
    const rateOutput = document.getElementById("rate-output");
    const rateEditorLink = document.getElementById("rate-editor-link");
    const rateHiringLink = document.getElementById("rate-hiring-link");
    const projectMultipliers = {
      short_form: 0.72,
      youtube: 1,
      podcast: 0.9,
      paid_social: 1.22,
      brand: 1.35,
    };
    const complexityMultipliers = {
      simple: 0.82,
      standard: 1,
      advanced: 1.32,
      premium: 1.62,
    };
    const turnaroundMultipliers = {
      relaxed: 0.92,
      standard: 1,
      rush: 1.35,
    };
    const levelRates = {
      junior: 38,
      professional: 68,
      senior: 105,
    };

    function rateNumber(name, fallback) {
      const value = Number(new FormData(rateForm).get(name));
      return Number.isFinite(value) ? value : fallback;
    }

    function rateValue(name) {
      return String(new FormData(rateForm).get(name) || "");
    }

    function money(value) {
      return "$" + Math.round(value).toLocaleString("en-US");
    }

    function renderRateCalculator() {
      const footage = rateNumber("footage_minutes", 90);
      const finished = rateNumber("finished_minutes", 12);
      const deliverables = rateNumber("deliverables_count", 1);
      const revisions = rateNumber("revision_rounds", 2);
      const projectType = rateValue("project_type");
      const complexity = rateValue("complexity");
      const turnaround = rateValue("turnaround");
      const editorLevel = rateValue("editor_level");

      const reviewHours = Math.max(1, footage / 55);
      const editHours = Math.max(2, finished * 0.9);
      const deliverableHours = Math.max(0, deliverables - 1) * 0.9;
      const revisionHours = Math.max(0, revisions) * 0.75;
      const baseHours = reviewHours + editHours + deliverableHours + revisionHours;
      const multiplier = projectMultipliers[projectType] * complexityMultipliers[complexity] * turnaroundMultipliers[turnaround];
      const estimatedHours = Math.max(3, baseHours * multiplier);
      const rate = levelRates[editorLevel];
      const low = estimatedHours * rate * 0.82;
      const high = estimatedHours * rate * 1.22;
      const midpoint = (low + high) / 2;
      const query = new URLSearchParams({
        utm_source: "site",
        utm_medium: "tool",
        utm_campaign: "rate_calculator",
        rate_estimate: Math.round(midpoint).toString(),
      });

      rateEstimate.textContent = money(low) + "-" + money(high);
      rateLabel.textContent = Math.round(estimatedHours) + " estimated hours";
      rateBreakdown.innerHTML = [
        ["Review", reviewHours],
        ["Edit", editHours],
        ["Deliverables", deliverableHours],
        ["Revisions", revisionHours],
      ]
        .map(([label, hours]) => '<div><span>' + label + '</span><strong>' + hours.toFixed(1) + 'h</strong></div>')
        .join("");

      const note = [
        "Estimated project range: " + money(low) + "-" + money(high),
        "Estimated hours: " + Math.round(estimatedHours),
        "Scope: " + footage + " raw minutes, " + finished + " finished minutes, " + deliverables + " deliverable(s), " + revisions + " revision round(s).",
      ].join("\\n");

      rateOutput.innerHTML = '<h2>Quote note</h2><pre>' + note + '</pre>';
      rateEditorLink.href = "/editors/?" + query.toString();
      rateHiringLink.href = "/video-editor-job-brief-builder/?" + query.toString();
    }

    rateForm.addEventListener("input", renderRateCalculator);
    rateForm.addEventListener("change", renderRateCalculator);
    renderRateCalculator();
  </script>`;

  return shell({ page, body, extraClass: "tool-page" }).replace("</head>", `${briefBuilderJsonLd(page)}\n</head>`);
}

function renderCommunityPostGeneratorPage(page) {
  const body = `<section class="compact-hero builder-hero">
    <p class="eyebrow">${escapeHtml(page.eyebrow)}</p>
    <h1>${escapeHtml(page.h1)}</h1>
    <p class="lede">${escapeHtml(page.intro)}</p>
    <p class="intent">${escapeHtml(page.intent)}</p>
  </section>

  <section class="band builder-layout">
    <form class="brief-builder" id="community-post-form">
      <div class="section-head">
        <p>Draft</p>
        <h2>Start with a useful community question</h2>
      </div>
      <div class="builder-field-grid">
        <label>
          Platform
          <select name="platform">
            <option value="reddit">Reddit</option>
            <option value="facebook">Facebook group</option>
            <option value="forum">Forum</option>
          </select>
        </label>
        <label>
          Audience
          <select name="audience">
            <option value="editors">Editors</option>
            <option value="hiring">Hiring teams</option>
            <option value="both">Editors and hiring teams</option>
          </select>
        </label>
        <label>
          Angle
          <select name="angle">
            <option value="portfolio">Portfolio feedback</option>
            <option value="rates">Rates and pricing</option>
            <option value="job_brief">Job post quality</option>
            <option value="remote">Remote workflow</option>
            <option value="community">Community feedback</option>
          </select>
        </label>
        <label>
          Target page
          <select name="target_page">
            <option value="/video-editor-portfolio-checklist/">Portfolio checklist</option>
            <option value="/video-editing-rate-calculator/">Rate calculator</option>
            <option value="/video-editor-job-brief-builder/">Brief builder</option>
            <option value="/editors/">Editor intake</option>
            <option value="/post-video-editor-job/">Post job</option>
            <option value="/video-editor-community/">Community page</option>
          </select>
        </label>
        <label>
          Community name
          <input name="community_name" placeholder="r/editors, Facebook group name, forum name">
        </label>
        <label>
          One specific ask
          <input name="specific_ask" placeholder="What makes a video editor portfolio easier to trust?">
        </label>
      </div>
    </form>

    <aside class="builder-preview" aria-label="Generated community post">
      <div class="builder-score rate-score">
        <span id="community-platform">Reddit</span>
        <strong id="community-label">Feedback-first post</strong>
      </div>
      <div class="brief-output" id="community-post-output">
        <h2>Post draft</h2>
        <p>Choose an angle and this tool will create a community-safe starting point with a tracked link.</p>
      </div>
      <div class="brief-output" id="community-link-output">
        <h2>Tracked link</h2>
        <p>The tracked URL will appear here.</p>
      </div>
      <div class="hero-actions">
        <a class="button primary" id="community-target-link" href="/video-editor-community/?utm_source=site&utm_medium=tool&utm_campaign=community_post_generator">Open target page</a>
        <a class="button secondary" href="/video-editor-community/">Community page</a>
      </div>
      <p class="builder-note">Review the rules before posting. Use this as a starting point, then adapt it to the community tone.</p>
    </aside>
  </section>

  <section class="band editorial">
    <article>
      <h2>Why feedback posts work better</h2>
      <p>Early community growth should ask for specific input, not announce a generic job board. Better comments reveal what editors and hiring teams actually need.</p>
    </article>
    <article>
      <h2>What to record after posting</h2>
      <p>Add the post URL, replies, submissions, quality notes, and next action to the Community Posts sheet so the next post gets sharper.</p>
    </article>
  </section>

  ${faqMarkup(page)}

  <script>
    const communityForm = document.getElementById("community-post-form");
    const communityPlatform = document.getElementById("community-platform");
    const communityLabel = document.getElementById("community-label");
    const communityPostOutput = document.getElementById("community-post-output");
    const communityLinkOutput = document.getElementById("community-link-output");
    const communityTargetLink = document.getElementById("community-target-link");
    const angleQuestions = {
      portfolio: "What makes a video editor portfolio easier to trust quickly?",
      rates: "What pricing details should be clear before quoting video editing work?",
      job_brief: "What makes a video editing job post specific enough to apply to?",
      remote: "What remote editing workflow details prevent confusion later?",
      community: "What would make a video-editor-only job board actually useful?",
    };
    const targetLabels = {
      "/video-editor-portfolio-checklist/": "portfolio checklist",
      "/video-editing-rate-calculator/": "rate calculator",
      "/video-editor-job-brief-builder/": "brief builder",
      "/editors/": "editor list",
      "/post-video-editor-job/": "post-job form",
      "/video-editor-community/": "community page",
    };

    function communityValue(name) {
      return String(new FormData(communityForm).get(name) || "").trim();
    }

    function sentenceFor(values) {
      if (values.audience === "hiring") {
        return "I am trying to make video editor job briefs less vague for teams hiring editors.";
      }
      if (values.audience === "both") {
        return "I am trying to understand what would make a video-editor-only job board useful for both editors and hiring teams.";
      }
      return "I am trying to make a video-editor-only job board more useful for editors looking for better-fit work.";
    }

    function platformTone(platform) {
      if (platform === "facebook") return "Hi all -";
      if (platform === "forum") return "Hey everyone,";
      return "Quick question for editors:";
    }

    function renderCommunityPost() {
      const values = {
        platform: communityValue("platform"),
        audience: communityValue("audience"),
        angle: communityValue("angle"),
        target_page: communityValue("target_page"),
        community_name: communityValue("community_name"),
        specific_ask: communityValue("specific_ask"),
      };
      const source = values.platform === "facebook" ? "facebook" : values.platform === "forum" ? "forum" : "reddit";
      const medium = values.platform === "facebook" ? "group" : "community";
      const question = values.specific_ask || angleQuestions[values.angle];
      const url = new URL(values.target_page, window.location.origin);
      url.searchParams.set("utm_source", source);
      url.searchParams.set("utm_medium", medium);
      url.searchParams.set("utm_campaign", "community_post_generator");
      url.searchParams.set("utm_content", values.angle);
      if (values.community_name) {
        url.searchParams.set("ref", values.community_name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, ""));
      }

      const draft = [
        platformTone(values.platform),
        "",
        sentenceFor(values),
        "",
        question,
        "",
        "I put together a small " + targetLabels[values.target_page] + " here if it helps frame the feedback: " + url.toString(),
        "",
        "Not trying to spam the group - mainly looking for specific feedback so the early version is actually useful.",
      ].join("\\n");

      communityPlatform.textContent = values.platform === "facebook" ? "Facebook" : values.platform === "forum" ? "Forum" : "Reddit";
      communityLabel.textContent = values.audience === "hiring" ? "Hiring-side post" : values.audience === "both" ? "Two-sided post" : "Editor-side post";
      communityPostOutput.innerHTML = '<h2>Post draft</h2><pre>' + draft.replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char]) + '</pre>';
      communityLinkOutput.innerHTML = '<h2>Tracked link</h2><pre>' + url.toString() + '</pre>';
      communityTargetLink.href = url.toString();
    }

    communityForm.addEventListener("input", renderCommunityPost);
    communityForm.addEventListener("change", renderCommunityPost);
    renderCommunityPost();
  </script>`;

  return shell({ page, body, extraClass: "tool-page" }).replace("</head>", `${briefBuilderJsonLd(page)}\n</head>`);
}

function renderToolPage(page) {
  if (page.pageType === "community-post-generator") return renderCommunityPostGeneratorPage(page);
  if (page.pageType === "rate-calculator") return renderRateCalculatorPage(page);
  if (page.pageType === "portfolio-checklist") return renderPortfolioChecklistPage(page);
  return renderBriefBuilderPage(page);
}

function renderBlogIndex() {
  const page = {
    slug: "blog",
    title: "Video Editor Jobs Blog: Editor Career and Hiring Guides",
    description:
      "Guides for finding video editor jobs, hiring editors, writing briefs, building portfolios, setting rates, and understanding editing workflows.",
    h1: "Video Editor Jobs Blog",
  };

  const body = `<section class="compact-hero">
    <p class="eyebrow">Blog</p>
    <h1>${page.h1}</h1>
    <p class="lede">A resource library for the two sides of the market: editors looking for better work and teams trying to write better briefs.</p>
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
      <a class="resource-panel editor-tool" href="/video-editor-portfolio-checklist/">
        <span>Tool</span>
        <strong>Check whether your portfolio is ready</strong>
        <p>Score your clips, software, rate, capacity, turnaround, and best-fit editor profile.</p>
      </a>
      <a class="resource-panel rates" href="/video-editing-rate-calculator/">
        <span>Tool</span>
        <strong>Estimate a practical editing rate range</strong>
        <p>Use scope, footage, deliverables, complexity, turnaround, and revisions to frame pricing.</p>
      </a>
      <a class="resource-panel community-tool" href="/video-editor-community-post-generator/">
        <span>Tool</span>
        <strong>Draft community-safe feedback posts</strong>
        <p>Create Reddit, Facebook, and forum post drafts with tracked links for the launch loop.</p>
      </a>
      <a class="resource-panel hiring" href="/hire-video-editor/">
        <span>Hiring teams</span>
        <strong>Write a brief editors can evaluate</strong>
        <p>Job descriptions, interview questions, YouTube editor briefs, workflow, budget, and revision process.</p>
      </a>
      <a class="resource-panel tool" href="/video-editor-job-brief-builder/">
        <span>Tool</span>
        <strong>Build a clearer editor brief before posting</strong>
        <p>Score the details editors expect: budget, footage, deliverables, references, software, and revisions.</p>
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
    <div class="blog-grid full">${blogCards(blogPosts.length)}</div>
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
    <div class="hero-actions">
      <a class="button primary" href="/editors/">Join as an editor</a>
      <a class="button secondary" href="/hire-video-editor/">Hire an editor</a>
    </div>
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
        <a class="header-cta" href="/editors/">Join</a>
        <a class="header-cta post" href="/post-video-editor-job/">Post job</a>
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
    <p class="lede">Find category pages, local pages, hiring resources, editor guides, and the right intake route.</p>
  </section>

  <section class="band search-band">
    <form class="search-panel" role="search">
      <label>
        Search the site
        <input id="site-search-input" name="q" type="search" autocomplete="off" placeholder="remote, YouTube, Chicago, rates, hire">
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
        : '<p class="empty-search">No matching pages yet. Try remote, freelance, YouTube, rates, portfolio, hire, or a city.</p>';
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

  return shell({ page: searchPage, body });
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
    ["Search", "/search/", "Search category pages, guides, local pages, and intake routes."],
    ["Blog", "/blog/", "Guides for editors and hiring teams."],
    ["Sitemap", "/sitemap.xml", "XML sitemap for crawl discovery."],
    ["RSS", "/rss.xml", "RSS feed for blog posts."],
  ];

  const categoryRoutes = pages
    .filter((page) => page.slug)
    .map((page) => `- [${page.h1}](${toUrl(page.slug)}): ${page.description}`);

  const blogRoutes = blogPosts.map((post) => `- [${post.h1}](${toUrl(`blog/${post.slug}`)}): ${post.excerpt}`);

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
  const items = blogPosts
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

for (const page of pages) {
  await writePage(page.slug, page.pageType === "home" ? renderLandingPage(page) : renderCollectionPage(page));
}

for (const page of appPages) {
  await writePage(page.slug, renderAppPage(page));
}

for (const page of toolPages) {
  await writePage(page.slug, renderToolPage(page));
}

await writePage("blog", renderBlogIndex());
await writePage("search", renderSearchPage());

for (const post of blogPosts) {
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
