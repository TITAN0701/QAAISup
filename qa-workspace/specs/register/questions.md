# QA/AI Questions for PM: 創建帳號入口

## Need Clarification

1. 註冊是否需要 Email 驗證、手機驗證或同意服務條款，待確認。
   - Impact: 影響驗收條件、測試資料或自動化斷言。
   - PM Answer:

2. 請確認「給定使用者位於註冊頁，當必填欄位未填就送出，則系統應提示必填欄位。」的實際畫面文案、URL 或成功狀態。
   - Impact: 影響 E2E 測試斷言。
   - PM Answer:

3. 請確認「給定使用者位於註冊頁，當密碼與確認密碼不一致並送出，則系統應提示密碼不一致。」的實際畫面文案、URL 或成功狀態。
   - Impact: 影響 E2E 測試斷言。
   - PM Answer:

4. 請確認「給定使用者位於註冊頁，當輸入有效資料並送出，則系統應建立帳號或進入後續驗證流程。」的實際畫面文案、URL 或成功狀態。
   - Impact: 影響 E2E 測試斷言。
   - PM Answer:

## Confirmed Decisions

- Source requirement: 創建帳號入口
- User story: 身為新使用者，我想要從登入頁進入創建帳號流程，以便註冊成為會員。
