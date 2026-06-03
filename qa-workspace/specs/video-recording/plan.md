# Test Plan: 影片錄製

## Status

- Updated: 2026-06-03
- Feature workspace: qa-workspace/specs/video-recording/

## Scenario Coverage

| Scenario ID | Issue | 描述 | 狀態 |
|-------------|-------|------|------|
| SC-VIDEO-RECORDING-001 | #12 | 錄製時長不足時顯示提醒 | Ready |
| SC-VIDEO-RECORDING-002 | #12 | 錄製時長不足時提供重新錄製選項 | Ready |
| SC-VIDEO-RECORDING-003 | #13 | 未達最低秒數前無法結束錄製 | Ready |
| SC-VIDEO-RECORDING-004 | #13 | AI 模組影片需強制錄製達最低秒數 | Ready |
| SC-VIDEO-RECORDING-005 | #14 | 大肢體模組錄製時長說明文字正確 | Ready |
| SC-VIDEO-RECORDING-006 | #14 | 走路側面模組錄製時長說明文字正確 | Ready |

## Test Scope

- Issue #12~#14 均為「已完成」狀態，全部納入測試。
- 無 BLOCKED 情境。

## Out of Scope

- 影片上傳後的 AI 分析結果驗證（屬於 AI 模組範疇）。

## Test Types

- E2E: 覆蓋錄製流程（開始、時長限制、結束、重錄）。
- UI: 驗證各模組錄製說明文字一致性。
- Negative: 確認提早結束或時長不足被正確阻擋。

## Risks

- High: 影片錄製測試需要實際裝置與攝影機環境，自動化難度高。
- Medium: 各模組的最低錄製秒數可能因模組不同而異，需確認完整清單。

## Open Questions

- 請參考 questions.md。
