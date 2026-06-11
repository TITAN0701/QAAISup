# Tasks: 帳號/註冊

## 可立即測試的 Issue

- [x] #41 - 修正驗證碼驗證後可正常完成註冊 → 狀態：已完成

## 需等待的 Issue

- [ ] #46 - 邀請制度規則 → 狀態：**待內部測試**，等 John/內部測試完成後安排 QA 測試

## QA

- [ ] 準備測試用帳號資料（測試信箱或手機號）。
- [ ] 執行 SC-ACCOUNT-REGISTER-001（完整註冊流程）。
- [ ] 執行 SC-ACCOUNT-REGISTER-002（正確驗證碼通過）。
- [ ] 執行 SC-ACCOUNT-REGISTER-003（錯誤驗證碼被拒）。
- [ ] 確認 #46 完成內部測試後補充情境並執行。
- [ ] 執行後更新 execution-results.json。

## Automation

- [ ] 確認註冊表單各欄位的 selector。
- [ ] 建立驗證碼驗證流程的 Cypress E2E 測試（需 Mock 驗證碼 API）。
- [ ] 建立錯誤驗證碼的負向測試。

## PM / 開發

- [ ] 確認測試環境是否有 Mock 或固定驗證碼機制，供 QA 自動化使用。
- [ ] 追蹤 Issue #46：邀請制度內部測試完成後通知 QA。

## AI Follow-up

- [ ] 3 個 Ready 情境可直接進行自動化腳本產生（QA-5）。
- [ ] #46 解除 BLOCKED 後需補充 SC-ACCOUNT-REGISTER-004 的 Given/When/Then。
