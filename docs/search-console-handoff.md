# Search Console Handoff

Use this after the production site is deployed with the tightened route set and the Google Apps Script `/exec` endpoint embedded.

## Property

Primary property:

```text
videoeditorjobs.com
```

Preferred sitemap:

```text
https://videoeditorjobs.com/sitemap.xml
```

Do not submit the sitemap until the live site passes:

```bash
npm run smoke:live -- https://videoeditorjobs.com --require-endpoint
```

The live smoke should confirm the homepage, editor intake, hiring intake, blog, community page, noindex utility pages, `robots.txt`, and the 18 crawlable URLs sitemap are all reachable.

## Submit Sitemap

1. Open Google Search Console.
2. Select the `videoeditorjobs.com` property.
3. Open `Sitemaps`.
4. Submit the full sitemap URL:

```text
https://videoeditorjobs.com/sitemap.xml
```

5. Confirm Search Console reports success.
6. Record the submitted date, discovered URL count, and any immediate errors in the launch notes.

Expected live sitemap count:

```text
18 crawlable URLs
```

The search page and thank-you pages are intentionally excluded from the sitemap and should stay `noindex, follow`.

## URL Inspection Queue

After sitemap submission, inspect these URLs first:

```text
https://videoeditorjobs.com/
https://videoeditorjobs.com/editors/
https://videoeditorjobs.com/hire-video-editor/
https://videoeditorjobs.com/jobs/
https://videoeditorjobs.com/remote-video-editor-jobs/
https://videoeditorjobs.com/freelance-video-editor-jobs/
https://videoeditorjobs.com/youtube-video-editor-jobs/
https://videoeditorjobs.com/part-time-video-editor-jobs/
https://videoeditorjobs.com/video-editor-community/
https://videoeditorjobs.com/blog/
https://videoeditorjobs.com/blog/where-to-find-video-editor-jobs/
https://videoeditorjobs.com/blog/video-editor-portfolio-examples/
https://videoeditorjobs.com/blog/how-to-hire-a-video-editor/
https://videoeditorjobs.com/blog/video-editor-job-description-template/
https://videoeditorjobs.com/blog/freelance-video-editor-rates/
https://videoeditorjobs.com/blog/youtube-video-editor-job-description/
```

For each inspected URL, check:

- Google can fetch the page.
- Canonical URL is the `https://videoeditorjobs.com/...` URL.
- The page is not blocked by `robots.txt`.
- The page is indexable unless it is `/search/`, `/thanks-editor/`, or `/thanks-hiring/`.
- The rendered page shows the expected H1 and primary CTA.

## Removed From Crawl

These pages were cut from the launch sitemap because they were too generic, tool-like, or weakly tied to early traction:

```text
/video-editor-job-brief-builder/
/video-editor-portfolio-checklist/
/video-editing-rate-calculator/
/video-editor-community-post-generator/
/video-editor-jobs-last-3-days/
/on-call-travel-video-editor-jobs/
/teen-video-editor-jobs/
/night-shift-teen-video-editor-jobs/
/french-video-editor-jobs/
/video-editor-jobs-nyc/
/video-editor-jobs-manhattan/
/post-video-editor-job/
```

Do not request indexing for these routes. If Search Console has them from an older crawl, let them fall out naturally or use Removals only if a stale page is still live.

## First Search Console Review

Check Search Console again after 24 to 72 hours. Record:

- Indexed pages
- Crawled but not indexed pages
- Queries with impressions
- Pages receiving impressions
- Countries and devices if there is enough data
- Any coverage warnings

Map Search Console queries into one of these actions:

- If a query matches an existing page, improve title, meta description, intro, FAQ, and internal links.
- If a query repeats but has no exact page, park it until Sheet rows or community replies prove it is worth adding.
- If a hiring-intent query appears, add internal links to `/hire-video-editor/`.
- If an editor-intent query appears, add internal links to `/editors/`.
- If a query comes from a community post, compare it with `utm_source`, `utm_campaign`, and `page_path` in the Sheet.

Use Search Console data to expand only from evidence, not from keyword-padding instincts.
