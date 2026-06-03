# Tasks: 觀察題組

## 可立即測試的 Issue

- [x] #20 - 修正所有年齡層在 AI 模組後可進入觀察題組 → 狀態：已完成
- [x] #21 - 修正 AI→觀察題組流程銜接與結果保留 → 狀態：已完成

## 需等待的 Issue

- 無。本功能所有 Issue（#20~#21）均已完成，可立即安排測試。

## QA

- [ ] 準備 15M 以上多種年齡層測試個案（建議覆蓋 24M、36M、39M）。
- [ ] 執行 SC-OBSERVATION-GROUP-001 ~ SC-OBSERVATION-GROUP-002（年齡層覆蓋）。
- [ ] 執行 SC-OBSERVATION-GROUP-003（直接進入觀察題組）。
- [ ] 執行 SC-OBSERVATION-GROUP-004（AI 模組結果保留）。
- [ ] 執行後更新 execution-results.json。

## Automation

- [ ] 確認 AI 模組完成狀態的判斷 selector 或 API 回應。
- [ ] 建立 AI→觀察題組流程的 Cypress E2E 測試。
- [ ] 建立結果保留的自動化驗證（需 Mock 或 Stub AI 模組完成事件）。

## PM / 開發

- [ ] 確認「AI 模組完成」的判斷條件是前端狀態還是後端回應。
- [ ] 提供各年齡層觀察題組的題目範圍說明，供 QA 驗證基準使用。

## AI Follow-up

- [ ] 所有 4 個情境均已 Ready，可直接進行自動化腳本產生（QA-5）。
