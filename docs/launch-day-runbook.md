# Launch Day Runbook

Use this when the site is deployed and the Google Apps Script `/exec` endpoint is wired into `VEJ_INTAKE_ENDPOINT`.

## Launch Readiness

Before posting anywhere, confirm:

- `npm run launch:ready` passes locally.
- Vercel production build passes with `VEJ_INTAKE_ENDPOINT` set.
- `npm run configure:endpoint -- <exec-url>` saves the local endpoint.
- `npm run launch:ready -- --require-endpoint` passes before the production deploy.
- `npm run smoke:live -- https://videoeditorjobs.com --require-endpoint` passes against the deployed site.
- `https://videoeditorjobs.com/sitemap.xml` lists 18 crawlable URLs.
- `/thanks-editor/` and `/thanks-hiring/` return `noindex, follow` and are not in the sitemap.
- `npm run smoke:intake` creates one editor row and one hiring row.
- `Dashboard` updates after the smoke rows land.
- `Source Summary` groups smoke/test rows by `utm_source`, `utm_campaign`, and `page_path`.
- `Community Posts` exists and has columns for planned posts, post URLs, replies, submissions, quality notes, and next action.
- `seedCommunityPosts()` has created the starter Reddit, Facebook, forum, and two-week calendar planned posts.
- `docs/community-posting-calendar.md` is ready for the two-week Reddit, Facebook, and forum posting plan.
- Sample rows in `Editors`, `Hiring Requests`, and `Matches` are deleted or clearly marked as examples.
- `docs/search-console-handoff.md` and `docs/seo-30-day-plan.md` are ready for the post-deploy SEO loop.

## First 24 Hours

Post in small batches so comments can be answered carefully.

Use `docs/community-posting-calendar.md` for the two-week calendar, exact angles, UTM links, and `Community Posts` row seeds.

| Window | Channel | Action | Link |
| --- | --- | --- | --- |
| Hour 0 | Reddit editor community | Ask for feedback on editor intake fields. | `https://videoeditorjobs.com/editors/?utm_source=reddit&utm_medium=community&utm_campaign=early_editor_list` |
| Hour 2 | Facebook editor group | Share the editor list and ask what makes a job post trustworthy. | `https://videoeditorjobs.com/editors/?utm_source=facebook&utm_medium=group&utm_campaign=early_editor_list` |
| Hour 6 | Creator or agency community | Ask what details editors need before judging a gig. | `https://videoeditorjobs.com/hire-video-editor/?utm_source=reddit&utm_medium=community&utm_campaign=early_hiring_briefs` |
| Hour 12 | Forum reply | Share the community page or one relevant guide only where it answers the thread. | `https://videoeditorjobs.com/video-editor-community/?utm_source=forum&utm_medium=community&utm_campaign=early_community` |
| Hour 24 | Internal review | Check source quality and update next actions. | `Dashboard`, `Source Summary`, `Community Posts` |

## What To Track

Open `Source Summary` first, then spot-check the intake rows. Group new rows by:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `page_path`
- `primary_fit` for editors
- `role_type` and `budget` for hiring briefs

Open `Community Posts` next and update:

- `status`
- `post_url`
- `replies_count`
- `submissions_count`
- `quality_notes`
- `next_action`

Use these decisions:

- If Reddit sends signups but weak portfolios, improve the post copy before posting again.
- If Facebook sends editors with strong portfolios, post a follow-up question instead of reposting the same link.
- If hiring briefs are vague, turn the missing details into the next blog post and improve the hiring form placeholder.
- If a niche repeats at least 3 times, create a more specific SEO page or blog guide for it.

## Daily Review Queue

1. Open `Dashboard`.
2. Open `Source Summary`.
3. Open `Community Posts`.
4. Review `New editor submissions`, `New hiring briefs`, source groups, campaigns, page paths, and posts needing replies.
5. Filter each intake tab to `status = new`.
6. Sort by `priority`, then `lead_score`.
7. Review the auto-filled `next_action`.
8. Add `review_notes`.
9. Run `suggestMatches()` in Apps Script once both editor and hiring rows exist.
10. Review proposed rows in `Matches`.
11. Use `docs/operator-email-templates.md` for follow-ups and intros.
12. When contacted, fill `last_contacted_at`.

## Success Criteria

The first traction loop is working when:

- At least 10 editor submissions land from tracked community links.
- At least 2 hiring briefs land with usable budget, timeline, and format details.
- The Sheet shows which source produced the best rows.
- `Community Posts` shows which post angle produced replies, submissions, or no useful signal.
- One real match candidate is entered in `Matches`.
- One follow-up or intro is sent using `docs/operator-email-templates.md`.
- One blog or SEO follow-up is chosen from actual intake/search evidence.

## Search Console Follow-Up

After the live smoke and intake smoke pass, submit `https://videoeditorjobs.com/sitemap.xml` using `docs/search-console-handoff.md`.

Do the first Search Console review after 24 to 72 hours. Use `docs/seo-30-day-plan.md` to compare queries, impressions, clicks, and landing pages against Sheet rows by `utm_source`, `utm_campaign`, and `page_path`.
