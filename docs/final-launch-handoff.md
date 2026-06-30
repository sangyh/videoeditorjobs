# Final Launch Handoff

Use this as the last checklist before posting in Reddit, Facebook, forums, or Search Console.

## Current State

- Static app builds 18 crawlable URLs.
- `/editors/` collects editor profiles.
- `/hire-video-editor/` collects hiring briefs.
- `/post-video-editor-job/` captures hiring teams that search or expect a post-a-job flow.
- Crawlable pages are limited to remote, freelance, YouTube, part-time, community, and six high-intent guides.
- The public pseudo-tools and weak freshness/local/teen/language pages have been cut from generation and sitemap submission.
- Thank-you pages are `noindex, follow` and excluded from `sitemap.xml`.
- Community launch copy and tracked links live in `docs/community-launch-kit.md`.
- The two-week community posting schedule lives in `docs/community-posting-calendar.md`.
- Search Console sitemap and URL inspection steps live in `docs/search-console-handoff.md`.
- The first-month SEO feedback loop lives in `docs/seo-30-day-plan.md`.
- Operator follow-up and intro copy lives in `docs/operator-email-templates.md`.
- Launch readiness command is `npm run launch:ready`.

## Live Google Sheet

Spreadsheet:

```text
https://docs.google.com/spreadsheets/d/19Hx9jc-cMI2yjYAzSG5NVca8yABCTLygomKs59CuTXI
```

Verified live readback:

- `Setup` tab lists the current launch status and remaining blocker.
- `Editors` has 51 columns.
- `Hiring Requests` has 51 columns.
- `Editors!AW1:AY1` is `source_bucket`, `lead_score`, `review_reason`.
- `Hiring Requests!AW1:AY1` is `source_bucket`, `lead_score`, `review_reason`.
- `Source Summary` includes the live traction campaigns and active page paths only, including `portfolio_examples_share`, `job_template_share`, and `community_share`.
- Run `setup()` with the latest Apps Script to add or refresh `Community Posts` before community posting.
- Run `seedCommunityPosts()` to create the starter Reddit, Facebook, forum, and two-week calendar planned posts.

## Remaining Action

Deploy the Apps Script web app:

0. Run `npm run prepare:apps-script` and keep its JSON output open.
1. Open the Google Sheet.
2. Go to Extensions, Apps Script.
3. Paste `docs/google-sheets-apps-script.js`.
4. Save.
5. Run `setup()`.
6. Approve Sheets and send-email permissions.
7. Run `seedCommunityPosts()`.
8. Run `launchHealthCheck()` and confirm `ok: true` and `scriptVersion: "vej-2026-06-29-tight-18p"`.
9. Run `testSubmission()` and confirm it creates one editor row, one hiring row, and at least one `proposed` match row.
10. Run `cleanupTestSubmissions()` to remove generated test rows and test matches.
11. Run `suggestMatches()` later whenever new editor and hiring rows need proposed matches.
12. Deploy as Web app.
13. Execute as `Me`.
14. Access `Anyone`.
15. Copy the `/exec` URL.

## Proof Commands

After the `/exec` URL exists:

```bash
npm run verify:apps-script
npm run prepare:apps-script
npm run configure:endpoint -- "<exec-url>"
npm run launch:ready -- --require-endpoint
npm run smoke:intake
npm run smoke:live -- https://videoeditorjobs.com --require-endpoint
```

Confirm `contract.scriptVersion` from `npm run prepare:apps-script`, `launchHealthCheck().scriptVersion`, and `npm run smoke:intake` `health.scriptVersion` all match `vej-2026-06-29-tight-18p`.

Also add the same `/exec` URL to Vercel as the production `VEJ_INTAKE_ENDPOINT` environment variable before the final deploy.

The goal is complete only when `npm run smoke:intake` proves one editor row and one hiring row land in the live Sheet with triage and confirmation results.

After that proof, submit `https://videoeditorjobs.com/sitemap.xml` in Search Console and inspect the priority URL queue from `docs/search-console-handoff.md`.
