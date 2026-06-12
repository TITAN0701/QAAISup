# 專案待辦總表

> 最後更新：2026-06-12
> 來源合併：pm-qa-sync-checklist.md + architecture-improvement.md
> 用途：統一追蹤 PM/QA 溝通斷點與技術改善項目，依優先順序排列

---

## 說明

| 標籤 | 意義 |
|------|------|
| 🔴 P1 | 立即處理 — 阻塞測試推進或 CI 執行 |
| 🟡 P2 | 近期處理 — 影響正確性或流程效率 |
| 🟢 P3 | 長期優化 — 不緊急但值得改善 |
| ✅ | 已完成 |
| ❌ | 待處理 |

---

## 🔴 P1 — 立即處理

### [P1-1] 71 題 PM Questions 全數空白
- **負責方**：PM
- **狀態**：❌ 待處理
- **說明**：所有 16 個 feature 的 `questions.md` 中 PM Answer 欄位全部空白，QA 無法確認測試斷言與驗收標準，影響所有 TC 的正確性。
- **行動**：PM 依序開啟下列文件填寫答案後通知 QA

  **高影響功能（優先回覆）：**
  - [ ] login（8 題）→ `qa-workspace/specs/login/questions.md`
  - [ ] gait-analysis（5 題）→ `qa-workspace/specs/gait-analysis/questions.md`
  - [ ] verbal-expression（5 題）→ `qa-workspace/specs/verbal-expression/questions.md`
  - [ ] handwriting-recognition（5 題）→ `qa-workspace/specs/handwriting-recognition/questions.md`
  - [ ] account-register（5 題）→ `qa-workspace/specs/account-register/questions.md`
  - [ ] admin-backend（5 題）→ `qa-workspace/specs/admin-backend/questions.md`

  **一般功能：**
  - [ ] question-logic（5 題）→ `qa-workspace/specs/question-logic/questions.md`
  - [ ] observation-group（4 題）→ `qa-workspace/specs/observation-group/questions.md`
  - [ ] re-recording（4 題）→ `qa-workspace/specs/re-recording/questions.md`
  - [ ] progress-bar（4 題）→ `qa-workspace/specs/progress-bar/questions.md`
  - [ ] data-validation（4 題）→ `qa-workspace/specs/data-validation/questions.md`
  - [ ] question-content（4 題）→ `qa-workspace/specs/question-content/questions.md`
  - [ ] card-matching（4 題）→ `qa-workspace/specs/card-matching/questions.md`
  - [ ] video-recording（4 題）→ `qa-workspace/specs/video-recording/questions.md`
  - [ ] register（4 題）→ `qa-workspace/specs/register/questions.md`
  - [ ] forgot-password（4 題）→ `qa-workspace/specs/forgot-password/questions.md`

---

### [P1-2] issue-tracking-0507 的 8 個未解 Issue 未反映進 QA spec
- **負責方**：PM 確認狀態 → 通知 QA 更新 spec
- **狀態**：❌ 待處理
- **說明**：`pm-inbox/issue-tracking-0507.md` 中狀態為「調整中」或「待確認」的 Issue，尚未進入對應 feature 的 spec 或 questions.md，可能導致測試方向錯誤。
- **行動**：

  - [ ] **Issue 10**｜圖卡配對年齡層限制邏輯 → feature: card-matching
    - 問題：不同年齡層的圖卡顯示規則是否已確認？
    - 需要：更新 `qa-workspace/specs/card-matching/spec.md`

  - [ ] **Issue 17**｜看圖說故事計時邏輯 → feature: verbal-expression
    - 問題：計時起始 / 結束條件是否已確認？
    - 需要：更新 `qa-workspace/specs/verbal-expression/spec.md`

  - [ ] **Issue 19**｜無 AI 口語表達模組 → feature: verbal-expression
    - 問題：AI 模組未完成時測試範圍如何界定？
    - 需要：PM 確認是否 block 測試，或僅測試流程不驗 AI 結果

  - [ ] **Issue 22**｜無 AI 手繪圖形辨識拍攝模組 → feature: handwriting-recognition
    - 問題：拍攝模組何時到位？目前測試能否進行？
    - 需要：PM 確認是否應列為 BLOCKED

  - [ ] **Issue 26**｜3–6 歲檢測流程順序 → feature: question-logic
    - 問題：3–6 歲的題目順序是否有特殊流程？
    - 需要：更新 `qa-workspace/specs/question-logic/spec.md`

  - [ ] **Issue 27**｜3–6 歲年齡段測試不足 → feature: question-logic
    - 問題：此年齡段是否需要補測試案例？
    - 需要：QA 補充 test-cases.json（PM 確認後執行）

  - [ ] **Issue 28**｜手繪圖形缺少影片錄製 → feature: handwriting-recognition
    - 問題：是否需要錄影功能？是否與 video-recording 共用邏輯？
    - 需要：更新 spec，可能影響 re-recording 範圍

  - [ ] **Issue 19 & 22 共同確認**｜AI 模組未就緒的測試邊界
    - 問題：哪些 TC 應標記 Blocked？哪些仍可執行？
    - 需要：PM + QA 共同決定，更新 scenarios.md 的 status

