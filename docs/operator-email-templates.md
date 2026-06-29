# Operator Email Templates

Use these when reviewing new rows in `Editors`, `Hiring Requests`, and `Matches`.

## Review Rules

- Start from `Dashboard`, then `Source Summary`.
- Filter intake tabs to `status = new`.
- Sort by `priority`, then `lead_score`.
- Use `next_action` to choose the first reply.
- Add a short `review_notes` entry after every manual touch.
- Fill `last_contacted_at` after sending any email.

## Editor Follow-Up: Strong Profile

Use when `next_action = review` or the editor has a high `lead_score`.

Subject:

```text
Quick follow-up on your Video Editor Jobs profile
```

Body:

```text
Hi {{editor_first_name}},

Thanks for joining Video Editor Jobs. Your profile came through with enough detail to review.

I’m looking at:
- primary fit: {{primary_fit}}
- portfolio: {{portfolio_url}}
- work preference: {{work_preference}}
- capacity: {{weekly_capacity}}
- rate range: {{rate_range}}

If a hiring brief looks relevant, I may follow up with a specific intro or one extra question about availability.

Best,
Video Editor Jobs
```

Sheet update:

```text
status = reviewed
next_action = find hiring match
last_contacted_at = today
review_notes = Sent strong-profile follow-up.
```

## Editor Follow-Up: Missing Portfolio Or Details

Use when `next_action = ask for portfolio` or `next_action = email editor`.

Subject:

```text
One missing detail for your Video Editor Jobs profile
```

Body:

```text
Hi {{editor_first_name}},

Thanks for joining Video Editor Jobs. I’m reviewing early editor profiles manually, and one detail would make your profile easier to match:

{{missing_detail}}

The most useful reply is short: portfolio link, best editing format, rate range, weekly capacity, and preferred workflow.

Best,
Video Editor Jobs
```

Sheet update:

```text
status = needs_follow_up
next_action = email editor
last_contacted_at = today
review_notes = Asked for missing editor detail: {{missing_detail}}.
```

## Hiring Follow-Up: Brief Needs More Detail

Use when `next_action = ask for brief details`.

Subject:

```text
One detail that would make your editor brief easier to match
```

Body:

```text
Hi {{hiring_first_name}},

Thanks for sending a hiring brief through Video Editor Jobs. I’m reviewing early briefs manually before matching them with editors.

Could you reply with:
- budget or rate range
- source footage volume
- expected deliverables
- revision process
- 1 or 2 reference links

Those details help editors judge fit before anyone wastes time.

Best,
Video Editor Jobs
```

Sheet update:

```text
status = needs_follow_up
next_action = ask for brief details
last_contacted_at = today
review_notes = Asked hiring lead for budget/scope/references/revision detail.
```

## Hiring Follow-Up: Usable Brief

Use when a hiring brief has budget, timeline, deliverables, and references.

Subject:

```text
Your Video Editor Jobs brief is ready for matching review
```

Body:

```text
Hi {{hiring_first_name}},

Thanks for the clear brief. I have enough detail to review it against the early editor list.

I’m looking at:
- role type: {{role_type}}
- budget: {{budget}}
- timeline: {{timeline}}
- content format: {{content_format}}
- deliverables: {{deliverables}}

If I see an editor who looks relevant, I’ll follow up before making an intro.

Best,
Video Editor Jobs
```

Sheet update:

```text
status = reviewed
next_action = find hiring match
last_contacted_at = today
review_notes = Sent usable-brief follow-up.
```

## Match Intro

Use after adding a proposed row to `Matches` manually or after reviewing a `suggestMatches()` row.

Subject:

```text
Possible video editor match: {{role_or_fit}}
```

Body:

```text
Hi {{hiring_first_name}} and {{editor_first_name}},

I’m making a lightweight intro because the brief and editor profile look directionally aligned.

Brief:
- role or format: {{role_type_or_primary_fit}}
- budget or rate: {{budget_or_rate}}
- timeline: {{timeline}}
- workflow notes: {{workflow_notes}}

Editor:
- portfolio: {{portfolio_url}}
- fit: {{primary_fit}}
- software: {{software}}
- availability: {{availability}}

No pressure on either side. If it looks relevant, reply here with the next useful detail or a time to talk.

Best,
Video Editor Jobs
```

Sheet update:

```text
Matches.status = intro_sent
Matches.intro_sent_at = today
Editors.status = matched
Hiring Requests.status = matched
review_notes = Intro sent for {{match_id}}.
```

## Not A Fit

Use when a row is clearly outside the early scope or too incomplete after follow-up.

Subject:

```text
Thanks for sending this through Video Editor Jobs
```

Body:

```text
Hi {{first_name}},

Thanks for sending this through. I do not think I can match it well in the early version of Video Editor Jobs.

The current focus is remote, freelance, YouTube, social, podcast, assistant editor, brand, agency, local, and travel/event editing work where the portfolio or brief is clear enough to judge.

I appreciate you being part of the early signal.

Best,
Video Editor Jobs
```

Sheet update:

```text
status = not_fit
next_action = no action
last_contacted_at = today
review_notes = Sent not-fit note.
```
