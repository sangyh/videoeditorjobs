# Apps Script Handoff

The Google Sheet already exists:

```text
https://docs.google.com/spreadsheets/d/19Hx9jc-cMI2yjYAzSG5NVca8yABCTLygomKs59CuTXI
```

The script is already prefilled with that Sheet ID in:

```text
docs/google-sheets-apps-script.js
```

It is also mirrored as an Apps Script project folder:

```text
apps-script/Code.js
apps-script/appsscript.json
```

Current live Sheet status, verified June 29, 2026:

- `Editors` and `Hiring Requests` each have 51 columns, including `source_bucket`, `lead_score`, `review_reason`, `consent`, `consent_at`, `consent_text`, and the structured matching fields for experience, capacity, scope, deliverables, footage volume, revision process, and references.
- Apps Script sends owner notifications and submitter confirmation emails; smoke/test addresses on `example.com`, `example.org`, and `example.net` are skipped for submitter confirmations.
- `Matches` exists with the manual match-tracking columns.
- `Dashboard` exists with live formulas for new submissions, high-priority rows, open matches, intros sent, and row counts.
- `Source Summary` exists with live formulas for editor/hiring rows grouped by source, campaign, and page path.
- The Apps Script sends new-submission notification emails to `sangy@rightjoin.co`; expect Google to ask for Sheets and send-email permissions when you approve the script.

If you edit the canonical doc script, run:

```bash
npm run sync:apps-script
npm run verify:apps-script
```

## What To Do In Google Sheets

1. Open the Sheet link above.
2. Go to Extensions, Apps Script.
3. Delete any starter code.
4. Paste the full contents of `docs/google-sheets-apps-script.js`.
5. Save.
6. Run `setup()`. The Sheet is already migrated, so this should safely confirm permissions and leave existing rows intact.
7. Approve Sheets and send-email permissions.
8. Run `seedCommunityPosts()`.
9. Run `launchHealthCheck()`.
10. Confirm it returns `ok: true`, `scriptVersion: "vej-2026-07-14-public-jobs-200"`, `expectedSeeds: 11`, `presentSeeds: 11`, and no missing headers or seed IDs.
11. Run `testSubmission()`.
12. Confirm planned rows appear in `Community Posts`, one test row appears in `Editors`, one in `Hiring Requests`, at least one `proposed` row appears in `Matches`, `Dashboard` shows live counts, and `Source Summary` counts `apps_script` source plus `integration_test` campaign.
13. Run `cleanupTestSubmissions()` to remove only generated test rows and proposed test matches.
14. Run `suggestMatches()` later whenever new editor and hiring rows need proposed matches. It should return `ok: true` and add only `proposed` rows to `Matches`.
15. Deploy, New deployment.
16. Select Web app.
17. Execute as: `Me`.
18. Who has access: `Anyone`.
19. Deploy.
20. Copy the Web app URL ending in `/exec`.

## Optional Project Folder Path

If you prefer `clasp`, use the `apps-script/` folder as the Apps Script project source. The manifest is already configured for V8, Sheets access, and anonymous Web App access. The manual Google Sheets UI path above is still the simplest path for the first deploy.

## Health Check

Before deployment, run `launchHealthCheck()` inside Apps Script. It safely runs setup, inserts any missing community post seeds, checks required headers, and reports the launch state:

```json
{
  "ok": true,
  "scriptVersion": "vej-2026-07-14-public-jobs-200",
  "communityPosts": {
    "expectedSeeds": 11,
    "presentSeeds": 11,
    "missingSeedIds": [],
    "planned": 11
  },
  "nextStep": "Deploy Web App and run npm run smoke:intake with the /exec URL."
}
```

Open the deployed `/exec` URL in a browser. It should return JSON similar to:

```json
{
  "ok": true,
  "scriptVersion": "vej-2026-07-14-public-jobs-200",
  "spreadsheetId": "19Hx9jc-cMI2yjYAzSG5NVca8yABCTLygomKs59CuTXI",
  "spreadsheetName": "Video Editor Jobs Intake",
  "sheets": ["Setup", "Editors", "Hiring Requests", "Matches", "Dashboard", "Source Summary"]
}
```

## Send Back

Send the `/exec` URL back to Codex.

Keep the `npm run prepare:apps-script` JSON open and confirm its `contract.scriptVersion` matches the `scriptVersion` returned by `launchHealthCheck()` and the deployed `/exec` URL.

After that, save it locally:

```bash
npm run configure:endpoint -- "<the /exec URL>"
```

That validates the URL, writes `.env.local`, and prints the next verification commands. `.env.local` is ignored by git.

Then run the local readiness gate with the endpoint required:

```bash
npm run launch:ready -- --require-endpoint
```

Then run the endpoint smoke test:

```bash
npm run smoke:intake
```

Expected:

- the command returns JSON with `ok: true`
- the command returns `health.scriptVersion` matching `vej-2026-07-14-public-jobs-200`
- one smoke editor row appears in `Editors`
- one smoke hiring row appears in `Hiring Requests`
- `Dashboard` counts update after rows land

The public browser form uses `no-cors` for Apps Script compatibility, so it cannot read the endpoint JSON response directly. Treat the `/exec` health check and `npm run smoke:intake` as the endpoint proof, then confirm public form submissions by checking the Sheet rows.

## Live Smoke Test

Once the endpoint is wired, submit:

- one editor test from `/editors/`
- one hiring test from `/hire-video-editor/`

Expected:

- editor test lands in `Editors`
- hiring test lands in `Hiring Requests`
- both rows include `status = new`
- both rows include an auto-filled `next_action`
- both rows include `source_bucket`, `lead_score`, and `review_reason`
- `page_path` is correct
- UTM fields populate when using a tracked link
- `Dashboard` reflects the new rows
