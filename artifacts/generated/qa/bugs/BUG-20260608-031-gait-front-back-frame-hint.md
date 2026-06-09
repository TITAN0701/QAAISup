# Bug Report: 步態正背面模組輔助框提示內容不夠明確

**ID**: BUG-20260608-031
**日期**: 2026-06-08
**回報者**: QA
**狀態**: 已驗證 PASS
**嚴重程度**: Low
**優先級**: P3

---

## R — Reproduction Steps（重現步驟）

環境：SIT — https://sit-wetpaint.nhri.org.tw/
瀏覽器：待補充
帳號：0999999993

1. 登入系統
2. 進入相關功能頁面
3. 執行相關操作，觀察問題

## I — Impact（影響範圍）

- 受影響功能：gait-analysis
- 受影響角色：一般使用者
- 資料風險：待確認
- 阻塞測試項目：gait-analysis 相關測試案例

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
| **預期** | 提示修改為「錄影前避免孩子超出輔助框，錄影後確保孩子在輔助框內」 |
| **實際** | 正/背面模組提示詞「錄影前避免孩子超出輔助框」，內容不夠明確 |

## R — References（附件與參考）

- 截圖：待補充
- 相關 spec：`qa-workspace/specs/gait-analysis/spec.md`
- 相關測試案例：待補充
- 相關 Issue：

---

## 自動化評估

| 項目 | 說明 |
|------|------|
| **判斷結果** | 可 |
| **理由** | 可驗證提示文字內容 |
| **建議方式** | Cypress E2E |
| **阻礙** | 無 |
| **對應 spec 檔** | `automation/e2e/specs/gait-analysis.cy.ts` |
