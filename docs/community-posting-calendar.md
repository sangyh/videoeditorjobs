# Community Posting Calendar

Use this as the first two-week posting plan after `npm run smoke:intake` proves real rows land in the Google Sheet. The goal is to learn which communities, angles, and pages produce useful editor profiles or hiring briefs.

Do not post every row at once. Start small, reply carefully, and update `Community Posts` after each post.

## Pre-Post Checklist

Before each post:

- Confirm the community allows feedback requests, job-board links, or founder posts.
- Add or update a row in `Community Posts` with `status = planned`.
- Use the exact UTM link from the `target_url` column.
- Write the post as a question or request for feedback, not a launch announcement.
- Avoid posting the same copy across multiple communities on the same day.

After each post:

- Set `status = posted`.
- Fill `post_url` and `posted_at`.
- Update `replies_count`, `submissions_count`, `quality_notes`, and `next_action` after 24 hours.
- If the thread needs a response, set `status = needs_reply`.
- If a moderator removes it or asks you to stop, set `status = removed` or `paused`.

## Week 1

| Day | Platform | Audience | Angle | Target URL | Success Signal |
| --- | --- | --- | --- | --- | --- |
| 1 | Reddit | Editors | Feedback on editor intake fields | `https://videoeditorjobs.com/editors/?utm_source=reddit&utm_medium=community&utm_campaign=early_editor_list` | Editors mention missing fields or submit portfolios |
| 2 | Facebook | Editors | What makes a job post trustworthy | `https://videoeditorjobs.com/editors/?utm_source=facebook&utm_medium=group&utm_campaign=early_editor_list` | Comments about rate, scope, examples, or red flags |
| 3 | Reddit | Hiring teams | What details editors need before judging a gig | `https://videoeditorjobs.com/hire-video-editor/?utm_source=reddit&utm_medium=community&utm_campaign=early_hiring_briefs` | Hiring-side comments or usable briefs |
| 4 | Forum | Both | Editing-specific fields every job post should include | `https://videoeditorjobs.com/video-editor-community/?utm_source=forum&utm_medium=community&utm_campaign=early_community` | Replies about workflow, review process, or rates |
| 5 | Reddit comment | Editors | Portfolio examples answer | `https://videoeditorjobs.com/blog/video-editor-portfolio-examples/?utm_source=reddit&utm_medium=comment&utm_campaign=blog_guide` | Portfolio questions or editor submissions |
| 6 | Facebook comment | Hiring teams | Job description template answer | `https://videoeditorjobs.com/blog/video-editor-job-description-template/?utm_source=facebook&utm_medium=comment&utm_campaign=blog_guide` | Hiring teams ask about scope or budget |
| 7 | Internal review | Both | Review `Source Summary` and `Community Posts` | `Dashboard` | Pick one angle to repeat or improve |

## Week 2

| Day | Platform | Audience | Angle | Target URL | Success Signal |
| --- | --- | --- | --- | --- | --- |
| 8 | Reddit | Editors | Remote editing workflow, not just location | `https://videoeditorjobs.com/remote-video-editing-jobs/?utm_source=reddit&utm_medium=community&utm_campaign=seo_resource` | Remote editors submit availability and tools |
| 9 | Facebook | Editors | Pricing and revision load | `https://videoeditorjobs.com/blog/how-to-price-video-editing-work/?utm_source=facebook&utm_medium=group&utm_campaign=blog_guide` | Rate questions, rate ranges, or pricing objections |
| 10 | Reddit comment | Hiring teams | Interview questions for editors | `https://videoeditorjobs.com/blog/video-editor-interview-questions/?utm_source=reddit&utm_medium=comment&utm_campaign=blog_guide` | Hiring teams ask about screening or portfolio review |
| 11 | Forum | Editors | Early-career editor safety and scope | `https://videoeditorjobs.com/teen-video-editor-jobs/?utm_source=forum&utm_medium=community&utm_campaign=seo_resource` | Student or junior editors ask follow-up questions |
| 12 | Reddit | Hiring teams | YouTube editor job description | `https://videoeditorjobs.com/blog/youtube-video-editor-job-description/?utm_source=reddit&utm_medium=community&utm_campaign=blog_guide` | YouTube or creator hiring briefs |
| 13 | Facebook comment | Editors | Fresh editing alerts and early list | `https://videoeditorjobs.com/video-editor-jobs-last-3-days/?utm_source=facebook&utm_medium=comment&utm_campaign=seo_resource` | Editors ask whether jobs are live yet |
| 14 | Internal review | Both | Decide next page or form change | `Source Summary` | Choose one evidence-backed improvement |

