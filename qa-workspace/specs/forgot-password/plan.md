# Test Plan: 忘記密碼入口

## Status

- Draft generated from PM inbox.
- Feature workspace: qa-workspace/specs/forgot-password/

## Test Scope

- 使用者可從登入頁點擊「忘記密碼」。
- 系統應顯示忘記密碼頁或流程。
- 忘記密碼流程需要求使用者輸入註冊 Email。
- 使用者送出有效 Email 後，系統應提示已送出密碼重設通知。

## Acceptance Coverage

- 給定使用者位於登入頁，當點擊「忘記密碼」，則系統應進入忘記密碼流程。
- 給定使用者位於忘記密碼頁，當未輸入 Email 就送出，則系統應提示 Email 為必填。
- 給定使用者位於忘記密碼頁，當輸入格式錯誤的 Email 並送出，則系統應提示 Email 格式錯誤。
- 給定使用者位於忘記密碼頁，當輸入有效 Email 並送出，則系統應提示已送出密碼重設通知。

## Out of Scope

- PM 標示為暫不納入或尚未確認的內容。
- API、selector、實際測試資料尚未提供前，不列為可執行自動化的硬性前提。

## Test Types

- E2E: 覆蓋主要使用者流程。
- Negative: 覆蓋必填、格式錯誤或錯誤輸入。
- UI Validation: 覆蓋欄位、導頁、提示訊息。
- Regression: 確認此功能不破壞相關入口或既有流程。

## Test Data

- Valid user data: 待 QA/PM 提供。
- Invalid input data: 依驗收條件設計。
- Empty input data: 用於必填驗證。

## Automation Candidate

- 驗收條件中的主要正向流程。
- 必填與格式錯誤等穩定負向流程。

## Risks

- Medium: PM 文案、URL、測試資料尚未完全確認，可能影響自動化斷言。
- Medium: 若缺少穩定 selector 或 API contract，自動化需等開發補齊。

## Open Questions

請參考 questions.md。
