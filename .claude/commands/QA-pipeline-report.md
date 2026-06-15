# QA Pipeline: Report

> 執行前先讀：`.claude/modules/config-loader.md`、`.claude/modules/qa-knowledge-loader.md`、`.claude/modules/eval-loader.md`

依序執行 Google Sheets 同步 → Google Drive xlsx 上傳，完整完成報告產出。
資料來源：`qa-workspace/.pipeline-state.json`（最新 pipeline 結果）。

Arguments:

```txt
$ARGUMENTS
```

---

## Steps

### Step 1 — 確認執行結果存在

檢查 `qa-workspace/specs/*/execution-results.json` 是否存在：

- **不存在** → **停止**，告知使用者先執行 `/QA-pipeline-run` 取得測試結果
- **已存在** → 繼續 Step 2

### Step 2 — 同步 Google Sheets

執行：

```powershell
npm run sync:sheet
```

分頁內容：
- `Test Cases`：來源 `qa-workspace/specs/*/test-cases.json`
- `Scenarios`：來源 `qa-workspace/specs/*/scenarios.md`
- `Test Report`：來源 `qa-workspace/.pipeline-state.json`（最新 Pass/Pending/Fail）
- `Risk Notes`：來源 `artifacts/generated/qa/risk-notes.md`（若無則 0 筆）
- `Bug Reports`：來源 `artifacts/generated/qa/bugs/*.md`

同步失敗（token 過期）→ 告知使用者執行 `node scripts/auth-sheets.js` 重新授權。

### Step 3 — 產出 xlsx 並上傳 Google Drive

執行：

```powershell
node scripts/upload-to-drive.js
```

產出 `artifacts/generated/qa/{日期}-qa-report.xlsx`，上傳至 Drive `WETPAINT > AI Suport文件`。

Sheet 內容與 Step 2 相同，額外包含 `Release Summary` sheet（pipeline pending 分類摘要）。

上傳失敗（權限不足）→ 告知使用者執行 `node scripts/auth-sheets.js` 重新授權（需 `drive.file` scope）。

---

## 完成摘要格式

```
QA Pipeline: Report 完成
✅ Step 1 執行結果  — 已確認（15 個 feature）
✅ Step 2 Google Sheets — 同步完成
   Test Cases: N 筆 / Scenarios: N 筆 / Test Report: N 筆 / Bug Reports: N 筆
✅ Step 3 Google Drive  — 上傳完成
   產出：artifacts/generated/qa/{日期}-qa-report.xlsx
   連結：{Drive 連結}
```
