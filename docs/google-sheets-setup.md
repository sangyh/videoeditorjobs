# Google Sheets Intake Setup

Use this when connecting the public forms to a real Google Sheet.

Created intake sheet:

```text
https://docs.google.com/spreadsheets/d/19Hx9jc-cMI2yjYAzSG5NVca8yABCTLygomKs59CuTXI
```

Sheet ID:

```text
19Hx9jc-cMI2yjYAzSG5NVca8yABCTLygomKs59CuTXI
```

## Sheet Structure

Create one Google Sheet with these tabs, or use the native Google Sheet template created from this repo's intake workbook:

- `Editors`
- `Hiring Requests`
- `Matches`
- `Community Posts`
- `Dashboard`
- `Source Summary`

The Apps Script will create tabs and headers automatically when you run `setup()`, but these are the main intake columns it writes:

You can rerun `setup()` after future form or script changes. Existing rows are preserved, and any missing header columns are appended to the end of the relevant tab.

Live status as of June 30, 2026: the connected Google Sheet already has `Editors`, `Hiring Requests`, `Matches`, `Dashboard`, `Source Summary`, and `Community Posts`. Run `setup()` after pasting the latest Apps Script to refresh tracker and dashboard formulas, then run `seedCommunityPosts()` to add any missing starter or two-week calendar planned posts. Run `launchHealthCheck()` before deploying; it should return `ok: true`, `scriptVersion: "vej-2026-07-14-onsite-applications"`, `expectedSeeds: 11`, `presentSeeds: 11`, and no missing headers or seed IDs. The public launch sitemap is now limited to 18 crawlable URLs. The two intake tabs have the current 51-column schema, including triage fields, `consent`, `consent_at`, `consent_text`, and the structured matching fields for experience, capacity, scope, deliverables, footage volume, revision process, and references. Running `setup()` is still useful as the first Apps Script permission check and is safe to rerun.

```text
created_at
submission_id
kind
status
priority
owner
next_action
last_contacted_at
review_notes
source_bucket
lead_score
review_reason
consent
consent_at
consent_text
name
email
company
location
primary_fit
role_type
experience_level
work_preference
portfolio_url
rate_range
weekly_capacity
budget
timeline
content_format
project_scope
deliverables
footage_volume
software
turnaround_time
availability
revision_process
reference_urls
notes
brief
page_url
page_path
page_title
referrer
utm_source
utm_medium
utm_campaign
utm_content
utm_term
ref
user_agent
raw_payload
```

The `Matches` tab uses these columns:

```text
created_at
match_id
status
editor_submission_id
hiring_submission_id
editor_name
hiring_name
role_or_fit
budget_or_rate
match_notes
intro_sent_at
outcome
outcome_notes
```

The `Community Posts` tab uses these columns:

```text
created_at
post_id
status
platform
community_name
community_url
post_url
audience
angle
question
target_url
utm_source
utm_medium
utm_campaign
posted_at
replies_count
submissions_count
quality_notes
next_action
owner
```

The `Dashboard` tab is created by `setup()` and shows live counts for new editor submissions, new hiring briefs, high-priority rows, open matches, sent introductions, planned community posts, published community posts, replies needing response, and total intake rows.

The `Source Summary` tab is also created by `setup()` and groups editor submissions and hiring briefs by source, campaign, and page path. Its formulas match columns by header name, so they keep working after additive schema migrations. The source section tracks `reddit`, `facebook`, `forum`, `community`, `referral`, `organic`, `direct`, `apps_script`, `smoke`, and `manual`. The campaign section tracks launch experiments such as `early_editor_list`, `early_hiring_briefs`, `early_community`, `blog_guide`, `seo_resource`, referral invites, thank-you share campaigns, integration tests, and endpoint smoke tests. The page-path section tracks the main editor, hiring, community, SEO, Ahrefs-backed, and blog entry points.

The Apps Script also computes launch triage for each non-duplicate row:

