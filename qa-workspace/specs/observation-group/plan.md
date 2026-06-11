# Test Plan: 觀察題組

## Status

- Updated: 2026-06-03
- Feature workspace: qa-workspace/specs/observation-group/

## Scenario Coverage

| Scenario ID | Issue | 描述 | 狀態 |
|-------------|-------|------|------|
| SC-OBSERVATION-GROUP-001 | #20 | 所有年齡層完成 AI 模組後可進入觀察題組 | Ready |
| SC-OBSERVATION-GROUP-002 | #20 | 1 歲 3 個月以外年齡層也能進入觀察題組 | Ready |
| SC-OBSERVATION-GROUP-003 | #21 | AI 模組完成後無需取消重來即可進入觀察題組 | Ready |
| SC-OBSERVATION-GROUP-004 | #21 | 重新進入觀察題組不需重做 AI 模組 | Ready |

## Test Scope

- Issue #20~#21 均為「已完成」狀態，全部納入測試。
- 無 BLOCKED 情境。

## Out of Scope

- 觀察題組題目內容正確性（屬於題庫範疇）。

## Test Types

- E2E: 覆蓋 AI 模組至觀察題組的完整流程銜接。
- Regression: 確認修正後不影響其他模組流程。
- State: 驗證 AI 模組結果保留機制。

## Risks

- Medium: 需要多種年齡層（>15M）的測試個案。
- Medium: 流程銜接測試依賴 AI 模組完成的狀態，測試準備複雜。

## Open Questions

- 請參考 questions.md。
