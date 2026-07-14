# Job Refresh Pipeline

The job board combines public Reddit hiring posts tracked in the private intake sheet with other source-attributed listings.

## What The Pipeline Does

`npm run sync:sheet-jobs` calls the Apps Script `?action=jobs` view and writes `src/sheet-jobs-data.mjs`. That endpoint returns only public job-card fields from Reddit rows; email, consent, notes, and raw payload fields stay private. The Vercel build runs this sync automatically and preserves the committed feed if Google is temporarily unavailable.

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

Every public card links out to the original listing and shows the source.

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

- Do not scrape or republish Reddit post bodies.
- Do not copy full job descriptions from third-party boards.
- Keep each listing as title, company, location, date listed, source label, role family, and outbound URL.
- Prefer employer-owned boards and public feeds that expect attribution.
- If a job is submitted directly through Video Editor Jobs, it can be promoted above sourced link-outs.

## Cadence

Run daily during the seed period. After the site has direct employer submissions, run the feed refresh daily and review direct submissions manually before mixing them into the public board.

## Acceptance Check

A refresh is good when:

- `src/sheet-jobs-data.mjs` has the expected Reddit inventory and unique source URLs;
- `src/jobs-data.mjs` has the supplemental public-feed inventory;
- every job has `dateListed` and `sourceUrl`;
- `/jobs/` renders the combined Reddit and supplemental inventory;
- `npm run verify` passes;
- direct video/editing jobs appear before broad adjacent creative roles.
