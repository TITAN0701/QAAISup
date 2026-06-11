# Test Plan: 重新錄製

## Status

- Updated: 2026-06-03
- Feature workspace: qa-workspace/specs/re-recording/

## Scenario Coverage

| Scenario ID | Issue | 描述 | 狀態 |
|-------------|-------|------|------|
| SC-RE-RECORDING-001 | #38 | 重新錄製後可連貫完成所有待補錄模組 | Ready |
| SC-RE-RECORDING-002 | #38 | 重新錄製不觸發圖卡配對 | Ready |
| SC-RE-RECORDING-003 | #38 | 所有待補錄模組完成後顯示完成畫面 | Ready |
| SC-RE-RECORDING-004 | #38 | 中途中斷後可再次進入繼續 | Ready |

## Test Scope

- Issue #38 為「已完成」狀態，全部納入測試。
- 無 BLOCKED 情境。

## Out of Scope

- 單次首次錄製流程（屬於各模組本身的測試範疇）。

## Test Types

- E2E: 覆蓋完整補錄流程（多模組連貫、中途中斷恢復）。
- Negative: 確認補錄流程不觸發圖卡配對或評測結果。
- Regression: 確認修正不影響檢測紀錄頁面與正常評測流程。

## Risks

- Medium: 測試需要事先建立有多個待補錄模組的個案資料。
- Medium: 流程狀態保留的測試需要控制中途中斷的時機。

## Open Questions

- 請參考 questions.md。
