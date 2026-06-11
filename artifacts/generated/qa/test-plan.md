# Test Plan

## Summary

- 總測試案例數：57
- Ready（已產生測試案例）：57
- BLOCKED（跳過）：18
- automation_candidate: true 數量：33

> 注意：progress-bar 功能全部 2 個情境均為 BLOCKED，無測試案例產生。

---

## 各功能覆蓋

| 功能 | 案例數 | High | Medium | Low | 可自動化 |
|------|--------|------|--------|-----|---------|
| question-logic | 6 | 5 | 1 | 0 | 6 |
| question-content | 7 | 5 | 2 | 0 | 5 |
| card-matching | 5 | 3 | 2 | 0 | 5 |
| video-recording | 6 | 4 | 2 | 0 | 2 |
| verbal-expression | 5 | 4 | 1 | 0 | 2 |
| observation-group | 4 | 4 | 0 | 0 | 0 |
| handwriting-recognition | 3 | 0 | 3 | 0 | 1 |
| gait-analysis | 10 | 0 | 8 | 1 | 6 (UI text) |
| re-recording | 4 | 2 | 2 | 0 | 2 |
| progress-bar | 0 | 0 | 0 | 0 | 0 |
| account-register | 3 | 3 | 0 | 0 | 1 |
| data-validation | 3 | 0 | 3 | 0 | 3 |
| admin-backend | 4 | 3 | 1 | 0 | 4 |
| **合計** | **60** | **33** | **25** | **1** | **37** |

> 說明：gait-analysis 中 TC-GAIT-001 ~ TC-GAIT-005、TC-GAIT-007、TC-GAIT-009 共 7 個 UI 文字驗證案例標記 automation_candidate: true（DOM 文字比對）；TC-GAIT-006、TC-GAIT-008、TC-GAIT-010 需人工視覺或媒體模擬，標記 false。

---

## BLOCKED 項目追蹤

| 功能 | Scenario ID | Issue | 原因 | 等待對象 |
|------|-------------|-------|------|---------|
| card-matching | SC-CARD-MATCHING-004 | #10 | 圖卡配對跳題上限規則（升一階）尚未確認完成 | PM / 開發 |
| verbal-expression | SC-VERBAL-EXPRESSION-005 | #17 | 看圖說故事最少完成時間合理值尚未確認 | PM / 開發 |
| verbal-expression | SC-VERBAL-EXPRESSION-007 | #19 | AI 口語表達模組部署狀況尚未確認完成 | 開發 |
| handwriting-recognition | SC-HANDWRITING-001 | #22 | AI 手繪圖形辨識拍攝模組尚未確認部署完成 | 開發 |
| handwriting-recognition | SC-HANDWRITING-005 | #26 | 3-6 歲檢測流程順序尚未確認修正，需與主任確認流程設計 | PM / 主任 / 開發 |
| handwriting-recognition | SC-HANDWRITING-006 | #27 | 3-6 歲部分月齡仍無法測試（題目不足），尚未確認修正完成 | 開發 |
| handwriting-recognition | SC-HANDWRITING-007 | #28 | 手繪圖形模組完整流程（影片+照片）尚未確認修正 | 開發 |
| progress-bar | SC-PROGRESS-BAR-001 | #39 | AI 模組進度條更新規則尚未由群健所提供 | 群健所 / PM |
| progress-bar | SC-PROGRESS-BAR-002 | #40 | 觀察題組進度條更新規則尚未由群健所提供 | 群健所 / PM |
| account-register | SC-ACCOUNT-REGISTER-004 | #46 | 邀請規則尚未完成內部測試與確認 | 開發（內部測試） |
| data-validation | SC-DATA-VALIDATION-004 | #43 | 流水號（CASEID）編號規則尚未與群健所確認完成 | 群健所 / PM |
| admin-backend | SC-ADMIN-BACKEND-005 | #46 | 邀請規則尚未完成內部測試 | 開發（內部測試） |
| admin-backend | SC-ADMIN-BACKEND-006 | #49 | 帳號管理列表檢視權限規則尚未完成內部測試 | 開發（內部測試） |
| admin-backend | SC-ADMIN-BACKEND-007 | #50 | 局處／機構建立需求與實作狀態不明 | PM / 開發 |
| admin-backend | SC-ADMIN-BACKEND-008 | #51 | 局處／機構維護頁面需求與實作狀態不明 | PM / 開發 |

---

## 自動化建議

### 優先自動化（Cypress）
- 跳題邏輯（question-logic）全部 6 個案例：核心商業規則，穩定且輸入輸出明確
- 題目內容（question-content）TC-QCONTENT-001 ~ TC-QCONTENT-005：DOM 文字比對，易實作
- 圖卡配對（card-matching）TC-CARDMATCH-001 ~ TC-CARDMATCH-005：年齡層邏輯驗證
- 身分證驗證（data-validation）全部 3 個案例：建議 pytest API contract test
- 後台帳號管理（admin-backend）TC-ADMIN-001 ~ TC-ADMIN-004：核心權限流程

### 暫緩自動化
- 所有影片錄製類案例：需媒體裝置模擬，建議 manual test
- 觀察題組（observation-group）全部案例：依賴 AI 模組上傳非同步回應
- 視覺確認類案例（圖示、示意圖、輔助框位置）：需人工檢查

---

*產生日期：2026-06-03*