- `source_bucket` groups rows into buckets such as `reddit`, `facebook`, `community`, `organic`, `referral`, or `direct`.
- `lead_score` is a 0-10 completeness score based on portfolio, budget, scope, references, and workflow detail.
- `priority` is auto-filled as `high`, `medium`, or `low`.
- `next_action` is auto-filled with an operator action such as `review`, `email editor`, `ask for portfolio`, `ask for brief details`, or `find hiring match`.
- `review_reason` explains the strongest scoring signals.

The Apps Script sends two fail-soft emails for each new non-duplicate editor profile or hiring brief:

- A plain-text notification email to `sangy@rightjoin.co` with the key matching fields, triage fields, source URL, UTM values, and Sheet link.
- A plain-text confirmation email to the submitter with the fields received, next steps, and submission ID. Confirmation email is skipped for `example.com`, `example.org`, and `example.net` test addresses.

Email failures do not block the Sheet row. The endpoint response reports notification and confirmation results for smoke-test visibility.

## Apps Script Steps

1. Open the Google Sheet.
2. Go to Extensions, Apps Script.
3. Paste `docs/google-sheets-apps-script.js`.
4. Confirm `spreadsheetId` is `19Hx9jc-cMI2yjYAzSG5NVca8yABCTLygomKs59CuTXI`.
5. Save the script.
6. Run `setup()` once. The Sheet is already migrated, so this should be idempotent.
7. Approve the requested Google Sheets and send-email permissions.
8. Run `seedCommunityPosts()` once to create the first planned Reddit, Facebook, and forum posting queue.
9. Run `testSubmission()` once.
10. Confirm test rows appear in `Editors` and `Hiring Requests`, at least one `proposed` row appears in `Matches`, `Community Posts` has planned rows, and `Source Summary` counts the `apps_script` source and `integration_test` campaign.
11. Run `cleanupTestSubmissions()` after verification to remove only generated test rows and proposed test matches.
12. Deploy, New deployment, Web app.
13. Execute as: `Me`.
14. Who has access: `Anyone`.
15. Copy the Web app URL ending in `/exec`.

After deployment, open the `/exec` URL in a browser. The `doGet()` health check should return JSON with `ok: true`, `scriptVersion: "vej-2026-07-14-onsite-applications"`, the configured spreadsheet ID, and the expected sheet names. Confirm that version matches `contract.scriptVersion` from `npm run prepare:apps-script`.

The same code is mirrored in `apps-script/Code.js` with `apps-script/appsscript.json` for project-style or `clasp` deployment. Run `npm run sync:apps-script` after editing `docs/google-sheets-apps-script.js`.

Before deploying Apps Script, run:

```bash
npm run verify:apps-script
```

That checks the 51-column intake schema, match schema, manifest permissions, Web App access mode, mirrored Apps Script project file, smoke-test contract, and Source Summary source/page coverage.

## Build With The Endpoint

```bash
VEJ_INTAKE_ENDPOINT="https://script.google.com/macros/s/DEPLOYMENT_ID/exec" npm run build
npm run verify
npm run verify:app
```

For local verification, you can save the endpoint once:

```bash
npm run configure:endpoint -- "https://script.google.com/macros/s/DEPLOYMENT_ID/exec"
```

That writes `.env.local`, which is ignored by git and read by the local build, readiness, and smoke scripts.

For Vercel, add `VEJ_INTAKE_ENDPOINT` as a production environment variable, then redeploy.

After the Web App is deployed, you can test the endpoint directly:

```bash
npm run smoke:intake
```

Expected result:

- JSON output includes `ok: true`.
- JSON output includes `health.scriptVersion: "vej-2026-07-14-onsite-applications"`.
- JSON output includes `triage.source_bucket` and `triage.lead_score`.
- JSON output includes `confirmation.sent`.
- One smoke row appears in `Editors`.
- One smoke row appears in `Hiring Requests`.

The browser form submits to Apps Script with `no-cors`, which is required for this simple static-site integration. That means the public page can send the payload but cannot read the Apps Script JSON response. Use `testSubmission()` and `npm run smoke:intake` as the authoritative endpoint checks, then verify public form rows in the Sheet.

