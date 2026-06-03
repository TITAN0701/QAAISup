# Tasks: 圖卡配對

## 可立即測試的 Issue

- [x] #9 - 修正圖卡配對月齡起始條件（從 8M 開始）→ 狀態：已完成
- [x] #11 - 維持點選互動方式（不需拖拉）→ 狀態：已完成

## 需等待的 Issue

- [ ] #10 - 圖卡配對跳題上限（升一階）→ 狀態：**調整中**，等開發完成後再安排測試

## QA

- [ ] 準備 4M / 6M / 8M 年齡層測試個案資料。
- [ ] 執行 SC-CARD-MATCHING-001 ~ SC-CARD-MATCHING-003（月齡起始驗證）。
- [ ] 執行 SC-CARD-MATCHING-005 ~ SC-CARD-MATCHING-006（點選互動驗證）。
- [ ] 確認 #10 完成後補充測試情境並執行。
- [ ] 執行後更新 execution-results.json。

## Automation

- [ ] 確認圖卡配對元件的穩定 selector 或 data-testid。
- [ ] 建立月齡起始條件的 Cypress E2E 測試（#9）。
- [ ] 建立點選互動的自動化測試（#11）。
- [ ] 待 #10 完成後，補充跳題上限的自動化測試。

## PM / 開發

- [ ] 追蹤 Issue #10（圖卡配對跳題上限）的調整進度，確認完成後通知 QA。

## AI Follow-up

- [ ] 5 個 Ready 情境可直接進行自動化腳本產生（QA-5）。
- [ ] #10 完成後需補充 SC-CARD-MATCHING-004 的 Given/When/Then。
