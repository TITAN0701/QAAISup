# Test Plan: 口語表達

## Status

- Updated: 2026-06-03
- Feature workspace: qa-workspace/specs/verbal-expression/

## Scenario Coverage

| Scenario ID | Issue | 描述 | 狀態 |
|-------------|-------|------|------|
| SC-VERBAL-EXPRESSION-001 | #15 | 每張圖片獨立計時 60 秒倒數 | Ready |
| SC-VERBAL-EXPRESSION-002 | #15 | 第一張圖計時結束後切換並重置計時 | Ready |
| SC-VERBAL-EXPRESSION-003 | #16 | 上傳影片成功後「下一題」可點擊 | Ready |
| SC-VERBAL-EXPRESSION-004 | #16 | 上傳後不需點「取消」即可繼續 | Ready |
| SC-VERBAL-EXPRESSION-005 | #17 | 看圖說故事最短完成時間限制 | **BLOCKED** |
| SC-VERBAL-EXPRESSION-006 | #18 | 圖卡與鏡頭視窗不互相遮擋 | Ready |
| SC-VERBAL-EXPRESSION-007 | #19 | AI 口語表達模組存在 | **BLOCKED** |

## Test Scope

- Issue #15：已完成，可測試。
- Issue #16：已完成，可測試。
- Issue #17：待確認，BLOCKED。
- Issue #18：已完成，可測試。
- Issue #19：調整中，BLOCKED。

## Out of Scope

- 口語表達 AI 分析結果的正確性（屬於 AI 模組驗收範疇）。

## Test Types

- E2E: 覆蓋計時邏輯、影片上傳、下一題流程。
- UI: 驗證圖卡與鏡頭視窗版面配置。
- Negative: 確認計時錯誤情境（如 6 分鐘總計限制已移除）。

## Risks

- High: Issue #17 和 #19 仍 BLOCKED，口語表達模組測試覆蓋不完整。
- Medium: 計時邏輯測試需要模擬時間流逝，自動化難度中等。

## Open Questions

- 請參考 questions.md。
