# Test Scenarios: 創建帳號入口

## Source

- Feature: register
- Requirement: 創建帳號入口

## Scenarios

### SC-REGISTER-001

- Source acceptance: 給定使用者位於登入頁，當點擊「創建帳號」，則系統應進入註冊流程。
- Type: e2e
- Priority: high
- Automation candidate: true


### SC-REGISTER-002

- Source acceptance: 給定使用者位於註冊頁，當必填欄位未填就送出，則系統應提示必填欄位。
- Type: e2e
- Priority: high
- Automation candidate: true

### SC-REGISTER-003

- Source acceptance: 給定使用者位於註冊頁，當密碼與確認密碼不一致並送出，則系統應提示密碼不一致。
- Type: e2e
- Priority: high
- Automation candidate: true

### SC-REGISTER-004

- Source acceptance: 給定使用者位於註冊頁，當輸入有效資料並送出，則系統應建立帳號或進入後續驗證流程。
- Type: e2e
- Priority: high
- Automation candidate: true
