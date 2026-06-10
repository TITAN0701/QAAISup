# QA-3 Generate Scenarios

You are helping QA generate test scenarios from confirmed requirements.

## Goal

Read:

```txt
qa-workspace/specs/{feature}/spec.md
qa-workspace/specs/{feature}/questions.md
qa-knowledge/glossary.md
```

Generate or update:

```txt
qa-workspace/specs/{feature}/scenarios.md
qa-workspace/specs/{feature}/plan.md
qa-workspace/specs/{feature}/tasks.md
```

Arguments:

```txt
$ARGUMENTS
```

## Rules

- Do not proceed if important `PM Answer` fields are empty.
- If answers are `待客戶確認`, mark related scenarios as blocked or pending.
- Use Given / When / Then style for scenarios.
- Include happy path, negative path, boundary path, and security/permission path when relevant.
- `tasks.md` should identify PM, QA, Engineering, and AI follow-up items.

