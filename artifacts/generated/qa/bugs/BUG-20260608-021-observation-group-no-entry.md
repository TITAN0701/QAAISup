# Bug Report: AI模組完成後點下一題無法進入觀察題組

**ID**: BUG-20260608-021
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
| **預期** | 修正AI觀察題組的流程銜接，並保留已完成的AI模組結果，不需重做 |
| **實際** | AI模組完成測驗後按「下一題」無反應，按取消後重新開始會需要重做AI模組 |

## R — References（附件與參考）

- 截圖：待補充
- 相關 spec：`qa-workspace/specs/observation-group/spec.md`
- 相關測試案例：待補充
- 相關 Issue：

---

## 自動化評估

| 項目 | 說明 |
|------|------|
| **判斷結果** | 不可 |
| **理由** | 需AI模組實際跑完，涉及開始測驗限制 |
| **建議方式** | 手動 |
| **阻礙** | 涉及影片錄製 / 需 AI 模組 / 涉及開始測驗限制 |
| **對應 spec 檔** | `automation/e2e/specs/observation-group.cy.ts` |
