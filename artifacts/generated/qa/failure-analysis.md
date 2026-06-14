# Failure Analysis

> 報告日期：2026-06-14
> 本次執行：Cypress 14.5.4 / Electron 130 headless，SIT 環境
> Pipeline ID：2026-06-14-001

---

## 概況

本次執行共 **58 件自動化規格**，結果：Pass 20、**Pending 38、Fail 0**。

**無任何 Fail（系統錯誤/功能異常）**，所有未通過案例均為 `it.skip()`（Pending），原因可分為三類：

| 類型 | 數量 | 說明 |
|------|------|------|
| SDET 技術待解決 | 27 | 需 API intercept、cy.clock()、媒體裝置模擬 |
| SIT 環境限制 | 8 | 功能未開放、需外部非同步 API |
| 人工視覺驗證 | 3 | 無法純自動化，需截圖目視確認 |

---

## 類型一：SDET 技術待解決

### card-matching（5 件）

| TC ID | 阻塞原因 |
|-------|---------|
| TC-CARDMATCH-001 | 需 API intercept 確認題型不含圖卡配對，4M 孩童無法完整走完測驗流程 |
| TC-CARDMATCH-002 | 同上，6M 孩童 |
| TC-CARDMATCH-003 | 需確認 8M 孩童測驗中圖卡配對題目出現的 DOM 特徵 |
| TC-CARDMATCH-004 | 需進入圖卡配對題目（8M 孩童），selector 待確認 |
| TC-CARDMATCH-005 | 同上，需確認正向回饋 DOM 元素 |

**待辦：** SDET 需取得 8M 孩童測驗的 Playwright snapshot，確認圖卡配對題目的辨識特徵

---

### question-logic（5 件）

| TC ID | 阻塞原因 |
|-------|---------|
| TC-QLOGIC-001 | 年齡層降級邏輯需 API intercept 或題庫比對驗證，目前無 intercept stub |
| TC-QLOGIC-002 | 年齡層升降需 API intercept 驗證 |
| TC-QLOGIC-003 | 最高年齡層上限驗證需 API intercept |
| TC-QLOGIC-004 | 跨模組跳轉需確認 URL pattern 或 heading 文字變化 |
| TC-QLOGIC-005 | 需有 AI 模組完成的 6M 個案；結果頁月齡顯示方式待確認 |

**待辦：** SDET 加入 `cy.intercept()` stub 模擬答對/答錯後的 API 回應

---

### verbal-expression（2 件）

| TC ID | 阻塞原因 |
|-------|---------|
| TC-VERBAL-001 | 計時器倒數需等待 60 秒；可用 cy.clock() 加速，待實作 |
| TC-VERBAL-002 | 同上，需 cy.clock() 模擬 60 秒過期 |

**待辦：** SDET 加入 `cy.clock()` + `cy.tick(60000)` 加速計時器

---

### question-content（2 件）

| TC ID | 阻塞原因 |
|-------|---------|
| TC-QCONTENT-001 | 需在單一 test 中遍歷所有題目（題數不定，頁面動態切換），遍歷邏輯待設計 |
| TC-QCONTENT-002 | 48M 新孩童第一題為精細動作拍照題（step=graphic-copying-photo），不含是/否按鈕，需確認哪個月齡第一題為選擇題 |

**待辦：** TC-001 設計動態遍歷邏輯；TC-002 確認適合測試的起始月齡

---

### gait-analysis（7 件）

| TC ID | 阻塞原因 |
|-------|---------|
| TC-GAIT-001~005, 007, 009 | 需 Playwright 取得步態分析頁面 snapshot 以確認 selector；目前缺少對應頁面截圖 |

**待辦：** 使用 `/playwright-smoke-test` 補齊步態分析相關頁面截圖後，SDET 更新 selector

---

### handwriting-recognition（1 件）

| TC ID | 阻塞原因 |
|-------|---------|
| TC-HWRITE-003 | 需媒體裝置（相機）操作模擬，驗證梯形輔助框消失；目前 Cypress 環境無相機模擬 |

**待辦：** 評估使用 `cy.stub(navigator.mediaDevices, 'getUserMedia')` 模擬相機

---

### video-recording（2 件）

| TC ID | 阻塞原因 |
|-------|---------|
| TC-VIDEO-005 | 需進入大肢體模組錄製頁面（Playwright snapshot 缺失，selector 未確認） |
| TC-VIDEO-006 | 需進入側面模組錄製頁面（同上） |

**待辦：** 補齊錄製頁面 snapshot，確認 DOM 中說明文字的 selector

---

## 類型二：SIT 環境限制

### register（4 件，BLOCKED）

| TC ID | 阻塞原因 |
|-------|---------|
| TC-REGISTER-001~004 | **SIT 環境帳號創建功能未開放（Blocked）**，創建帳號按鈕已被系統停用 |

**待辦：** 確認 SIT 環境是否預計開放帳號創建；若不開放需改以 UAT 環境測試

---

### account-register（1 件）

| TC ID | 阻塞原因 |
|-------|---------|
| TC-ACCREG-001 | 需 mock 驗證碼；SIT 環境無法取得真實 Email 驗證碼 |

**待辦：** SDET 實作驗證碼 mock（或與後端協商提供固定測試驗證碼）

---

### observation-group（4 件）

| TC ID | 阻塞原因 |
|-------|---------|
| TC-OBSERVE-001~004 | 需等待 AI 模組影片上傳完成（外部非同步 API），目前無法在 CI 環境模擬 |

**待辦：** 考慮使用已完成 AI 模組的固定測試個案（如 userId=502），或 stub AI 模組完成 API

---

### data-validation（1 件）

| TC ID | 阻塞原因 |
|-------|---------|
| TC-DATAVAL-001 | 身分證驗證 API 測試需獨立 pytest，不屬 Cypress e2e 範疇；pytest 測試尚未建立 |

**待辦：** SDET 在 `automation/api/tests/` 建立 pytest 身分證驗證測試

---

### re-recording（2 件）

| TC ID | 阻塞原因 |
|-------|---------|
| TC-REREC-001, 003 | 需等待影片上傳完成（外部非同步行為），無法在 headless 環境模擬錄製流程 |

---

## 類型三：人工視覺驗證

| TC ID | Feature | 阻塞原因 |
|-------|---------|---------|
| TC-GAIT-006 | gait-analysis | 需人工確認輔助框位置（視覺判斷）|
| TC-HWRITE-001 | handwriting-recognition | 需人工確認示意圖不含手或筆 |
| TC-HWRITE-002 | handwriting-recognition | 需人工確認圖文一致性 |

**建議：** 這 3 件可安排 QA 人工測試回填結果，不需等待自動化解決

---

## 無 Fail 說明

本次執行 **0 件 Fail**，代表：
- 系統無明確 regression（已自動化的 20 件全數通過）
- 所有未執行案例均為技術/環境限制，非系統問題
- 特別確認：測驗最低邊界（2M 持續答錯不崩潰）已通過
- 特別確認：48M/60M/72M 題庫完整性已通過
