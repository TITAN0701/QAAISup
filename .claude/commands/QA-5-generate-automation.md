# QA-5 Generate Automation

> 執行前先讀：`.claude/modules/config-loader.md`、`.claude/modules/qa-knowledge-loader.md`、`.claude/modules/mcp-fallback.md`

You are helping QA generate automation draft code.

## Goal

Read approved test cases and generate Cypress-first automation draft.

Input:

```txt
artifacts/generated/qa/test-cases.json
qa-workspace/specs/{feature}/scenarios.md
qa-knowledge/glossary.md
qa-knowledge/selector-policy.md
qa-knowledge/test-strategy.md
qa-knowledge/risk-rules.md
artifacts/raw/screenshots/snapshots/          ← Playwright DOM snapshot（若存在）
```

Output:

```txt
automation/e2e/specs/{feature}.cy.ts
automation/e2e/pages/
automation/e2e/flows/
automation/e2e/fixtures/
automation/api/tests/
automation/testdata/
```

Arguments:

```txt
$ARGUMENTS
```

## Steps（執行順序）

### Step 1 — 產出自動化草稿（.cy.ts）

依 Selector 抽取規則產出所有 feature 的 `.cy.ts`（見下方規則）。

### Step 2 — 驗證所有產出檔案

產出完成後，**逐一 Read 每個 .cy.ts 檔案**，確認：
- 無 `data-testid` selector
- 無 Tailwind/hash class（`box_shadow`、`bg-white` 等）
- 無不存在的 `#id` selector
- 無法確認的 selector 已寫成 `it.skip()` + `[SDET TODO]`

確認無誤後才進入 Step 3。

### Step 3 — 確認執行環境

讀取 `.env` 檔案，確認：
- `CYPRESS_BASE_URL` 存在且非空白
- 值為有效 URL（以 `http://` 或 `https://` 開頭）

若 `CYPRESS_BASE_URL` 未設定或為空 → **停止，告知使用者「請先設定 .env 的 CYPRESS_BASE_URL 再繼續」，不執行測試**。

### Step 4 — 執行測試

環境確認正確後，執行：

```powershell
npm run test:e2e
```

等待執行完成，觀察終端輸出，記錄：
- 總共執行幾個 TC
- 通過 / 失敗 / skip 各幾個
- 是否有環境錯誤（如 `cy.visit()` 404、`baseUrl` 未設定）

若出現**環境錯誤**（非功能失敗）→ 停止，告知使用者排除環境問題後重跑。

### Step 5 — 整理產物

執行完成後執行：

```powershell
.\scripts\refresh-qa-artifacts.ps1
```

### Step 6 — 回報執行結果

列出：
- 執行時間
- 通過 / 失敗 / skip 統計
- 失敗項目清單（TC ID + 失敗原因摘要）
- 建議下一步（`/QA-6-generate-report`）

---

## Rules

- Cypress is the default.
- Use pytest only for API/backend validation.
- **禁止使用 `cy.get('[data-testid="..."]')`** — SIT DOM 尚未加入 data-testid，詳見 qa-knowledge/selector-policy.md
- Do not use real credentials or production data.
- Generated code is draft and needs SDET review before execution.
- **宣告完成前必須逐一 Read 每個產出的 .cy.ts 驗證**，不可依賴印象或推斷。

### Selector 抽取規則

**Step 1 — 讀取 Playwright snapshot**

若 `artifacts/raw/screenshots/snapshots/` 存在，讀取與當前 feature 對應的 `.yml` snapshot 檔案，從 accessibility tree 抽取元素的 `id`、`placeholder`、穩定 `class`、按鈕文字、`href`。

**Step 2 — 依優先順序選用 selector**

`#id` > `.stable-class` > `input[placeholder]` > `cy.contains('button/a', '文字')` > `a[href]`

從 snapshot 找到的 selector 直接填入 `.cy.ts`，不猜測、不硬寫。

**Step 3 — snapshot 不存在或找不到對應元素**

寫 `it.skip()`，並在檔案頂部加 `[SDET TODO]` 說明需確認的 URL 或 selector。建議先執行 `/playwright-smoke-test` 取得 snapshot 再重跑 QA-5。

