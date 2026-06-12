# Rubric: automation (.cy.ts / .py) 品質評估

每次 AI 產出 Cypress 或 pytest 檔案後，對照以下標準自我評分。

## 評分項目（Cypress .cy.ts）

| # | 檢查項目 | 通過條件 | 權重 |
|---|---------|---------|------|
| 1 | **無 data-testid** | 沒有任何 `[data-testid="..."]` selector | 高 |
| 2 | **無硬寫憑證** | 沒有帳號、密碼、電話號碼的字串字面量 | 高 |
| 3 | **無硬寫 URL** | 沒有完整 URL 字串，使用相對路徑或 env var | 高 |
| 4 | **SDET TODO 標記正確** | 不確定的 selector 使用 `it.skip()` + `[SDET TODO]` | 高 |
| 5 | **TC ID 對應** | 每個 `it()` 標題包含對應的 TC ID | 中 |
| 6 | **截圖呼叫** | 每個 test 結尾有 `cy.screenshot()` | 中 |
| 7 | **intercept 設在 visit 前** | API intercept 設定在 `cy.visit()` 之前 | 中 |
| 8 | **viewport 設定** | beforeEach 有 `cy.viewport()` | 低 |

## 評分項目（pytest .py）

| # | 檢查項目 | 通過條件 | 權重 |
|---|---------|---------|------|
| 1 | **BASE_URL 使用 env var** | `os.environ.get("API_BASE_URL")` 而非硬寫 | 高 |
| 2 | **無硬寫憑證** | 帳密從 env var 讀取 | 高 |
| 3 | **TC ID 對應** | 每個 test function 名稱包含 TC ID | 中 |

## 評分方式

- 高權重 ❌ 任何一項 → 標記 `AUTOMATION_BLOCKED`，必須修正後才可提交
- 中低權重 ❌ → 標記並繼續，列入 SDET review 清單

## 輸出格式

```
Automation Eval: {feature}.cy.ts
✅ 無 data-testid
✅ 無硬寫憑證
✅ 無硬寫 URL
⚠️ 3 個 TC 使用 it.skip()（selector 未確認）→ 已加 [SDET TODO]
✅ TC ID 對應（8/8）
結論: AUTOMATION_OK（可提交，SDET 需確認 3 個 skip）
```
