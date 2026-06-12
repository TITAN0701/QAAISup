# PM Report

審查並匯出 PM 發布摘要報告。

## Goal

審查或改善 PM 報告，確認後匯出 Word 文件：

```txt
artifacts/generated/pm/release-summary.md
artifacts/generated/pm/release-summary.docx
```

Arguments:

```txt
$ARGUMENTS
```

## Steps

### Step 1 — 讀取現有報告

讀取 `artifacts/generated/pm/release-summary.md`。

若檔案不存在或內容為空，告知使用者：「尚未產出 release-summary.md，請先執行 /QA-6-generate-report。」直接結束。

### Step 2 — 審查內容

檢查以下項目：
- 功能清單是否完整（對照 `qa-workspace/specs/` 下的 feature 數量）
- 各功能狀態是否正確（Not Evaluated / Passed / Failed / Blocked）
- 發布風險說明是否清楚
- 是否有需要 PM 決策的未決事項

列出審查結果，若有問題項目逐一說明。

### Step 3 — 確認或修正

若報告內容有誤或過期，詢問使用者是否要重新產出（執行 `/QA-6-generate-report`）或手動修正。

### Step 4 — 匯出 Word

報告確認後執行：

```powershell
.\scripts\export-pm-report-docx.ps1
```

回報匯出結果與檔案路徑。

## Rules

- PM 報告欄位保持中文
- 狀態值保持英文：`Not Evaluated`、`Passed`、`Failed`、`Blocked`
- 不捏造 Pass/Fail 結果，數據必須來自實際執行
- 不包含 stack trace 或技術細節
- 報告重點：發布風險、受影響功能、需要 PM 決策的事項、客戶端注意事項
- 若原始執行結果缺失，明確說明「無法評估」
