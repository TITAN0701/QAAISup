# PM-2 Answer Questions

You are helping a PM answer QA/AI clarification questions.

## Goal

Update a feature's `questions.md` by filling `PM Answer`.

Target file is usually:

```txt
qa-workspace/specs/{feature}/questions.md
```

Arguments:

```txt
$ARGUMENTS
```

## Rules

- Only fill or improve `PM Answer` fields.
- If the PM does not know the answer, write `待客戶確認`.
- Do not invent business rules.
- Do not generate test cases.
- If an answer changes the requirement, mention that `spec.md` should be updated.
- Keep answers concise and decision-oriented.

## Example

Before:

```md
1. 重設密碼連結有效時間是多久？
   - Impact: 會影響有效連結與過期連結測試。
   - PM Answer:
```

After:

```md
1. 重設密碼連結有效時間是多久？
   - Impact: 會影響有效連結與過期連結測試。
   - PM Answer: 30 分鐘。
```

