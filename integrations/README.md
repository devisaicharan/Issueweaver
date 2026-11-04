# IssueWeaver for coding assistants

Turn a rough bug description or transcript into a reviewable six-field Markdown report. The skill keeps unknown details visible and uses the same section headings as the web app's Markdown export.

| Assistant | Install | Invoke |
| --- | --- | --- |
| Codex | Open this repository in Codex, or copy `.agents/skills/issueweaver` into your project's `.agents/skills/`. | Select `$issueweaver` and add your description. |
| Claude Code | Open this repository in Claude Code, or copy `.claude/skills/issueweaver` into your project's `.claude/skills/`. | Type `/issueweaver` and add your description. |
| OpenClaw | Copy `skills/issueweaver` into the agent's configured workspace under `skills/`. Start a fresh session after installing. | In OpenClaw, ask “Use the issueweaver skill to draft a bug report” and add your description. |

Copy the whole skill folder. Use an assistant you already have configured. The skill itself needs no additional account, API key, or dependency. It produces a draft. Review it before pasting it into your tracker. For audio capture, sign-in, or cloud saving, use the [IssueWeaver web app](https://issueweaver.netlify.app/).

## Try the same example on all three

1. **Input:** “After I click Sign in with Google and pick my account, the page goes blank. It happens every time.”
2. **Expected follow-up:** Ask for the browser and device or build. Give “Chrome on Windows 11. I expected to see the dashboard.”
3. **Expected draft:** Compare with [this sample](sample-report.md). Wording may vary. The report should include the known reproduction steps and avoid claiming a cause. Ask for a draft immediately to try the missing-detail path.

When updating the workflow, keep the three skill bodies aligned. The OpenClaw copy adds its invocation flag in front matter.
