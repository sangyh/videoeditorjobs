# Video Editor Jobs

Static SEO and intake app for `videoeditorjobs.com`.

The goal of this version is to start traction before a full account system exists: collect editor profiles, collect hiring briefs, publish only the crawlable pages that support the creator-workflow wedge, and route both sides into a Google Sheet-backed matching queue.

Use [docs/guiding-principles.md](docs/guiding-principles.md) as the ICP and product filter: prioritize early creator businesses, with a beachhead of coaches, consultants, educators, and founder-led personal brands that need recurring long-form-to-short-form editing workflows.

## What is included

- Homepage targeting `video editor jobs`
- A tight crawl set for remote, freelance, YouTube, part-time, community, and creator-workflow searches
- `/editors/` intake page for video editors
- `/hire-video-editor/` intake page for hiring teams
- `/post-video-editor-job/` hiring-intent page for teams expecting a post-a-job flow
- `/blog/` plus a small set of guides for editor proof, hiring briefs, rates, and YouTube editor scope
- `/search/` for noindex site search across the current guides and intake routes
- Noindex thank-you pages for editor and hiring submissions
- `sitemap.xml`
- `robots.txt`
- Canonical URLs
- Open Graph and Twitter preview metadata
- JSON-LD for `WebSite`, `Organization`, `CollectionPage`, `ItemList`, and `FAQPage`
- Google Sheets-ready intake forms with UTM/source tracking and email fallback
- Google Sheet dashboard and source summary tabs for launch review
- Internal notification email and submitter confirmation email from Apps Script
- Browser-side draft restore for unfinished editor and hiring forms
- Structured matching fields for editor experience, work preference, capacity, turnaround, hiring scope, deliverables, footage volume, revision process, and reference links

## Commands

```bash
npm run build
npm run verify
npm run verify:app
npm run verify:apps-script
npm run check
npm run launch:ready
npm run dev
npm run smoke:live -- https://videoeditorjobs.com --require-endpoint
npm run prepare:apps-script
```

`npm run dev` serves `dist/` at `http://localhost:4173`.

`npm run check` runs build, SEO verification, and app-intake verification in sequence.

`npm run launch:ready` runs the full local gate and checks the generated launch bundle, Apps Script sync, Sheet setup docs, 18-URL sitemap count, noindex utility pages, and endpoint configuration state.

`npm run prepare:apps-script` verifies the Apps Script bundle, manifest, Sheet contract, and expected script version, then prints the exact Google Sheets deployment steps and post-deploy proof commands.

`npm run smoke:live -- https://videoeditorjobs.com --require-endpoint` checks the deployed homepage, intake pages, blog, community page, thank-you noindex pages, sitemap, robots file, and embedded intake endpoint before public posting.

To embed the Google Apps Script endpoint at build time:

```bash
VEJ_INTAKE_ENDPOINT="https://script.google.com/macros/s/DEPLOYMENT_ID/exec" npm run build
```

Or save it locally after the Apps Script Web App URL exists:

```bash
npm run configure:endpoint -- "https://script.google.com/macros/s/DEPLOYMENT_ID/exec"
```

That writes `.env.local`, which is ignored by git and read by the local build, readiness, and smoke scripts. The endpoint smoke test also checks that the deployed `/exec` health response reports the current Apps Script version.

If `VEJ_INTAKE_ENDPOINT` is not set, forms open an email draft with the structured submission so leads are not lost while the Sheet is being connected.

## Google Sheets intake setup

Use [docs/google-sheets-setup.md](docs/google-sheets-setup.md) for the exact setup and smoke-test steps.

The form payload includes `created_at`, `submission_id`, visitor type, explicit consent fields, form fields, page URL, referrer, UTM parameters, raw JSON payload, and Apps Script triage fields for `source_bucket`, `lead_score`, and `review_reason`.

## Community launch

Use [docs/community-launch-kit.md](docs/community-launch-kit.md) for Reddit, Facebook, and forum post drafts with UTM-tagged links.

Use [docs/community-posting-calendar.md](docs/community-posting-calendar.md) for the two-week posting cadence, community post row seeds, and reply rules.

Use [docs/launch-day-runbook.md](docs/launch-day-runbook.md) for the first 24-hour posting plan, Sheet review workflow, and traction success criteria.

Use [docs/operator-email-templates.md](docs/operator-email-templates.md) for manual follow-ups, missing-detail requests, and editor-hiring intros from the Sheet queue.

## Deployment

The project is ready for Vercel static hosting:

1. Create a new Vercel project from this folder or repository.
2. Use the included `vercel.json`.
3. Add `videoeditorjobs.com` as the production domain.
4. Redirect `www.videoeditorjobs.com` to `videoeditorjobs.com`.
5. After DNS propagates, submit `https://videoeditorjobs.com/sitemap.xml` in Google Search Console.

Use [docs/deployment-checklist.md](docs/deployment-checklist.md) for the full deploy, live smoke-test, and Search Console checklist.

Use [docs/search-console-handoff.md](docs/search-console-handoff.md) for sitemap submission, URL inspection, and first Search Console review.

Use [docs/seo-30-day-plan.md](docs/seo-30-day-plan.md) for the first month of blog/category-page iteration from Search Console and Sheet evidence.

Use [docs/final-launch-handoff.md](docs/final-launch-handoff.md) for the last handoff checklist once the Apps Script `/exec` URL is ready.

Recommended DNS shape:

```text
videoeditorjobs.com      A/CNAME target from host
www.videoeditorjobs.com  CNAME to host, redirected to apex
```

Use the exact records from the hosting provider because Vercel, Cloudflare, Netlify, and other hosts issue different values.

## Future backend integration notes

When a full backend is ready, replace the Apps Script endpoint with an authenticated intake endpoint and keep these fields:

- `email`
- editor or hiring fields
- source page URL
- visitor type, editor or employer
- consent timestamp

For job listings, do not add `JobPosting` structured data until real jobs exist. Google treats fake or placeholder job structured data as spammy. Keep category pages as `CollectionPage` until actual roles are feeding public pages.

## SEO next steps

- Add real job pages as soon as TalentPrism has live roles.
- Add a Google Search Console verification file or DNS TXT record.
- Set up Bing Webmaster Tools after Google is verified.
- Expand blog posts from Ahrefs, Search Console queries, and Sheet `page_path` conversion data once early impressions appear.
- Add dedicated job alert pages once the Sheet starts showing repeatable editor niches or city demand.
