# IssueWeaver

**A clearer bug report starts with your voice.**

[Try the app](https://issueweaver.netlify.app/) · [Setup guide](IssueWeaver-Netlify/README.md)

IssueWeaver guides users through six questions to describe a software bug. Speak, upload audio, or type an answer, then review the report before saving or sharing it.

## How it works

1. Sign in with Google for voice and account storage, or continue with typed answers.
2. Describe the bug title, actual behaviour, steps to reproduce, expected behaviour, environment and frequency.
3. Review and edit the answers, and optionally attach a screenshot.
4. Save the report, copy it, or export Markdown.

**Gnani Prisma** transcribes audio. **Gnani Timbre** reads the questions aloud. Original transcriptions are preserved in a source trail.

## Features

- Guided questions with examples and progress tracking.
- Microphone recording, audio upload and typed input.
- Editable report preview and Markdown export.
- Google sign-in, account reports and private screenshot storage.
- Browser recovery copies and cloud draft recovery.
- 24 text-language choices: 22 scheduled Indian languages, English and Other.
- Voice enabled for 10 locales: English, Bengali, Gujarati, Hindi, Kannada, Malayalam, Marathi, Punjabi, Tamil and Telugu.

Answers map directly to report fields. The app does not automatically translate answers, infer a root cause, or create GitHub issues.

## Tech stack

| Component | Technology |
| --- | --- |
| Frontend | HTML, CSS, JavaScript |
| Speech | Gnani Prisma and Timbre |
| Hosting and API | Netlify and Netlify Functions |
| Authentication | Supabase Auth with Google |
| Reports | Supabase Postgres with row-level security |
| Screenshots | Private Supabase Storage bucket |

## Build and test

Requires **Node.js 22+**.

```bash
git clone https://github.com/devisaicharan/Issueweaver.git
cd Issueweaver/IssueWeaver-Netlify
npm ci
npm run build
npm test
```

The build outputs `public/`. Deployment also requires the included server functions; see the [setup guide](IssueWeaver-Netlify/README.md).

Tests cover API guards, database policies and client flows. External services are mocked where applicable; automated tests do not measure live speech accuracy across all languages.

## Privacy and limits

- Voice requires sign-in. Audio passes through the server to Gnani and is not saved by IssueWeaver.
- Reports and screenshots save to the signed-in account. Browser recovery copies remain on the device after sign-out.
- Voice allowance: 20 requests per account per UTC day. Failed upstream requests also count.
- Recordings: up to 55 seconds. Audio uploads: up to 4 MB.
- Screenshots: PNG, JPEG or WebP, up to 5 MB.
- Account storage: up to 500 report records, including the cloud draft.

Keep API keys and other secrets in deployment environment settings, never in source control.
