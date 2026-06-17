# QA Pipeline: Run

> 執行前先讀：`.claude/modules/config-loader.md`、`.claude/modules/mcp-fallback.md`、`.claude/modules/eval-loader.md`

依序執行 playwright-smoke-test → QA-5，完整完成 snapshot 取得、automation 產出、測試執行。
原有指令內容不變，此 pipeline 只負責串聯與 gate 判斷。

## TodoWrite 任務追蹤（必須執行）

> 先讀 `.claude/modules/task-registry.md`，取得 `qa-pipeline-run` 的任務模板，**啟動時立即呼叫 TodoWrite 建立任務清單**。進度更新規則見 task-registry.md 的通用規則與 `qa-pipeline-run` 專屬規則。

Arguments:

```txt
$ARGUMENTS
```

---

## 預設行為（無需使用者確認）

- **未帶 feature 參數** → 對全部功能執行（all）
- **snapshot 不存在** → 自動執行 playwright-smoke-test，不詢問使用者
- **`.env` 不存在** → 自動從 `config.json`（sitUrl / testEmail）+ Grep CLAUDE.md（password）建立 `.env`，不詢問使用者
- **帶 `--restart` 參數** → 忽略上次狀態，QA-5 也重新產出（會覆蓋現有 .cy.ts）
- **帶 `--retest` 參數** → QA-5 跳過，但 Cypress 測試全部重跑（適合 SIT 環境有更新時）

---

## Steps

### Step 0 — 確認 .env

檢查 `.env` 是否存在且 `CYPRESS_BASE_URL` 有值：

- **不存在或空白** → 依下列方式取值後寫入 `.env`，繼續執行（Context Rot 防護，不整份讀 CLAUDE.md）：
  - `CYPRESS_BASE_URL`：讀 `config.json` 的 `env.sitUrl`
  - `TEST_USER_EMAIL`：讀 `config.json` 的 `env.testEmail`
  - `TEST_USER_PASSWORD`：用 Grep 在 CLAUDE.md 找 `TEST_USER_PASSWORD=` 取值

---

### Step 0.5 — 掃描上次執行紀錄（Resume Check）

讀取 `qa-workspace/.pipeline-state.json`：

**若不存在** → 這是第一次執行，所有 feature 列為「需產出 QA-5」，進入 Step 1。

**若存在** → 顯示上次執行摘要（僅供參考），並決定各 feature 的 **QA-5 產出策略**：

```
📋 上次執行紀錄（Pipeline ID: {pipeline_id}，{last_updated}）

| Feature              | 上次 QA-5 | Pass | Pending | Fail | QA-5 本次 | 測試本次   |
|----------------------|-----------|------|---------|------|-----------|-----------|
| login                | ✅ done   | 5    | 1       | 0    | ⏭️ 跳過   | 🔄 執行   |
| forgot-password      | ✅ done   | 4    | 0       | 0    | ⏭️ 跳過   | ⏭️ 跳過   |
| card-matching        | ✅ done   | 0    | 5       | 0    | ⏭️ 跳過   | 🔄 執行   |
| gait-analysis        | ⏳ 未完成  | -    | -       | -    | 🔄 產出   | 🔄 執行   |
...

📌 本次策略：
  QA-5  ⏭️ 跳過：N 個 / 🔄 產出：M 個
  測試  ⏭️ 跳過：N 個 / 🔄 執行：M 個
```

**QA-5 跳過規則：**
- `qa5 = "done"` 且未帶 `--restart` → 跳過產出，保留現有 .cy.ts
- `qa5 = "pending"` → 執行 QA-5
- 帶 `--restart` → 所有 feature 重新產出

**Cypress 測試跳過規則：**

> 永久跳過白名單從 `pipeline-state.json` 的 `pending_breakdown.legitimate_skip.features` 動態讀取，不在此硬寫清單。

- **feature 在 `legitimate_skip.features` 名單內** → 顯示 `[永久跳過] {feature} — 合法 skip（{原因}）`，沿用上次結果，不重跑
- `tests_run = "done"` 且 `fail = 0` 且 `pending = 0` 且未帶 `--retest` / `--restart` → 跳過，顯示 `[測試跳過] {feature} — 全數通過（Pass {N}）`
- `tests_run = "done"` 且 `pending > 0` 且 **該 feature 的所有 pending 都在 `legitimate_skip` 名單內** → 跳過，顯示 `[測試跳過] {feature} — pending 均為合法 skip`
- `tests_run = "done"` 且 `pending > 0` 且 **有 pending 不在 `legitimate_skip` 名單內** → **強制重跑**（it.skip 有機會解鎖）
- `tests_run = "done"` 且 `fail > 0` → **一律重跑**（有失敗必須確認）
- `tests_run = "pending"` → 執行測試
- 帶 `--retest` 或 `--restart` → legitimate_skip 名單以外的 feature 全部重跑測試

---

### Step 1 — 確認 Snapshot 狀態

檢查 `artifacts/raw/screenshots/snapshots/` 是否存在 snapshot 檔案：

- **不存在** → 自動載入並執行 `.claude/commands/playwright-smoke-test.md` 的所有步驟，完成後繼續 Step 2
- **已存在** → 跳過，直接進入 Step 2

---

### Step 2 — 逐 Feature 執行（QA-5 選擇性產出 + 測試全跑）

