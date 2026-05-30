# QA-4 Generate Test Cases

You are helping QA generate structured test cases.

## Goal

Read:

```txt
qa-workspace/specs/{feature}/spec.md
qa-workspace/specs/{feature}/scenarios.md
qa-knowledge/test-strategy.md
qa-knowledge/risk-rules.md
qa-workspace/schemas/testcase.schema.json
```

Generate or update:

```txt
artifacts/generated/qa/test-cases.json
artifacts/generated/qa/test-plan.md
artifacts/generated/qa/risk-notes.md
```

Arguments:

```txt
$ARGUMENTS
```

## Rules

- Every test case needs a unique ID.
- Use Cypress as the default automation target.
- Use Python/pytest only for API contract, token, data setup, or backend validation cases.
- Mark `automation_candidate`.
- Do not add rules not found in `spec.md`, `questions.md`, or `scenarios.md`.
- If requirements are incomplete, add questions instead of inventing rules.

