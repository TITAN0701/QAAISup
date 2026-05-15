# Prompt: Generate Questions

用途：根據 PM inbox 或 `spec.md`，產生 QA/AI 要回拋給 PM 的釐清問題。

## Input

```txt
pm-inbox/{feature}.md
qa-workspace/specs/{feature}/spec.md
qa-knowledge/test-strategy.md
qa-knowledge/risk-rules.md
```

## Output

```txt
qa-workspace/specs/{feature}/questions.md
```

## Rules

- 問題要具體，不要問太大範圍。
- 每個問題都要包含 `Impact`，說明會影響哪個測試、驗收或風險。
- 不要自行補 PM 沒有確認的商業規則。
- 如果資訊不足，提出問題，不要直接產生測試碼。
- PM 只需要填寫每題的 `PM Answer`。

## Output Format

```md
# QA/AI Questions for PM

## Need Clarification

1. 問題
   - Impact: 這會影響什麼測試或驗收？
   - PM Answer:

## Confirmed Decisions

- 已確認的決策
```
