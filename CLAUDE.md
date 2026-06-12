# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 專案簡介

AI 輔助、規格驅動的 QA 自動化框架。從 PM 需求到 QA 報告的全流程 AI 協作，針對「國衛院學齡前兒童發展數位評估系統」（代號 wetpaint）進行測試。

目標 SIT 環境：`https://sit-wetpaint.nhri.org.tw/`

---

## 核心流程（PM → QA → 自動化 → 報告）

```
PM 填需求 (pm-inbox/)
  ↓ /PM-1-create-intake → .\scripts\new-feature-from-inbox.ps1
QA/AI 產規格與問題 (qa-workspace/specs/{feature}/)
  ↓ /QA-1 /QA-2 → spec.md, questions.md
QA/AI 產情境與案例
  ↓ /QA-3 /QA-4 → scenarios.md, test-cases.json
QA/AI 產自動化草稿
  ↓ /QA-5 → automation/e2e/specs/*.cy.ts, automation/api/tests/*.py
執行測試 & 回填結果 (artifacts/raw/)
  ↓ .\scripts\refresh-qa-artifacts.ps1
報告產出 (artifacts/generated/)
  ↓ /QA-6 → test-cases.md, test-report.md, scenario-matrix.xlsx
```

---

## 常用指令

```powershell
# 建立新功能工作區（從 pm-inbox 匯入）
.\scripts\new-feature-from-inbox.ps1

# 執行 Cypress E2E（讀 .env 的 CYPRESS_BASE_URL）
npm run test:e2e

# 執行單一 Cypress 測試檔
npx cypress run --spec "automation/e2e/specs/login.cy.ts"

# 執行 pytest API 測試
pytest automation/api/tests/

# 產出所有 QA 產物（回填執行結果後）
.\scripts\refresh-qa-artifacts.ps1

# 含 PM release summary
.\scripts\refresh-qa-artifacts.ps1 -IncludePm

# 驗證 SDD 文件結構完整性
.\scripts\validate-sdd.ps1

# 匯出 PM 報告（Word）
.\scripts\export-pm-report-docx.ps1

# 同步 TC 至 Google Sheet（供 PM 查閱）
npm run sync:sheet

# 初始化新專案（清空舊內容、更新設定）
.\scripts\project-init.ps1 -ProjectName "..." -ProjectCode "..." -SitUrl "..." -TestEmail "..." -TestPassword "..."
```

---

## Slash Commands

| 指令 | 用途 |
|------|------|
| `/PM-1-create-intake` | PM 建立需求（整理 pm-inbox） |
| `/PM-3-review-release-summary` | PM 審查 release summary |
| `/PM-4-import-xlsx` | 匯入 XLSX 需求表 |
| `/QA-1-import-pm-request` | 檢查 pm-inbox，準備建立工作區 |
| `/QA-2-generate-questions` | 根據 spec 產生 PM 釐清問題 |
| `/QA-3-generate-scenarios` | 產生測試情境（scenarios、plan、tasks） |
| `/QA-4-generate-testcases` | 產生 test-cases.json、test-plan、risk-notes |
| `/QA-5-generate-automation` | 產自動化草稿（Cypress + pytest）；AI 依 test-cases.json 與 scenarios.md 推斷產出，非真實執行，需 QA/Engineer review 後才可跑 |
| `/QA-6-generate-report` | 根據執行結果產 QA/PM 報告 |
| `/QA-bug-report` | 將 bug 描述整理成 RIDER 格式報告（輸出至 artifacts/generated/qa/bugs/） |
| `/QA-knowledge-update` | 審視 qa-knowledge 四個檔案是否與現有 spec 一致，列出差異後確認再更新（系統改版後執行）|
| `/check-project` | 掃描專案整體檔案結構（只用 Glob，最小 token）|
| `/playwright-smoke-test` | 用 Playwright MCP 截圖所有主要頁面 |
| `/project-init` | 清空舊專案內容、更新設定，快速切換至新系統 |

---

## 目錄結構

