# QA Design

根據 spec 一次產出測試情境（scenarios）與測試案例（test cases）。

## Goal

讀取：

```txt
qa-workspace/specs/{feature}/spec.md
qa-workspace/specs/{feature}/questions.md
qa-knowledge/glossary.md
qa-knowledge/test-strategy.md
qa-knowledge/risk-rules.md
qa-workspace/schemas/testcase.schema.json
```

產出或更新：

```txt
qa-workspace/specs/{feature}/scenarios.md
qa-workspace/specs/{feature}/plan.md
qa-workspace/specs/{feature}/tasks.md
qa-workspace/specs/{feature}/test-cases.json
```

Arguments:

```txt
$ARGUMENTS
```

## Steps

### Step 1 — 產出 scenarios.md

依 Given / When / Then 格式產出測試情境，涵蓋：
- Happy path（正常流程）
- Negative path（錯誤 / 例外）
- Boundary path（邊界條件）
- Security / permission path（權限相關，若適用）

若 questions.md 有未釐清項目，以 QA Assumption 標記並繼續，不要停下來等待。

同時產出 `plan.md`（測試計畫摘要）與 `tasks.md`（PM / QA / Engineering / AI 後續待辦）。

### Step 2 — 產出 test-cases.json

根據 Step 1 產出的 scenarios.md，產出結構化測試案例：
- 每個 TC 給唯一 ID
- 標記 `automation_candidate`
- 預設自動化目標為 Cypress；API / 後端驗證才用 pytest
- 不發明 spec 以外的規則；需求不完整時加備註，不要猜測

## Rules

- 若 spec.md 不存在，停止並告知使用者先執行 `/QA-1-import-pm-request`
- questions.md 的未釐清項目用 QA Assumption 標記，不阻擋流程
- 不重複讀取已產出的 scenarios.md，Step 2 直接沿用 Step 1 的結果
- 兩個 Step 連續執行，不需使用者確認中間步驟
