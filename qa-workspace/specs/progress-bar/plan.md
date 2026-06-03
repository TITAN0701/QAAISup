# Test Plan: 進度條

## Status

- Updated: 2026-06-03
- Feature workspace: qa-workspace/specs/progress-bar/

## Scenario Coverage

| Scenario ID | Issue | 描述 | 狀態 |
|-------------|-------|------|------|
| SC-PROGRESS-BAR-001 | #39 | AI 模組進度條隨測驗進度更新 | **BLOCKED** |
| SC-PROGRESS-BAR-002 | #40 | 觀察題組進度條隨答題進度更新 | **BLOCKED** |

## Test Scope

- Issue #39：待確認（等群健所提供規則），全部 BLOCKED。
- Issue #40：待確認（等群健所提供規則），全部 BLOCKED。

## Out of Scope

- 目前無可執行的測試情境，待規則確認後全面納入。

## Test Types

- E2E: 預計覆蓋進度條更新觸發條件與數值正確性。
- UI: 驗證進度條視覺顯示與百分比。

## Risks

- **Critical**: 本功能全部情境均為 BLOCKED，需等待客戶（群健所）提供進度條更新規則。
- High: 規則未確認前無法進行任何測試規劃。

## Open Questions

- 請參考 questions.md。
- 需向群健所確認 AI 模組進度條更新規則（#39）。
- 需向群健所確認觀察題組進度條更新規則（#40）。
