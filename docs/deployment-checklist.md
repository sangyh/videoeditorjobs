# Deployment Checklist

Use this before posting in communities or submitting the site in Search Console.

## Before Deploy

Run the full local gate:

```bash
npm run launch:ready
npm run prepare:apps-script
```

Expected:

- Build reports `Built 50 pages in dist/`.
- SEO verifier reports `Verified 50 pages`.
- App verifier reports intake routes, tracking, fallback behavior, and traction sitemap routes.
- Launch readiness reports synced Apps Script files, 50 sitemap URLs, and whether the intake endpoint is embedded.
- Apps Script deploy prep reports the spreadsheet URL, manifest access of `ANYONE_ANONYMOUS`, 51 intake headers, 20 community post headers, and the exact functions to run in Apps Script.

## Vercel Environment

Set this production environment variable after the Google Apps Script is deployed:

```text
VEJ_INTAKE_ENDPOINT=https://script.google.com/macros/s/DEPLOYMENT_ID/exec
```

The Vercel build command runs:

```bash
npm run vercel-build
```

That command builds the site, verifies SEO output, verifies intake routes, and only then exposes `dist/`.

## Endpoint Build Check

After Apps Script deployment, save the `/exec` URL locally:

```bash
npm run configure:endpoint -- "https://script.google.com/macros/s/DEPLOYMENT_ID/exec"
```

Before promoting a production deploy, confirm the built site includes the deployed Apps Script endpoint:

```bash
npm run launch:ready -- --require-endpoint
```

The generated homepage should include a non-empty `window.VEJ_CONFIG.intakeEndpoint`. The live smoke command below also checks this when you pass `--require-endpoint`.

## Live Smoke Test

After deploy, verify these URLs in the browser:

```text
https://videoeditorjobs.com/
https://videoeditorjobs.com/editors/
https://videoeditorjobs.com/hire-video-editor/
https://videoeditorjobs.com/post-video-editor-job/
https://videoeditorjobs.com/video-editor-job-brief-builder/
https://videoeditorjobs.com/video-editor-portfolio-checklist/
https://videoeditorjobs.com/video-editing-rate-calculator/
https://videoeditorjobs.com/video-editor-community-post-generator/
https://videoeditorjobs.com/blog/
https://videoeditorjobs.com/blog/where-to-find-video-editor-jobs/
https://videoeditorjobs.com/video-editor-jobs-near-me/
https://videoeditorjobs.com/work-from-home-video-editor-jobs/
https://videoeditorjobs.com/remote-video-editing-jobs/
https://videoeditorjobs.com/travel-video-editor-jobs/
https://videoeditorjobs.com/night-shift-video-editor-jobs/
https://videoeditorjobs.com/night-shift-teen-video-editor-jobs/
https://videoeditorjobs.com/student-video-editor-jobs/
https://videoeditorjobs.com/new-video-editor-jobs/
https://videoeditorjobs.com/video-editor-jobs-last-3-days/
https://videoeditorjobs.com/video-editor-community/
https://videoeditorjobs.com/assistant-video-editor-jobs/
https://videoeditorjobs.com/french-video-editor-jobs/
https://videoeditorjobs.com/thanks-editor/
https://videoeditorjobs.com/thanks-hiring/
https://videoeditorjobs.com/sitemap.xml
https://videoeditorjobs.com/robots.txt
```

You can run the automated live smoke check first:

```bash
npm run smoke:live -- https://videoeditorjobs.com --require-endpoint
```

For the live pages, confirm:

- The title and H1 match the route.
- Forms are visible on `/editors/` and `/hire-video-editor/`.
- `sitemap.xml` lists 50 URLs.
- `sitemap.xml` does not include `/thanks-editor/` or `/thanks-hiring/`.
- Thank-you pages include `noindex, follow`.
- Thank-you pages do not receive a conflicting `X-Robots-Tag: index, follow` header.
- `robots.txt` points to `https://videoeditorjobs.com/sitemap.xml`.

## Google Search Console

Full handoff: `docs/search-console-handoff.md`.

1. Open the `videoeditorjobs.com` property.
2. Go to Sitemaps.
3. Submit the full absolute sitemap URL:

```text
https://videoeditorjobs.com/sitemap.xml
```

4. Refresh until Search Console shows success.
5. Record discovered URL count and date.

Do not submit a relative sitemap path. Always verify the live sitemap response first.

After submission, use URL Inspection for the homepage, `/editors/`, `/hire-video-editor/`, `/post-video-editor-job/`, `/video-editor-job-brief-builder/`, `/video-editor-portfolio-checklist/`, `/video-editing-rate-calculator/`, `/video-editor-community-post-generator/`, `/blog/`, `/video-editor-community/`, `/video-editor-jobs-last-3-days/`, `/on-call-travel-video-editor-jobs/`, `/teen-video-editor-jobs/`, `/remote-video-editing-jobs/`, `/night-shift-teen-video-editor-jobs/`, `/video-editor-jobs-nyc/`, `/video-editor-jobs-manhattan/`, `/blog/how-to-find-video-editor-jobs/`, `/blog/how-to-get-jobs-as-a-video-editor/`, `/blog/video-editor-portfolio-examples/`, `/blog/video-editor-interview-questions/`, `/blog/youtube-video-editor-job-description/`, and `/blog/how-to-price-video-editing-work/`.

Use `docs/seo-30-day-plan.md` to turn Search Console queries and Sheet conversion data into the next blog post, category page, or form improvement.

## First Community Push

Once live form rows are landing in the Sheet:

1. Pick one editor community and one hiring-side community.
2. Use the matching UTM link from `docs/community-launch-kit.md`.
3. Post one specific feedback question, not just a launch announcement.
4. After 24 hours, check Sheet rows grouped by `utm_source`, `utm_campaign`, and `page_path`.
5. Convert the highest-signal replies into the next blog post or intake-field improvement.

Use `docs/launch-day-runbook.md` for the first 24-hour posting sequence, review queue, and success criteria.
