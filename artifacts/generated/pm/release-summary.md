# PM 發布摘要報告

> 專案：國衛院學齡前兒童發展數位評估系統（wetpaint）
> 環境：SIT — https://sit-wetpaint.nhri.org.tw/
> 報告日期：2026-06-12
> 撰寫：QA Team

---

## 整體狀態

| 指標 | 數值 |
|------|------|
| 涵蓋功能數 | 15（共 16，1 個 BLOCKED）|
| 測試案例總數 | 74 |
| Pass | 19 |
| Fail | **0** |
| Skip（待 SDET）| 15 |
| 未執行 | 40 |

**目前無已知 Fail。** Skip 為自動化草稿待補 selector，不影響功能正確性判斷。

---

## 各功能狀態

| 功能 | 優先度 | 測試結果 | 備註 |
|------|--------|---------|------|
| 登入（login） | High | ✅ 5 Pass / 1 Skip | 正常登入流程通過 |
| 忘記密碼（forgot-password） | High | ✅ 4 Pass | 全數通過 |
| 帳號建立（register） | High | ⚠️ 2 Pass / 2 Skip | 部分草稿待補 selector |
| 帳號資料填寫（account-register） | High | ⬜ 未執行 | 需 SDET 補充自動化 |
| 後台管理（admin-backend） | High | ✅ 7 Pass / 1 Skip | 停用/啟用帳號正常 |
| 圖卡配對（card-matching） | High | ⬜ 未執行 | — |
| 資料驗證（data-validation） | Medium | ⬜ 未執行 | — |
| 步態分析（gait-analysis） | Medium | ⬜ 未執行 | — |
| 手寫辨識（handwriting-recognition） | Medium | ⬜ 未執行 | — |
| 觀察題組（observation-group） | High | ⬜ 未執行 | — |
| 題目內容（question-content） | High | ⬜ 未執行 | — |
| 題目邏輯（question-logic） | High | ⬜ 未執行 | — |
| 補錄（re-recording） | High | ⬜ 未執行 | — |
| 口語表達（verbal-expression） | High | ⬜ 未執行 | — |
| 影片錄製（video-recording） | High | ⚠️ 1 Pass / 1 Skip / 4 未執行 | 錄製說明文字通過 |
| 進度條（progress-bar） | — | 🚫 BLOCKED | test-cases 尚未完成 |

---

## 發布風險

| 等級 | 描述 |
|------|------|
| 低 | 已執行的 5 個功能全數通過，無 Fail |
| 中 | 10 個功能尚未執行，無法確認狀態 |

### PM 決策需求

1. **progress-bar**：是否在此版本 scope 內？目前無 test-cases，QA 無法覆蓋。
2. **未執行功能**：排程 SDET 補充 selector 後安排下一輪執行，或由 PM 評估手動測試補充覆蓋。

---

## 客戶端影響

- 核心登入、帳號管理、後台管理流程已驗證通過。
- 評測核心功能（題目邏輯、圖卡配對、步態分析等）尚未完整自動化覆蓋，建議正式上線前補充手動驗收或下一輪自動化執行。

---

## 下一步

| 行動 | 負責人 | 優先度 |
|------|--------|--------|
| SDET 補充 observation-group、gait-analysis selector | SDET | High |
| 排程執行剩餘 10 個功能 | QA | High |
| 確認 progress-bar 是否列入此版本 | PM | Medium |
| 補充 account-register 自動化 | SDET | Medium |
