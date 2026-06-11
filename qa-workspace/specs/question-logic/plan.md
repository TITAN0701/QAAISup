# Test Plan: 跳題邏輯

## Status

- Updated: 2026-06-03
- Feature workspace: qa-workspace/specs/question-logic/

## Scenario Coverage

| Scenario ID | Issue | 描述 | 狀態 |
|-------------|-------|------|------|
| SC-QUESTION-LOGIC-001 | #1 | 從實質年齡層出題，答錯無限制下降 | Ready |
| SC-QUESTION-LOGIC-002 | #1, #2 | 答對後只升一階 | Ready |
| SC-QUESTION-LOGIC-003 | #2 | 42M 個案不可越過兩階升至 60M | Ready |
| SC-QUESTION-LOGIC-004 | #3 | 跨模組後回到實質年齡層對應模組 | Ready |
| SC-QUESTION-LOGIC-005 | #4 | 觀察題組全錯顯示最低 2 個月 | Ready |
| SC-QUESTION-LOGIC-006 | #1, #4 | 已在最低階時繼續答錯的邊界行為 | Ready |

## Test Scope

- Issue #1~#4 均為「已完成」狀態，全部納入測試。
- 無 BLOCKED 情境。

## Out of Scope

- 其他功能模組的跳題行為（非 question-logic 範疇）。

## Test Types

- E2E: 覆蓋完整跳題流程（升階、降階、跨模組）。
- Boundary: 覆蓋最低/最高年齡層邊界條件。
- Regression: 確認修正後不影響其他模組出題流程。

## Risks

- Medium: 需要多種年齡層測試資料（2M、4M、6M、42M 等）。
- Medium: 缺少穩定 selector 或 data-testid，自動化需等開發補齊。

## Open Questions

- 請參考 questions.md。