---

### [P1-3] ~~data-validation.test.py BASE_URL 寫死~~
- **負責方**：Engineer
- **狀態**：✅ 已修（2026-06-12）
- **說明**：改為從 `os.environ.get("API_BASE_URL")` 讀取，不再連到 localhost。

---

### [P1-4] ~~MCP 斷線無 fallback，playwright-smoke-test 會卡住~~
- **負責方**：Engineer
- **狀態**：✅ 已修（2026-06-12）
- **說明**：MCP 工具不可用時立即輸出錯誤訊息並結束，不繼續後續步驟。

---

## 🟡 P2 — 近期處理

### [P2-1] 三份報告文件內容過期（只含 3 個 feature，2026-05-28）
- **負責方**：QA
- **狀態**：❌ 待處理
- **說明**：PM 查閱到的是舊版報告，可能誤判專案狀態。

  - [ ] **test-report.md** — 現況 3 個 feature / 14 TC，應為 15 個 feature / 74 TC
    - 行動：執行 `/QA-6-generate-report`
  - [ ] **release-summary.md** — 同上，連同 .docx 一起更新
    - 行動：執行 `/QA-6-generate-report`
  - [ ] **scenario-matrix.md** — 現況 3 個 feature / 14 情境
    - 行動：執行 `/QA-6-generate-report`

---

### [P2-2] progress-bar BLOCKED 無追蹤機制
- **負責方**：PM + QA
- **狀態**：❌ 待處理
- **說明**：`progress-bar` 的 `test-cases.json` 標記 BLOCKED，但沒有記錄阻塞原因、誰負責解除、預計時間。

  - [ ] PM 確認 BLOCKED 原因（等待規格確認 or 技術限制）
  - [ ] QA 在 `qa-workspace/specs/progress-bar/` 建立 `blocker.md`，記錄原因、對應問題編號、預計解除日期
  - [ ] 規格確認後，QA 執行 `/QA-design progress-bar`

---

### [P2-3] ENGINEERING-TASKS.md 的 51 個任務無優先排序
- **負責方**：QA + Engineer
- **狀態**：❌ 待處理
- **說明**：高風險功能的 selector 可能排在最後補，導致重要 TC 遲遲無法自動化。
- **行動**：依 `qa-knowledge/risk-rules.md` 風險分級，在每個任務前標記 `[🔴 HIGH]` / `[🟡 MED]` / `[🟢 LOW]`，並按優先序重排

---

### [P2-4] Command 未模組化，重複邏輯分散在 16 個 command 檔
- **負責方**：Engineer
- **狀態**：❌ 待處理
- **說明**：登入流程假設、錯誤處理、路徑規則各自維護，改一處不同步，維護成本高。
- **行動**：建立 `.claude/modules/` 目錄，共用邏輯抽出為獨立 `.md`，各 command 開頭加「先讀 `.claude/modules/xxx.md`」

---

### [P2-5] 切換專案後 command 路徑假設不自動更新
- **負責方**：Engineer
- **狀態**：❌ 待處理
- **說明**：`/project-init` 只更新 `.env` 和 `CLAUDE.md`，16 個 command 內的路徑假設不會跟著改，換專案後行為可能不符。
- **行動**：建立 `config.json` 集中管理路徑設定，command 改為讀取 config；`/project-init` 只需更新 config.json

---

## 🟢 P3 — 長期優化

### [P3-1] Bug 回報無 Google Sheet 整合，PM 需另開 GitHub 查看
- **負責方**：Engineer
- **狀態**：❌ 待處理
- **說明**：`/QA-bug-report` 推到 GitHub Issues，PM 通常不看 GitHub。
- **行動**：`npm run sync:sheet` 時一併將 `artifacts/generated/qa/bugs/` 推到 Google Sheet 的 Bug 頁籤

---

### [P3-2] 無政府 / 醫療場景 Preset，換系統時所有設定從頭填入
- **負責方**：Engineer
- **狀態**：❌ 待處理
- **說明**：切換新專案無預設值，設定成本高。
- **行動**：參考 qa-claude-skill 的 `government.json`，建立 `config/presets/medical-gov.json`

---

## 統計摘要

| 優先 | 項目數 | 已完成 | 待處理 | 主要負責方 |
|------|--------|--------|--------|-----------|
| 🔴 P1 | 4 | 2 | 2 | PM（P1-1、P1-2） |
| 🟡 P2 | 5 | 0 | 5 | QA / Engineer |
| 🟢 P3 | 2 | 0 | 2 | Engineer |
| **合計** | **11** | **2** | **9** | |

---

> 原始來源文件：
> - `artifacts/generated/qa/pm-qa-sync-checklist.md`（已由本文件取代）
> - `docs/architecture-improvement.md`（已由本文件取代）
