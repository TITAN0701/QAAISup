# Test Plan: 帳號/註冊

## Status

- Updated: 2026-06-03
- Feature workspace: qa-workspace/specs/account-register/

## Scenario Coverage

| Scenario ID | Issue | 描述 | 狀態 |
|-------------|-------|------|------|
| SC-ACCOUNT-REGISTER-001 | #41 | 填寫資料並取得驗證碼後可完成註冊 | Ready |
| SC-ACCOUNT-REGISTER-002 | #41 | 正確驗證碼可通過驗證 | Ready |
| SC-ACCOUNT-REGISTER-003 | #41 | 錯誤驗證碼無法完成註冊 | Ready |
| SC-ACCOUNT-REGISTER-004 | #46 | 邀請制度規則 | **BLOCKED** |

## Test Scope

- Issue #41：已完成，可測試。
- Issue #46：待內部測試，BLOCKED。

## Out of Scope

- 帳號登入流程（屬於 login 功能範疇）。
- 忘記密碼流程（屬於 forgot-password 功能範疇）。

## Test Types

- E2E: 覆蓋完整註冊流程（填寫資料、收驗證碼、驗證、完成）。
- Negative: 覆蓋錯誤驗證碼等負向情境。
- Security: 驗證碼有效期限與重複使用防護（視需求補充）。

## Risks

- Medium: Issue #46（邀請制度）BLOCKED，影響部分帳號管理測試覆蓋。
- Medium: 測試需要可接收驗證碼的測試信箱或 Mock 驗證碼 API。

## Open Questions

- 請參考 questions.md。
