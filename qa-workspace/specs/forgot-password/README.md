# Feature: Forgot Password

> 此資料夾示範 PM 收集客戶需求後，如何先整理成可給 QA 審核的功能文件。

## Owner

- PM:
- QA:
- Engineer:

## Status

| Item | Status |
|---|---|
| Spec | Draft |
| PM Review | Not Started |
| QA Review | Not Started |
| Test Case | Not Started |
| Automation | Not Started |
| Report | Not Started |

## Related Files

- `spec.md`: PM 收集客戶需求後整理的規格
- `questions.md`: 待 QA/AI 產生
- `scenarios.md`: 待 QA/AI 產生
- `plan.md`: 待 QA/AI 產生
- `tasks.md`: 待建立

## Current Decision

- 客戶希望使用者忘記密碼時，可以透過 Email 取得重設密碼連結。

## Pending Questions

- 重設密碼連結有效時間尚未確認。
- 使用者輸入不存在的 Email 時要顯示什麼尚未確認。
- 新密碼規則尚未確認。
- 重設成功後是否自動登入尚未確認。

## Next Step

- QA 先審核 `spec.md` 是否足夠可測。
- 後續再由 QA 觸發 AI 產生 `questions.md`。
