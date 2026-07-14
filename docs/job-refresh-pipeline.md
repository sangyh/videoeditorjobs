# Job Refresh Pipeline

The job board combines public hiring opportunities tracked in the private intake sheet with other relevant listings.

## What The Pipeline Does

`npm run sync:sheet-jobs` calls the Apps Script `?action=jobs` view and writes `src/sheet-jobs-data.mjs`. That endpoint returns only public job-card fields and internal application URLs; acquisition sources, email, consent, notes, and raw payload fields stay private. The Vercel build runs this sync automatically and preserves the committed feed if Google is temporarily unavailable.

`npm run refresh:jobs` runs `scripts/refresh-jobs.mjs` and writes the supplemental `src/jobs-data.mjs` feed.

The script:

- pulls public APIs, RSS feeds, and official company Greenhouse job boards;
- keeps only jobs with source URL, title, company, location, and date listed;
- classifies each job as `direct`, `near`, or `adjacent`;
- dedupes by company, title, and location;
- ranks direct video editing roles first, then creator-side and adjacent creative roles;
- writes up to 50 supplemental listings by default.

## Current Source Mix

- Remotive public API
- Working Nomads public category APIs
- We Work Remotely RSS category feeds
- Official company Greenhouse boards for creator, media, education, social, and community platforms

Every public card routes to the VideoEditorJobs editor intake with a job-specific query parameter. Acquisition sources and original URLs remain private operational data.

## Refresh Command

```bash
npm run refresh:jobs
npm run build
npm run verify
```

If network access is flaky, keep the downloaded feed files and rerun from cache:

```bash
node scripts/refresh-jobs.mjs --no-fetch --cache-dir=/path/to/cache --max=50
```

## Source Rules

- Do not republish third-party post bodies.
- Do not copy full job descriptions from third-party boards.
- Keep each public listing to title, company label, location, date listed, role family, and an internal application URL.
- Retain original provenance only in the private operations layer.
- If a job is submitted directly through Video Editor Jobs, it can be promoted above seeded opportunities.

## Cadence

Run daily during the seed period. After the site has direct employer submissions, run the feed refresh daily and review direct submissions manually before mixing them into the public board.

## Acceptance Check

A refresh is good when:

- `src/sheet-jobs-data.mjs` has the expected marketplace inventory and unique internal application URLs;
- `src/jobs-data.mjs` has the supplemental public-feed inventory;
- every job has `dateListed` and an internal application URL;
- `/jobs/` renders the combined Reddit and supplemental inventory;
- `npm run verify` passes;
- direct video/editing jobs appear before broad adjacent creative roles.
