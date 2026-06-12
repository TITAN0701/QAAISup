# Rubric: test-cases.json 品質評估

每次 AI 產出 test-cases.json 後，對照以下標準自我評分。

## 評分項目

| # | 檢查項目 | 通過條件 | 權重 |
|---|---------|---------|------|
| 1 | **唯一 ID** | 每個 TC 有唯一且格式正確的 ID（如 TC-LOGIN-001） | 高 |
| 2 | **automation_candidate 標記** | 每個 TC 都有 `automation_candidate: true/false` | 高 |
| 3 | **scenarios 對應** | 每個 TC 對應 scenarios.md 的至少一個情境 | 高 |
| 4 | **步驟完整** | 每個 TC 有 steps 陣列，至少 2 個步驟 | 中 |
| 5 | **預期結果明確** | 每個 TC 有 `expected_result`，可驗證 | 高 |
| 6 | **風險等級標記** | 每個 TC 有對應 risk-rules.md 的風險等級 | 中 |
| 7 | **不可自動化原因** | `automation_candidate: false` 的 TC 有說明原因 | 中 |

## 評分方式

- 高權重 ❌ 任何一項 → 標記 `TC_INVALID`，不繼續產 automation
- 中權重 ❌ → 補充後繼續
- 通過所有高權重 → 標記 `TC_OK`

## 輸出格式

```
Test Cases Eval: {feature}
✅ 唯一 ID（8 個 TC，格式正確）
✅ automation_candidate（8/8 已標記）
✅ scenarios 對應（8/8 已對應）
✅ 預期結果（8/8 明確）
⚠️ 風險等級（6/8 已標記，2 個缺失）→ 補充為 Medium
結論: TC_OK（繼續產 automation）
```
