# IssueWeaver setup

Application source for [IssueWeaver](https://issueweaver.netlify.app/). See the [project README](../README.md) for features and usage.

## Build

Requires Node.js 22 or newer.

```bash
npm ci
npm run build
npm test
```

## Supabase

1. Create a Supabase project and apply [supabase/setup.sql](supabase/setup.sql). It creates the report tables, account policies, voice quota functions and private screenshot bucket.
2. Enable Google under Authentication providers and configure its OAuth credentials.
3. In Google Cloud, use your Supabase callback as the authorized redirect URI:
   `https://<project-ref>.supabase.co/auth/v1/callback`.
4. In Supabase URL Configuration, set Site URL to your deployed app origin and add that origin followed by `/` to Redirect URLs.
5. Configure Google consent access for your intended users before public release.

Use your own Supabase project and publishable key. For an existing database, review schema changes before applying them; use migrations for subsequent changes.

## Netlify

Connect the repository and use:

| Setting | Value |
| --- | --- |
| Base directory | IssueWeaver-Netlify |
| Build command | npm run build |
| Publish directory | public |
| Functions directory | netlify/functions |
| Node version | 22 or newer |

Set these environment variables:

| Variable | Purpose |
| --- | --- |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_PUBLISHABLE_KEY` | Public client key for that project |
| `GNANI_API_KEY` | Secret key with speech-to-text and text-to-speech access |
| `VOICE_ENABLED` | `true` to enable voice; `false` for typed reporting only |

Supabase configuration must be available during builds and to functions. Keep the Gnani key secret and available to functions. Redeploy after changing environment values.

Static drag-and-drop deployment alone is insufficient because voice requires server functions.

The optional Windows helper, `DEPLOY-NETLIFY.bat`, creates or links a Netlify project. It initializes `VOICE_ENABLED=false`; review its settings before using it on an existing site.

## Check your deployment

Open the site in a signed-out browser. Confirm typed reporting works, then sign in with Google and test a spoken question, microphone transcription, report save/reopen, screenshot upload/download and Markdown export. Test a second account to confirm report isolation.

The three automated test suites cover server contracts, Postgres policies through PGlite, and simulated client flows. They use mocked external services or simulated auth/storage schemas and do not replace live deployment checks.
