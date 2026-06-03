# Test Plan: 圖卡配對

## Status

- Updated: 2026-06-03
- Feature workspace: qa-workspace/specs/card-matching/

## Scenario Coverage

| Scenario ID | Issue | 描述 | 狀態 |
|-------------|-------|------|------|
| SC-CARD-MATCHING-001 | #9 | 4M 個案不顯示圖卡配對 | Ready |
| SC-CARD-MATCHING-002 | #9 | 6M 個案不顯示圖卡配對 | Ready |
| SC-CARD-MATCHING-003 | #9 | 8M 個案可正常顯示圖卡配對 | Ready |
| SC-CARD-MATCHING-004 | #10 | 圖卡配對跳題範圍限制 | **BLOCKED** |
| SC-CARD-MATCHING-005 | #11 | 點擊圖案即算配對成功 | Ready |
| SC-CARD-MATCHING-006 | #11 | 配對成功後進入下一題 | Ready |

## Test Scope

- Issue #9：已完成，可測試。
- Issue #10：調整中，BLOCKED，待開發完成後補入。
- Issue #11：已完成，可測試。

## Out of Scope

- 拖拉交互邏輯（已依群健所確認改為點選）。

## Test Types

- E2E: 覆蓋圖卡配對出題條件（月齡起始）與作答互動。
- Negative: 確認 4M/6M 不出現圖卡配對。
- Regression: 確認修改後不影響其他年齡層題目顯示。

## Risks

- High: Issue #10（跳題上限）調整中，部分配對功能覆蓋不完整。
- Medium: 缺少穩定 selector 或 data-testid，自動化需等開發補齊。

## Open Questions

- 請參考 questions.md。
