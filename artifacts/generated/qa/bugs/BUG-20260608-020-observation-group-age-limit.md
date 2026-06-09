# Bug Report: 觀察組入口年齡限制未正確擋關

**ID**: BUG-20260608-020
**日期**: 2026-06-08
**回報者**: QA
**狀態**: 已驗證 PASS
**嚴重程度**: High
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

- 受影響功能：observation-group
- 受影響角色：一般使用者
- 資料風險：待確認
- 阻塞測試項目：observation-group 相關測試案例

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
| **預期** | 確保觀察組限1歲3個月(含)以上才可進入 |
| **實際** | 目前觀察組顯示1歲3個月個案可進入，在AI模組完成錄影後點「下一題」沒反應，無法進到觀察題組 |

## R — References（附件與參考）

- 截圖：待補充
- 相關 spec：`qa-workspace/specs/observation-group/spec.md`
- 相關測試案例：待補充
- 相關 Issue：

---

## 自動化評估

| 項目 | 說明 |
|------|------|
| **判斷結果** | 可 |
| **理由** | 可驗證觀察組入口年齡限制 |
| **建議方式** | Cypress E2E |
| **阻礙** | 無 |
| **對應 spec 檔** | `automation/e2e/specs/observation-group.cy.ts` |
