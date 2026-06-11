# Prompt: Generate Test Plan

用途：根據已整理的 spec、scenarios 與 QA 規則，產生測試計畫與風險筆記。

## Input

```txt
qa-workspace/specs/{feature}/spec.md
qa-workspace/specs/{feature}/scenarios.md
qa-knowledge/test-strategy.md
qa-knowledge/risk-rules.md
```

## Output

```txt
artifacts/generated/qa/test-plan.md
artifacts/generated/qa/risk-notes.md
```

## Required Content

- Test Scope：本次要測的範圍
- Out of Scope：本次不測的範圍
- Test Types：E2E、API、Regression、Negative、Boundary 等
- Test Data：需要哪些測試資料
- Automation Candidate：哪些案例適合自動化
- Risk：主要風險與 release 影響

## Rules

- 只根據已確認的 spec 與 PM answer 產生計畫。
- 如果需求尚未確認，標示為待釐清，不要自行假設。
- 高風險項目要明確寫出原因。