```
pm-inbox/                    # PM 需求輸入（.md 或 .xlsx）
qa-workspace/
  specs/{feature}/           # 每個功能的工作區
    spec.md                  # 功能規格
    questions.md             # 待 PM 確認的問題（含 PM Answer）
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

## 架構重點

**五層架構**：PM Input → QA/AI Specification → Test Design → Automation → Execution & Report

每層的關鍵限制：
- **AI 不可自行創造測試結果**：Pass/Fail 必須來自測試框架或 CI
- **AI 產出需 QA 審核後才能進入自動化**
- **QA-5 產出為草稿**：AI 依文件推斷寫出 Cypress 程式碼，未實際跑瀏覽器；需 QA/Engineer 確認 selector 正確後才可執行 `npm run test:e2e`
- **缺少 `data-testid` 時**，應在 `automation/ENGINEERING-TASKS.md` 新增 Engineering Task，不要寫脆弱 selector

---

## AI 行為限制

- **不可擅自新增使用者未要求的欄位、區塊或功能**
- **修改檔案時只改使用者指定的部分**，不做額外調整或「順手優化」
- **產出格式以參考來源為準**（如 qa-claude-skill），不自行發明新欄位
- **有疑問先問，不要假設**：不確定是否該加某個東西時，先詢問使用者確認
- **對話過程中只執行使用者明確說的事**：不把討論中的想法、建議或分析自動實作進去，除非使用者明確說「請做」或「幫我加」
- **使用者只是提問或討論時，不可動任何檔案**：問題就回答問題，分析就給分析，沒有收到明確指令前不得寫入、新增或修改任何檔案
- **分析技術可行性前必須先驗證假設，不可把未經確認的推斷當結論寫入文件**：若無法驗證，應明確說明「尚未確認」，不得以猜測作為分析依據
- **每次對話開始時必須讀取本專案的 memory**：從 Claude Code 的專案 memory 目錄讀取 `MEMORY.md`（路徑由系統自動提供，不需寫死）。根據內容了解專案現況與過去決策，讀取失敗時不需提示使用者，直接繼續。

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
Compress-Archive -Path "c:\Users\suppo\Desktop\QAAI專案" -DestinationPath "c:\Users\suppo\Desktop\QAAI專案-backup-$(Get-Date -Format 'yyyyMMdd-HHmm').zip" -Exclude "*/node_modules/*"
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
- Spreadsheet ID：`1-EO-84MVnU7zyBoCJUcJvNJpPYYYCzmRldCwDvEcO1Q`

### Playwright MCP
- 用途：截圖主要頁面（`/playwright-smoke-test`），不操作資料
- 透過 Claude Code MCP 整合，不需額外安裝
- 限制：不可點「開始測驗」或送出表單

### GitHub CLI（gh）
- 用途：`/QA-bug-report` 自動推送 Bug 至 GitHub Issues
- 目標 Repo：`TITAN0701/QAAISup`
- 前置確認：`gh auth status`

> 以上 token 檔案均不提交 Git。

---

## 切換新專案

將此框架套用至不同系統時，執行 `/project-init`，AI 會依序詢問：

| 欄位 | 說明 |
|------|------|
| 專案名稱 | 中文全名，例如：成人健康評估系統 |
| 專案代號 | 英文小寫，例如：adult-health |
| SIT URL | 新系統的測試環境網址 |
| 測試帳號 / 密碼 | 新系統的登入憑證 |
| API URL | 若無可略過 |

確認後自動執行 `scripts/project-init.ps1`，清空所有舊內容並更新 `.env` 與 `CLAUDE.md`。完成後直接從 `/QA-1-import-pm-request` 開始新專案。

> 清空範圍：`pm-inbox/`、`qa-workspace/specs/`、`automation/e2e/specs/*.cy.ts`、`automation/api/tests/*.py`、`artifacts/`
> 保留範圍：`scripts/`、`.claude/commands/`、`qa-knowledge/`、Page Object 結構、`package.json`

---

## Selector 規則

完整規則見 `qa-knowledge/selector-policy.md`。

**目前限制（SIT 環境，2026-06-10 起）：**
- **禁止使用 `data-testid`** — SIT 環境 DOM 尚未加入，寫了會全部失敗
- 替代優先順序：唯一穩定 `id` > 語意 `class` > `placeholder` > 按鈕文字 > `href` > 標題文字
- 無法確認 selector 的 TC 一律寫 `it.skip()`，並在檔案頂部加 `[ENG TASK]`
- 禁止：CSS nth-child、Tailwind utility class、hash class、完整 XPath

**長期目標（data-testid 補上後）：** `data-testid` > semantic role > label > 穩定唯一文字

---

## 重要限制（SIT 環境）

- **點「開始測驗」或「開始檢測」前必須先詢問使用者確認**，確認後才執行
- **送出會新增/修改資料的表單前必須先詢問使用者確認**，確認後才執行
- Playwright MCP 截圖任務：允許登入操作（填帳密、點登入）；其他會異動資料的操作須先詢問使用者確認

---

## 功能狀態快照（2026-06-12）

| 功能 | spec | questions | scenarios | test-cases | .cy.ts |
|------|:----:|:---------:|:---------:|:----------:|:------:|
| login | ✅ | ✅ | ✅ | ✅ | ✅ |
| forgot-password | ✅ | ✅ | ✅ | ✅ | ✅ |
| register | ✅ | ✅ | ✅ | ✅ | ✅ |
| question-logic | ✅ | ✅ | ✅ | ✅ | ✅ |
| question-content | ✅ | ✅ | ✅ | ✅ | ✅ |
| card-matching | ✅ | ✅ | ✅ | ✅ | ✅ |
| video-recording | ✅ | ✅ | ✅ | ✅ | ✅ |
| verbal-expression | ✅ | ✅ | ✅ | ✅ | ✅ |
| observation-group | ✅ | ✅ | ✅ | ✅ | ✅ |
| handwriting-recognition | ✅ | ✅ | ✅ | ✅ | ✅ |
| gait-analysis | ✅ | ✅ | ✅ | ✅ | ✅ |
| re-recording | ✅ | ✅ | ✅ | ✅ | ✅ |
| account-register | ✅ | ✅ | ✅ | ✅ | ✅ |
| data-validation | ✅ | ✅ | ✅ | ✅ | ✅ |
| admin-backend | ✅ | ✅ | ✅ | ✅ | ✅ |
| progress-bar | ✅ | ✅ | ✅ | ❌ BLOCKED | ❌ |
