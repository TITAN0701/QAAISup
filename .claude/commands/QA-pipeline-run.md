# QA Pipeline: Run

> 執行前先讀：`.claude/modules/config-loader.md`、`.claude/modules/mcp-fallback.md`、`.claude/modules/eval-loader.md`

依序執行 playwright-smoke-test → QA-5，完整完成 snapshot 取得、automation 產出、測試執行。
原有指令內容不變，此 pipeline 只負責串聯與 gate 判斷。

Arguments:

```txt
$ARGUMENTS
```

---

## 預設行為（無需使用者確認）

- **未帶 feature 參數** → 對全部功能執行（all）
- **snapshot 不存在** → 自動執行 playwright-smoke-test，不詢問使用者
- **`.env` 不存在** → 自動從 CLAUDE.md / config.json 建立 `.env`，不詢問使用者
- **帶 `--restart` 參數** → 忽略上次狀態，QA-5 也重新產出（會覆蓋現有 .cy.ts）

---

## Steps

### Step 0 — 確認 .env

檢查 `.env` 是否存在且 `CYPRESS_BASE_URL` 有值：

- **不存在或空白** → 自動從 CLAUDE.md 讀取 `CYPRESS_BASE_URL`、`TEST_USER_EMAIL`、`TEST_USER_PASSWORD`，寫入 `.env`，繼續執行

---

### Step 0.5 — 掃描上次執行紀錄（Resume Check）

讀取 `qa-workspace/.pipeline-state.json`：

**若不存在** → 這是第一次執行，所有 feature 列為「需產出 QA-5」，進入 Step 1。

**若存在** → 顯示上次執行摘要（僅供參考），並決定各 feature 的 **QA-5 產出策略**：

```
📋 上次執行紀錄（Pipeline ID: {pipeline_id}，{last_updated}）

| Feature              | 上次 QA-5 | 上次 Pass | 上次 Pending | 上次 Fail | QA-5 本次 |
|----------------------|-----------|-----------|--------------|-----------|-----------|
| login                | ✅ done   | 5         | 1            | 0         | ⏭️ 跳過   |
| card-matching        | ✅ done   | 0         | 5            | 0         | ⏭️ 跳過   |
| gait-analysis        | ⏳ 未完成  | -         | -            | -         | 🔄 產出   |
...

📌 QA-5 產出策略：
  ⏭️ 跳過（保留現有 .cy.ts）：N 個（qa5 = "done" 且非 --restart）
  🔄 重新產出：M 個（qa5 = "pending" 或帶 --restart）
```

**QA-5 跳過規則：**
- `qa5 = "done"` 且未帶 `--restart` → 跳過產出，保留現有 .cy.ts（避免覆蓋已通過的測試）
- `qa5 = "pending"` → 執行 QA-5
- 帶 `--restart` → 所有 feature 重新產出

> ⚠️ 注意：QA-5 跳過只影響「程式碼產出」。**所有 feature 的 Cypress 測試都會執行**，以取得真實現況。

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

#### 2b — 執行 Cypress 測試（每個 feature 都跑）

不管上次狀態，每個 feature 都執行：

```powershell
npm run test:e2e -- --spec "automation/e2e/specs/{feature}.cy.ts"
```

記錄結果：Pass / Pending（it.skip）/ Fail 數量。

#### 2c — 更新 Pipeline State

每個 feature 完成後：

```powershell
.\scripts\update-pipeline-state.ps1 -Feature "{feature}" -Qa5 "done" -TestsRun "done" -Pass {N} -Pending {N} -Fail {N}
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
  "pipeline_id": "2026-06-14-001",
  "started_at": "2026-06-14T10:00:00+08:00",
  "last_updated": "2026-06-14T10:30:00+08:00",
  "scope": "all",
  "features": {
    "login":          { "qa5": "done", "tests_run": "done", "pass": 5, "pending": 1, "fail": 0 },
    "card-matching":  { "qa5": "done", "tests_run": "done", "pass": 0, "pending": 5, "fail": 0 }
  },
  "totals": { "pass": 22, "pending": 37, "fail": 0, "specs": 59 }
}
```

Helper：`scripts/update-pipeline-state.ps1`
