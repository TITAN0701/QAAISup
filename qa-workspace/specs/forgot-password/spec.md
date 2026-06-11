# Feature: forgot-password

> Draft generated from PM inbox requirement "忘記密碼入口". QA/AI should review and refine before automation.

## PM Inbox Source

- Source file: pm-inbox/release-2026-05-example.md
- Requirement: 忘記密碼入口

~~~md
### 需求 2: 忘記密碼入口 {#forgot-password}

#### 使用者故事

身為忘記密碼的會員，我想要從登入頁進入密碼重設流程，以便重新取得帳號存取權。

#### 功能說明

- 使用者可從登入頁點擊「忘記密碼」。
- 系統應顯示忘記密碼頁或流程。
- 忘記密碼流程需要求使用者輸入註冊 Email。
- 使用者送出有效 Email 後，系統應提示已送出密碼重設通知。

#### 驗收條件

- 給定使用者位於登入頁，當點擊「忘記密碼」，則系統應進入忘記密碼流程。
- 給定使用者位於忘記密碼頁，當未輸入 Email 就送出，則系統應提示 Email 為必填。
- 給定使用者位於忘記密碼頁，當輸入格式錯誤的 Email 並送出，則系統應提示 Email 格式錯誤。
- 給定使用者位於忘記密碼頁，當輸入有效 Email 並送出，則系統應提示已送出密碼重設通知。

#### PM 補充

- 密碼重設信實際寄送規則與有效期限待確認。
~~~

## Customer Request

身為忘記密碼的會員，我想要從登入頁進入密碼重設流程，以便重新取得帳號存取權。

## Background

此需求來自會員入口需求集合，目標是讓使用者可以完成「忘記密碼入口」相關流程。

## Business Goal

- 支援會員入口的必要使用者流程。
- 降低使用者在登入、帳號存取或註冊入口上的阻塞。

## User Roles

- 一般使用者

## Scope

### In Scope

- 使用者可從登入頁點擊「忘記密碼」。
- 系統應顯示忘記密碼頁或流程。
- 忘記密碼流程需要求使用者輸入註冊 Email。
- 使用者送出有效 Email 後，系統應提示已送出密碼重設通知。

### Out of Scope

- PM 標示為暫不納入或尚未確認的內容。
- 未在此需求章節列出的延伸流程。

## Acceptance Criteria

- 給定使用者位於登入頁，當點擊「忘記密碼」，則系統應進入忘記密碼流程。
- 給定使用者位於忘記密碼頁，當未輸入 Email 就送出，則系統應提示 Email 為必填。
- 給定使用者位於忘記密碼頁，當輸入格式錯誤的 Email 並送出，則系統應提示 Email 格式錯誤。
- 給定使用者位於忘記密碼頁，當輸入有效 Email 並送出，則系統應提示已送出密碼重設通知。

## Business Rules

- 密碼重設信實際寄送規則與有效期限待確認。

## Error Messages

- 依驗收條件與 PM 回答確認。
- 若文案尚未確認，測試應先標記為待釐清，不應硬編碼斷言。

## Dependencies

- 測試環境登入入口 URL。
- 穩定 selector 或 data-testid。
- 可用測試資料。
- 若涉及 API 或通知寄送，需後端/API 文件或測試替身。

## Open Questions

- 請參考 questions.md。
