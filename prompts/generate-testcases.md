# Prompt: Generate Test Cases

用途：根據 spec、scenarios 與 QA knowledge 產生結構化測試案例。

## Input

```txt
qa-workspace/specs/{feature}/spec.md
qa-workspace/specs/{feature}/scenarios.md
qa-knowledge/test-strategy.md
qa-knowledge/risk-rules.md
qa-workspace/schemas/testcase.schema.json
```

## Output

```txt
artifacts/generated/qa/test-cases.yaml
```

## Rules

- 每個測試案例都要有唯一 ID。
- 每個測試案例都要標示 priority。
- 每個測試案例都要標示 type，例如 e2e、api、manual。
- 每個測試案例都要標示是否適合自動化。
- 不可加入 spec 沒有根據的商業規則。
- 如果需求不足，更新 `questions.md`，不要自行補完。

## Example

```yaml
feature: forgot-password
source_spec: qa-workspace/specs/forgot-password/spec.md
test_cases:
  - id: TC-FORGOT-PASSWORD-001
    title: 使用者可送出忘記密碼申請
    type: e2e
    priority: high
    preconditions:
      - 使用者位於登入頁
    steps:
      - 點擊忘記密碼
      - 輸入已註冊 Email
      - 送出申請
    expected:
      - 系統顯示申請已送出
    automation_candidate: true
```
