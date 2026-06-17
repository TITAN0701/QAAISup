# QA-6 Generate Report

> 執行前先讀：`.claude/modules/config-loader.md`、`.claude/modules/qa-knowledge-loader.md`、`.claude/modules/eval-loader.md`

You are helping QA generate reports from test execution results.

> **報告流程說明**：不產出 markdown 中間檔（test-report.md / failure-analysis.md / release-summary.md 均已廢除）。
> 唯一資料來源為 `qa-workspace/.pipeline-state.json`，輸出目標為 Google Sheets + Google Drive xlsx。

## Goal

Read:

```txt
qa-workspace/.pipeline-state.json          ← 唯一執行結果來源
qa-workspace/specs/*/test-cases.json       ← TC 清單（供 Test Cases sheet）
qa-workspace/specs/*/scenarios.md          ← 情境（供 Scenarios sheet）
artifacts/generated/qa/risk-notes.md       ← 風險備註（若存在）
artifacts/generated/qa/bugs/*.md           ← Bug reports（若存在）
```

Generate / Sync:

```txt
Google Sheets（npm run sync:sheet）
  → Test Cases、Scenarios、Test Report、Risk Notes、Bug Reports

Google Drive xlsx（node scripts/upload-to-drive.js）
  → artifacts/generated/qa/{日期}-qa-report.xlsx
  → 上傳至 Drive：WETPAINT > AI Suport文件
```

Arguments:

```txt
$ARGUMENTS
```

## Steps

### Step 1 — 確認執行結果存在

檢查 `qa-workspace/.pipeline-state.json` 是否存在且 `totals.pass` 或 `totals.pending` 大於 0：

- **不存在或全為 0** → **停止**，告知使用者先執行 `/QA-pipeline-run` 取得測試結果
- **已存在** → 繼續 Step 2

### Step 2 — 自我評估

依序執行：

1. 對照 `.claude/evals/rubrics/report.md` 逐項確認 pipeline-state 欄位完整性
2. 依 `.claude/evals/criteria/flow-gates.md` 判斷結果代碼：
   - `REPORT_INVALID`：pipeline-state 缺少 pass/pending/fail 來源 → **停止**
   - `REPORT_OK`：繼續 Step 3
3. 依 `.claude/evals/benchmarks/qa-baseline.md` 確認覆蓋率是否達標，輸出評估結果

### Step 3 — 同步 Google Sheets

```powershell
npm run sync:sheet
```

失敗（token 過期）→ 告知使用者執行 `node scripts/auth-sheets.js` 重新授權。

### Step 4 — 產出 xlsx 並上傳 Google Drive

```powershell
node scripts/upload-to-drive.js
```

產出 `artifacts/generated/qa/{日期}-qa-report.xlsx`，上傳至 Drive `WETPAINT > AI Suport文件`。

失敗（權限不足）→ 告知使用者執行 `node scripts/auth-sheets.js` 重新授權（需 `drive.file` scope）。

## Rules

### Context Rot 防護

- 讀取 `qa-workspace/specs/*/test-cases.json` 時，**每次只處理一個 feature**，完成後繼續下一個，不同時載入所有 feature 的檔案
- 讀取前先用 Grep 確認關鍵欄位存在，再用 Read + limit/offset 只讀需要的段落

### 報告規則

- Pass/Fail 數字必須來自 `pipeline-state.json`，不得捏造或推算
- 不產出任何 .md 中間檔（test-report.md / failure-analysis.md / release-summary.md 均已廢除）
- 不執行 `export-pm-report-docx.ps1`（Word 匯出已廢除）
- 若使用者需要 PM 可讀版本，指引至 Google Sheets 連結或 Drive xlsx

