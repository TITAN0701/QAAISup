# Prompt: Generate Report

用途：根據測試框架或 CI 產生的 raw report，產生 QA 與 PM 報告。

## Input

```txt
artifacts/raw/
```

可能包含：

```txt
artifacts/raw/allure-results/
artifacts/generated/allure-report/
screenshots/
videos/
logs/
GitHub Actions log
```

## Output

```txt
artifacts/generated/qa/test-report.md
artifacts/generated/qa/failure-analysis.md
artifacts/generated/pm/release-summary.md
artifacts/generated/pm/release-summary.docx
```

## Rules

- 不可自行創造 pass / fail 結果。
- Pass / fail 必須來自 raw report。
- 需要整理失敗測試、可能原因、風險與建議 owner。
- PM 摘要要避免過多 stack trace 與技術細節。
- 如果 raw report 不足，明確標示無法判斷。

## Report Focus

- QA report：測試數量、失敗案例、錯誤訊息、trace 或 screenshot 連結。
- Failure analysis：失敗分類、可能原因、建議 owner、是否建議重跑。
- PM summary：整體狀態、主要風險、是否建議 release。

## PM Summary Format

PM summary 請輸出到：

```txt
artifacts/generated/pm/release-summary.md
```

必須包含：

- 整體狀態
- 摘要說明
- 測試結果統計
- 發布建議
- 受影響功能
- 主要風險
- 需要 PM 決策
- 對外說明建議
- 相關連結

PM summary 不要包含大量 stack trace、selector、API response body 或 framework log。

PM summary 欄位名稱使用中文；只有狀態值使用英文，例如 `Not Evaluated`、`Passed`、`Failed`、`Skipped`、`Blocked`。

PM Word 版本由匯出腳本產生：

```powershell
.\scripts\export-pm-report-docx.ps1
```

AI 仍先產生 Markdown，Word docx 作為 PM 傳閱版本。
