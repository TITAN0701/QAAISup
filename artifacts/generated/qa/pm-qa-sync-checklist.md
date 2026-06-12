# PM / QA 同步問題 Checklist

> 產出時間：2026-06-10
> 更新時間：2026-06-12
> 來源：專案整體同步分析
> 用途：QA 追蹤未解項目，每項完成後打勾

---

## 區塊 A｜QA Assumption 待評估（71 題）✅ 格式已更新

> ~~PM Answer 欄位空白~~ — 格式已於 2026-06-12 更新。
> PM 不進此系統，questions.md 改為 QA 內部備忘，`PM Answer:` 全數改為 `QA Assumption:`。
> QA 自行填入假設值後即可推進 `/QA-design`，不需等待 PM。

### 待 QA 填入 Assumption 的功能（優先）

- [ ] **login**（8 題）— `qa-workspace/specs/login/questions.md`
- [ ] **gait-analysis**（5 題）— `qa-workspace/specs/gait-analysis/questions.md`
- [ ] **verbal-expression**（5 題）— `qa-workspace/specs/verbal-expression/questions.md`
- [ ] **handwriting-recognition**（5 題）— `qa-workspace/specs/handwriting-recognition/questions.md`
- [ ] **account-register**（5 題）— `qa-workspace/specs/account-register/questions.md`
- [ ] **admin-backend**（5 題）— `qa-workspace/specs/admin-backend/questions.md`
- [ ] **question-logic**（5 題）— `qa-workspace/specs/question-logic/questions.md`
- [ ] **observation-group**（4 題）— `qa-workspace/specs/observation-group/questions.md`
- [ ] **re-recording**（4 題）— `qa-workspace/specs/re-recording/questions.md`
- [ ] **progress-bar**（4 題）— `qa-workspace/specs/progress-bar/questions.md`
- [ ] **data-validation**（4 題）— `qa-workspace/specs/data-validation/questions.md`
- [ ] **question-content**（4 題）— `qa-workspace/specs/question-content/questions.md`
- [ ] **card-matching**（4 題）— `qa-workspace/specs/card-matching/questions.md`
- [ ] **video-recording**（4 題）— `qa-workspace/specs/video-recording/questions.md`
- [ ] **register**（4 題）— `qa-workspace/specs/register/questions.md`
- [ ] **forgot-password**（4 題）— `qa-workspace/specs/forgot-password/questions.md`

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

- [x] **test-report.md** — 舊版（2026-05-28）已刪除，待執行測試後由 `/QA-6-generate-report` 重新產出
- [x] **release-summary.md** — 舊版已刪除，同上
- [x] **scenario-matrix.md** — 舊版已刪除，同上
- [x] **CLAUDE.md 功能狀態表** — observation-group、data-validation .cy.ts 已更新為 ✅（2026-06-12）

---

## 區塊 D｜progress-bar BLOCKED 確認（QA + PM）

- [ ] **progress-bar test-cases.json 尚未產出**
  - 現況：CLAUDE.md 標記為「❌ BLOCKED」
  - 問題：BLOCKED 的原因是等待 PM 確認規格，還是技術限制？
  - 行動：PM 確認後，若規格已穩定 → QA 執行 `/QA-design progress-bar`

---

## 統計摘要

| 區塊 | 項目數 | 負責方 | 狀態 |
|------|--------|--------|------|
| A — QA Assumption 待填入 | 71 題 / 16 個 feature | QA | ⏳ 待填 |
| B — Issue Tracking 未解 | 8 個 Issue | 等系統修復 | ⏳ 待確認 |
| C — 文件更新 | 4 份文件 | QA | ✅ 已處理 |
| D — progress-bar BLOCKED | 1 項確認 | 等外部規則 | ⏳ 待確認 |
