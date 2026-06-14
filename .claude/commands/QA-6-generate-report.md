# QA-6 Generate Report

> 執行前先讀：`.claude/modules/config-loader.md`、`.claude/modules/qa-knowledge-loader.md`、`.claude/modules/eval-loader.md`

You are helping QA generate QA and PM reports from test execution results.

## Goal

Read:

```txt
artifacts/raw/allure-results/
artifacts/generated/allure-report/
qa-workspace/specs/*/test-cases.json
qa-knowledge/glossary.md
CI logs if available
```

Generate:

```txt
artifacts/generated/qa/test-cases.md       ← 所有 feature TC 彙整（人讀版）
artifacts/generated/qa/test-report.md
artifacts/generated/qa/failure-analysis.md
artifacts/generated/pm/release-summary.md
```

Then export:

```txt
artifacts/generated/pm/release-summary.docx
```

Then sync to Google Sheets:

```powershell
npm run sync:sheet
```

Then upload dated xlsx to Google Drive (WETPAINT > AI Suport文件):

```powershell
npm run upload:drive
```

Arguments:

```txt
$ARGUMENTS
```

## Steps

### Step 1 — 產出報告

依 Goal 中定義的輸入來源產出 test-cases.md、test-report.md、failure-analysis.md、release-summary.md。

### Step 2 — 自我評估

產出完成後，依序執行評估：

1. 對照 `.claude/evals/rubrics/report.md` 逐項檢查 test-report.md 與 release-summary.md
2. 依 `.claude/evals/criteria/flow-gates.md` 判斷結果代碼
3. 依 `.claude/evals/benchmarks/qa-baseline.md` 確認覆蓋率是否達標
4. 輸出評估結果

若結果為 `REPORT_INVALID`，**停止**，不匯出 Word，告知使用者先取得 execution-results.json 後再重跑。

### Step 3 — 匯出與同步

評估結果為 `REPORT_OK` 後才執行匯出與同步。

## Rules

### test-cases.md 產出規則

從 `qa-workspace/specs/*/test-cases.json` 讀取所有 feature 的測試案例，產出 `artifacts/generated/qa/test-cases.md`，格式如下：

```md
# Test Cases 彙整

> 自動產出，請勿手動編輯。來源：`qa-workspace/specs/*/test-cases.json`
> 最後更新：{產出時間}

## 統計

| Feature | 總數 | High | Medium | Low | 可自動化 | 自動化率 |
|---------|------|------|--------|-----|---------|---------|
| login   | n    | n    | n      | n   | n       | xx%     |
| ...     |      |      |        |     |         |         |
| **合計** | n   | n    | n      | n   | n       | xx%     |

---

## {feature}

> 來源：`qa-workspace/specs/{feature}/test-cases.json`

| ID | 標題 | 優先度 | 類型 | 自動化 |
|----|------|--------|------|--------|
| TC-LOGIN-001 | 正常登入流程 | high | e2e | ✅ |
| TC-LOGIN-002 | 密碼錯誤 | medium | e2e | ✅ |
| TC-LOGIN-003 | 帳號不存在 | medium | e2e | ⚠️ |
```

自動化欄位規則：
- `automation_candidate: true` → ✅
- `automation_candidate: false` → ❌
- 欄位不存在 → ⚠️（待評估）

不在 md 展開 steps / preconditions / expected，保留在 JSON。

### 報告規則

- Do not invent pass/fail results.
- Pass/fail must come from Cypress, pytest, CI, or Allure.
- PM report fields should be Chinese.
- PM report status values should remain English.
- QA report may include technical details.
- PM report should summarize release risk, impacted features, PM decisions needed, and customer-facing notes.
- Use `.\scripts\export-pm-report-docx.ps1` to export Word after Markdown is ready.

