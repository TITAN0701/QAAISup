# Bug Report: 15秒前仍可結束上傳影片

**ID**: BUG-20260608-013
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
| **預期** | 強制執行最低錄製秒數限制，未達標前不可結束錄製 |
| **實際** | 影片顯示需錄製至少15秒，但不到15秒仍可結束上傳 |

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
