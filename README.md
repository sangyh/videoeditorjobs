# Video Editor Jobs

Static SEO launch site for `videoeditorjobs.com`.

The goal of this first version is simple: publish crawlable pages now so Google can discover the domain while the live TalentPrism job backend is still being wired in.

## What is included

- Homepage targeting `video editor jobs`
- Category pages for remote, freelance, YouTube, broad video editing, part-time, entry-level, and local editor searches
- `sitemap.xml`
- `robots.txt`
- Canonical URLs
- Open Graph and Twitter preview metadata
- JSON-LD for `WebSite`, `Organization`, `CollectionPage`, `ItemList`, and `FAQPage`
- Static editor and employer intake forms that open email drafts until the TalentPrism endpoint exists

## Commands

```bash
npm run build
npm run verify
npm run dev
```

`npm run dev` serves `dist/` at `http://localhost:4173`.

## Deployment

The project is ready for Vercel static hosting:

1. Create a new Vercel project from this folder or repository.
2. Use the included `vercel.json`.
3. Add `videoeditorjobs.com` as the production domain.
4. Redirect `www.videoeditorjobs.com` to `videoeditorjobs.com`.
5. After DNS propagates, submit `https://videoeditorjobs.com/sitemap.xml` in Google Search Console.

Recommended DNS shape:

```text
videoeditorjobs.com      A/CNAME target from host
www.videoeditorjobs.com  CNAME to host, redirected to apex
```

Use the exact records from the hosting provider because Vercel, Cloudflare, Netlify, and other hosts issue different values.

## TalentPrism integration notes

The current forms are static. When the backend is ready, connect them to a TalentPrism intake endpoint and keep these fields:

- `email`
- `fit`
- `portfolio`
- source page URL
- visitor type, editor or employer
- consent timestamp

For job listings, do not add `JobPosting` structured data until real jobs exist. Google treats fake or placeholder job structured data as spammy. Keep category pages as `CollectionPage` until TalentPrism is feeding actual roles.

## SEO next steps

- Add real job pages as soon as TalentPrism has live roles.
- Add a Google Search Console verification file or DNS TXT record.
- Set up Bing Webmaster Tools after Google is verified.
- Add a simple `/search/` route once real listings exist, matching the `SearchAction` structured data.
- Replace the static email forms with backend submissions.
