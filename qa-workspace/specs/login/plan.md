# Login QA Plan

## Test Scope

- Login UI flow
- Login API behavior
- Error message validation
- Account status validation
- Session behavior

## Test Types

- E2E test
- API test
- Negative test
- Boundary test
- Regression smoke test

## Automation Candidate

適合優先自動化：

- 正確帳密登入成功
- 錯誤密碼登入失敗
- 停用帳號不可登入
- 鎖定帳號不可登入

暫不優先自動化：

- 複雜資安攻擊情境
- 需要人工驗證的 UX 細節
- 第三方登入，因目前 out of scope
