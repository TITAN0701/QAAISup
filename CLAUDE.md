# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 核心流程（三步驟）

```
【Step 1 — 需求進來】
PM 填需求 (pm-inbox/)
  ↓ /PM-import
QA 建立工作區
  ↓ /QA-1-import-pm-request → .\scripts\new-feature-from-inbox.ps1
QA 整理假設（內部備忘，不等 PM）
  ↓ /QA-clarify → questions.md
QA 產情境與案例
  ↓ /QA-design → scenarios.md, test-cases.json

【Step 2 — 產自動化 + 執行】
截圖取 DOM snapshot
  ↓ /playwright-smoke-test → artifacts/raw/screenshots/snapshots/
產自動化草稿（selector 從 snapshot 抽取）
  ↓ /QA-5-generate-automation → automation/e2e/specs/*.cy.ts, automation/api/tests/*.py
執行測試
  ↓ npm run test:e2e / pytest → artifacts/raw/allure-results/
  ↓ .\scripts\refresh-qa-artifacts.ps1

【Step 3 — 產報告】
產 QA + PM 報告
  ↓ /QA-6-generate-report → test-cases.md, test-report.md, release-summary.md
匯出 Word
  ↓ /PM-report → release-summary.docx
```

---

> 常用指令與 Slash Commands 完整清單見 [README.md](README.md)

---

## 目錄結構

```
pm-inbox/                    # PM 需求輸入（.md 或 .xlsx）
qa-workspace/
  specs/{feature}/           # 每個功能的工作區
    spec.md                  # 功能規格
    questions.md             # QA 釐清備忘（QA Assumption，不等 PM）
    scenarios.md             # 測試情境（Given/When/Then）
    test-cases.json          # 測試案例
    execution-results.json   # 執行結果回填
  schemas/                   # JSON Schema 驗證
qa-knowledge/                # QA 知識庫（test-strategy, risk-rules, selector-policy）
artifacts/
  generated/qa/              # AI 產出：test-plan.md, test-cases.json, scenario-matrix.xlsx
  generated/pm/              # PM 報告：release-summary.md
  raw/                       # 原始執行結果（Allure, screenshots）
automation/
  e2e/
    specs/                   # Cypress 測試案例 (*.cy.ts)
    pages/                   # Page Object selectors
    flows/                   # 跨頁流程
    fixtures/                # 測試資料與登入狀態
  api/tests/                 # pytest API 測試 (*.py)
scripts/                     # PowerShell/Python 工具腳本
docs/                        # 架構、協作、環境設定文件
```

---

## AI 行為限制

- **不可擅自新增使用者未要求的欄位、區塊或功能**
- **修改檔案時只改使用者指定的部分**，不做額外調整或「順手優化」
- **產出格式以參考來源為準**（如 qa-claude-skill），不自行發明新欄位
- **有疑問先問，不要假設**：不確定是否該加某個東西時，先詢問使用者確認
- **對話過程中只執行使用者明確說的事**：不把討論中的想法、建議或分析自動實作進去，除非使用者明確說「請做」或「幫我加」
- **使用者只是提問或討論時，不可動任何檔案**：問題就回答問題，分析就給分析，沒有收到明確指令前不得寫入、新增或修改任何檔案
- **分析技術可行性前必須先驗證假設，不可把未經確認的推斷當結論寫入文件**：若無法驗證，應明確說明「尚未確認」，不得以猜測作為分析依據
- **回答任何問題或執行任何任務前，必須確認 CLAUDE.md 相關章節的內容**，不得依賴記憶或推斷；涉及流程、指令順序、目錄結構、規則的問題，一律以 CLAUDE.md 為唯一來源。
- **每次對話開始時必須讀取本專案的 memory**：從 Claude Code 的專案 memory 目錄讀取 `MEMORY.md`（路徑由系統自動提供，不需寫死）。根據內容了解專案現況與過去決策，讀取失敗時不需提示使用者，直接繼續。
- **建立或修改任何 `.claude/` 檔案前，必須先載入 `.claude/modules/structure-policy.md`**，確認內容放置在正確層級（commands / evals / modules），不得憑印象判斷。
- **讀取大型檔案時優先用 Grep 找關鍵字，再用 Read + limit/offset 只讀需要的段落**，避免一次載入整份檔案消耗大量 token（Context Rot 防護）。
- **每個 feature 完成後立即 commit**，確保狀態落地為檔案，不依賴 session 記憶。

