# Reporting Standard

本專案統一使用 Allure 作為測試報告格式。

## Raw Report Location

所有測試框架應輸出 raw result 到：

```txt
artifacts/raw/allure-results/
```

Allure HTML report 輸出到：

```txt
artifacts/generated/allure-report/
```

## Cypress Output

Cypress 測試應輸出：

```txt
artifacts/raw/allure-results/
```

建議每個測試案例包含：

- feature name
- test case id
- priority
- screenshot on failure
- video or trace if available

## pytest Output

pytest 測試應輸出：

```txt
artifacts/raw/allure-results/
```

建議每個測試案例包含：

- feature name
- API endpoint
- request payload summary
- response status
- assertion failure detail

## AI Report Input

AI 產生測試報告時，只能讀取：

```txt
artifacts/raw/allure-results/
artifacts/generated/allure-report/
```

以及 CI log。

AI 不可自行創造：

- passed count
- failed count
- skipped count
- failed reason

## AI Report Output

AI 可產生：

```txt
artifacts/generated/qa/test-report.md
artifacts/generated/qa/failure-analysis.md
artifacts/generated/pm/release-summary.md
artifacts/generated/pm/release-summary.docx
```

PM summary 應聚焦：

- 是否有阻擋 release 的風險
- 哪些功能受影響
- 是否需要 PM 或客戶決策

PM summary 欄位名稱使用中文，狀態值才使用英文。

範例：

```txt
整體狀態: Not Evaluated
測試結果統計: Passed / Failed / Skipped / Blocked
發布建議: Approved / Blocked / Not Evaluated
```

QA report 應聚焦：

- failed tests
- error message
- likely owner
- retry recommendation
- related screenshots or logs

## Report Audience

| Report | Audience | Purpose |
|---|---|---|
| `artifacts/generated/pm/release-summary.md` | PM / lead | release 風險與決策摘要 |
| `artifacts/generated/pm/release-summary.docx` | PM / lead / customer-facing owner | Word 版本，方便傳閱與留存 |
| `artifacts/generated/qa/test-report.md` | QA | 測試結果與失敗案例 |
| `artifacts/generated/qa/failure-analysis.md` | QA / Engineer | 失敗分類、可能原因與建議 owner |
| `artifacts/generated/allure-report/` | QA / Engineer | Allure HTML 詳細報告 |

PM 版本報告不應包含大量 stack trace。若需要技術細節，應連結到 QA report 或 Allure report。

## PM Word Report

PM 報告流程：

```txt
AI 產生 release-summary.md
        ↓
QA/PM 確認內容
        ↓
匯出 release-summary.docx
```

執行：

```powershell
.\scripts\export-pm-report-docx.ps1
```

Markdown 是內部版本控管來源，Word 是 PM 對外傳閱或留存版本。
