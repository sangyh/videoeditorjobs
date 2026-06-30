# SEO 30-Day Plan

This plan turns the blog and category pages into a measured acquisition loop for editors and hiring teams.

## Goals

- Get the 17 crawlable URLs discovered and indexed.
- Learn which editor niches, hiring briefs, and search queries produce real submissions.
- Publish only pages that answer demonstrated search or community demand.
- Use the Sheet as the conversion truth source.

## Week 1: Launch And Indexing

Run before posting:

```bash
npm run launch:ready
npm run smoke:live -- https://videoeditorjobs.com --require-endpoint
npm run smoke:intake
```

Actions:

- Submit `https://videoeditorjobs.com/sitemap.xml` in Google Search Console.
- Inspect the homepage, `/editors/`, `/hire-video-editor/`, `/remote-video-editor-jobs/`, `/freelance-video-editor-jobs/`, `/youtube-video-editor-jobs/`, `/part-time-video-editor-jobs/`, `/video-editor-community/`, and `/blog/`.
- Post one editor-focused community thread and one hiring-focused community thread.
- Reply manually to useful comments with the most specific guide or intake page.
- Check `Source Summary` daily for `utm_source`, `utm_campaign`, and `page_path`.

Decision rule:

- If a community sends low-quality submissions, revise the post copy before posting again.
- If a page gets impressions but no submissions, improve CTA placement and internal links.

## Week 2: Query Review

Actions:

- Open Search Console Performance.
- Filter to the last 7 days.
- Export or record top queries, top pages, impressions, clicks, average position, and CTR.
- Compare Search Console pages with Sheet rows by `page_path`.
- Improve pages that get impressions but weak CTR.

Page improvements to prioritize:

- Tighter title tag
- Clearer meta description
- More specific intro
- FAQ that mirrors the query language
- Links to `/editors/` or `/hire-video-editor/`
- Links from related blog posts to category pages

Decision rule:

- If the same query appears at least twice and no page answers it directly, add it to the content parking lot. Publish only when Search Console, Sheet rows, or community replies show it could create real supply or hiring demand.

## Week 3: Publish From Evidence

Pick one new post or page from actual data. Good candidates:

- A niche with at least 3 editor submissions
- A hiring question repeated in comments or briefs
- A Search Console query with impressions and no exact page, plus a plausible editor or hiring conversion path
- A page path with traffic but low conversion

Prefer these content types:

- Hiring-side guide if briefs are vague
- Editor-side portfolio/rates guide if editors ask how to stand out
- Niche category page if a job type repeats
- City page only if location demand appears in the Sheet or Search Console and the current community can actually serve it

Current blog guide clusters to watch:

- `video editor portfolio examples`
- `youtube video editor job description`
- `freelance video editor rates`

Every new page should include:

- One clear search intent
- One primary CTA
- Internal links to related pages
- FAQ content grounded in real questions
- Sitemap inclusion unless it is a utility page

## Week 4: Conversion Review

Review:

- Search Console queries and pages
- Sheet rows by `utm_source`
- Sheet rows by `utm_campaign`
- Sheet rows by `page_path`
- Editor `primary_fit`
- Hiring `role_type`
- Lead quality via `lead_score` and `review_reason`

Keep:

- Pages that drive submissions or Search Console impressions.
- Community channels that produce usable rows.
- Blog topics that create replies, shares, or hiring brief improvements.

Cut or revise:

- Posts that attract comments but no submissions.
- Pages with impressions but unclear intent.
- Channels that require heavy moderation and produce weak rows.

## Monthly Output

At the end of the first 30 days, produce:

- Top 10 Search Console queries
- Top 10 landing pages
- Top 5 community sources by submissions
- Best editor niche by quality
- Best hiring category by quality
- One recommended new page
- One recommended form improvement
- One recommended community post angle

Use this to decide the next build cycle instead of adding content blindly.
