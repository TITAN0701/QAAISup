# Bug Report: 口語表達計時器應為每張圖獨立60秒反向倒數

**ID**: BUG-20260608-015
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

- 受影響功能：verbal-expression
- 受影響角色：一般使用者
- 資料風險：待確認
- 阻塞測試項目：verbal-expression 相關測試案例

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
| **預期** | 改為每張圖獨立計時60秒反向倒數 |
| **實際** | 口語表達計時方式有誤，目前設為6分鐘內全部作業完成，即刻失敗也無法進到下一題 |

## R — References（附件與參考）

- 截圖：待補充
- 相關 spec：`qa-workspace/specs/verbal-expression/spec.md`
- 相關測試案例：待補充
- 相關 Issue：

---

## 自動化評估

| 項目 | 說明 |
|------|------|
| **判斷結果** | 部分可 |
| **理由** | 需進入測驗流程，受開始測驗限制 |
| **建議方式** | Cypress E2E |
| **阻礙** | 需人工輔助確認 |
| **對應 spec 檔** | `automation/e2e/specs/verbal-expression.cy.ts` |
