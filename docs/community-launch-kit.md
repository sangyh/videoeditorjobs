# Community Launch Kit

Use these posts to start collecting editors and hiring briefs without sounding like a generic job-board ad.

For the day-by-day launch cadence, use `docs/community-posting-calendar.md`. This file is the copy bank; the calendar is the operating schedule.

## Tracking Links

Use platform-specific UTM links so the Sheet shows where submissions came from.

The site stores first/latest UTM or `ref` values in browser local storage, so source fields can still populate if someone lands on a guide first and submits from `/editors/` or `/hire-video-editor/` later in the same browser.

Before posting, run `seedCommunityPosts()` in Apps Script if the starter rows and two-week calendar rows are not already in `Community Posts`. For any new post idea, add a row with `status = planned`, then fill `platform`, `community_name`, `audience`, `angle`, `question`, `target_url`, `utm_source`, `utm_medium`, and `utm_campaign`. After posting, update `post_url`, `posted_at`, `replies_count`, `submissions_count`, `quality_notes`, and `next_action`.

```text
Reddit editors:
https://videoeditorjobs.com/editors/?utm_source=reddit&utm_medium=community&utm_campaign=early_editor_list

Reddit hiring:
https://videoeditorjobs.com/hire-video-editor/?utm_source=reddit&utm_medium=community&utm_campaign=early_hiring_briefs

Facebook editors:
https://videoeditorjobs.com/editors/?utm_source=facebook&utm_medium=group&utm_campaign=early_editor_list

Facebook hiring:
https://videoeditorjobs.com/hire-video-editor/?utm_source=facebook&utm_medium=group&utm_campaign=early_hiring_briefs

Forum editors:
https://videoeditorjobs.com/editors/?utm_source=forum&utm_medium=community&utm_campaign=early_editor_list

Forum hiring:
https://videoeditorjobs.com/hire-video-editor/?utm_source=forum&utm_medium=community&utm_campaign=early_hiring_briefs

Community feedback page:
https://videoeditorjobs.com/video-editor-community/?utm_source=community&utm_medium=feedback&utm_campaign=early_community

Remote editor page:
https://videoeditorjobs.com/remote-video-editor-jobs/?utm_source=community&utm_medium=reply&utm_campaign=seo_resource

Freelance editor page:
https://videoeditorjobs.com/freelance-video-editor-jobs/?utm_source=community&utm_medium=reply&utm_campaign=seo_resource

YouTube editor page:
https://videoeditorjobs.com/youtube-video-editor-jobs/?utm_source=community&utm_medium=reply&utm_campaign=seo_resource

Part-time recurring editor page:
https://videoeditorjobs.com/part-time-video-editor-jobs/?utm_source=community&utm_medium=reply&utm_campaign=seo_resource

Where to find video editor jobs guide:
https://videoeditorjobs.com/blog/where-to-find-video-editor-jobs/?utm_source=community&utm_medium=reply&utm_campaign=blog_guide

Portfolio examples guide:
https://videoeditorjobs.com/blog/video-editor-portfolio-examples/?utm_source=community&utm_medium=reply&utm_campaign=blog_guide

Thank-you page editor invite:
https://videoeditorjobs.com/editors/?utm_source=referral&utm_medium=thank_you&utm_campaign=editor_invite

Thank-you page hiring invite:
https://videoeditorjobs.com/hire-video-editor/?utm_source=referral&utm_medium=thank_you&utm_campaign=hiring_invite

Thank-you page hiring resource:
https://videoeditorjobs.com/blog/how-to-hire-a-video-editor/?utm_source=referral&utm_medium=thank_you&utm_campaign=hiring_resource_share

Thank-you page portfolio examples share:
https://videoeditorjobs.com/blog/video-editor-portfolio-examples/?utm_source=referral&utm_medium=thank_you&utm_campaign=portfolio_examples_share

Thank-you page job template share:
https://videoeditorjobs.com/blog/video-editor-job-description-template/?utm_source=referral&utm_medium=thank_you&utm_campaign=job_template_share

Thank-you page community share:
https://videoeditorjobs.com/video-editor-community/?utm_source=referral&utm_medium=thank_you&utm_campaign=community_share
```

