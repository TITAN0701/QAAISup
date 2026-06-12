# QA 測試報告

> 執行環境：SIT — https://sit-wetpaint.nhri.org.tw/
> 報告日期：2026-06-12
> 測試框架：Cypress E2E

---

## 執行摘要

| 指標 | 數值 |
|------|------|
| 總測試案例 | 74 |
| 已執行 | 34 |
| **Pass** | **19** |
| **Skip（待確認 selector / URL）** | **15** |
| **Not Run（尚無 execution-results）** | **40** |
| Fail | 0 |
| 自動化覆蓋率（可自動化中） | 37% (19/52) |

> **注意**：Skip 為 `it.skip()` 標記的自動化草稿，需 SDET 補上 selector 後方可執行；Not Run 為尚未有 execution-results.json 的功能。

---

## 各功能執行結果

| Feature | Total | Pass | Skip | Fail | Not Run | 狀態 |
|---------|-------|------|------|------|---------|------|
| login | 6 | 5 | 1 | 0 | 0 | ✅ |
| forgot-password | 4 | 4 | 0 | 0 | 0 | ✅ |
| register | 4 | 2 | 2 | 0 | 0 | ⚠️ |
| account-register | 3 | 0 | 0 | 0 | 3 | ⬜ |
| admin-backend | 4 | 7 | 1 | 0 | 0 | ✅ |
| card-matching | 5 | 0 | 0 | 0 | 5 | ⬜ |
| data-validation | 3 | 0 | 0 | 0 | 3 | ⬜ |
| gait-analysis | 10 | 0 | 0 | 0 | 10 | ⬜ |
| handwriting-recognition | 3 | 0 | 0 | 0 | 3 | ⬜ |
| observation-group | 4 | 0 | 0 | 0 | 4 | ⬜ |
| question-content | 7 | 0 | 0 | 0 | 7 | ⬜ |
| question-logic | 6 | 0 | 0 | 0 | 6 | ⬜ |
| re-recording | 4 | 0 | 0 | 0 | 4 | ⬜ |
| verbal-expression | 5 | 0 | 0 | 0 | 5 | ⬜ |
| video-recording | 6 | 1 | 1 | 0 | 4 | ⚠️ |
| progress-bar | — | — | — | — | — | 🚫 BLOCKED |

> ✅ 全數通過 ⚠️ 部分 Skip ⬜ 未執行 🚫 已知阻塞

### 執行來源說明

- **login / forgot-password / register / admin-backend / video-recording**：本次（2026-06-12）Cypress 執行
- **其餘功能**：尚未執行，`execution-results.json` 不存在或僅為 Not Run 狀態

---

## Cypress 最新執行記錄（2026-06-12）

| Spec 檔 | Pass | Skip | Fail |
|---------|------|------|------|
| login.cy.ts | 5 | 1 | 0 |
| forgot-password.cy.ts | 4 | 0 | 0 |
| register.cy.ts | 2 | 2 | 0 |
| admin-backend.cy.ts | 7 | 1 | 0 |
| video-recording.cy.ts | 1 | 1 | 0 |
| 其餘 10 個 .cy.ts | 0 | 全部 skip | 0 |

---

## Skip 原因分析

所有 Skip 均為 `it.skip()` + `[SDET TODO]` 標記，原因如下：

| 原因類型 | 說明 |
|---------|------|
| 需確認 selector（SIT DOM 未加 data-testid） | 大多數 Skip 項目 |
| 需確認頁面 URL / 路徑 | 部分路徑未在 snapshot 中確認 |
| 功能需手動操作（影片錄製、AI 模組） | 技術上無法全自動化 |

---

## SDET 待辦清單

詳見 `automation/ENGINEERING-TASKS.md`。

優先項目：
1. **observation-group**：4 個 TC 全部 Skip，需確認跳轉 URL 與觀察題組頁面 selector
2. **gait-analysis**：3 個 TC 需確認 URL（TC-GAIT-006、TC-GAIT-008、TC-GAIT-010）
3. **verbal-expression**：3 個 TC 需確認計時器、圖片與上傳後狀態 selector
4. **video-recording**：4 個 TC 需確認錄製按鈕狀態 selector

---

## 測試覆蓋率

| 維度 | 數值 |
|------|------|
| 功能覆蓋率 | 15/16（progress-bar BLOCKED）|
| 自動化草稿完成率 | 15/15（.cy.ts 均已產出）|
| 實際執行率 | 5/15 功能有執行記錄 |
| Zero Fail | ✅ |
