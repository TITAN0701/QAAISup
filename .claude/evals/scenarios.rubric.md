# Rubric: scenarios.md 品質評估

每次 AI 產出 scenarios.md 後，對照以下標準自我評分。

## 評分項目

| # | 檢查項目 | 通過條件 | 權重 |
|---|---------|---------|------|
| 1 | **Happy path 覆蓋** | 至少 1 個完整的正常流程情境 | 高 |
| 2 | **Negative path 覆蓋** | 至少 2 個失敗或錯誤情境 | 高 |
| 3 | **Given/When/Then 格式** | 所有情境均使用 G/W/T 格式 | 高 |
| 4 | **Boundary 覆蓋** | 涉及數值或格式限制時有邊界情境 | 中 |
| 5 | **驗收標準對應** | spec.md 的每條 acceptance criteria 至少對應 1 個情境 | 高 |
| 6 | **角色標注** | 每個情境有標注執行角色 | 中 |
| 7 | **測試資料說明** | 需要特定資料的情境有說明測試資料需求 | 低 |

## 評分方式

- 高權重 ❌ 超過 2 項 → 標記 `SCENARIOS_INCOMPLETE`，重新產出
- 高權重 ❌ 為 1 項 → 標記 `QA Assumption` 補充說明後繼續
- 只有中低權重缺失 → 繼續，在 scenarios.md 頂部標記缺失項

## 輸出格式

```
Scenarios Eval: {feature}
✅ Happy path（2 個情境）
✅ Negative path（3 個情境）
✅ Given/When/Then 格式
⚠️ Boundary（有年齡邊界，但未測 0 歲邊界）→ 補充 1 條情境
✅ 驗收標準對應（5/5 條已覆蓋）
結論: SCENARIOS_OK（繼續）
```
