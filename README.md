# IssueWeaver

**Turn a spoken bug report into six clear answers.**

[Open IssueWeaver](https://issueweaver.netlify.app/) · [Setup guide](IssueWeaver-Netlify/README.md) · [Demo and submission guide](DEMO.md)

IssueWeaver helps students, testers and everyday users describe software problems without starting from a blank issue template. It asks one question at a time, reads supported questions aloud with **Gnani Timbre**, and transcribes recorded or uploaded speech with **Gnani Prisma**.

## How it works

1. Sign in with Google to use account storage and voice.
2. Speak, upload audio, or type an answer to each question.
3. Review and edit the title, actual behaviour, reproduction steps, expected behaviour, environment and frequency.
4. Attach an optional screenshot and save the report.
5. Reopen your account report, copy it, or export Markdown.

Answers map directly to fields. Original transcriptions remain in a source trail. IssueWeaver does not infer a root cause, translate answers, or automatically create GitHub issues.

## Features

- Guided questions, examples, completion review and editing.
- 24 language choices: the 22 scheduled Indian languages, English and Other for typed input.
- Voice enabled for **10 locales**: English, Bengali, Gujarati, Hindi, Kannada, Malayalam, Marathi, Punjabi, Tamil and Telugu. Other choices support text; this is not a claim of voice support for every Indian language.
- Google authentication through Supabase, independent of ChatGPT accounts.
- Account reports in Postgres with row-level security and revision checks.
- Private screenshot storage with authenticated downloads.
- Browser recovery copies, cloud draft recovery and Markdown export.

## Architecture

The frontend uses HTML, CSS and JavaScript. Netlify Functions authenticate voice requests and call Gnani without exposing the API key. Supabase provides Google authentication, Postgres reports and a private screenshot bucket.

Source is in [IssueWeaver-Netlify](IssueWeaver-Netlify). Current application version: **1.7.0**.

## Development and deployment

Install Node.js 22 or newer, then:

```powershell
git clone https://github.com/devisaicharan/Issueweaver.git
cd Issueweaver/IssueWeaver-Netlify
npm ci
npm run build
npm test
```

The build creates `public/`. For a Netlify Git deployment use:

| Setting | Value |
| --- | --- |
| Branch | main |
| Base directory | IssueWeaver-Netlify |
| Build command | npm run build |
| Publish directory | public |
| Functions directory | netlify/functions |

Apply [supabase/setup.sql](IssueWeaver-Netlify/supabase/setup.sql) to your own Supabase project, enable Google authentication, and configure the production origin in Supabase Site URL and Redirect URLs. Google's OAuth redirect URI is the Supabase auth callback. See the [detailed setup guide](IssueWeaver-Netlify/README.md) before deploying.

Configure `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` for your project. Keep `GNANI_API_KEY` in Netlify's secret environment settings. Set `VOICE_ENABLED=true` when voice is ready, then redeploy. Never commit a real API key, Google client secret, Supabase service-role key, or personal reports. Static drag-and-drop hosting alone does not deploy the required functions.

The Windows deployment helper initializes voice as disabled; review its settings before using it on an existing deployment.

## Data and limits

Reports and screenshots are stored in the signed-in account. Browser recovery copies also remain on the device after sign-out, so take care on shared computers. Audio is sent to Gnani through the server and is not persisted by IssueWeaver.

Voice has a 20-request allowance per account per UTC day; upstream failures also count. This is not a global spending cap. Audio uploads are limited to 4 MB and recordings to 55 seconds. Screenshots support PNG, JPEG and WebP up to 5 MB. Accounts have a 500-record limit including the cloud draft.

Earlier localhost and ChatGPT-hosted reports are separate and are not automatically migrated. Keep their exports.

## Validation status

As of 25 October 2026:

- The owner confirmed deployed microphone transcription, spoken questions, and screenshot save/download after refresh.
- Earlier live checks verified Google sign-in and cloud report save/reopen.
- Three automated suites cover server contracts, actual Postgres via PGlite, and client flows in a simulated DOM. External services and auth/storage schemas are mocked or simulated where stated.
- The existing local suites passed again on 25 October. This does not establish live accuracy across all ten voice locales, all devices, or all noisy/mixed-language inputs.

For a new deployment, verify Google consent/public access, a second account's isolation, microphone permissions, error recovery and screenshot storage on the actual production domain. Google OAuth publishing and hosting visibility are account settings, not guaranteed by this source code.

## Programme

Built for the Great Indian AI Internship Challenge using Gnani Prisma speech-to-text and Timbre text-to-speech. See the [official programme page](https://www.gnani.ai/internship) for current terms and [DEMO.md](DEMO.md) for the recording plan.