對每個 feature 依序執行：

#### 2a — QA-5 產出（選擇性）

```
若 qa5 = "done" 且非 --restart：
  → 顯示 [QA-5 跳過] {feature} — 上次已產出，保留現有 .cy.ts
  
若 qa5 = "pending" 或 --restart：
  → 載入並執行 QA-5-generate-automation 步驟（讀 snapshot 抽 selector）
  → 產出 automation/e2e/specs/{feature}.cy.ts
```

#### 2b — 執行 Cypress 測試（依跳過規則）

```
若 feature 在 legitimate_skip.features 名單內：
  → 顯示 [永久跳過] {feature} — 合法 skip，沿用上次結果

若 tests_run = "done" 且 fail = 0 且 pending = 0 且非 --retest / --restart：
  → 顯示 [測試跳過] {feature} — 全數通過（Pass {N}），沿用結果

若 tests_run = "done" 且 pending > 0 且所有 pending 在 legitimate_skip 名單內 且非 --retest / --restart：
  → 顯示 [測試跳過] {feature} — pending 均為合法 skip，沿用結果

若 tests_run = "done" 且 pending > 0 且有 pending 不在 legitimate_skip 名單內：
  → 強制重跑（it.skip 有機會因 snapshot 補齊或工程實作而解鎖）

若 tests_run = "done" 且 fail > 0：
  → 強制重跑（有失敗必須確認）

若 tests_run = "pending" 或帶 --retest / --restart：
  → 執行：
```

```powershell
npm run test:e2e -- --spec "automation/e2e/specs/{feature}.cy.ts"
```

記錄結果：Pass / Pending（it.skip）/ Fail 數量。

#### 2b-補 — Playwright MCP 補驗（Cypress 無法覆蓋時）

```
若 Cypress 執行後仍有 pending（it.skip）或 fail，且原因為：
  - 前置需 mediaDevices（影片錄製）
  - 需完整流程狀態才能到達的步驟
  - SIT 不支援直連 URL（被重導）

→ 改用 Playwright MCP 走完流程並驗證：
  1. 用 createChild(月齡) API 建立全新孩童
  2. Playwright MCP 完整走完測驗流程（含影片錄製）
  3. 截圖 + snapshot 存入 artifacts/raw/screenshots/snapshots/
  4. 在 .cy.ts 對應的 it.skip 上方加：
     // [VERIFIED BY PLAYWRIGHT MCP] {日期} — {確認的事實}
  5. pipeline-state 該 TC 改為 pass，pending 數量減少
```

#### 2c — 更新 Pipeline State

每個 feature 完成後：

```powershell
.\scripts\update-pipeline-state.ps1 -Feature "{feature}" -Qa5 "done" -TestsRun "done" -Pass {N} -Pending {N} -Fail {N} -PlaywrightVerified {N}
```

---

### Step 3 — 整體評估與完成摘要

完成所有 feature 後執行 `.\scripts\update-pipeline-state.ps1 -Finalize`，然後輸出：

```
QA Pipeline: Run 完成
Pipeline ID: {new_id}
✅ Step 0.5 Resume  — QA-5 跳過 {M} 個 / 產出 {N} 個
✅ Step 1 Snapshot  — 已取得（或已跳過）
✅ Step 2 測試執行  — 全 {total} 個 feature 均已執行

測試結果彙整：
| Feature              | Pass | Pending | Fail | 狀態        |
|----------------------|------|---------|------|-------------|
| login                | 5    | 1       | 0    | ✅ 通過      |
| card-matching        | 0    | 5       | 0    | ⚠️ 全 Pending |
| gait-analysis        | 0    | 7       | 0    | ⚠️ 全 Pending |
...

總計：Pass {N} / Pending {N} / Fail {N}
AUTOMATION_OK / AUTOMATION_BLOCKED

下一步：/QA-pipeline-report
```

評估結果代碼：
- 任一 feature `fail > 0` → `AUTOMATION_BLOCKED`，列出失敗清單，告知需修正後重新執行
- 全部 `fail = 0` → `AUTOMATION_OK`

---

## 狀態檔格式（qa-workspace/.pipeline-state.json）

```json
{
  "pipeline_id": "2026-06-15-001",
  "started_at": "2026-06-15T05:30:00+08:00",
  "last_updated": "2026-06-15T16:00:00+08:00",
  "scope": "all",
  "features": {
    "login":         { "qa5": "done", "tests_run": "done", "pass": 5, "pending": 1, "fail": 0, "playwright_verified": 1, "note": "TC-LOGIN-006: it.skip 合法" },
    "card-matching": { "qa5": "done", "tests_run": "done", "pass": 0, "pending": 5, "fail": 0, "playwright_verified": 5, "note": "功能未上線，SIT 無 route" }
  },
  "totals": { "pass": 34, "pending": 23, "fail": 0, "specs": 58, "playwright_verified": 36 },
  "pending_breakdown": {
    "legitimate_skip": {
      "count": 23,
      "features": ["login(1)", "card-matching(5)", "register(4)", "account-register(1)", "re-recording(2)", "verbal-expression(2)", "admin-backend(1)", "question-content(2)", "question-logic(5)"],
      "reason": "功能未上線、功能未開放、需工程師提供測試資料、或需確認 API intercept 方案"
    }
  }
}
```

Helper：`scripts/update-pipeline-state.ps1`
