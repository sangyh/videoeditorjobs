# Search Console Handoff

Use this after the production site is deployed with the Google Apps Script `/exec` endpoint embedded and live intake smoke tests pass.

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

The live smoke should confirm the homepage, editor intake, hiring intake, blog, community page, thank-you noindex pages, `robots.txt`, and the sitemap are all reachable.

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
50 crawlable URLs
```

The thank-you pages are intentionally excluded from the sitemap and should stay `noindex, follow`.

## URL Inspection Queue

After sitemap submission, inspect these URLs first:

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
https://videoeditorjobs.com/video-editor-community/
https://videoeditorjobs.com/video-editor-jobs-last-3-days/
https://videoeditorjobs.com/on-call-travel-video-editor-jobs/
https://videoeditorjobs.com/teen-video-editor-jobs/
https://videoeditorjobs.com/remote-video-editing-jobs/
https://videoeditorjobs.com/night-shift-teen-video-editor-jobs/
https://videoeditorjobs.com/french-video-editor-jobs/
https://videoeditorjobs.com/video-editor-jobs-nyc/
https://videoeditorjobs.com/video-editor-jobs-manhattan/
https://videoeditorjobs.com/blog/how-to-find-video-editor-jobs/
https://videoeditorjobs.com/blog/how-to-get-jobs-as-a-video-editor/
https://videoeditorjobs.com/blog/video-editor-portfolio-examples/
https://videoeditorjobs.com/blog/video-editor-interview-questions/
https://videoeditorjobs.com/blog/youtube-video-editor-job-description/
https://videoeditorjobs.com/blog/how-to-price-video-editing-work/
```

For each inspected URL, check:

- Google can fetch the page.
- Canonical URL is the `https://videoeditorjobs.com/...` URL.
- The page is not blocked by `robots.txt`.
- The page is indexable unless it is a thank-you utility route.
- The rendered page shows the expected H1 and primary CTA.

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
- If a query repeats but has no exact page, create a new category page or blog post.
- If a hiring-intent query appears, add internal links to `/hire-video-editor/`.
- If an editor-intent query appears, add internal links to `/editors/`.
- If a query comes from a community post, compare it with `utm_source`, `utm_campaign`, and `page_path` in the Sheet.

## Seed Keyword Coverage

These Ahrefs-inspired seed clusters are already covered in the current site:

- `video editor jobs`
- `remote video editor jobs`
- `remote video editing jobs`
- `video editor jobs remote`
- `freelance video editor jobs`
- `youtube video editor jobs`
- `part-time video editor jobs`
- `entry-level video editor jobs`
- `student video editor jobs`
- `teen video editor jobs`
- `work from home video editor jobs`
- `travel video editor jobs`
- `on call travel video editor jobs`
- `night shift video editor jobs`
- `night shift teen video editor jobs`
- `assistant video editor jobs`
- `french video editor jobs`
- `video editor jobs nyc`
- `video editor jobs manhattan`
- `video editor jobs last 3 days`
- `how to get jobs as a video editor`
- `how to hire a video editor`
- `post video editor job`
- `video editor job description template`
- `video editor portfolio examples`
- `video editor interview questions`
- `youtube video editor job description`
- `how to price video editing work`

Use Search Console data to decide what to expand next instead of publishing generic blog posts.

## Bing

After Google sitemap submission succeeds, import the verified property into Bing Webmaster Tools or submit:

```text
https://videoeditorjobs.com/sitemap.xml
```

This is optional for launch day but useful once the first Google crawl is clean.
