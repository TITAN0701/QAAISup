# Test Scenarios: 資料驗證

## Source
- Feature: data-validation
- Issue Source: pm-inbox/issue-tracking-0507.md

## Scenarios

### SC-DATA-VALIDATION-001: 身分證字號第二碼為 1（男）驗證通過
- **Status**: Ready
- **Given**: 使用者在表單中輸入身分證字號，第二碼為「1」（男性）
- **When**: 系統進行身分證字號驗證
- **Then**: 驗證通過，系統接受此身分證字號
- **Type**: api
- **Priority**: medium
- **Issue Ref**: #42

### SC-DATA-VALIDATION-002: 身分證字號第二碼為 2（女）驗證通過
- **Status**: Ready
- **Given**: 使用者在表單中輸入身分證字號，第二碼為「2」（女性）
- **When**: 系統進行身分證字號驗證
- **Then**: 驗證通過，系統接受此身分證字號
- **Type**: api
- **Priority**: medium
- **Issue Ref**: #42

### SC-DATA-VALIDATION-003: 身分證字號第二碼非 1 或 2 時驗證失敗
- **Status**: Ready
- **Given**: 使用者在表單中輸入身分證字號，第二碼為「3」或其他非 1/2 的數字
- **When**: 系統進行身分證字號驗證
- **Then**: 系統顯示驗證錯誤訊息，不接受此身分證字號
- **Type**: api
- **Priority**: medium
- **Issue Ref**: #42

### SC-DATA-VALIDATION-004: 流水號按群健所規則編號（調整中）
- **Status**: BLOCKED
- **Blocked Reason**: Issue #43 狀態為「調整中」，流水號（CASEID）的具體編號規則尚未與群健所確認完成，無法建立驗證情境。
- **Issue Ref**: #43
