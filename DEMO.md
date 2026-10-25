# IssueWeaver demo and submission guide

## Record a 60-second working demo

Use fictional data. Keep API settings, account emails, browser notifications and unrelated tabs out of the recording. Do not use the generated test screenshot as evidence of a real product defect; label it fictional. Capture the actual app responding, including the transcription, rather than implying a static mockup is live.

| Time | On screen | Suggested narration |
| --- | --- | --- |
| 0–7s | IssueWeaver home | “A vague bug report is hard to reproduce. I built IssueWeaver to guide people through six clear answers.” |
| 7–22s | Signed-in app; hear a question, record a short answer, stop and show the returned text | “Gnani Timbre reads the question aloud, and Gnani Prisma transcribes my answer.” |
| 22–35s | Remaining answers and review screen | “I can speak or type, review every field, and correct anything before saving.” |
| 35–48s | Attach fictional screenshot, save, refresh, reopen cloud report | “Google sign-in keeps reports and screenshots in my account, with a browser recovery copy.” |
| 48–60s | Export Markdown and show resulting text | “The report is ready to share. Ten voice locales are enabled, with 24 text-language choices. IssueWeaver preserves my answers without inventing a cause.” |

Do a rehearsal first. If live processing takes longer, show a clearly labelled cut or publish a longer walkthrough; never speed up a request without disclosure. A 60-second demo is an award category, not a stated mandatory length for every entry.

### Fictional sample answers

- Title: Login button keeps loading.
- Actual: The spinner stays visible for over 30 seconds and the dashboard never opens.
- Steps: Open the demo app, enter test credentials, and click Login.
- Expected: The dashboard should open after signing in.
- Environment: Chrome on a Windows laptop, fictional demo app.
- Frequency: Every attempt in three test attempts.

Use English for the first take. Add a Telugu segment only after checking the actual returned transcription. Do not claim all languages or mixed-language accuracy were tested.

## Recording on your Windows laptop

Open the deployed app and sign in before recording, so account selection does not expose personal details. Use your screen recorder with microphone and system/app audio enabled. Frame only the app window. Review the recording to confirm both your narration and the spoken question are audible. Save a clean MP4 and watch it through before publishing.

This repository contains a script, not a recorded demo. Record the actual deployed workflow on your device.

## Programme checklist

Official source: https://www.gnani.ai/internship
Checked: 25 October 2026. Recheck the registration terms before the final submission.

- Deadline listed: **10 November 2026, 11:59 PM IST**.
- The brief is open: a practical working app using Gnani technology is allowed.
- Show a working app in a public demo video.
- Identify Gnani Prisma speech-to-text and Timbre text-to-speech.
- State each member's contribution accurately. Solo or a team of two; do not invent a contribution statement.
- Post the demo on LinkedIn, X, or both before submitting.
- Tag Gnani AI and include **#GnaniAI #GreatIndianAIInternshipChallenge**.
- Nominate one post link per platform in the submission. Posting/tagging alone is not submission.
- Include the demo video, written project explanation and models/APIs used in the submission form sent by email.
- Use synthetic data; avoid private identifiers and real recorded calls.
- Do not buy engagement, use bots, paid promotion or engagement exchanges, or present a misleading demo.
- The 60-second video award is separate from internship selection.

## Project explanation draft

IssueWeaver helps students, testers and everyday users describe software problems clearly. It collects six directly supplied answers: title, actual behaviour, reproduction steps, expected behaviour, environment and frequency. Gnani Timbre reads guided questions aloud, and Gnani Prisma transcribes microphone recordings or uploaded audio in supported locales. Users can review and edit answers, preserve the original transcript trail, attach a screenshot, save through a Google-authenticated account, and export Markdown.

The app uses Netlify Functions for authenticated voice requests, Supabase Google authentication, Postgres with row-level security for reports, and private storage for screenshots. It offers 24 text-language choices and enables voice in 10 locales. It does not translate answers, infer a root cause, or create GitHub issues automatically. Live checks and user-confirmed device tests cover the main deployed workflow; automated tests separately cover server contracts, database policies and simulated client flows.

Live app: https://issueweaver.netlify.app/
Source: https://github.com/devisaicharan/Issueweaver

Before submitting, add your actual contribution statement and your public demo/post links. Verify unauthenticated site access and Google sign-in with a separate account. This guide does not submit or publish anything on your behalf.
