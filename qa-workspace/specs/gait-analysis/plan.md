# Test Plan: 走路步態

## Status

- Updated: 2026-06-03
- Feature workspace: qa-workspace/specs/gait-analysis/

## Scenario Coverage

| Scenario ID | Issue | 描述 | 狀態 |
|-------------|-------|------|------|
| SC-GAIT-ANALYSIS-001 | #29 | 拍攝提醒包含衣著限制說明 | Ready |
| SC-GAIT-ANALYSIS-002 | #30 | 正/背面模組提示詞說明全身入鏡 | Ready |
| SC-GAIT-ANALYSIS-003 | #31 | 正/背面模組提示詞一包含超出輔助框提醒 | Ready |
| SC-GAIT-ANALYSIS-004 | #32 | 正/背面模組提示詞三包含不干涉說明 | Ready |
| SC-GAIT-ANALYSIS-005 | #33 | 側面模組提示詞描述橫向行走 | Ready |
| SC-GAIT-ANALYSIS-006 | #34 | 側面模組輔助框設置於畫面邊緣 | Ready |
| SC-GAIT-ANALYSIS-007 | #35 | 側面模組錄製時長顯示超過 15 秒 | Ready |
| SC-GAIT-ANALYSIS-008 | #35 | 側面模組未達 15 秒無法結束錄製 | Ready |
| SC-GAIT-ANALYSIS-009 | #36 | 側面模組拍攝事項包含不干涉說明 | Ready |
| SC-GAIT-ANALYSIS-010 | #37 | 口語表達錄製時圖片不被視窗遮擋 | Ready |

## Test Scope

- Issue #29~#37 均為「已完成」狀態，全部納入測試。
- 無 BLOCKED 情境。

## Out of Scope

- 走路步態 AI 分析結果的準確度（屬於 AI 模型範疇）。

## Test Types

- UI: 驗證各模組提示詞與注意事項文字正確性（主要類型）。
- E2E: 覆蓋錄製時長限制的功能行為。
- Regression: 確認文字修改不影響其他模組頁面。

## Risks

- Medium: 大量 UI 文字驗證，需維護文字比對清單。
- Medium: 影片錄製相關測試需實際裝置環境或模擬。

## Open Questions

- 請參考 questions.md。