## Reddit Post For Editors

Title options:

```text
Building a focused video editor jobs board, looking for early editors to join
```

```text
What would you want from a video-editor-only job board?
```

Body:

```text
I’m building Video Editor Jobs, a focused board/community for editing work instead of a generic job feed.

The first version is intentionally simple: editors can join the early list with portfolio, niche, software, rates, availability, and the kind of work they actually want.

I’m especially trying to separate:
- remote editor jobs
- freelance video editing
- YouTube/channel editing
- short-form social editing
- podcast/multicam editing
- assistant editor roles
- local/hybrid studio work

If you edit professionally or are trying to get more editing work, I’d genuinely appreciate feedback on what fields matter and what makes a job post worth applying to.

Early editor list:
https://videoeditorjobs.com/editors/?utm_source=reddit&utm_medium=community&utm_campaign=early_editor_list
```

## Reddit Post For Hiring Teams

Title options:

```text
What details do editors need before they can judge a video editing gig?
```

```text
Building a cleaner way to submit video editor roles, looking for hiring feedback
```

Body:

```text
I’m building Video Editor Jobs, a focused place for video editor roles and editing projects.

One thing I keep seeing is that many video editing posts are too vague: no rate, no deliverables, no source footage volume, no review process, no software stack, no examples of the desired style.

The hiring intake I’m testing asks for:
- role type
- content format
- budget or rate
- timeline
- remote/local expectations
- software/workflow
- references
- brief and review process

If you hire editors, I’d love feedback on what else belongs in a useful brief.

Hiring intake:
https://videoeditorjobs.com/hire-video-editor/?utm_source=reddit&utm_medium=community&utm_campaign=early_hiring_briefs
```

## Facebook Group Post

```text
Hey everyone, I’m building Video Editor Jobs, a focused job board/community for editing work.

The goal is to make it less painful for editors and hiring teams to find each other by collecting the details that actually matter: portfolio fit, software, rates, availability, format, budget, deliverables, and workflow.

Editors can join the early list here:
https://videoeditorjobs.com/editors/?utm_source=facebook&utm_medium=group&utm_campaign=early_editor_list

Hiring teams can submit a brief here:
https://videoeditorjobs.com/hire-video-editor/?utm_source=facebook&utm_medium=group&utm_campaign=early_hiring_briefs

I’m also looking for feedback: what makes a video editing job post feel trustworthy enough to apply to?
```

## Forum Reply

```text
This is exactly the problem I’m trying to solve with Video Editor Jobs. Generic job boards miss a lot of editing-specific details, especially format, turnaround, review process, software, footage volume, and rate structure.

I’m collecting early editor profiles here:
https://videoeditorjobs.com/editors/?utm_source=forum&utm_medium=community&utm_campaign=early_editor_list

And hiring briefs here:
https://videoeditorjobs.com/hire-video-editor/?utm_source=forum&utm_medium=community&utm_campaign=early_hiring_briefs

Happy to take feedback on the intake fields too.
```

## Comment Replies

Use these as replies after someone comments, so the thread stays conversational instead of looking like a link drop.

Editor asks if there are live jobs yet:

```text
Not a public job feed yet. This is the early intake layer first: editors can join with portfolio, format fit, software, rates, availability, and preferences. As hiring briefs come in, I’m using the Sheet queue to understand which categories and matches are worth building first.

Editor intake:
https://videoeditorjobs.com/editors/?utm_source=reddit&utm_medium=comment&utm_campaign=early_editor_list
```

Editor asks what makes the list different:

```text
The main difference is the intake is editing-specific. Instead of only a resume or generic profile, it asks for portfolio, primary format, software, rate range, capacity, turnaround, and work preference. The goal is to make fit easier to judge for YouTube, social, podcast, assistant, agency, brand, local, and remote work.

Editor intake:
https://videoeditorjobs.com/editors/?utm_source=reddit&utm_medium=comment&utm_campaign=early_editor_list
```

