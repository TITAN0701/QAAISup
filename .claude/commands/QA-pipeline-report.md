# QA Pipeline: Report

> 執行前先讀：`.claude/modules/config-loader.md`、`.claude/modules/qa-knowledge-loader.md`、`.claude/modules/eval-loader.md`

依序執行 QA-6 → PM-report，完整完成報告產出到 Word 匯出。
原有指令內容不變，此 pipeline 只負責串聯與 gate 判斷。

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

### Step 2 — 執行 QA-6

載入並執行 `.claude/commands/QA-6-generate-report.md` 的所有步驟。

完成後執行報告評估：
- 結果為 `REPORT_INVALID` → **停止**，告知使用者 Pass/Fail 來源有問題，不繼續匯出
- 結果為 `REPORT_OK` → 繼續 Step 3

### Step 3 — 執行 PM-report

載入並執行 `.claude/commands/PM-report.md` 的所有步驟。

完成後輸出完成摘要。

---

## 完成摘要格式

```
QA Pipeline: Report 完成
✅ Step 1 執行結果  — 已確認
✅ Step 2 QA-6     — REPORT_OK
✅ Step 3 PM-report — 匯出完成
產出：artifacts/generated/qa/test-cases.md
      artifacts/generated/qa/test-report.md
      artifacts/generated/qa/failure-analysis.md
      artifacts/generated/pm/release-summary.md
      artifacts/generated/pm/release-summary.docx
同步：Google Sheets（npm run sync:sheet）
上傳：Google Drive（npm run upload:drive）
```
