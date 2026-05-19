# QA/AI Questions for PM: 忘記密碼入口

## Need Clarification

1. 密碼重設信實際寄送規則與有效期限待確認。
   - Impact: 影響驗收條件、測試資料或自動化斷言。
   - PM Answer:

2. 請確認「給定使用者位於忘記密碼頁，當未輸入 Email 就送出，則系統應提示 Email 為必填。」的實際畫面文案、URL 或成功狀態。
   - Impact: 影響 E2E 測試斷言。
   - PM Answer:

3. 請確認「給定使用者位於忘記密碼頁，當輸入格式錯誤的 Email 並送出，則系統應提示 Email 格式錯誤。」的實際畫面文案、URL 或成功狀態。
   - Impact: 影響 E2E 測試斷言。
   - PM Answer:

4. 請確認「給定使用者位於忘記密碼頁，當輸入有效 Email 並送出，則系統應提示已送出密碼重設通知。」的實際畫面文案、URL 或成功狀態。
   - Impact: 影響 E2E 測試斷言。
   - PM Answer:

## Confirmed Decisions

- Source requirement: 忘記密碼入口
- User story: 身為忘記密碼的會員，我想要從登入頁進入密碼重設流程，以便重新取得帳號存取權。
