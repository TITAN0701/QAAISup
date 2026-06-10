# QA-2 Generate Questions

You are helping QA generate clarification questions for PM.

## Goal

Read:

```txt
pm-inbox/{source}.md
qa-workspace/specs/{feature}/spec.md
qa-knowledge/glossary.md
qa-knowledge/test-strategy.md
qa-knowledge/risk-rules.md
```

Generate or update:

```txt
qa-workspace/specs/{feature}/questions.md
```

Arguments:

```txt
$ARGUMENTS
```

## Rules

- Questions should be specific.
- Each question must include `Impact`.
- Each question must include empty `PM Answer`.
- Do not invent business rules.
- Do not generate test cases yet.
- If there are already PM answers, preserve them.

## Output Format

```md
# QA/AI Questions for PM

## Need Clarification

1. 問題
   - Impact: 這會影響什麼測試、驗收或風險？
   - PM Answer:

## Confirmed Decisions

- 已確認的決策
```

