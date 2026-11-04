# IssueWeaver for coding assistants

Turn a rough bug description or transcript into a reviewable six-field Markdown report. Report fields contain only facts the reporter supplied. The title may summarize the reported symptom; expected behaviour stays unknown unless the reporter states it. Incomplete reproduction sequences are labeled `Partial` and are not completed with guessed steps.

| Assistant | Install | Invoke |
| --- | --- | --- |
| Codex | Open this repository in Codex, or copy `.agents/skills/issueweaver` into your project's `.agents/skills/`. | Select `$issueweaver` and add your description. |
| Claude Code | Open this repository in Claude Code, or copy `.claude/skills/issueweaver` into your project's `.claude/skills/`. | Type `/issueweaver` and add your description. |
| OpenClaw | Copy `skills/issueweaver` into the agent's configured workspace under `skills/`. Start a fresh session after installing. | In OpenClaw, ask “Use the issueweaver skill to draft a bug report” and add your description. |

Copy the whole skill folder. Use an assistant you already have configured. The skill itself needs no additional account, API key, or dependency. It produces a draft. Review it before pasting it into your tracker. For audio capture, sign-in, or cloud saving, use the [IssueWeaver web app](https://issueweaver.netlify.app/).

## Try the same example on all three

Start with: “After I click Sign in with Google and pick my account, the page goes blank. It happens every time.” In the default guided flow, the assistant should ask one focused question about an important missing detail, such as: “What did you expect to happen?” The reporter answers: “I expected to see the dashboard. Chrome on Windows 11.” (That reply also supplies the environment.)

The assistant should then produce a report like [this sample](sample-report.md). It may summarize the symptom in the title, but should not invent reproduction actions, a cause, or any other field value. To try immediate draft behavior, repeat with the original input and explicitly ask for the draft now: all six headings should appear, with unknown fields marked `Not provided`.

When updating the workflow, keep the three skill bodies aligned. The OpenClaw copy adds its invocation flag in front matter.