---

## Git 高風險指令絕對限制

以下指令**執行前必須先備份，且必須列出將要執行的完整指令讓使用者確認，不得直接執行**：

- `git filter-repo`（任何參數組合）
- `git push --force` / `git push -f`
- `git reset --hard`
- `git rebase`（改寫歷史模式）
- `git clean -f` / `git clean -fd`
- 任何會**改寫 commit 歷史**或**刪除工作目錄檔案**的指令

**備份流程（每次執行上述指令前強制執行）：**
```powershell
$root = (Get-Item -Path (git -C $PSScriptRoot rev-parse --show-toplevel 2>$null ?? ".")); Compress-Archive -Path $root.FullName -DestinationPath "$($root.Parent.FullName)\$($root.Name)-backup-$(Get-Date -Format 'yyyyMMdd-HHmm').zip" -Exclude "*/node_modules/*"
```

**特別禁止**：`git filter-repo --path <單一路徑> --replace-text` 組合使用 — 這會刪除所有其他檔案。正確用法只用 `--replace-text`，不加 `--path`。

---

## 環境設定（.env）

```env
CYPRESS_BASE_URL=https://sit-wetpaint.nhri.org.tw/
API_BASE_URL=https://api-staging.example.com
TEST_USER_EMAIL=0999999993
TEST_USER_PASSWORD=password123
TEST_ENV=staging
```

`.env` 不提交 Git。CI 使用 GitHub Secrets：`CYPRESS_BASE_URL`、`API_BASE_URL`、`TEST_USER_EMAIL`、`TEST_USER_PASSWORD`。

---

## 外部工具設定

### Google Drive MCP
- 用途：唯讀搜尋 Drive 檔案（`mcp__gdrive__search`）
- Token：`.claude/gdrive-token.json`
- Credentials：`.claude/google-credentials.json`
- 範圍：`drive.readonly`

### Google Sheets 同步
- 用途：將 TC、Scenarios、Report、Risk Notes、Bug Reports 同步至 Google Sheet 供 PM 查閱
- 執行：`npm run sync:sheet`（腳本：`scripts/sync-to-sheet.js`）
- Token：`.claude/sheets-token.json`（範圍：`spreadsheets` + `drive.readonly`）
- 初次授權：`node scripts/auth-sheets.js`（會開啟瀏覽器，完成後自動存 token）
- Spreadsheet ID：`1uK9k4O1gL_YiNbXolOITpVnYwzJHB0j-UunLjG0fV0g`（WETPAINT QA AI 測試報告，2026-06-17 建立）

### Playwright MCP
- 用途：截圖所有頁面與測驗流程（`/playwright-smoke-test`），包含進入測驗、逐題作答、影片錄製上傳
- 透過 Claude Code MCP 整合，不需額外安裝
- **允許所有操作**：登入、點「開始測驗」/「開始檢測」、填寫並送出表單（2026-06-12 授權）
- **每一題都必須點入截圖 + snapshot，不可跳過**
- **影片模組必須完整執行**：切換 390×844 → 開始錄製 → 等 30 秒 → 停止 → 上傳
- **等待操作上限**：單次 wait 不超過 20 秒；影片上傳等長時間操作改用輪詢（wait 10s → 檢查 → wait 10s → 檢查）
- **Smoke Test 必須新增全新孩童**：不可使用已測驗個案（顯示「等待下次檢測時間」無法進入）
- **已知測試個案及年齡層模組對照**：見 `automation/e2e/pages.md` 與 project memory

### GitHub CLI（gh）
- 用途：`/QA-bug-report` 自動推送 Bug 至 GitHub Issues
- 目標 Repo：`TITAN0701/QAAISup`
- 前置確認：`gh auth status`

> 以上 token 檔案均不提交 Git。

---

## Selector 規則

完整規則見 `qa-knowledge/selector-policy.md`。

