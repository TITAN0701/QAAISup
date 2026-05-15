# Risk Notes: Login

## High Risk

- 登入是核心入口流程，登入成功流程失敗時不建議 release。
- 錯誤訊息若透露帳號存在狀態，可能有安全風險。
- 帳號鎖定規則若未定義跨裝置累計方式，測試與實作可能不一致。

## Need Confirmation

- 登入成功導向規則
- Session 有效時間定義
- 錯誤訊息是否需模糊化
