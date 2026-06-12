# Rubric: 報告品質評估

每次 AI 產出 test-report.md 或 release-summary.md 後，對照以下標準自我評分。

## 評分項目（QA Report）

| # | 檢查項目 | 通過條件 | 權重 |
|---|---------|---------|------|
| 1 | **Pass/Fail 來源正確** | 所有狀態來自 execution-results.json，不是 AI 推斷 | 高 |
| 2 | **覆蓋率計算正確** | 通過數 / 總 TC 數，與 execution-results 一致 | 高 |
| 3 | **Failed TC 有說明** | 每個 Failed TC 有失敗原因說明 | 高 |
| 4 | **Blocked TC 有說明** | Blocked TC 有記錄阻塞原因 | 中 |
| 5 | **風險結論** | 有整體風險評估（可 release / 建議修復後 release / 不建議 release） | 高 |

## 評分項目（PM Release Summary）

| # | 檢查項目 | 通過條件 | 權重 |
|---|---------|---------|------|
| 1 | **語言適合 PM** | 無技術術語，使用功能性描述 | 高 |
| 2 | **結論在最前** | 第一段即說明此次 release 是否建議上線 | 高 |
| 3 | **已知問題列出** | Failed 或 Blocked 的功能有明確列出 | 高 |
| 4 | **不含未執行功能** | 沒有 execution-results 的功能不出現在報告中 | 高 |

## 評分方式

- 高權重 ❌ 任何一項 → 標記 `REPORT_INVALID`，不產出報告，告知使用者缺少執行結果
- 全部高權重通過 → 標記 `REPORT_OK`

## 輸出格式

```
Report Eval: login
✅ Pass/Fail 來源（來自 execution-results.json）
✅ 覆蓋率（5/5 = 100%）
✅ Failed TC 說明（0 個 Failed）
✅ 風險結論（建議 release）
結論: REPORT_OK
```
