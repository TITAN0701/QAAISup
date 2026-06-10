# Selector Policy

此文件定義 E2E 測試使用 selector 的優先順序。
適用系統：國衛院學齡前兒童發展數位評估系統（wetpaint）

## 目前限制（2026-06-10 起）

**禁止在 `.cy.ts` 中使用 `data-testid` 作為 selector。**

原因：SIT 環境的 DOM 目前尚未加入 `data-testid`，用 `[data-testid="..."]` 會導致測試全部失敗。

**遇到沒有穩定 selector 的元素，一律改用以下替代方案：**

| 情況 | 替代 selector |
|------|-------------|
| input 欄位 | `input[placeholder="實際文字"]` |
| 按鈕 | `cy.contains('button', '按鈕文字')` |
| 連結 | `cy.contains('a', '連結文字')` 或 `a[href="/path"]` |
| 標題確認 | `cy.contains('h1,h2,h3', '標題文字')` |
| 表格欄位 | `cy.get('table thead').within(() => cy.contains('欄位名稱'))` |

若以上替代方案也無法確認 selector，該 TC 改為 `it.skip()`，並在頂部加 `[ENG TASK]` 說明需補哪個屬性。

## Preferred Selector（data-testid 可用後的長期目標）

1. `data-testid`（待工程師補上後再啟用）
2. semantic role，例如 `button`、`input`
3. `placeholder` 或 `label` 文字
4. 穩定且唯一的中文文字（`cy.contains`）

## Avoid

避免使用：

```txt
[data-testid="..."]          ← 目前禁用，DOM 尚未加入
CSS nth-child
不穩定 class name
完整 XPath
依賴畫面位置的 selector
```

## Naming Convention（供未來工程師補 data-testid 參考）

```txt
data-testid="login-email-input"
data-testid="login-password-input"
data-testid="login-submit-button"
data-testid="login-error-message"
```

## Review Rule

AI 產生測試碼時：

- **不可寫** `cy.get('[data-testid="..."]')`
- 必須使用從 Playwright snapshot 或 WETPAINT 參考資料中確認的真實 selector
- 無法確認 selector 的 TC 一律寫 `it.skip()`，並在檔案頂部加 `[ENG TASK]`
- `[ENG TASK]` 說明工程師需補哪個 `data-testid` 及對應元素