Hiring team asks what to include in a brief:

```text
The most useful briefs usually include content format, deliverables, source footage volume, timeline, budget, software/workflow, reference links, and revision process. I made the hiring form around those fields so editors can judge fit faster.

Hiring brief:
https://videoeditorjobs.com/hire-video-editor/?utm_source=reddit&utm_medium=comment&utm_campaign=early_hiring_briefs
```

Someone asks about beginner or teen editors:

```text
For newer editors, I’d separate portfolio-building work from professional roles and be clear about pay, rights, schedule, and expectations. For this first version I’m collecting editor profiles first, then only adding new early-career pages if the Sheet shows real demand.

Editor intake:
https://videoeditorjobs.com/editors/?utm_source=reddit&utm_medium=comment&utm_campaign=early_editor_list
```

Someone asks about teen editing work around school or evening hours:

```text
For younger editors, I’d be careful with anything framed as night-shift work. The safer path is evening or weekend projects with written scope, clear pay or credit, revision limits, portfolio rights, and a clear adult point of contact. I’m not publishing a separate page for that until there is enough real demand to handle it responsibly.

Portfolio examples:
https://videoeditorjobs.com/blog/video-editor-portfolio-examples/?utm_source=reddit&utm_medium=comment&utm_campaign=blog_guide
```

Someone asks about remote editing work:

```text
Remote editing is less about location and more about workflow: how footage moves, how notes are handled, what timezone overlap is needed, and how fast exports are reviewed.

Remote editor page:
https://videoeditorjobs.com/remote-video-editor-jobs/?utm_source=reddit&utm_medium=comment&utm_campaign=seo_resource
```

Someone mentions event, tour, or travel work:

```text
Travel editing needs a different brief than normal remote work: travel dates, call times, day rate, lodging/per diem, gear, file backup, internet access, and whether shooting is part of the role. It is not part of the first tight sitemap, but hiring teams can still submit a detailed brief.

Post a job:
https://videoeditorjobs.com/hire-video-editor/?utm_source=reddit&utm_medium=comment&utm_campaign=early_hiring_briefs
```

## DM Follow-Ups

Use these only after someone invites a DM or asks for more detail.

Editor follow-up:

```text
Thanks for the thoughtful reply. I’m collecting early editor profiles here so I can learn which categories have real supply before turning this into a broader board:

https://videoeditorjobs.com/editors/?utm_source=dm&utm_medium=followup&utm_campaign=early_editor_list

The useful fields are portfolio, format fit, software, rate range, capacity, turnaround, and work preference. No pressure if it is not a fit.
```

Hiring follow-up:

```text
Appreciate the context. I’m testing a hiring intake that asks for the editing details most posts skip: budget, timeline, deliverables, footage volume, references, software/workflow, and revision process.

https://videoeditorjobs.com/hire-video-editor/?utm_source=dm&utm_medium=followup&utm_campaign=early_hiring_briefs

Even if you do not submit, I’d be curious which field feels unnecessary or missing.
```

## Moderation Notes

- Read community rules before posting.
- Prefer one specific question over a launch announcement.
- Do not repost identical copy across groups.
- Reply with a relevant guide only when it answers the thread.
- If a moderator asks for removal or clarification, thank them and remove the link.
- Track real submissions in `Source Summary`; comments without rows are still useful for copy and form changes.
- Track each post in `Community Posts`; use `status = needs_reply` when comments are waiting on a response.

## Weekly Posting Rhythm

Week 1:

- Post one editor-focused thread in a video editing community.
- Post one hiring-brief question in a creator, agency, or business community.
- Reply manually to every thoughtful comment.
- Record which community produced signups using the UTM columns in the Sheet.
- Update `Community Posts` with replies, submissions, and next action after 24 hours.

Week 2:

- Share one useful blog post, not the homepage.
- Ask a specific question about rates, portfolio review, job post red flags, or hiring briefs.
- Avoid reposting the same copy across communities.

Week 3:

- Publish a small anonymized insight from submissions, such as common editor niches or common missing hiring details.
- Link back to the relevant intake page.
