# Test Plan: 創建帳號入口

## Status

- Draft generated from PM inbox.
- Feature workspace: qa-workspace/specs/register/

## Test Scope

- 使用者可從登入頁點擊「創建帳號」。
- 系統應顯示註冊頁或註冊流程。
- 註冊流程至少需包含帳號、密碼與確認密碼欄位。
- 使用者完成必要資料並送出後，系統應建立帳號或進入後續驗證流程。

## Acceptance Coverage

- 給定使用者位於登入頁，當點擊「創建帳號」，則系統應進入註冊流程。
- 給定使用者位於註冊頁，當必填欄位未填就送出，則系統應提示必填欄位。
- 給定使用者位於註冊頁，當密碼與確認密碼不一致並送出，則系統應提示密碼不一致。
- 給定使用者位於註冊頁，當輸入有效資料並送出，則系統應建立帳號或進入後續驗證流程。

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
