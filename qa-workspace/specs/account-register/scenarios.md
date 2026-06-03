# Test Scenarios: 帳號/註冊

## Source
- Feature: account-register
- Issue Source: pm-inbox/issue-tracking-0507.md

## Scenarios

### SC-ACCOUNT-REGISTER-001: 填寫資料並取得驗證碼後可完成註冊
- **Status**: Ready
- **Given**: 使用者進入帳號註冊頁面，填寫完整的必填資料
- **When**: 使用者填寫完資料後提交並等待驗證碼，輸入正確驗證碼後送出
- **Then**: 系統成功完成註冊，跳轉至登入頁面或首頁，顯示「註冊成功」或類似提示
- **Type**: e2e
- **Priority**: high
- **Issue Ref**: #41

### SC-ACCOUNT-REGISTER-002: 正確驗證碼可通過驗證
- **Status**: Ready
- **Given**: 使用者已填寫資料，收到驗證碼
- **When**: 使用者輸入正確的驗證碼並送出
- **Then**: 驗證通過，系統繼續完成後續註冊步驟
- **Type**: e2e
- **Priority**: high
- **Issue Ref**: #41

### SC-ACCOUNT-REGISTER-003: 錯誤驗證碼無法完成註冊
- **Status**: Ready
- **Given**: 使用者已填寫資料，收到驗證碼
- **When**: 使用者輸入錯誤的驗證碼並送出
- **Then**: 系統顯示驗證碼錯誤提示，不允許完成註冊
- **Type**: e2e
- **Priority**: high
- **Issue Ref**: #41

### SC-ACCOUNT-REGISTER-004: 邀請制度規則（待內部測試）
- **Status**: BLOCKED
- **Blocked Reason**: Issue #46 狀態為「待內部測試」，邀請規則尚未完成內部測試與確認，無法建立外部 QA 測試情境。
- **Issue Ref**: #46
