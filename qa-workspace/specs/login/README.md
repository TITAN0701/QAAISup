# Feature: Login

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
| Test Case | Draft |
| Automation | Not Started |
| Report | Not Started |

## Related Files

- `spec.md`: 登入功能需求與驗收條件
- `questions.md`: 需要 PM 釐清的登入規則
- `scenarios.md`: 登入功能測試情境
- `plan.md`: 登入功能 QA 測試計畫
- `tasks.md`: PM、QA、工程師與 AI 的分工

## Current Decision

- 登入方式目前只包含帳號密碼登入。
- 第三方登入、忘記密碼與 MFA 不在本次範圍。
- 錯誤密碼、停用帳號、鎖定帳號都需要測試。

## Pending Questions

- 登入成功後要導向固定首頁，還是導回登入前頁面？
- Session 30 分鐘是閒置時間，還是登入後絕對有效時間？
- 密碼錯誤次數是否跨裝置與跨瀏覽器累計？

## Next Step

- PM 先回答 `questions.md`。
- QA 根據 PM 回答更新 `scenarios.md`。
- AI 再根據確認後的 spec 產生正式版 `test-cases.yaml`。
