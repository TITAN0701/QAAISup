# AI-assisted Spec-Driven QA Automation

針對「國衛院學齡前兒童發展數位評估系統」（**wetpaint**）的全流程 AI 協作 QA 框架。
SIT：`https://sit-wetpaint.nhri.org.tw/`

---

## 流程總覽

```
Step 1 — 需求分析
  /PM-import → /QA-pipeline-spec → scenarios.md + test-cases.json

Step 2 — 自動化 + 執行
  /playwright-smoke-test → /QA-5-generate-automation → /QA-pipeline-run

Step 3 — 報告
  /QA-pipeline-report → Google Sheets + Drive xlsx
```

---

## Slash Commands

| 指令 | 用途 |
|------|------|
| `/PM-import` | 匯入 PM 需求 |
| `/QA-1-import-pm-request` | 建立功能工作區 |
| `/QA-clarify` | 整理 QA 假設備忘 |
| `/QA-design` | 產 scenarios + test-cases.json |
| `/QA-pipeline-spec` | Step 1 一鍵串聯（QA-1 → clarify → design） |
| `/playwright-smoke-test` | 截圖所有頁面 + 取 DOM snapshot |
| `/QA-5-generate-automation` | 從 snapshot 抽 selector 產 .cy.ts |
| `/QA-pipeline-run` | Step 2 一鍵串聯（smoke → QA-5 → 執行） |
| `/QA-6-generate-report` | sync:sheet + upload-to-drive |
| `/PM-report` | 確認 pipeline-state → sync:sheet |
| `/QA-pipeline-report` | Step 3 一鍵串聯（報告產出） |
| `/QA-bug-report` | RIDER 格式 bug + 推送 GitHub Issues |
| `/QA-knowledge-update` | 同步 qa-knowledge 與現有 spec |
| `/check-project` | 掃描專案結構 |
| `/project-init` | 切換新系統（清空舊內容） |
| `/run-task` | 執行 current-task.md 任務清單 |

---

## 常用指令

```powershell
npm run test:e2e                                        # 執行全部 Cypress
npx cypress run --spec "automation/e2e/specs/login.cy.ts"  # 執行單一 spec
npm run sync:sheet                                      # 同步 Google Sheets
node scripts/upload-to-drive.js                         # 上傳 xlsx 至 Drive
node scripts/auth-sheets.js                             # token 過期時重新授權
.\scripts\new-feature-from-inbox.ps1                    # 建立新功能工作區
```

---

## 報告產出

```
npm run sync:sheet          → Google Sheets（TC / Scenarios / Report / Bugs）
node scripts/upload-to-drive.js  → artifacts/generated/qa/{日期}-qa-report.xlsx
                                   → Google Drive：WETPAINT > AI Suport文件
```

資料來源：`qa-workspace/.pipeline-state.json`（唯一來源，不產出 .md / .docx）
Spreadsheet ID：`1uK9k4O1gL_YiNbXolOITpVnYwzJHB0j-UunLjG0fV0g`

---

## AI 架構

```
┌──────────────────────────────────────────────────────┐
│  Claude Code                                          │
│  CLAUDE.md        行為規則、安全限制                  │
│  .claude/commands/ 16 個 Slash Command 執行步驟       │
│  .claude/modules/  共用載入器（config / eval / mcp）  │
│  .claude/evals/    產出品質評分標準                   │
│  qa-knowledge/     測試策略、selector 規則、風險定義  │
│  memory/           跨對話持久記憶                     │
└──────────────────────────────────────────────────────┘
      │                   │                  │
Playwright MCP      Google Drive MCP    GitHub CLI (gh)
截圖 + snapshot      唯讀搜尋 Drive     推送 Bug Issues
```

AI 產出物每步自動評分：`SPEC_OK` / `SCENARIOS_OK` / `TC_OK` / `AUTOMATION_OK` / `REPORT_OK`
`AUTOMATION_BLOCKED` 時強制停止，修正後才能繼續。

---

## 自動化核心

