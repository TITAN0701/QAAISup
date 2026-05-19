# Test Scenarios: 忘記密碼入口

## Source

- Feature: forgot-password
- Requirement: 忘記密碼入口

## Scenarios

### SC-FORGOT-PASSWORD-001

- Source acceptance: 給定使用者位於登入頁，當點擊「忘記密碼」，則系統應進入忘記密碼流程。
- Type: e2e
- Priority: high
- Automation candidate: true

### SC-FORGOT-PASSWORD-002

- Source acceptance: 給定使用者位於忘記密碼頁，當未輸入 Email 就送出，則系統應提示 Email 為必填。
- Type: e2e
- Priority: high
- Automation candidate: true

### SC-FORGOT-PASSWORD-003

- Source acceptance: 給定使用者位於忘記密碼頁，當輸入格式錯誤的 Email 並送出，則系統應提示 Email 格式錯誤。
- Type: e2e
- Priority: high
- Automation candidate: true

### SC-FORGOT-PASSWORD-004

- Source acceptance: 給定使用者位於忘記密碼頁，當輸入有效 Email 並送出，則系統應提示已送出密碼重設通知。
- Type: e2e
- Priority: high
- Automation candidate: true

