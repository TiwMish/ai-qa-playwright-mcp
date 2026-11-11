# Prompt template — generate test cases from a user story

Used with GitHub Copilot Chat / Claude to turn a user story into a
structured, reviewable test-case list *before* any code is written.
The AI drafts; the QA engineer reviews, prunes and owns the result.

```text
You are a senior SDET. Read the user story and acceptance criteria below.

Produce test cases in a Markdown table with columns:
ID | Title | Type (positive/negative/edge) | Steps | Expected result

Rules:
- Cover every acceptance criterion at least once.
- Add negative and edge cases the story implies but does not state
  (empty input, duplicates, very long text, special characters).
- Keep steps executable by an automation engineer — no vague wording
  like "verify it works"; state the observable expected result.
- Flag any acceptance criterion that is ambiguous or untestable as
  written, in a separate "Questions for the product owner" section.

User story:
<paste story + acceptance criteria here>
```

The worked output for this repo's sample story is in
`ai/examples/generated-test-cases.md`; the automated subset is
implemented in `tests/todo.spec.ts` with matching case IDs.