After Vercel is redeployed with `VEJ_INTAKE_ENDPOINT`, run the live page smoke check:

```bash
npm run smoke:live -- https://videoeditorjobs.com --require-endpoint
```

This confirms the public pages are reachable, thank-you pages remain noindex, the sitemap excludes thank-you pages, and the built app contains a non-empty intake endpoint.

The Apps Script also rejects direct posts that are missing required fields, invalid email addresses, consent, or a `submission_id`. Honeypot submissions are returned as `ok: true` with `spam: true`, but they are not appended to the Sheet.

## Smoke Test After Deploy

Submit one test editor row:

- Name: `Test Editor`
- Email: your email
- Primary fit: any value
- Portfolio: `https://example.com`
- Consent: checked

Expected result:

- A new row appears in `Editors`.
- `kind` is `editor`.
- `page_path` is `/editors/`.
- UTM columns are filled if you used a tracked URL.

Submit one test hiring row:

- Name: `Test Hiring`
- Email: your email
- Role type: any value
- Brief: `Testing the hiring intake flow.`
- Consent: checked

Expected result:

- A new row appears in `Hiring Requests`.
- `kind` is `hiring`.
- `page_path` is `/hire-video-editor/`.

After testing, delete the test rows or mark them clearly in the sheet.

## Duplicate Handling

Each form submission includes a `submission_id`. The Apps Script checks that ID before appending a row, so browser retries or double-clicked submits should not create duplicate rows in the same tab.

## Operating Workflow

Use the intake tabs as a simple review queue.

Recommended `status` values:

```text
new
reviewed
needs_follow_up
matched
not_fit
spam
closed
```

Recommended `priority` values:

```text
high
medium
low
```

Daily review flow:

1. Open `Dashboard` and check new editor submissions, new hiring briefs, high-priority rows, open matches, planned community posts, and replies needing response.
2. Open `Source Summary` and compare which `utm_source`, `utm_campaign`, and `page_path` produced useful rows.
3. Open `Community Posts` and update any rows with new replies, submissions, quality notes, or `next_action`.
4. Filter each intake tab to `status = new`.
5. Review portfolio, fit, budget, and notes.
6. Sort by `priority`, then `lead_score`.
7. Review the auto-filled `next_action`, such as `email editor`, `ask for portfolio`, `ask for brief details`, `find hiring match`, `send intro`, or `no action`.
8. Add internal notes in `review_notes`.
9. When you contact someone, update `last_contacted_at`.
10. Run `suggestMatches()` in Apps Script when both editor and hiring rows exist. It adds `proposed` rows to `Matches`; it does not send intros.
11. Review proposed rows, then send intros manually when the fit is good.

Use the `Matches` tab to track manual introductions:

1. Create a `match_id`, for example `match-2026-06-29-001`, or review a row created by `suggestMatches()`.
2. Copy `editor_submission_id` and `hiring_submission_id`.
3. Add short context in `match_notes`.
4. Set `status` to `proposed`, `intro_sent`, `active`, `won`, `lost`, or `closed`.
5. Fill `intro_sent_at` when the intro goes out.

Use the `Community Posts` tab to track outbound traction experiments:

1. Run `seedCommunityPosts()` after `setup()` to add the starter planned posts.
2. For new ideas, create a `post_id`, for example `post-2026-06-29-001`.
3. Set `status` to `planned` before publishing.
4. Fill `platform`, `community_name`, `community_url`, `audience`, `angle`, `question`, `target_url`, and UTM fields.
5. After publishing, set `status` to `posted`, fill `post_url` and `posted_at`, and update `replies_count`.
6. If there are unanswered comments, set `status` to `needs_reply`.
7. After 24 hours, fill `submissions_count`, `quality_notes`, and `next_action`.

## Trust Pages

The forms link to:

- `https://videoeditorjobs.com/privacy/`
- `https://videoeditorjobs.com/terms/`

Keep those pages live before posting in public communities.
