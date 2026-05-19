# Test Scenarios: 一般登入

## Source

- Feature: login
- Requirement: 一般登入

## Scenarios

### SC-LOGIN-001

- Source acceptance: 給定使用者位於登入頁，當使用者輸入有效帳號與正確密碼並送出，則系統應登入成功。
- Type: e2e
- Priority: high
- Automation candidate: true

### SC-LOGIN-002

- Source acceptance: 給定使用者位於登入頁，當使用者未輸入帳號就送出，則系統應提示帳號為必填。
- Type: e2e
- Priority: high
- Automation candidate: true

### SC-LOGIN-003

- Source acceptance: 給定使用者位於登入頁，當使用者未輸入密碼就送出，則系統應提示密碼為必填。
- Type: e2e
- Priority: high
- Automation candidate: true

### SC-LOGIN-004

- Source acceptance: 給定使用者位於登入頁，當使用者輸入錯誤帳號或錯誤密碼並送出，則系統應顯示登入失敗提示。
- Type: e2e
- Priority: high
- Automation candidate: true

### SC-LOGIN-005

- Source acceptance: 給定使用者位於登入頁，當使用者點擊「忘記密碼」，則系統應導向忘記密碼流程。
- Type: e2e
- Priority: high
- Automation candidate: true

### SC-LOGIN-006

- Source acceptance: 給定使用者位於登入頁，當使用者點擊「創建帳號」，則系統應導向註冊流程。
- Type: e2e
- Priority: high
- Automation candidate: true