## Community Posts Rows To Seed

Add these rows to `Community Posts` if you want the calendar visible in the Sheet before posting.

| post_id | status | platform | audience | angle | question | target_url | utm_source | utm_medium | utm_campaign | next_action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `cal-reddit-editor-fields-001` | planned | reddit | editors | editor intake feedback | What fields would make a video-editor-only job board worth joining? | `https://videoeditorjobs.com/editors/?utm_source=reddit&utm_medium=community&utm_campaign=early_editor_list` | reddit | community | early_editor_list | review rules and post |
| `cal-facebook-trust-001` | planned | facebook | editors | trustworthy job posts | What makes a video editing job post feel trustworthy enough to apply to? | `https://videoeditorjobs.com/editors/?utm_source=facebook&utm_medium=group&utm_campaign=early_editor_list` | facebook | group | early_editor_list | review group rules |
| `cal-reddit-hiring-brief-001` | planned | reddit | hiring | useful hiring briefs | What details do editors need before judging a video editing gig? | `https://videoeditorjobs.com/hire-video-editor/?utm_source=reddit&utm_medium=community&utm_campaign=early_hiring_briefs` | reddit | community | early_hiring_briefs | find hiring-side community |
| `cal-forum-job-fields-001` | planned | forum | both | job post field feedback | Which editing-specific details should every job post include? | `https://videoeditorjobs.com/video-editor-community/?utm_source=forum&utm_medium=community&utm_campaign=early_community` | forum | community | early_community | find relevant thread |
| `cal-reddit-portfolio-001` | planned | reddit | editors | portfolio examples | What portfolio examples make an editor easier to hire? | `https://videoeditorjobs.com/blog/video-editor-portfolio-examples/?utm_source=reddit&utm_medium=comment&utm_campaign=blog_guide` | reddit | comment | blog_guide | use as reply only |
| `cal-facebook-pricing-001` | planned | facebook | both | pricing and revisions | How do you price video editing when revision load is unclear? | `https://videoeditorjobs.com/blog/how-to-price-video-editing-work/?utm_source=facebook&utm_medium=group&utm_campaign=blog_guide` | facebook | group | blog_guide | review group rules |
| `cal-reddit-youtube-brief-001` | planned | reddit | hiring | YouTube editor brief | What should a YouTube editor job description include beyond software? | `https://videoeditorjobs.com/blog/youtube-video-editor-job-description/?utm_source=reddit&utm_medium=community&utm_campaign=blog_guide` | reddit | community | blog_guide | find creator community |

## Reply Rules

- Reply with a guide link only when it answers the exact comment.
- If someone asks whether jobs are live yet, be direct: the site is in early intake mode while hiring briefs are collected.
- If someone shares a useful missing field, add it to `quality_notes` and consider whether the form should change.
- If a community reacts badly to links, continue the discussion without linking and mark the post `paused`.
- If a hiring team shares a real need, route them to `/hire-video-editor/` and ask for budget, timeline, examples, and revision process.

## Weekly Decision

At the end of each week, pick only one change:

- Repeat the best-performing post angle in one new community.
- Rewrite a weak post angle and test it once more.
- Add one missing form field or placeholder.
- Publish one new guide or category page from repeated questions.
- Stop posting in a channel that produced weak rows or moderation issues.
