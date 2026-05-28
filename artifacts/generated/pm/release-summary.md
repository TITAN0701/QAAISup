# PM 測試發布摘要：全部測試功能

## 整體狀態

Not Evaluated

## 摘要說明

本摘要根據 QA workspace 文件產生，包含 3 個功能。

- 產生時間：2026-05-28 13:30:25
- 測試案例數量：14

## 本次測試功能

- forgot-password: Feature: forgot-password
- login: Feature: login
- register: Feature: register

## 驗收重點

- forgot-password: 情境 4 筆，通過 0 筆，未標記 0 筆。
- login: 情境 6 筆，通過 0 筆，未標記 6 筆。
- register: 情境 4 筆，通過 0 筆，未標記 4 筆。

## 功能目標

- 彙整 qa-workspace/specs/ 下所有功能的 QA 狀態與發布風險。

## 測試執行結果統計

| 項目 | 數量 |
|---|---:|
| Total | 14 |
| Passed | 0 |
| Failed | 0 |
| Blocked | 4 |
| Skipped | 0 |
| Not Run / Not Marked | 10 |

## QA 任務狀態

| 項目 | 數量 |
|---|---:|
| Done | 0 |
| Open | 33 |

## 功能狀態明細

| 功能 | 狀態 | Scenarios | Test Cases | Passed | Failed | Not Run | Open Tasks | Open PM Questions |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| forgot-password | Not Recommended | 4 | 4 | 0 | 0 | 0 | 11 | 4 |
| login | Not Evaluated | 6 | 6 | 0 | 0 | 6 | 11 | 8 |
| register | Not Evaluated | 4 | 4 | 0 | 0 | 4 | 11 | 4 |

## 發布建議

狀態：Not Evaluated

需要注意：

- 尚未回答 PM 問題：16
- 尚未完成 QA 任務：33
- 尚未標記測試結果的情境：10

## 主要風險

- 若仍有 PM 問題未回答，測試斷言與驗收標準可能不穩定。
- 若 Cypress spec 尚未建立，代表自動化覆蓋尚未完成。
- 若 Allure raw results 尚未產生，代表尚未有正式自動化執行結果。

## 相關連結

- QA 測試報告：artifacts/generated/qa/test-report.md
- 測試情境矩陣 Markdown：artifacts/generated/qa/scenario-matrix.md
- 測試情境矩陣 Excel：artifacts/generated/qa/scenario-matrix.xlsx
- 功能規格：qa-workspace/specs/{feature}/spec.md
- 測試計畫：qa-workspace/specs/{feature}/plan.md
- 測試情境：qa-workspace/specs/{feature}/scenarios.md
- 測試案例：qa-workspace/specs/{feature}/test-cases.json
- 測試執行結果：qa-workspace/specs/{feature}/execution-results.json
