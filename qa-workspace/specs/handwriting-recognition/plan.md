# Test Plan: 手繪圖形辨識

## Status

- Updated: 2026-06-03
- Feature workspace: qa-workspace/specs/handwriting-recognition/

## Scenario Coverage

| Scenario ID | Issue | 描述 | 狀態 |
|-------------|-------|------|------|
| SC-HANDWRITING-001 | #22 | AI 手繪圖形辨識模組存在 | **BLOCKED** |
| SC-HANDWRITING-002 | #23 | 拍攝教學示意圖顯示正確情境 | Ready |
| SC-HANDWRITING-003 | #24 | 拍攝注意事項圖片角度與文字說明一致 | Ready |
| SC-HANDWRITING-004 | #25 | 梯形輔助框在開始錄製後消失 | Ready |
| SC-HANDWRITING-005 | #26 | 3-6 歲先進入手繪圖形辨識 | **BLOCKED** |
| SC-HANDWRITING-006 | #27 | 3-6 歲各月齡皆可正常測驗 | **BLOCKED** |
| SC-HANDWRITING-007 | #28 | 手繪圖形模組包含影片錄製與照片 | **BLOCKED** |

## Test Scope

- Issue #23：已完成，可測試。
- Issue #24：已完成，可測試。
- Issue #25：已完成，可測試。
- Issue #22：調整中，BLOCKED。
- Issue #26：調整中，BLOCKED。
- Issue #27：調整中，BLOCKED。
- Issue #28：調整中，BLOCKED。

## Out of Scope

- AI 辨識結果的準確度驗證（屬於 AI 模型範疇）。

## Test Types

- E2E: 覆蓋梯形輔助框顯示與隱藏行為。
- UI: 驗證教學圖與注意事項圖片內容正確性。
- Regression: 確認修正不影響錄影教學頁面。

## Risks

- **Critical**: 4 個 Issue（#22、#26、#27、#28）均為「調整中」，手繪圖形辨識主要功能覆蓋嚴重不足。
- High: 3-6 歲流程設計需與主任確認，影響測試計畫範圍。

## Open Questions

- 請參考 questions.md。
