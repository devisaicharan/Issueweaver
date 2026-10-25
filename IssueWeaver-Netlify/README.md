# IssueWeaver 1.7.0 · Netlify + Supabase

A guided multilingual voice/text bug reporter with six directly supplied fields, original transcript history, review/edit, Markdown export, browser recovery, Google sign-in, private account reports and screenshots. This is the standalone public-hosting edition, independent of ChatGPT accounts. Google OAuth must complete setup on the real production domain before public use.

## Windows deployment

Extract into a new folder. Run **DEPLOY-NETLIFY.bat** with Node.js 22+ installed. It installs pinned dependencies, builds, asks you to log in to Netlify, creates/links a project via Netlify's normal prompts, sets the public Supabase configuration, and deploys the frontend AND server functions. Choose a **new IssueWeaver site**, never the existing CampusOS site. Review the selected site carefully before approving production deployment. The CLI uses your normal account login; credentials are not included in this project.

Do not use static drag-and-drop deployment: the app requires the included server function. For Git-based builds, use `npm run build`, publish `public`, functions `netlify/functions`; `netlify.toml` declares these settings.

## Supabase setup

Project: `https://flyxghrdeldpnlgwgoyg.supabase.co`.
Google provider was enabled by the owner. `supabase/setup.sql` creates only IssueWeaver-prefixed tables/functions/policies and a private screenshot bucket, transactionally. It was applied successfully through the Supabase dashboard on 25 October 2026. The schema file is included for reproducibility; do not casually edit an applied migration. Future schema changes should use new migrations.

After deployment, in **Authentication → URL Configuration**, set Site URL to your exact Netlify origin and allow that same origin followed by `/` in Redirect URLs. Google Cloud's Authorized redirect URI remains the **Supabase callback** (`https://<project-ref>.supabase.co/auth/v1/callback`), not the Netlify URL. The app requests Google sign-in with PKCE through the official Supabase SDK and redirects back to the origin root.

Google consent configuration was in External/Testing mode at the last owner screenshot. Review Branding/Audience, add your test accounts as appropriate, and complete production publishing requirements before broad release. No additional Google API scopes such as Drive/Gmail are requested by this app.

## Voice environment

Set in Netlify with Functions runtime scope:

- `SUPABASE_URL`: project origin above.
- `SUPABASE_PUBLISHABLE_KEY`: public browser-safe key in `.env.example`.
- `GNANI_API_KEY`: your actual Gnani key; enter only in Netlify, never source/chat.
- `VOICE_ENABLED`: starts `false`; enable `true` after login/database tests.

Redeploy after environment changes. Function verifies each supplied bearer token with Supabase's user endpoint. Anonymous and invalid users cannot call Gnani. Each account has 20 voice requests per UTC day, enforced atomically in Postgres; failed upstream calls still count. Netlify IP/domain rate protection is also declared. This is a per-account allowance, not a global spending cap.

Uploads are limited to 4 MB for Netlify binary request overhead; microphone recordings remain up to 55 seconds. Gnani upstream timeout is 45 seconds, leaving room for auth/quota checks in Netlify's function limit. Speech is available in 10 documented languages; 22 scheduled Indian languages + English + Other support typed input. No automatic translation or inference is performed.

## Private data and recovery

RLS scopes reports to Supabase user ID. Clients cannot directly insert/update/delete report rows: validated RPCs apply optimistic revision checks and a 500-record account cap (including draft). Screenshot storage policies require an account path and an owned report. Buckets are private, allow PNG/JPEG/WebP up to 5 MB, and use authenticated downloads. Screenshot signatures are checked by the app before upload; Supabase enforces bucket MIME/size and account ownership. This is not malware scanning.

The official SDK stores the login session locally and refreshes it. Browser report keys (`iw-draft`, `iw-saved`) remain recovery copies; signing out retains them on that device. A shared-device user can see these browser copies. Cloud content is hidden on sign-out and separately protected by RLS. Audio is sent through the server to Gnani and is not saved by IssueWeaver.

Cloud drafts auto-save after edits; existing cloud drafts require an explicit restore/continue choice. Conflicts pause cloud writes instead of overwriting another device. Reports/screenshots can be reopened/downloaded/deleted. Deletion removes a screenshot before deleting its report; if storage deletion fails, report deletion stops. Direct RPC deletion outside the app can leave inaccessible orphaned storage objects for owner cleanup.

## Existing data

The ChatGPT-hosted app and local Windows edition remain separate and intact. Their users, reports and screenshot buckets are not automatically migrated to Supabase. A new origin cannot read another origin's localStorage. The import button copies reports already present in the new origin, using deterministic IDs; it does not reach into the old Site or localhost. Keep old exports until a deliberate migration is completed. No passwords/API keys or pre-existing report data are bundled.

## Build and checks

`npm ci`, `npm run build`, `npm test`.
Tests use actual Postgres via PGlite with simulated Supabase auth/storage schemas, and mocked network/SDK contracts. They cover schema reruns, user isolation, direct-write denial, revision conflict, Unicode, quota, server auth/origin/prompt guards, bundle syntax, and full UI initialization/login redirect/autosave/save in a simulated DOM. These tests do not prove a successful live Google login, deployed Netlify function operation, or live Gnani transcription. Complete those after deployment.

## Final device checks

Sign in with Google, create six answers, review/save, reload/restore, reopen cloud report, upload/download screenshot, sign out, sign in on another device, and repeat with a different account to check isolation. Enable voice only after these pass; check record/upload, spoken prompt, invalid audio and error recovery. Do not call public setup complete before these checks.
