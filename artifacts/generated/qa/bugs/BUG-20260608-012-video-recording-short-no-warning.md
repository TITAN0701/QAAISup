# Bug Report: 影片時間不足未提醒且無法重錄

**ID**: BUG-20260608-012
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

- 受影響功能：video-recording
- 受影響角色：一般使用者
- 資料風險：待確認
- 阻塞測試項目：video-recording 相關測試案例

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
| **預期** | 錄製時長未達最低要求時彈出提醒，並提供重新錄製選項 |
| **實際** | 影片時間不足（如僅錄製17秒）未提醒，錄製完成也沒辦法重錄 |

## R — References（附件與參考）

- 截圖：待補充
- 相關 spec：`qa-workspace/specs/video-recording/spec.md`
- 相關測試案例：待補充
- 相關 Issue：

---

## 自動化評估

| 項目 | 說明 |
|------|------|
| **判斷結果** | 不可 |
| **理由** | 涉及影片錄製操作，需人工執行 |
| **建議方式** | 手動 |
| **阻礙** | 涉及影片錄製 / 需 AI 模組 / 涉及開始測驗限制 |
| **對應 spec 檔** | `automation/e2e/specs/video-recording.cy.ts` |
