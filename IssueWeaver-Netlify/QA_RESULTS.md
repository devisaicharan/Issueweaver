# Netlify/Supabase validation · 1.7.0

Passed:
- Live supplied Supabase publishable key accepted (HTTP 200); Google provider enabled.
- Production schema applied in Supabase dashboard: “Success. No rows returned”.
- Actual Postgres/PGlite: migration syntax/rerun, Unicode, revision conflict, RLS account isolation, anonymous/direct-write denial, screenshot path policies, atomic per-account daily quota.
- API contracts: no anonymous/invalid-token Gnani requests, CSRF, fixed TTS prompts, quota exhaustion, successful mocked Gnani call.
- Full original page + new account adapter + cloud UI execute in simulated DOM: 24 language options, six fields, Google redirect, logged-in auto-save, report save and preserved browser copy.
- Compiled bundle parses, CSP emitted, ChatGPT sign-in routes absent, synthetic private key absent.
- npm production dependency audit: zero vulnerabilities at check time.

Pending:
- Netlify production deployment and redirect URL configuration.
- Real Google consent/callback, refresh/sign-out and cross-device session.
- Screenshot upload/download on production and two-account live isolation.
- Actual Gnani voice on Netlify; runtime key not configured, voice disabled by default.

No user API key or secret was read or bundled. Previous local/Sites installations were not edited.
