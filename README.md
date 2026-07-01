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

## AI Agent 架構

> **AI 負責推理，Cypress 負責執行，人負責審核——三者分工明確。**
> 定位：**AI-augmented QA**，AI 產草稿、人審核、Pass/Fail 不由 AI 判斷。

### 快覽

```
┌─────────────────────────────────────────────────────────┐
│  大腦    Claude sonnet-4-6 + CLAUDE.md（行為規則）       │
├─────────────────────────────────────────────────────────┤
│  規劃    current-task.md → Slash Commands（16 個）       │
│  感知    Playwright MCP  → snapshots/*.yml（DOM tree）   │
│  行動    MCP / PowerShell / gh CLI / Sheets API         │
│  評估    .claude/evals/  → SPEC_OK … AUTOMATION_BLOCKED │
│  記憶    memory/ + qa-knowledge/ + TodoWrite            │
├─────────────────────────────────────────────────────────┤
│  執行（非 AI）  Cypress → pipeline-state.json           │
└─────────────────────────────────────────────────────────┘
ReAct：Thought ✅  Action ✅  Observe ✅  自動閉環 ⚠️  Multi-agent ❌
```

---

### 細節：7 個 Agent 組件

| 組件 | 位置 | 職責 |
|------|------|------|
| **大腦** | `CLAUDE.md` + `claude-sonnet-4-6` | System Prompt、行為規則、安全限制 |
| **規劃層** | `current-task.md` + `task-registry.md` + Slash Commands | 任務範圍控制、16 個工作流指令 |
| **感知層** | Playwright MCP → `snapshots/*.yml` | DOM accessibility tree、截圖、JS evaluate |
| **行動層** | Playwright MCP / PowerShell / gh CLI / Sheets API | 瀏覽器操控、檔案操作、外部服務 |
| **評估層** | `.claude/evals/` | 每步產出自動評分，不達標強制阻擋 |
| **記憶層** | `memory/` + `qa-knowledge/` + TodoWrite | 跨 session 記憶、領域知識、進度追蹤 |
| **執行層** | Cypress + `pipeline-state.json` | 非 AI 執行測試，唯一 Pass/Fail 來源 |

### 細節：評估結果代碼

| 代碼 | 意義 | 行動 |
|------|------|------|
| `SPEC_OK` / `TC_OK` / `AUTOMATION_OK` / `REPORT_OK` | 通過 | 繼續下一步 |
| `SPEC_INCOMPLETE` / `TC_INVALID` | 產出不完整 | 補充後重跑 |
| `AUTOMATION_BLOCKED` | 安全違規（如 data-testid）| 強制停止，修正才繼續 |
| `REPORT_INVALID` | Pass/Fail 非來自執行結果 | 不產出報告 |

### 細節：與 ReAct 標準對照

| ReAct 要素 | 本框架 | 說明 |
|-----------|:------:|------|
| Thought（推理） | ✅ | Claude 每個 Action 前有推理 |
| Action（工具呼叫） | ✅ | MCP / PowerShell / gh |
| Observation（觀察回饋） | ✅ | snapshot / Cypress 結果 |
| 自動閉環 | ⚠️ | 人工觸發各步驟 |
| Multi-agent 協作 | ❌ | 目前單一 agent |

---

## Harness Engineering 定位

> 參考 Karpathy、Martin Fowler、Addy Osmani、OpenAI 官方文件的綜合分析。

### 三層 AI 工程演進

```
Prompt Engineering  (2022–2023)  怎麼問得好？        → 單次對話輸入
Context Engineering (2023–2024)  怎麼給足背景？       → 系統提示與背景文件
Harness Engineering (2025+)      怎麼讓 AI 自主運作？ → Agent 框架、工具邊界、協作架構
```

本框架屬於第三層：**Harness Engineering**。

### 核心設計原則（Karpathy）

> LLM 是 kernel（核心），Harness 是 nginx 規則——agent 在你的基礎設施規則內運作，不是自由行動。

實作對應：`CLAUDE.md` 行為規則 + `evals/` 阻擋機制 = Harness 的 nginx 規則層。

### 五個維度缺口分析

| Harness 維度 | 業界標準 | 本框架 | 符合度 |
|-------------|---------|--------|:------:|
| **任務邊界** | 明確定義 agent 可做 / 不可做 | `CLAUDE.md` AI 限制、git 高危指令禁止 | ✅ |
| **工具權限** | 每工具有授權範圍，harness 驗證 schema | `settings.local.json`、MCP 工具清單 | ✅ |
| **Human-in-the-loop** | 關鍵節點強制人工審核 | `evals/` BLOCKED 停止、QA 審核草稿 | ✅ |
| **Observability** | traces、audit logs、dashboard、成本追蹤 | 無（pipeline-state 有資料但無介面） | ❌ |
| **Multi-agent 協作** | 多 agent 分工平行，任務編排層協調 | 單一 agent，Slash Commands 串聯 | ❌ |

> **關鍵數字**（arXiv CAAF 論文）：生產 agent 中 ~98.4% 是 Harness 基礎設施，只有 ~1.6% 是 AI 決策邏輯。

### 補強路線（三個優先級）

| 優先 | 方向 | 做法 | 難度 |
|:----:|------|------|:----:|
| P1 | **Observability** | 讀 `pipeline-state.json` 產簡易 dashboard；或接 Langfuse / Helicone | 低 |
| P2 | **工具呼叫 schema 驗證** | 在 harness 層加 schema check，防 prompt injection 升級為任意指令 | 中 |
| P3 | **Multi-agent 分工** | spec-agent / automation-agent / review-agent 各自平行，用 LangGraph 或 CrewAI 協調 | 高 |

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
