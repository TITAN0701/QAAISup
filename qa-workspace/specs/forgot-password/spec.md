# Feature: Forgot Password

> 此文件模擬 PM 從客戶端收集回來的初步需求。內容不需要一開始就很完整，未知的規則先放到 Open Questions，後續由 QA/AI 協助釐清。

## Customer Request

客戶希望使用者忘記密碼時，可以自己透過 Email 重設密碼，不需要再聯絡客服處理。

## Background

目前使用者忘記密碼時，需要請客服協助重設。客戶反映這樣會增加客服工作量，也會讓使用者等待時間太久。

## Business Goal

讓使用者可以自行完成密碼重設，減少客服處理忘記密碼的案件。

## User Roles

- 一般使用者

## Scope

### In Scope

- 使用者可以在登入頁找到忘記密碼入口。
- 使用者可以輸入 Email 申請重設密碼。
- 使用者可以收到重設密碼 Email。
- 使用者可以設定新密碼。

### Out of Scope

- 尚未確認。

## Acceptance Criteria

- 使用者可以送出忘記密碼申請。
- 使用者收到重設密碼信後，可以進入重設密碼頁。
- 使用者設定新密碼後，可以用新密碼登入。

## Business Rules

- 尚未確認。

## Error Messages

尚未確認。

## Dependencies

- 需要 Email 寄送功能。
- 需要測試用使用者帳號。

## Open Questions

- 重設密碼連結有效時間是多久？
- 使用者輸入不存在的 Email 時，畫面要顯示什麼？
- 新密碼需要符合哪些規則？
- 重設連結是否只能使用一次？
- 密碼重設成功後，是否要自動登入？
- 密碼重設成功後，是否要寄送通知信？
