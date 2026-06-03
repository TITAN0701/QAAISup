# Test Plan: 資料驗證

## Status

- Updated: 2026-06-03
- Feature workspace: qa-workspace/specs/data-validation/

## Scenario Coverage

| Scenario ID | Issue | 描述 | 狀態 |
|-------------|-------|------|------|
| SC-DATA-VALIDATION-001 | #42 | 身分證字號第二碼為 1（男）驗證通過 | Ready |
| SC-DATA-VALIDATION-002 | #42 | 身分證字號第二碼為 2（女）驗證通過 | Ready |
| SC-DATA-VALIDATION-003 | #42 | 身分證字號第二碼非 1/2 時驗證失敗 | Ready |
| SC-DATA-VALIDATION-004 | #43 | 流水號按群健所規則編號 | **BLOCKED** |

## Test Scope

- Issue #42：已完成，可測試。
- Issue #43：調整中，BLOCKED。

## Out of Scope

- 其他資料欄位的格式驗證（如姓名、日期等），除非有明確 Issue。

## Test Types

- API: 覆蓋身分證字號性別碼驗證邏輯（後端規則）。
- E2E: 表單層面的驗證錯誤訊息顯示。
- Negative: 確認無效性別碼被正確拒絕。

## Risks

- Medium: Issue #43（流水號）BLOCKED，資料驗證覆蓋不完整。
- Low: 身分證字號驗證邏輯較單純，風險較低。

## Open Questions

- 請參考 questions.md。
- 需確認流水號（CASEID）的完整規則規格（#43）。
