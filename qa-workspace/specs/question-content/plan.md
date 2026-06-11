# Test Plan: 題目內容

## Status

- Updated: 2026-06-03
- Feature workspace: qa-workspace/specs/question-content/

## Scenario Coverage

| Scenario ID | Issue | 描述 | 狀態 |
|-------------|-------|------|------|
| SC-QUESTION-CONTENT-001 | #5 | 測試標記題目已從系統移除 | Ready |
| SC-QUESTION-CONTENT-002 | #6 | 答題後正確切換到下一題（不重複）| Ready |
| SC-QUESTION-CONTENT-003 | #7 | 48M 個案可正常開始測驗 | Ready |
| SC-QUESTION-CONTENT-004 | #7 | 60M 個案可正常開始測驗 | Ready |
| SC-QUESTION-CONTENT-005 | #7 | 72M 個案可正常開始測驗 | Ready |
| SC-QUESTION-CONTENT-006 | #8 | 答對顯示正向鼓勵（非「答對了」）| Ready |
| SC-QUESTION-CONTENT-007 | #8 | 答錯顯示正向鼓勵（非「答錯了」）| Ready |

## Test Scope

- Issue #5~#8 均為「已完成」狀態，全部納入測試。
- 無 BLOCKED 情境。

## Out of Scope

- 題庫內容正確性驗證（超出 QA 範疇，由 PM/客戶確認）。
- 馬偕提供新題目後的導入驗證（待後續安排）。

## Test Types

- E2E: 覆蓋測驗啟動、題目顯示、答題切換完整流程。
- UI: 驗證回饋文字內容正確性。
- Regression: 確認題庫修改後不影響現有功能。

## Risks

- Medium: 48M/60M/72M 為暫時性題目，待馬偕提供正式題庫後需再次驗證。
- Low: 回饋文字為 UI 層面，較易驗證。

## Open Questions

- 請參考 questions.md。
