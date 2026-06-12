# PM / QA 同步問題 Checklist

> 產出時間：2026-06-10
> 來源：專案整體同步分析
> 用途：供 PM 與 QA 逐項確認，每項完成後打勾

---

## 區塊 A｜PM Questions 待回覆（71 題）

> 所有 feature 的 `questions.md` 中，PM Answer 欄位全部空白。
> 請 PM 依序開啟對應文件填寫答案後通知 QA。

### A1. 高影響功能（優先處理）

- [ ] **login**（8 題）
  - 文件：`qa-workspace/specs/login/questions.md`
  - 影響：登入流程驗收標準、錯誤提示文案、帳號格式規則

- [ ] **gait-analysis 走路步態**（5 題）
  - 文件：`qa-workspace/specs/gait-analysis/questions.md`
  - 影響：步態分析流程、AI 模組觸發時機、判定標準

- [ ] **verbal-expression 口語表達**（5 題）
  - 文件：`qa-workspace/specs/verbal-expression/questions.md`
  - 影響：計時邏輯、無 AI 模組時的備案行為

- [ ] **handwriting-recognition 手繪圖形辨識**（5 題）
  - 文件：`qa-workspace/specs/handwriting-recognition/questions.md`
  - 影響：拍攝模組有無、手繪辨識觸發條件

- [ ] **account-register 帳號/註冊**（5 題）
  - 文件：`qa-workspace/specs/account-register/questions.md`
  - 影響：驗證碼邏輯、必填欄位定義

- [ ] **admin-backend 後台管理**（5 題）
  - 文件：`qa-workspace/specs/admin-backend/questions.md`
  - 影響：後台權限、資料查閱範圍

### A2. 一般功能

- [ ] **question-logic 跳題邏輯**（5 題）
  - 文件：`qa-workspace/specs/question-logic/questions.md`

- [ ] **observation-group 觀察題組**（4 題）
  - 文件：`qa-workspace/specs/observation-group/questions.md`

- [ ] **re-recording 重新錄製**（4 題）
  - 文件：`qa-workspace/specs/re-recording/questions.md`

- [ ] **progress-bar 進度條**（4 題）
  - 文件：`qa-workspace/specs/progress-bar/questions.md`

- [ ] **data-validation 資料驗證**（4 題）
  - 文件：`qa-workspace/specs/data-validation/questions.md`

- [ ] **question-content 題目內容**（4 題）
  - 文件：`qa-workspace/specs/question-content/questions.md`

- [ ] **card-matching 圖卡配對**（4 題）
  - 文件：`qa-workspace/specs/card-matching/questions.md`

- [ ] **video-recording 影片錄製**（4 題）
  - 文件：`qa-workspace/specs/video-recording/questions.md`

- [ ] **register 創建帳號入口**（4 題）
  - 文件：`qa-workspace/specs/register/questions.md`

- [ ] **forgot-password 忘記密碼**（4 題）
  - 文件：`qa-workspace/specs/forgot-password/questions.md`

---

## 區塊 B｜issue-tracking-0507 未解 Issue（8 項）

> 來源：`pm-inbox/issue-tracking-0507.md`
> 以下 Issue 狀態為「調整中」或「待確認」，尚未反映進 QA spec 或 questions.md。
> 請 PM 逐項確認最新狀態，並告知 QA 是否需要更新測試設計。

- [ ] **Issue 10**｜圖卡配對年齡層限制邏輯
  - 對應 feature：card-matching
  - 問題：不同年齡層的圖卡顯示規則是否已確認？
  - 需要：更新 `qa-workspace/specs/card-matching/spec.md` 與 questions.md

- [ ] **Issue 17**｜看圖說故事計時邏輯
  - 對應 feature：verbal-expression
  - 問題：計時起始/結束條件是否已確認？
  - 需要：更新 `qa-workspace/specs/verbal-expression/spec.md`

- [ ] **Issue 19**｜無 AI 口語表達模組
  - 對應 feature：verbal-expression
  - 問題：AI 模組尚未完成時，此 feature 測試範圍如何界定？
  - 需要：PM 確認是否 block 測試，或僅測試流程不驗 AI 結果

- [ ] **Issue 22**｜無 AI 手繪圖形辨識拍攝模組
  - 對應 feature：handwriting-recognition
  - 問題：拍攝模組何時到位？目前測試能否進行？
  - 需要：PM 確認 handwriting-recognition 是否應列為 BLOCKED

- [ ] **Issue 26**｜3–6 歲檢測流程順序
  - 對應 feature：question-logic
  - 問題：3–6 歲的題目順序是否有特殊流程？
  - 需要：更新 `qa-workspace/specs/question-logic/spec.md`

- [ ] **Issue 27**｜3–6 歲年齡段測試不足
  - 對應 feature：question-logic
  - 問題：此年齡段是否需要補測試案例？
  - 需要：QA 補充 test-cases.json，若 PM 確認需補

- [ ] **Issue 28**｜手繪圖形缺少影片錄製
  - 對應 feature：handwriting-recognition
  - 問題：手繪圖形是否需要錄影功能？若需要，是否與 video-recording 共用邏輯？
  - 需要：更新 spec，可能影響 re-recording feature 範圍

- [ ] **Issue 19 & 22 共同確認**｜AI 模組未就緒的測試邊界
  - 對應 feature：verbal-expression、handwriting-recognition
  - 問題：AI 模組未就位時，哪些 TC 應標記 Blocked？哪些仍可執行？
  - 需要：PM + QA 共同決定，更新 scenarios.md 的 status

---

## 區塊 C｜描述文件更新（QA 執行）

> 以下文件內容已落後，需 QA 重新產出。

- [ ] **test-report.md 重新產出**
  - 現況：只含 3 個 feature（login、forgot-password、register），2026-05-28
  - 正確：應涵蓋 15 個 feature、74 個 TC
  - 行動：執行 `/QA-6-generate-report`

- [ ] **release-summary.md 重新產出**
  - 現況：只含 3 個 feature，2026-05-28
  - 正確：應涵蓋所有 feature 的最新狀態
  - 行動：同上，連同 .docx 一起更新

- [ ] **scenario-matrix.md 重新產出**
  - 現況：只含 3 個 feature、14 個情境，2026-05-28
  - 正確：應涵蓋 15 個 feature 的完整情境矩陣
  - 行動：執行 `/QA-6-generate-report` 或單獨重建 scenario-matrix

- [ ] **CLAUDE.md 功能狀態表修正**
  - 現況：observation-group 與 data-validation 的 .cy.ts 欄位標記 ❌
  - 正確：兩個 .cy.ts 檔案已存在，應標記 ✅
  - 行動：手動更新 CLAUDE.md 第 115–116 行

---

## 區塊 D｜progress-bar BLOCKED 確認（QA + PM）

- [ ] **progress-bar test-cases.json 尚未產出**
  - 現況：CLAUDE.md 標記為「❌ BLOCKED」
  - 問題：BLOCKED 的原因是等待 PM 確認規格，還是技術限制？
  - 行動：PM 確認後，若規格已穩定 → QA 執行 `/QA-4-generate-testcases progress-bar`

---

## 統計摘要

| 區塊 | 項目數 | 負責方 |
|------|--------|--------|
| A — PM Questions 待回覆 | 71 題 / 16 個 feature | PM |
| B — Issue Tracking 未解 | 8 個 Issue | PM → 通知 QA |
| C — 文件更新 | 4 份文件 | QA |
| D — progress-bar BLOCKED | 1 項確認 | PM + QA |
| **合計** | **84 項** | |

---

> 完成後請通知 QA 更新對應的 spec 與報告文件。