**examFlow.ts 核心函數**

| 函數 | 說明 |
|------|------|
| `createChild(ageMonths)` | API 建立全新孩童，回傳 `{ name, id }` |
| `navigateToExamOverview(child)` | 導航至 developmental 頁，進入測驗總覽 |
| `navigateToStep(child, step, category, type?)` | stub API 強制 Vue Router 導向指定 step |

**category + type → step 對照**

| category | type | step |
|----------|------|------|
| observation | 任意 | choice |
| ai | GM01_01 | walk-fb |
| ai | GM01_02 | walk-side |
| ai | GM01_03 | supine |
| ai | FM02_01 | graphic-copying-video |
| ai | FM02_02 | graphic-copying-photo |
| ai | SE03_LE04 | picture-naming |

**it.skip 規則**

- ✅ 合法：功能未上線 / automation_candidate:false / SIT API 500（加 `[BLOCKED 日期]`）
- ❌ 不合法：selector 不知道、fixture 未建 — 補齊再跑，不寫 skip
- 🚫 禁止：`data-testid` selector（SIT DOM 未加入）

---

## SIT 參照

**已知個案**（⚠️ 必須用 `createChild()` 建全新孩童，已測驗者無法進入）

| child_id | 姓名 | 月齡 | 狀態 |
|----------|------|------|------|
| 546 | QATest36M | 36M | 🔴 進行中，不可重用 |
| 528 | 3 | 48M | 🟢 尚未測驗，可用 |
| 502 | 39test1042 | 39M | 🟡 部分完成，不可重測 |

**年齡層 × 模組**

| 月齡 | 模組 |
|------|------|
| 2–9m | walk-fb / walk-side / supine |
| 24m+ | ＋ graphic-copying-photo、picture-pairing |
| 36m+ | ＋ graphic-copying-video、picture-naming |
| 42–48m | 幾乎全部 |

---

## 功能狀態（Pipeline 2026-06-17-001）

> Pass **34** / Pending **23** / Fail **0**　　最後更新：2026-06-17

| Feature | Pass | Pending | 說明 |
|---------|:----:|:-------:|------|
| login | 5 | 1 | TC-LOGIN-006 功能不存在 |
| forgot-password | 4 | 0 | ✅ 全通過 |
| admin-backend | 7 | 1 | TC-ADMIN-008 待 disabled_user |
| account-register | 0 | 1 | OTP 後端未完成 |
| card-matching | 0 | 5 | 功能未上線 |
| register | 0 | 4 | 功能未開放 |
| data-validation | 1 | 0 | ✅ 全通過 |
| gait-analysis | 6 | 1 | TC-GAIT-001 skip |
| handwriting-recognition | 0 | 0 | automation_candidate:false |
| observation-group | 4 | 0 | ✅ 全通過 |
| re-recording | 0 | 2 | /records 不存在，需 seed |
| verbal-expression | 0 | 2 | picture-naming API 500 |
| question-content | 4 | 1 | TC-QCONTENT-002 API 500 |
| question-logic | 1 | 5 | 年齡層邏輯 DOM 不可見 |
| video-recording | 2 | 0 | ✅ 全通過 |
| progress-bar | — | — | test-cases.json 未產出 |

**待 Engineer 處理**

| 項目 | 影響 |
|------|------|
| 提供 `disabled_user` 帳號 | TC-ADMIN-008 |
| 修復 `observation/submit` API 500 | TC-QCONTENT-002 |
| 修復 picture-naming 錄製 API 500 | TC-VERBAL-001, 002 |
| Seed `/records` 資料 | TC-REREC-002, 004 |

---

## 切換新專案

執行 `/project-init`，輸入專案名稱、代號、SIT URL、帳密後自動清空並重設。

> 清空：`pm-inbox/`、`qa-workspace/specs/`、`automation/e2e/specs/*.cy.ts`、`artifacts/`
> 保留：`scripts/`、`.claude/`、`qa-knowledge/`、`automation/e2e/flows/`
