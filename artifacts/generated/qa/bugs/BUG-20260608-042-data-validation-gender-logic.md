# Bug Report: 身分證字號預設性別與實際性別欄位未驗證

**ID**: BUG-20260608-042
**日期**: 2026-06-08
**回報者**: QA
**狀態**: 已驗證 PASS
**嚴重程度**: Medium
**優先級**: P2

---

## R — Reproduction Steps（重現步驟）

環境：SIT — https://sit-wetpaint.nhri.org.tw/
瀏覽器：待補充
帳號：0999999993

1. 登入系統
2. 進入相關功能頁面
3. 執行相關操作，觀察問題

## I — Impact（影響範圍）

- 受影響功能：data-validation
- 受影響角色：一般使用者
- 資料風險：待確認
- 阻塞測試項目：data-validation 相關測試案例

## D — Device / Environment（裝置與環境）

| 項目 | 內容 |
|------|------|
| 環境 | SIT |
| OS | 待補充 |
| 瀏覽器 | 待補充 |
| 解析度 | 待補充 |
| 帳號角色 | 一般使用者 |

## E — Expected vs Actual（預期 vs 實際）

| | 說明 |
|--|------|
| **預期** | 新增身分證字號第二碼性別驗證邏輯 |
| **實際** | 身分證字號預設性別為男（男:1、女:2），未對性別欄位做驗證 |

## R — References（附件與參考）

- 截圖：待補充
- 相關 spec：`qa-workspace/specs/data-validation/spec.md`
- 相關測試案例：待補充
- 相關 Issue：

---

## 自動化評估

| 項目 | 說明 |
|------|------|
| **判斷結果** | 可 |
| **理由** | 可驗證身分證號碼與性別欄位的對應驗證邏輯 |
| **建議方式** | Cypress E2E |
| **阻礙** | 無 |
| **對應 spec 檔** | `automation/e2e/specs/data-validation.cy.ts` |
