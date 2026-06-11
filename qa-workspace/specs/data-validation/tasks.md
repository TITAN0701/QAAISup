# Tasks: 資料驗證

## 可立即測試的 Issue

- [x] #42 - 身分證字號第二碼性別驗證邏輯 → 狀態：已完成

## 需等待的 Issue

- [ ] #43 - 流水號（CASEID）規則 → 狀態：**調整中**，等群健所規則確認後安排測試

## QA

- [ ] 準備各類測試身分證字號（男性：第二碼 1、女性：第二碼 2、無效：第二碼 3）。
- [ ] 執行 SC-DATA-VALIDATION-001 ~ SC-DATA-VALIDATION-003（身分證驗證）。
- [ ] 確認 #43 完成後補充流水號驗證情境並執行。
- [ ] 執行後更新 execution-results.json。

## Automation

- [ ] 確認身分證字號輸入欄位的 selector。
- [ ] 建立身分證第二碼性別驗證的 API 測試（單元或整合）。
- [ ] 建立前端驗證錯誤訊息的 E2E 測試。
- [ ] 待 #43 解除 BLOCKED 後建立流水號規則驗證測試。

## PM / 開發

- [ ] 追蹤 Issue #43：與群健所確認流水號（CASEID）完整規則，取得規格後通知 QA。
- [ ] 確認身分證字號驗證是前端、後端或兩者皆有。

## AI Follow-up

- [ ] 3 個 Ready 情境可直接進行自動化腳本產生（QA-5）。
- [ ] #43 解除 BLOCKED 後需補充 SC-DATA-VALIDATION-004 的 Given/When/Then。
